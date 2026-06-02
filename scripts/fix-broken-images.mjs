#!/usr/bin/env node
/**
 * fix-broken-images.mjs
 * يفحص كل backdrop_url و poster_url في movies.ts
 * ويصلح الـ URLs التي تعطي 404 من TMDB API
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const MOVIES_FILE = path.join(ROOT, 'lib', 'movies.ts')

function loadEnv() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  }
}
loadEnv()

const TMDB_KEY = process.env.TMDB_API_KEY
if (!TMDB_KEY) { console.error('❌ TMDB_API_KEY غير موجود'); process.exit(1) }

async function checkUrl(url) {
  if (!url) return false
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    return res.ok
  } catch { return false }
}

async function fetchCorrectImages(tmdbId) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}&append_to_response=images`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '',
      backdrop: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '',
    }
  } catch { return null }
}

async function main() {
  console.log('🔍 فحص صور movies.ts...')
  let content = fs.readFileSync(MOVIES_FILE, 'utf8')

  // Extract all movies with id, poster_url, backdrop_url
  const moviePattern = /(\s*id:\s*'(\d+)'[\s\S]*?poster_url:\s*')(https?:[^']*|)('[\s\S]*?backdrop_url:\s*')(https?:[^']*|)(')/g

  const broken = []
  let match
  while ((match = moviePattern.exec(content)) !== null) {
    const id = match[2]
    const poster = match[3]
    const backdrop = match[5]
    if (!poster || !backdrop) {
      broken.push({ id, poster, backdrop, index: match.index })
    }
  }

  // Also check via HEAD requests (sample first 50 to avoid rate limits)
  console.log(`📊 إجمالي الأفلام في movies.ts`)
  console.log(`⚠️  أفلام بصور ناقصة: ${broken.length}`)

  // Now do HEAD checks on a sample
  const posterPattern = /id:\s*'(\d+)'[\s\S]{0,2000}?poster_url:\s*'(https?:[^']+)'/g
  const backdropPattern = /id:\s*'(\d+)'[\s\S]{0,2000}?backdrop_url:\s*'(https?:[^']+)'/g

  const posters = {}
  const backdrops = {}
  for (const m of content.matchAll(/id:\s*'(\d+)'[\s\S]{0,3000}?poster_url:\s*'([^']*)'[\s\S]{0,500}?backdrop_url:\s*'([^']*)'/g)) {
    posters[m[1]] = m[2]
    backdrops[m[1]] = m[3]
  }

  const ids = Object.keys(posters)
  console.log(`\n🎬 إجمالي الأفلام: ${ids.length}`)
  console.log('🔍 فحص صحة URLs...')

  let fixed = 0
  const BATCH = 10

  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = ids.slice(i, i + BATCH)
    await Promise.all(batch.map(async (id) => {
      const poster = posters[id]
      const backdrop = backdrops[id]

      const [posterOk, backdropOk] = await Promise.all([
        checkUrl(poster),
        checkUrl(backdrop),
      ])

      if (!posterOk || !backdropOk) {
        const newImgs = await fetchCorrectImages(id)
        if (!newImgs) return

        if (!posterOk && newImgs.poster) {
          content = content.replace(poster, newImgs.poster)
          console.log(`  ✅ poster fixed [${id}]: ${newImgs.poster.slice(40)}`)
          fixed++
        }
        if (!backdropOk && newImgs.backdrop) {
          content = content.replace(backdrop, newImgs.backdrop)
          console.log(`  ✅ backdrop fixed [${id}]: ${newImgs.backdrop.slice(43)}`)
          fixed++
        }
      }
    }))

    process.stdout.write(`\r  تم فحص ${Math.min(i + BATCH, ids.length)}/${ids.length}...`)
    await new Promise(r => setTimeout(r, 200)) // rate limit
  }

  console.log(`\n\n✅ تم إصلاح ${fixed} صورة`)
  if (fixed > 0) {
    fs.writeFileSync(MOVIES_FILE, content)
    console.log('💾 تم حفظ movies.ts')
  } else {
    console.log('ℹ️  لا توجد صور تحتاج إصلاح')
  }
}

main().catch(e => { console.error(e); process.exit(1) })
