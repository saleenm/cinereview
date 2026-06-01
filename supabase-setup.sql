-- CineReview — Supabase Tables Setup
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Movie Lists (shareable lists)
CREATE TABLE IF NOT EXISTS movie_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  slugs TEXT[] NOT NULL DEFAULT '{}',
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public read access
ALTER TABLE movie_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read lists" ON movie_lists FOR SELECT USING (true);
CREATE POLICY "Anyone can create lists" ON movie_lists FOR INSERT WITH CHECK (true);

-- 2. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  locale TEXT DEFAULT 'en',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- Private — only service role can read
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
-- Upsert on conflict (update locale/date if re-subscribed)
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_idx ON newsletter_subscribers (email);

-- 3. Movie Reviews (if not created yet)
CREATE TABLE IF NOT EXISTS movie_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  locale TEXT DEFAULT 'en',
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  helpful_count INTEGER DEFAULT 0
);

ALTER TABLE movie_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reviews" ON movie_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can write reviews" ON movie_reviews FOR INSERT WITH CHECK (true);
CREATE INDEX IF NOT EXISTS reviews_slug_idx ON movie_reviews (movie_slug);
