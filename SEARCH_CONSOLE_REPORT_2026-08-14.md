# cinereview — Search Console Weekly Report
**Date:** 2026-08-14  
**Site:** https://cinereview-mu.vercel.app

---

## Sitemap
- **URL count in sitemap:** 45,120
- **HTTP status:** 200 ✅

## Robots.txt
*(Verified via source — `app/robots.ts`; live fetch blocked by egress proxy)*
- **Allows `/`:** yes ✅
- **Sitemap declared:** yes → `https://cinereview-mu.vercel.app/sitemap.xml` ✅
- **Disallows:** `/api/`, `/profile`, `/watchlist`, `/list/`, `/*/search`, `/*/compare`

## Canonical Tags
- **inception:** `https://cinereview-mu.vercel.app/en/movies/inception` — correct, points to itself ✅
- **parasite:** ⚠️ unable to fetch (Vercel protection bypass returned 409 Conflict)
- **the-dark-knight:** `https://cinereview-mu.vercel.app/en/movies/the-dark-knight` — correct, points to itself ✅

## Hreflang (inception)
- **Count:** 9 (expected 9) ✅
- **Locales present:** `ar`, `en`, `fr`, `es`, `tr`, `de`, `ja`, `pt`, `x-default`
- **Missing locales:** none

## Page Status
| Path | HTTP |
|------|------|
| `/` | 200 ✅ |
| `/en/movies` | 200 ✅ |
| `/en/blog` | ⚠️ unable to verify (Vercel 409 bypass conflict) |
| `/ar/movies` | ⚠️ unable to verify (Vercel 409 bypass conflict) |

*Note: Direct curl to the site is blocked by the session's network egress policy (403 at proxy). Pages were fetched via Vercel MCP tool; some URLs triggered a 409 Conflict on Vercel's protection-bypass endpoint and could not be checked.*

## Repo Content
- **Blog posts:** 43 (38 in `lib/blog.ts` + 5 in `lib/blog-manual.ts`)
- **Movies:** 2,125 (in `lib/movies.ts`)

## vs Baseline (2026-08-07)
| Metric | Baseline | Now (proxy) | Change |
|--------|----------|-------------|--------|
| Sitemap URLs | — | **45,120** | first reading |
| Indexed (GSC) | 4,910 | ⚠️ check manually | — |
| Crawled not indexed | 2,124 | ⚠️ check manually | — |
| Duplicate w/o canonical | 241 | ⚠️ check manually | — |

*The sitemap contains 45,120 URLs (8 locales × ~5,640 pages including movies, blog, listings, and static pages). With only 4,910 indexed at baseline, roughly 40,000 URLs remain unindexed — this is the primary SEO gap to close.*

## Action Required
1. Open https://search.google.com/search-console and check:
   - **Coverage → Indexed count** (was 4,910 — has it grown?)
   - **Coverage → Crawled not indexed** (was 2,124 — has it dropped?)
   - **Coverage → Duplicate without canonical** (was 241 — has it dropped?)
2. Investigate why `/en/movies/parasite` could not be fetched via Vercel's tool — check if that slug exists or redirects in the deployment.
3. For `/en/blog` and `/ar/movies`, verify manually that they return 200 (no server-side issues found in repo code).

## Issues Found
1. **Large crawl gap:** 45,120 sitemap URLs vs 4,910 GSC-indexed = ~40,000 pages not yet indexed. This is expected for a growing site but worth tracking week-over-week. Consider requesting indexing for high-priority movie pages via GSC's URL Inspection tool.
2. **Parasite page inaccessible via Vercel MCP** (409 Conflict) — could not verify canonical or HTTP status. Manual check recommended.
3. **Canonical tags confirmed correct** on the two pages verified (inception, the-dark-knight) — no self-referential canonical issues detected.
4. **Hreflang fully implemented** — all 9 entries (8 locales + x-default) present on inception page; same pattern confirmed on the-dark-knight.
5. **Network access limitation:** The scheduled audit environment cannot reach `cinereview-mu.vercel.app` directly (egress policy blocks it). Future audits should use the Vercel MCP tool or a different environment with open egress to the deployment domain.
