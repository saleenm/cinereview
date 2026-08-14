# CineReview — Search Console Audit 2026-08-14
**Site:** https://cinereview-mu.vercel.app  
**Baseline date:** 2026-08-07  
**Fixes deployed:** 2026-08-13  
**Audit method:** Vercel MCP live fetch + local code inspection  
*(Direct curl blocked by egress proxy — cinereview-mu.vercel.app returns 403 at gateway)*

---

## Technical Checks

| Check | Expected | Result | Status |
|-------|----------|--------|--------|
| Sitemap URL count | ↓ from 8-locale build (ar+en only) | **7,770** (ar: 3,885 / en: 3,885) | ✅ |
| Sitemap HTTP | 200 | 200 | ✅ |
| Non-ar/en movie URLs in sitemap | 0 | 0 | ✅ |
| Non-ar/en blog URLs in sitemap | 0 | 0 | ✅ |
| /fr/blog canonical → /en/blog | yes | **no** (points to /fr/blog itself) | ❌ |
| /fr/blog has noindex | yes | **no** (no robots meta tag found) | ❌ |
| /fr/blog hreflang count | 2 (ar+en) | **8** (all locales) | ❌ |
| /ar/genre hreflang (code) | ar+en+x-default | 3 tags ✅ | ✅ |
| /ar/genre generateStaticParams | ar+en only | ar+en only | ✅ |
| /ar/genre ItemList schema (code) | yes | yes | ✅ |
| /ar/genre Arabic titles (code) | yes | GENRE_NAMES_AR map present | ✅ |
| /ar/movies generateStaticParams | ar+en only | ar+en only | ✅ |
| /ar/movies revalidate=86400 (code) | yes | yes (line 24) | ✅ |
| /ar/movies hreflang (live) | ar+en+x-default | **9** (8 locales + x-default) | ❌ |
| /ar/movies canonical (live) | self | /ar/movies/inception ✅ | ✅ |
| Blog [slug] generateStaticParams | ar+en only | ar+en only | ✅ |
| Blog [slug] canonical non-ar → /en/ | yes | yes | ✅ |
| Blog [slug] noindex fr/es/tr/de/ja/pt | yes | yes | ✅ |
| auto-genre/director posts noindex | yes | yes (lib/blog.ts confirmed) | ✅ |
| Homepage ld+json count | ≥2 | **10** | ✅ |
| Homepage WebSite schema | yes | yes | ✅ |
| Homepage Organization schema | yes | yes | ✅ |
| Homepage dual SearchAction (ar+en) | yes | yes (2 SearchAction blocks) | ✅ |
| Blog listing generateStaticParams | ar+en only | **ALL 8 LOCALES** | ❌ |

---

## HTTP Status
*(Verified via Vercel MCP; direct curl returns HTTP 000 / proxy 403)*

| Path | Status |
|------|--------|
| /sitemap.xml | 200 ✅ |
| /robots.txt | 200 ✅ |
| /ar (homepage) | 200 ✅ |
| /fr/blog | 200 (served, no noindex) ⚠️ |
| /ar/movies/inception | 200 ✅ |
| /ar/genre/drama | unverifiable via Vercel MCP (shareable URL failed) |

---

## robots.txt

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /profile
Disallow: /watchlist
Disallow: /list/
Disallow: /*/search
Disallow: /*/compare

