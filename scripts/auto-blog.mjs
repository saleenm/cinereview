#!/usr/bin/env node
/**
 * CineReview — Auto Blog Generator
 * يولّد مقالة مدونة جديدة أسبوعياً بالـ AI (Gemini) عن فيلم من المكتبة
 *
 * المتطلبات: GEMINI_API_KEY أو OPENROUTER_API_KEY في .env.local
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BLOG_FILE = path.join(ROOT, 'lib', 'blog.ts')
const MOVIES_FILE = path.join(ROOT, 'lib', 'movies.ts')

// ── Load env ──────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  }
}
loadEnv()

const GEMINI_KEY = process.env.GEMINI_API_KEY
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY

if (!GEMINI_KEY && !OPENROUTER_KEY) {
  console.warn('⚠️ لا يوجد مفتاح AI — سيتم استخدام القالب الافتراضي')
}

// ── Post types ────────────────────────────────────────────────────────────────
const POST_TYPES = [
  'deep_review',        // مراجعة عميقة للفيلم
  'director_analysis',  // تحليل أسلوب المخرج
  'legacy_impact',      // أثر الفيلم على السينما
  'hidden_meanings',    // رمزية ومعاني خفية
  'compare_era',        // مقارنة مع أفلام حقبته
]

// ── escapeStr ─────────────────────────────────────────────────────────────────
function escapeStr(str) {
  return (str || '')
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
    .replace(/\r?\n/g, '\\n')
    .replace(/\r/g, '\\n')
    .replace(/[\u2028\u2029]/g, ' ')
    .trim()
}

function escapeForTS(str) {
  return (str || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/[\u2028\u2029]/g, ' ')
    .trim()
}

// ── Parse existing blog slugs ─────────────────────────────────────────────────
function getExistingBlogSlugs() {
  const src = fs.readFileSync(BLOG_FILE, 'utf8')
  const slugs = new Set()
  for (const m of src.matchAll(/slug:\s*'([^']+)'/g)) slugs.add(m[1])
  return slugs
}

// ── Parse movies from movies.ts ───────────────────────────────────────────────
function getMovies() {
  const src = fs.readFileSync(MOVIES_FILE, 'utf8')
  const movies = []

  // Find each movie block between { id: '...' and the closing },
  const blockPattern = /\{\s*id:\s*'[^']+',[\s\S]*?\},(?=\s*\{|\s*\n\])/g

  function getField(block, field) {
    const m = block.match(new RegExp(`${field}:\\s*'([^']*)'`))
    return m ? m[1] : ''
  }
  function getNumField(block, field) {
    const m = block.match(new RegExp(`${field}:\\s*([\\d.]+)`))
    return m ? parseFloat(m[1]) : 0
  }

  for (const m of src.matchAll(blockPattern)) {
    const block = m[0]
    const slug = getField(block, 'slug')
    if (!slug) continue
    movies.push({
      slug,
      title: getField(block, 'title'),
      title_ar: getField(block, 'title_ar'),
      year: getNumField(block, 'year'),
      director: getField(block, 'director'),
      rating: getNumField(block, 'rating_overall'),
      poster_url: getField(block, 'poster_url'),
      backdrop_url: getField(block, 'backdrop_url'),
    })
  }
  return movies
}

// ── Pick movie for blog post ──────────────────────────────────────────────────
function pickMovie(movies, existingSlugs) {
  const blogMovieSlugs = new Set()
  const src = fs.readFileSync(BLOG_FILE, 'utf8')
  for (const m of src.matchAll(/movieSlug:\s*'([^']+)'/g)) blogMovieSlugs.add(m[1])

  // filter: not already blogged, rating >= 8.0, has backdrop
  const candidates = movies.filter(m =>
    !blogMovieSlugs.has(m.slug) &&
    m.rating >= 8.0 &&
    m.backdrop_url
  ).sort((a, b) => b.rating - a.rating)

  if (!candidates.length) {
    // fallback: any movie not blogged
    return movies.filter(m => !blogMovieSlugs.has(m.slug))[0]
  }

  // pick from top 20 randomly for variety
  const pool = candidates.slice(0, 20)
  return pool[Math.floor(Math.random() * pool.length)]
}

// ── AI call ───────────────────────────────────────────────────────────────────
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 4000, responseMimeType: 'application/json' },
    }),
  })
  if (res.status === 429) throw new Error('QUOTA_EXCEEDED')
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text().then(t => t.slice(0, 200))}`)
  const data = await res.json()
  if (data.error) throw new Error(`Gemini error: ${data.error.message}`)
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callOpenRouter(prompt) {
  // Try free models — updated 2026-06-01
  const models = [
    'google/gemma-4-31b-it:free',
    'deepseek/deepseek-v4-flash:free',
    'moonshotai/kimi-k2.6:free',
    'openai/gpt-oss-120b:free',
    'qwen/qwen3-next-80b-a3b-instruct:free',
    'meta-llama/llama-4-maverick:free',
    'microsoft/phi-4-reasoning-plus:free',
    'mistralai/mistral-small-3.2-24b-instruct:free',
  ]
  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          max_tokens: 3000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      if (res.status === 402) { console.log(`   ⚠️ ${model}: no credits, trying next...`); continue }
      if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text().then(t => t.slice(0, 200))}`)
      const data = await res.json()
      if (data.error) { console.log(`   ⚠️ ${model}: ${data.error.message}`); continue }
      const content = data.choices?.[0]?.message?.content || ''
      if (content) { console.log(`   ✅ Using model: ${model}`); return content }
    } catch (e) {
      console.log(`   ⚠️ ${model}: ${e.message}`)
    }
  }
  throw new Error('كل النماذج فشلت أو لا رصيد متاح')
}

async function aiGenerate(prompt) {
  if (GEMINI_KEY) {
    try {
      return await callGemini(prompt)
    } catch (e) {
      if (e.message === 'QUOTA_EXCEEDED') {
        console.log('   ⚠️ Gemini quota exceeded — switching to OpenRouter...')
      } else {
        throw e
      }
    }
  }
  if (!OPENROUTER_KEY) throw new Error('لا يوجد مفتاح AI متاح')
  return callOpenRouter(prompt)
}

// ── Generate blog post via AI ─────────────────────────────────────────────────
async function generateBlogPost(movie, postType) {
  const today = new Date().toISOString().split('T')[0]

  const typeInstructions = {
    deep_review: `Write a deep cinematic review analyzing the film's story, themes, performances, direction, and why it stands out.`,
    director_analysis: `Analyze the director's unique style, how their signature techniques appear in this film, and their contribution to cinema.`,
    legacy_impact: `Explore how this film influenced cinema, culture, and future filmmakers. What changed after it?`,
    hidden_meanings: `Reveal the hidden symbolism, metaphors, and deeper meanings in the film that casual viewers might miss.`,
    compare_era: `Compare this film to other great films of its era. What made it rise above its contemporaries?`,
  }

  const instruction = typeInstructions[postType]

  const prompt = `You are a professional film critic writing engaging blog posts for CineReview, a multilingual cinema review website.

Write a blog post about the film: "${movie.title}" (${movie.year}), directed by ${movie.director}.

Post type: ${instruction}

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "slug": "unique-url-slug-based-on-post-topic",
  "readTime": 6,
  "ar": {
    "title": "Arabic title (engaging, SEO-optimized, 60 chars max)",
    "description": "Arabic meta description (150 chars max)",
    "category": "Arabic category (2-3 words)",
    "content": "Full Arabic article in markdown format (400-600 words). Use ## for sections, **bold** for emphasis, > for quotes, * for lists. Rich, analytical content."
  },
  "en": {
    "title": "English title",
    "description": "English description",
    "category": "Category",
    "content": "Full English article (400-600 words)"
  },
  "fr": { "title": "...", "description": "...", "category": "...", "content": "..." },
  "es": { "title": "...", "description": "...", "category": "...", "content": "..." },
  "tr": { "title": "...", "description": "...", "category": "...", "content": "..." },
  "de": { "title": "...", "description": "...", "category": "...", "content": "..." },
  "ja": { "title": "...", "description": "...", "category": "...", "content": "..." },
  "pt": { "title": "...", "description": "...", "category": "...", "content": "..." }
}

Requirements:
- Arabic and English must be FULL articles (400+ words each)
- Other languages can be shorter (150+ words) but must be unique translations
- Content must be engaging, analytical, not generic
- Slug must be unique, URL-friendly (lowercase, hyphens only)
- readTime should reflect article length (5-8)`

  const raw = await aiGenerate(prompt)

  // Parse JSON
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    // try extracting JSON from response
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('AI returned invalid JSON')
    parsed = JSON.parse(match[0])
  }

  return { parsed }
}

// ── Template fallback (no AI needed) ─────────────────────────────────────────
function generateTemplate(movie, postType, today) {
  const slug = `${movie.slug}-${postType.replace(/_/g, '-')}-${today.slice(0, 7)}`
  const rating = movie.rating
  const stars = rating >= 9 ? '⭐⭐⭐⭐⭐' : rating >= 8 ? '⭐⭐⭐⭐' : '⭐⭐⭐'

  const templates = {
    ar: {
      deep_review: {
        title: `${movie.title_ar || movie.title}: مراجعة سينمائية معمّقة`,
        description: `تحليل شامل لفيلم ${movie.title_ar || movie.title} (${movie.year}) — القصة، الأداء، الإخراج، والقيمة السينمائية`,
        category: 'مراجعة سينمائية',
        content: `## ${movie.title_ar || movie.title} — تحفة سينمائية\n\n**المخرج:** ${movie.director}\n**السنة:** ${movie.year}\n**التقييم:** ${rating}/10 ${stars}\n\n## القصة والسرد\n\nيقدم فيلم **${movie.title_ar || movie.title}** تجربة سينمائية استثنائية تتجاوز حدود النوع الذي ينتمي إليه. ببراعة سردية نادرة، يُوظّف المخرج ${movie.director} كل أداة إخراجية في خدمة الرؤية الفنية الكاملة.\n\n## الأداء التمثيلي\n\nيتميز الفيلم بأداء تمثيلي يرسم الشخصيات بعمق وإتقان، مما يمنح المشاهد تجربة عاطفية غنية لا تُنسى.\n\n## الإخراج والتصوير\n\nاستطاع ${movie.director} أن يخلق بصرياً لغة سينمائية خاصة به، حيث تُكمّل كل لقطة الرواية بشكل عضوي ودقيق.\n\n## الخلاصة\n\nيستحق **${movie.title_ar || movie.title}** مكانته بين أبرز أفلام **${movie.year}**. إنه عمل سينمائي متكامل يُقدّم للمشاهد تجربة استثنائية لا مثيل لها.`,
      },
    },
    en: {
      deep_review: {
        title: `${movie.title}: A Deep Cinematic Analysis`,
        description: `An in-depth look at ${movie.title} (${movie.year}) by ${movie.director} — story, performances, direction, and cinematic legacy`,
        category: 'Film Analysis',
        content: `## ${movie.title} — A Cinematic Masterpiece\n\n**Director:** ${movie.director}\n**Year:** ${movie.year}\n**Rating:** ${rating}/10 ${stars}\n\n## Story & Narrative\n\n**${movie.title}** delivers an exceptional cinematic experience that transcends genre boundaries. With rare narrative skill, director ${movie.director} deploys every filmmaking tool in service of a complete artistic vision.\n\n## Performances\n\nThe film features performances of remarkable depth, drawing audiences into an emotionally rich world that lingers long after the credits roll.\n\n## Direction & Cinematography\n\n${movie.director} crafts a distinctive visual language where every frame serves the story organically, creating an immersive and memorable experience.\n\n## Verdict\n\n**${movie.title}** rightfully earns its place among the defining films of **${movie.year}**. This is essential cinema — a complete artistic statement that rewards both first-time viewers and repeat watchers.`,
      },
    },
  }

  const getContent = (lang, type) => {
    const t = templates[lang]?.[type] || templates[lang]?.deep_review
    if (t) return t
    // Generic fallback for non-template languages
    return {
      title: templates.en[type]?.title || templates.en.deep_review.title,
      description: templates.en[type]?.description || templates.en.deep_review.description,
      category: { fr: 'Analyse', es: 'Análisis', tr: 'Analiz', de: 'Analyse', ja: '映画分析', pt: 'Análise' }[lang] || 'Analysis',
      content: templates.en[type]?.content || templates.en.deep_review.content,
    }
  }

  return {
    slug,
    readTime: 5,
    ar: getContent('ar', postType),
    en: getContent('en', postType),
    fr: { ...getContent('en', postType), category: 'Analyse Cinématographique' },
    es: { ...getContent('en', postType), category: 'Análisis Cinematográfico' },
    tr: { ...getContent('en', postType), category: 'Film Analizi' },
    de: { ...getContent('en', postType), category: 'Filmanalyse' },
    ja: { ...getContent('en', postType), category: '映画分析' },
    pt: { ...getContent('en', postType), category: 'Análise Cinematográfica' },
  }
}

// ── Build TypeScript snippet for blog.ts ─────────────────────────────────────
function buildBlogPostTS(movie, parsed, today) {
  const slug = escapeForTS(parsed.slug || `${movie.slug}-review`)
  const image = movie.backdrop_url || movie.poster_url
  const locales = ['ar', 'en', 'fr', 'es', 'tr', 'de', 'ja', 'pt']

  const i18nEntries = locales.map((lang) => {
    const d = parsed[lang] || parsed.en
    const title = escapeForTS(d.title || '')
    const description = escapeForTS(d.description || '')
    const category = escapeForTS(d.category || '')
    const content = escapeStr(d.content || '')
    return `      ${lang}: {
        title: '${title}',
        description: '${description}',
        category: '${category}',
        content: \`${content}\`,
      }`
  }).join(',\n')

  return `  {
    slug: '${slug}',
    date: '${today}',
    readTime: ${parsed.readTime || 6},
    image: '${image}',
    movieSlug: '${movie.slug}',
    i18n: {
${i18nEntries}
    }
  },`
}

// ── Inject into blog.ts ───────────────────────────────────────────────────────
function injectBlogPost(postTS) {
  let src = fs.readFileSync(BLOG_FILE, 'utf8')

  // Find the closing ] of BLOG_POSTS array
  // The array ends with "}\n]" before "// ── AUTO-GENERATED" or end of BLOG_POSTS
  const insertPoint = src.indexOf('\n]\n\n// ── AUTO-GENERATED')
  if (insertPoint === -1) {
    // fallback: find last }] pattern
    const fallback = src.lastIndexOf('\n]\n\n// ')
    if (fallback === -1) throw new Error('لم أجد نقطة الإدراج في blog.ts')
    src = src.slice(0, fallback) + '\n' + postTS + src.slice(fallback)
  } else {
    src = src.slice(0, insertPoint) + '\n' + postTS + src.slice(insertPoint)
  }

  fs.writeFileSync(BLOG_FILE, src)
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('📝 CineReview Auto Blog Generator')
  console.log('='.repeat(50))

  const existingSlugs = getExistingBlogSlugs()
  const movies = getMovies()
  console.log(`🎬 أفلام متاحة: ${movies.length}`)
  console.log(`📚 مقالات موجودة: ${existingSlugs.size}`)

  const movie = pickMovie(movies, existingSlugs)
  if (!movie) {
    console.log('⚠️ لا توجد أفلام جديدة للكتابة عنها')
    process.exit(0)
  }

  const postType = POST_TYPES[Math.floor(Math.random() * POST_TYPES.length)]
  console.log(`\n🎯 الفيلم المختار: ${movie.title} (${movie.year})`)
  console.log(`📌 نوع المقالة: ${postType}`)
  console.log(`⭐ التقييم: ${movie.rating}`)

  const today = new Date().toISOString().split('T')[0]
  let parsed

  if (GEMINI_KEY || OPENROUTER_KEY) {
    console.log('\n🤖 توليد المحتوى بالـ AI...')
    try {
      const result = await generateBlogPost(movie, postType)
      parsed = result?.parsed
    } catch (e) {
      console.warn(`⚠️ فشل AI: ${e.message} — استخدام القالب الافتراضي`)
    }
  }

  if (!parsed) {
    console.log('\n📄 استخدام القالب الافتراضي (بدون AI)...')
    parsed = generateTemplate(movie, postType, today)
  }

  console.log(`✅ تم التوليد: "${parsed.en?.title || parsed.slug}"`)
  console.log(`   Slug: ${parsed.slug}`)

  // Check slug uniqueness
  if (existingSlugs.has(parsed.slug)) {
    parsed.slug = `${parsed.slug}-${movie.year}`
    console.log(`   ⚠️ Slug مكرر — تم التعديل: ${parsed.slug}`)
  }

  const postTS = buildBlogPostTS(movie, parsed, today)
  injectBlogPost(postTS)

  console.log(`\n✅ تمت إضافة المقالة لـ lib/blog.ts`)
  console.log(`📅 التاريخ: ${today}`)
  console.log(`🎬 الفيلم: ${movie.title}`)
  console.log(`📝 العنوان (EN): ${parsed.en?.title}`)
  console.log(`📝 العنوان (AR): ${parsed.ar?.title}`)
}

main().catch(e => {
  console.error('خطأ غير متوقع:', e.message)
  process.exit(1)
})
