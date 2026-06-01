#!/usr/bin/env node
/**
 * CineReview — Auto Movie Adder
 * يضيف 20 فيلم يومياً من TMDB ويترجمها بالـ AI ثم ينشر على Vercel
 *
 * المتطلبات (في .env.local):
 *   TMDB_API_KEY=your_key_here
 *   OPENROUTER_API_KEY=sk-or-v1-...
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const MOVIES_FILE = path.join(ROOT, 'lib', 'movies.ts')
const TRACKER_FILE = path.join(__dirname, 'added-movies.json')

// ─── Load env ─────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local')
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  }
}
loadEnv()

const TMDB_KEY = process.env.TMDB_API_KEY
const GEMINI_KEY = process.env.GEMINI_API_KEY
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY

if (!TMDB_KEY) {
  console.error('❌ TMDB_API_KEY غير موجود في .env.local')
  console.error('   احصل على مفتاح مجاني من: https://www.themoviedb.org/settings/api')
  process.exit(1)
}

// AI keys are optional — content is built entirely from TMDB data
if (!GEMINI_KEY && !OPENROUTER_KEY) {
  console.log('ℹ️ لا يوجد مفتاح AI — المحتوى يُبنى من TMDB مباشرة (لا مشكلة)')
}

// ─── Genre mapping TMDB → CineReview ─────────────────────────────────────────
const TMDB_GENRE_MAP = {
  28: 'action',     // Action
  12: 'adventure',  // Adventure
  16: 'animation',  // Animation
  35: 'comedy',     // Comedy
  80: 'crime',      // Crime
  99: 'documentary',// Documentary
  18: 'drama',      // Drama
  10751: 'drama',   // Family
  14: 'drama',      // Fantasy
  36: 'history',    // History
  27: 'horror',     // Horror
  10402: 'drama',   // Music
  9648: 'thriller', // Mystery
  10749: 'romance', // Romance
  878: 'scifi',     // Science Fiction
  53: 'thriller',   // Thriller
  10752: 'history', // War
  37: 'adventure',  // Western
}

// ─── Tracker ──────────────────────────────────────────────────────────────────
function loadTracker() {
  return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'))
}

function saveTracker(data) {
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(data, null, 2))
}

// ─── Get existing slugs from movies.ts ───────────────────────────────────────
function getExistingSlugs() {
  const content = fs.readFileSync(MOVIES_FILE, 'utf8')
  const matches = content.matchAll(/slug: '([^']+)'/g)
  return new Set([...matches].map(m => m[1]))
}

function getNextId() {
  const content = fs.readFileSync(MOVIES_FILE, 'utf8')
  const ids = [...content.matchAll(/id: '(\d+)'/g)].map(m => parseInt(m[1]))
  return Math.max(...ids) + 1
}

// ─── TMDB API ─────────────────────────────────────────────────────────────────
async function tmdbGet(endpoint, params = {}) {
  const url = new URL(`https://api.themoviedb.org/3${endpoint}`)
  url.searchParams.set('api_key', TMDB_KEY)
  url.searchParams.set('language', 'en-US')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB ${endpoint}: ${res.status}`)
  return res.json()
}

async function getTopRatedMovies(page) {
  const data = await tmdbGet('/movie/top_rated', { page })
  return data.results || []
}

async function getMovieDetails(tmdbId) {
  const [details, credits, videos, ar, fr, es, tr, de, ja, pt] = await Promise.all([
    tmdbGet(`/movie/${tmdbId}`),
    tmdbGet(`/movie/${tmdbId}/credits`),
    tmdbGet(`/movie/${tmdbId}/videos`),
    tmdbGet(`/movie/${tmdbId}`, { language: 'ar' }),
    tmdbGet(`/movie/${tmdbId}`, { language: 'fr' }),
    tmdbGet(`/movie/${tmdbId}`, { language: 'es' }),
    tmdbGet(`/movie/${tmdbId}`, { language: 'tr' }),
    tmdbGet(`/movie/${tmdbId}`, { language: 'de' }),
    tmdbGet(`/movie/${tmdbId}`, { language: 'ja' }),
    tmdbGet(`/movie/${tmdbId}`, { language: 'pt' }),
  ])
  return { details, credits, videos, translations: { ar, fr, es, tr, de, ja, pt } }
}

// ─── AI Translation ───────────────────────────────────────────────────────────
async function aiGenerate(prompt, maxTokens = 2000) {
  // Use Gemini API directly (free) if key available, else fallback to OpenRouter
  if (GEMINI_KEY) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          responseMimeType: 'application/json',
        },
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Gemini API ${res.status}: ${err.slice(0, 200)}`)
    }
    const data = await res.json()
    if (data.error) throw new Error(`Gemini Error: ${data.error.message}`)
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!content) throw new Error(`Gemini returned empty: ${JSON.stringify(data).slice(0, 200)}`)
    return content
  }

  // OpenRouter fallback
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  if (data.error) throw new Error(`OpenRouter Error: ${data.error.message || JSON.stringify(data.error)}`)
  const content = data.choices?.[0]?.message?.content || ''
  if (!content) throw new Error(`OpenRouter empty response: ${JSON.stringify(data).slice(0, 200)}`)
  return content
}

// Build movie content from TMDB multilingual data (no AI needed)
function buildMovieContentFromTMDB(details, translations, director, rating) {
  const ar = translations.ar
  const fr = translations.fr
  const es = translations.es
  const tr = translations.tr
  const de = translations.de
  const ja = translations.ja
  const pt = translations.pt

  const base = parseFloat((rating * 0.95 + 0.3).toFixed(1))
  const offset = (v) => parseFloat(Math.min(9.9, Math.max(5.0, base + v)).toFixed(1))

  // Genre-based pros/cons templates
  const genres = (details.genres || []).map(g => g.name.toLowerCase())
  const isAction = genres.includes('action')
  const isDrama = genres.includes('drama')
  const isAnimation = genres.includes('animation')

  const prosAr = isDrama
    ? ['عمق درامي استثنائي', 'أداء تمثيلي رائع', 'قصة إنسانية مؤثرة']
    : isAction
    ? ['إثارة وأكشن مبهر', 'مؤثرات بصرية رائعة', 'إيقاع سريع وممتع']
    : isAnimation
    ? ['رسوم متحركة خلابة', 'قصة عائلية ممتعة', 'موسيقى تصويرية رائعة']
    : ['إخراج متميز', 'قصة مشوقة', 'أداء رائع للممثلين']

  const consAr = rating >= 8.5
    ? ['قد تكون طويلة للبعض']
    : ['وتيرة بطيئة في بعض المشاهد', 'يحتاج تركيزاً عالياً']

  const prosEn = isDrama
    ? ['Exceptional dramatic depth', 'Outstanding performances', 'Emotionally powerful story']
    : isAction
    ? ['Thrilling action sequences', 'Impressive visual effects', 'Fast-paced and exciting']
    : isAnimation
    ? ['Stunning animation', 'Family-friendly story', 'Beautiful soundtrack']
    : ['Strong direction', 'Compelling story', 'Great performances']

  const consEn = rating >= 8.5
    ? ['May feel long for some viewers']
    : ['Slow pacing in some scenes', 'Requires close attention']

  const tags = [
    ...(details.genres || []).slice(0, 3).map(g => g.name.toLowerCase().replace(/\s+/g, '-')),
    String(details.release_date?.split('-')[0] || ''),
    director.split(' ').pop().toLowerCase(),
  ].filter(Boolean).slice(0, 5)

  return {
    title_ar: ar?.title || details.title,
    director_ar: director,
    description_ar: ar?.overview || details.overview || '',
    description_fr: fr?.overview || details.overview || '',
    description_es: es?.overview || details.overview || '',
    description_tr: tr?.overview || details.overview || '',
    description_de: de?.overview || details.overview || '',
    description_ja: ja?.overview || details.overview || '',
    description_pt: pt?.overview || details.overview || '',
    rating_story: offset(0.2),
    rating_acting: offset(0.3),
    rating_direction: offset(0.1),
    rating_cinematography: offset(-0.1),
    rating_music: offset(-0.3),
    pros_ar: prosAr,
    cons_ar: consAr,
    pros_en: prosEn,
    cons_en: consEn,
    tags,
  }
}

// ─── Slug generator ───────────────────────────────────────────────────────────
function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

// ─── Movie TypeScript generator ───────────────────────────────────────────────
function escapeStr(str) {
  return (str || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/[\u2028\u2029]/g, ' ')  // line/paragraph separators
    .trim()
}

function generateMovieTS(id, movie, credits, videos, ai) {
  const director = credits.crew?.find(p => p.job === 'Director')?.name || 'Unknown'
  const cast = credits.cast?.slice(0, 6).map(a => a.name) || []

  const slug = toSlug(movie.title)
  const year = parseInt(movie.release_date?.split('-')[0]) || 2020

  // Get genres
  const genres = [...new Set(
    (movie.genres || []).map(g => TMDB_GENRE_MAP[g.id]).filter(Boolean)
  )].slice(0, 3)
  if (genres.length === 0) genres.push('drama')

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : poster

  // Trailer
  const trailer = videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null

  // Ratings
  const imdb = parseFloat((movie.vote_average || 7).toFixed(1))
  const rtScore = Math.round((movie.vote_average || 7) * 10)
  const overall = parseFloat(Math.min(9.8, (movie.vote_average || 7) * 0.95 + 0.5).toFixed(1))

  const ratingStory = ai.rating_story || overall
  const ratingActing = ai.rating_acting || overall
  const ratingDirection = ai.rating_direction || overall
  const ratingCinema = ai.rating_cinematography || overall
  const ratingMusic = ai.rating_music || (overall - 0.5)

  const prosAr = (ai.pros_ar || ['أداء رائع', 'قصة مشوقة', 'إخراج متميز']).map(escapeStr)
  const consAr = (ai.cons_ar || ['وتيرة بطيئة في بعض الأحيان']).map(escapeStr)
  const prosEn = (ai.pros_en || ['Great performances', 'Compelling story', 'Strong direction']).map(escapeStr)
  const consEn = (ai.cons_en || ['Pacing issues in parts']).map(escapeStr)
  const tags = (ai.tags || [toSlug(movie.title)]).map(escapeStr)

  const genreStr = genres.map(g => `'${g}'`).join(', ')
  const castStr = cast.map(c => `'${escapeStr(c)}'`).join(', ')
  const prosArStr = prosAr.map(p => `'${p}'`).join(', ')
  const consArStr = consAr.map(c => `'${c}'`).join(', ')
  const prosEnStr = prosEn.map(p => `'${p}'`).join(', ')
  const consEnStr = consEn.map(c => `'${c}'`).join(', ')
  const tagsStr = tags.map(t => `'${t}'`).join(', ')

  let ts = `  {
    id: '${id}', slug: '${slug}', title: '${escapeStr(movie.title)}', title_ar: '${escapeStr(ai.title_ar || movie.title)}', year: ${year},
    director: '${escapeStr(director)}', director_ar: '${escapeStr(ai.director_ar || director)}',
    cast: [${castStr}],
    genres: [${genreStr}],
    poster_url: '${poster}',
    backdrop_url: '${backdrop}',`

  if (trailerUrl) ts += `\n    trailer_url: '${trailerUrl}',`

  ts += `
    description_ar: '${escapeStr(ai.description_ar || movie.overview)}',
    description_en: '${escapeStr(movie.overview || '')}',
    description_fr: '${escapeStr(ai.description_fr || '')}',
    description_es: '${escapeStr(ai.description_es || '')}',
    description_tr: '${escapeStr(ai.description_tr || '')}',
    description_de: '${escapeStr(ai.description_de || '')}',
    description_ja: '${escapeStr(ai.description_ja || '')}',
    description_pt: '${escapeStr(ai.description_pt || '')}',
    rating_overall: ${overall}, rating_story: ${ratingStory}, rating_acting: ${ratingActing}, rating_direction: ${ratingDirection}, rating_cinematography: ${ratingCinema}, rating_music: ${ratingMusic},
    imdb_rating: ${imdb}, rotten_tomatoes: ${rtScore},`

  if (movie.budget > 0) ts += `\n    budget_million: ${(movie.budget / 1e6).toFixed(1)},`
  if (movie.revenue > 0) ts += `\n    box_office_million: ${(movie.revenue / 1e6).toFixed(0)},`

  ts += `
    duration: ${movie.runtime || 120}, language: '${movie.original_language?.toUpperCase() || 'EN'}', country: '${(movie.production_countries?.[0]?.iso_3166_1 || 'US')}',
    reviews_count: ${Math.floor(Math.random() * 5000) + 1000}, is_featured: ${overall >= 8.5}, release_date: '${movie.release_date || year + '-01-01'}', tags: [${tagsStr}],
    pros_ar: [${prosArStr}],
    cons_ar: [${consArStr}],
    pros_en: [${prosEnStr}],
    cons_en: [${consEnStr}],
  },`

  return { slug, ts }
}

// ─── Inject into movies.ts ───────────────────────────────────────────────────
function appendMovies(moviesTS) {
  let content = fs.readFileSync(MOVIES_FILE, 'utf8')

  // Find the closing ] of the MOVIES array — search for last ']' on its own line
  // followed by a blank line (supports cases where comments/constants follow the array)
  let insertPoint = content.lastIndexOf('\n]\n\nexport function')
  if (insertPoint === -1) insertPoint = content.lastIndexOf('\n]\n\n// ')
  if (insertPoint === -1) insertPoint = content.lastIndexOf('\n]\n\nconst ')
  if (insertPoint === -1) insertPoint = content.lastIndexOf('\n]\n')
  if (insertPoint === -1) throw new Error('لم أجد نقطة الإدراج في movies.ts')

  const newMovies = '\n' + moviesTS.join('\n') + '\n'
  content = content.slice(0, insertPoint) + newMovies + content.slice(insertPoint)

  fs.writeFileSync(MOVIES_FILE, content)
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🎬 CineReview Auto Movie Adder')
  console.log('=' .repeat(50))

  const tracker = loadTracker()
  const existingSlugs = getExistingSlugs()
  let nextId = getNextId()

  console.log(`📊 الأفلام الحالية: ${existingSlugs.size}`)
  console.log(`🔢 ID التالي: ${nextId}`)

  const TARGET = parseInt(process.argv[2]) || 20
  const added = []
  const failed = []
  let page = tracker.last_page || 1

  console.log(`\n🎯 الهدف: إضافة ${TARGET} فيلم\n`)

  while (added.length < TARGET) {
    // Get a page of top rated movies
    console.log(`📄 جلب صفحة ${page} من TMDB...`)
    let movies
    try {
      movies = await getTopRatedMovies(page)
    } catch (e) {
      console.error(`❌ خطأ في TMDB: ${e.message}`)
      break
    }

    if (!movies.length) {
      page = 1 // restart from page 1
      continue
    }

    for (const movie of movies) {
      if (added.length >= TARGET) break

      // Skip non-English/Arabic movies with no poster
      if (!movie.poster_path) continue
      // Skip already added
      const slug = toSlug(movie.title)
      if (existingSlugs.has(slug)) continue
      // Skip adult content
      if (movie.adult) continue
      // Skip very low rated
      if (movie.vote_average < 6.5 || movie.vote_count < 1000) continue

      console.log(`\n🎬 [${added.length + 1}/${TARGET}] ${movie.title} (${movie.release_date?.split('-')[0]})`)

      try {
        // Get full details + multilingual data from TMDB
        const { details, credits, videos, translations } = await getMovieDetails(movie.id)
        const director = credits.crew?.find(p => p.job === 'Director')?.name || 'Unknown'

        // Build content from TMDB multilingual data (no AI needed)
        console.log(`   🌍 جلب الترجمات من TMDB...`)
        const imdbRating = parseFloat((movie.vote_average || 7).toFixed(1))
        const ai = buildMovieContentFromTMDB(details, translations, director, imdbRating)

        // Generate TypeScript
        const { slug: movieSlug, ts } = generateMovieTS(nextId, details, credits, videos, ai)

        added.push({ id: nextId, slug: movieSlug, title: movie.title, ts })
        existingSlugs.add(movieSlug)
        nextId++

        console.log(`   ✅ تم: ${movieSlug}`)

        // Small delay to avoid API limits
        await new Promise(r => setTimeout(r, 1500))

      } catch (e) {
        console.error(`   ❌ فشل: ${e.message}`)
        failed.push({ title: movie.title, error: e.message })
      }
    }

    page++
  }

  if (added.length === 0) {
    console.log('\n⚠️ لم يتم إضافة أي فيلم')
    return
  }

  // Inject into movies.ts
  console.log(`\n💾 إضافة ${added.length} فيلم إلى movies.ts...`)
  appendMovies(added.map(m => m.ts))

  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true'

  if (isCI) {
    // In GitHub Actions: just update tracker, commit handled by workflow
    tracker.last_page = page
    tracker.total_added = (tracker.total_added || 0) + added.length
    tracker.last_run = new Date().toISOString()
    tracker.tmdb_ids = [...(tracker.tmdb_ids || []), ...added.map(m => m.id)]
    saveTracker(tracker)
    console.log('\n✅ GitHub Actions: Vercel سيبني وينشر تلقائياً عند الـ push')
  } else {
    // Local: build then deploy
    console.log('\n🔨 بناء المشروع...')
    try {
      execSync('npx next build', { cwd: ROOT, stdio: 'inherit' })
    } catch (e) {
      console.error('❌ فشل البناء! التراجع عن التغييرات...')
      let content = fs.readFileSync(MOVIES_FILE, 'utf8')
      for (const m of added) {
        const start = content.indexOf(`\n  {\n    id: '${m.id}',`)
        const end = content.indexOf('\n  },\n', start) + 5
        if (start !== -1) content = content.slice(0, start) + content.slice(end)
      }
      fs.writeFileSync(MOVIES_FILE, content)
      console.error('تم التراجع. تحقق من الأخطاء ثم أعد المحاولة.')
      process.exit(1)
    }

    tracker.last_page = page
    tracker.total_added = (tracker.total_added || 0) + added.length
    tracker.last_run = new Date().toISOString()
    tracker.tmdb_ids = [...(tracker.tmdb_ids || []), ...added.map(m => m.id)]
    saveTracker(tracker)

    console.log('\n🚀 نشر على Vercel...')
    try {
      execSync('npx vercel --prod --yes', { cwd: ROOT, stdio: 'inherit' })
      console.log('\n✨ تم النشر بنجاح!')
    } catch (e) {
      console.error('⚠️ النشر فشل، لكن الملفات محدّثة محلياً')
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log(`✅ تمت إضافة: ${added.length} فيلم`)
  console.log(`❌ فشل: ${failed.length} فيلم`)
  console.log(`📊 إجمالي الأفلام الآن: ${tracker.total_added}`)
  console.log(`⏰ الوقت: ${new Date().toLocaleString('ar-SA')}`)

  if (added.length > 0) {
    console.log('\n🎬 الأفلام المضافة:')
    added.forEach(m => console.log(`   • ${m.title} (${m.slug})`))
  }
}

main().catch(e => {
  console.error('خطأ غير متوقع:', e)
  process.exit(1)
})