Host: https://cinereview-mu.vercel.app
Sitemap: https://cinereview-mu.vercel.app/sitemap.xml
```

✅ Correct — crawlable, sitemap declared.

---

## GSC Comparison (manual check needed)

| Metric | Baseline (2026-08-07) | Current (check GSC) | Change |
|--------|----------------------|---------------------|--------|
| Indexed pages | 4,910 | ? | ? |
| Crawled not indexed | 2,124 | ? | ? |
| Duplicate w/o canonical | 241 | ? | ? |

⚠️ GSC data lags 2–4 weeks. Sitemap dropped to ar+en-only (7,770 total). Expected impact: "Crawled not indexed" and "Duplicate w/o canonical" should fall significantly. Check again **2026-08-28**.

---

## Issues Found

### 🔴 CRITICAL — Blog listing page (`app/[locale]/blog/page.tsx`) fixes NOT deployed

The scheduled fixes for the blog listing page were **not applied** — the code is unchanged:

1. **`generateStaticParams` still uses ALL 8 LOCALES:**
   ```ts
   // current (wrong):
   return LOCALES.map((locale) => ({ locale }))
   // should be:
   return ['ar', 'en'].map((locale) => ({ locale }))
   ```

2. **Canonical for non-ar locales does NOT redirect to `/en/blog`:**
   ```ts
   // current (wrong) — points to itself:
   canonical: `${BASE}/${locale}/blog`
   // should be:
   canonical: `${BASE}/${locale === 'ar' ? 'ar' : 'en'}/blog`
   ```

3. **No `noindex` for fr/es/tr/de/ja/pt:**
   - `generateMetadata` has no robots noindex logic.
   - Live `/fr/blog` confirmed: **no** `<meta name="robots" content="noindex">`.
   - Live `/fr/blog` hreflang: **8 alternate tags** (all locales), should be ar+en only.

### 🟡 MEDIUM — Movie page hreflang still lists all 8 locales

`generateStaticParams` was fixed (ar+en only ✅), but `generateMetadata` still outputs 8-locale hreflang:

```ts
// current (wrong):
languages: {
  ...Object.fromEntries(
    ['ar', 'en', 'fr', 'es', 'tr', 'de', 'ja', 'pt'].map((l) => [l, `${BASE}/${l}/movies/${slug}`])
  ),
  'x-default': `${BASE}/ar/movies/${slug}`,
},
```

Live `/ar/movies/inception` confirmed: **9 hreflang tags** (8 locales + x-default).

Should be: ar, en, x-default only (3 tags).  
**Affected file:** `app/[locale]/movies/[slug]/page.tsx`

---

## What Is Working Correctly

- ✅ Sitemap: 7,770 URLs, perfectly split ar/en — no other locale URLs present
- ✅ Blog individual post pages: ar+en generateStaticParams, canonical → /en/ for non-ar, noindex for thin/auto-generated posts
- ✅ Auto-generated genre/director blog posts: `noindex: true` in lib/blog.ts
- ✅ Movie page: ar+en generateStaticParams, `revalidate=86400`, canonical self-referencing correctly
- ✅ Genre page: ar+en generateStaticParams, hreflang ar+en+x-default only, ItemList schema, Arabic genre titles
- ✅ Homepage: WebSite schema, Organization schema, dual SearchAction (ar+en), 10 ld+json blocks
- ✅ robots.txt: clean and correct

---

## Action Required

### Code fixes needed (2 remaining):

**Fix 1 — `app/[locale]/blog/page.tsx`:**
```ts
// generateStaticParams
return ['ar', 'en'].map((locale) => ({ locale }))

// generateMetadata — add:
const isNonPrimary = locale !== 'ar' && locale !== 'en'
// canonical: locale === 'ar' ? /ar/blog : /en/blog
// robots: { index: !isNonPrimary, follow: true } when isNonPrimary
// languages: { ar: ..., en: ..., 'x-default': ... }  (remove 8-locale LANGS)
```

**Fix 2 — `app/[locale]/movies/[slug]/page.tsx` generateMetadata:**
```ts
languages: {
  ar: `${BASE}/ar/movies/${slug}`,
  en: `${BASE}/en/movies/${slug}`,
  'x-default': `${BASE}/ar/movies/${slug}`,
},
```

### GSC (manual):
Open https://search.google.com/search-console → Coverage → compare to baseline. Re-check **2026-08-28** for GSC lag to clear.
