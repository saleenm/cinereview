/**
 * fix-posters.mjs
 * Checks every movie's poster_url, identifies broken ones (404),
 * fetches correct poster from TMDB by title+year, and patches movies.ts
 */
import fs from 'fs'
import path from 'path'

const TMDB_KEY = process.env.TMDB_API_KEY || 'c01d9a2e0194599e1d28c0755c480965'
const MOVIES_FILE = path.resolve('lib/movies.ts')

// Parse slug + title + year + poster_url from movies.ts
function parseMovies(src) {
  const movies = []
  const pattern = /\{\s*id:\s*'[^']+',\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)'[^}]*?year:\s*(\d+)[^}]*?poster_url:\s*'([^']+)'/gs
  let m
  while ((m = pattern.exec(src)) !== null) {
    movies.push({ slug: m[1], title: m[2], year: parseInt(m[3]), poster_url: m[4] })
  }
  return movies
}

async function checkUrl(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    return r.ok
  } catch {
    return false
  }
}

async function fetchCorrectPoster(title, year) {
  try {
    const q = encodeURIComponent(title)
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${q}&year=${year}&language=en-US`
    const r = await fetch(url)
    const data = await r.json()
    const movie = data.results?.find(m => m.release_date?.startsWith(String(year))) || data.results?.[0]
    if (movie?.poster_path) return movie.poster_path
    return null
  } catch {
    return null
  }
}

async function main() {
  const src = fs.readFileSync(MOVIES_FILE, 'utf8')
  const movies = parseMovies(src)
  console.log(`Found ${movies.length} movies. Checking poster URLs...`)

  const broken = []
  const BATCH = 10

  for (let i = 0; i < movies.length; i += BATCH) {
    const batch = movies.slice(i, i + BATCH)
    const results = await Promise.all(batch.map(async (m) => {
      const ok = await checkUrl(m.poster_url)
      if (!ok) {
        process.stdout.write(`✗ ${m.title} (${m.year}) — ${m.poster_url}\n`)
        return m
      }
      return null
    }))
    broken.push(...results.filter(Boolean))
    process.stdout.write(`Checked ${Math.min(i + BATCH, movies.length)}/${movies.length}\r`)
  }

  console.log(`\n\nBroken posters: ${broken.length}`)

  if (broken.length === 0) {
    console.log('All poster URLs are valid!')
    return
  }

  let updatedSrc = src
  let fixedCount = 0

  for (const m of broken) {
    console.log(`Fixing: ${m.title} (${m.year})...`)
    const posterPath = await fetchCorrectPoster(m.title, m.year)
    if (!posterPath) {
      console.log(`  ✗ Could not find poster on TMDB`)
      continue
    }
    const newPosterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`
    const newBackdropUrl = `https://image.tmdb.org/t/p/original${posterPath}`
    console.log(`  ✓ New poster: ${newPosterUrl}`)

    // Replace poster_url
    updatedSrc = updatedSrc.replace(
      new RegExp(`(slug:\\s*'${m.slug}'[\\s\\S]*?poster_url:\\s*)'${m.poster_url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`),
      `$1'${newPosterUrl}'`
    )
    // Replace backdrop_url if it was the same broken URL
    if (updatedSrc.includes(m.poster_url)) {
      updatedSrc = updatedSrc.replace(
        new RegExp(`'${m.poster_url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'),
        `'${newBackdropUrl}'`
      )
    }
    fixedCount++
    // Small delay to avoid TMDB rate limit
    await new Promise(r => setTimeout(r, 300))
  }

  if (fixedCount > 0) {
    fs.writeFileSync(MOVIES_FILE, updatedSrc)
    console.log(`\n✅ Fixed ${fixedCount} posters in lib/movies.ts`)
  } else {
    console.log('\n⚠️  No posters could be fixed automatically')
  }
}

main().catch(console.error)
