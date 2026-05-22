-- Movie Reviews Table for CineReview
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS movie_reviews (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_slug    text NOT NULL,
  name          text NOT NULL,
  locale        text NOT NULL DEFAULT 'ar',
  rating        numeric(3,1) NOT NULL CHECK (rating >= 1 AND rating <= 10),
  comment       text NOT NULL CHECK (length(comment) >= 10),
  helpful_count int DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS movie_reviews_slug_idx ON movie_reviews (movie_slug);
CREATE INDEX IF NOT EXISTS movie_reviews_created_idx ON movie_reviews (created_at DESC);

-- Enable RLS
ALTER TABLE movie_reviews ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public read reviews" ON movie_reviews FOR SELECT USING (true);

-- Anyone can insert
CREATE POLICY "public insert reviews" ON movie_reviews FOR INSERT WITH CHECK (true);

-- Seed some reviews for popular films
INSERT INTO movie_reviews (movie_slug, name, locale, rating, comment) VALUES
('the-godfather', 'أحمد السيد', 'ar', 10, 'أعظم فيلم في التاريخ بلا منازع. كل مشهد تحفة فنية.'),
('the-godfather', 'Mohammed Ali', 'en', 9.5, 'The pinnacle of cinema. Brando is absolutely flawless.'),
('the-godfather', 'Jean-Pierre', 'fr', 10, 'Le chef-d''œuvre absolu du cinéma mondial.'),
('the-dark-knight', 'خالد العمري', 'ar', 10, 'هيث ليدجر كجوكر — لن يُنسى للأبد. مستحق كل أوسكاراته.'),
('the-dark-knight', 'Sarah Chen', 'en', 9.5, 'Heath Ledger''s Joker is the most terrifying and compelling villain ever.'),
('interstellar', 'فيصل الحربي', 'ar', 9.5, 'فيلم غيّر طريقة تفكيري في الكون. موسيقى زيمر تدخل الروح.'),
('interstellar', 'Carlos García', 'es', 9, 'La música de Hans Zimmer y las imágenes del espacio son simplemente perfectas.'),
('parasite', 'يوسف المالكي', 'ar', 9.5, 'الفيلم الكوري الذي أثبت أن السينما بلا حدود. نهاية صادمة.'),
('parasite', 'Elena Rossi', 'it', 10, 'Capolavoro assoluto. Il finale mi ha lasciato senza parole.'),
('schindlers-list', 'نورة العتيبي', 'ar', 10, 'بكيت طوال الفيلم. شهادة للإنسانية لا يجب أن تُنسى.'),
('inception', 'علي البلوشي', 'ar', 9, 'تحفة ذهنية. شاهدته 3 مرات وما زلت أكتشف تفاصيل جديدة.'),
('the-shawshank-redemption', 'سارة خالد', 'ar', 10, 'أكثر فيلم ملهم في حياتي. جملة ''احصل على الحياة'' ستظل معي دائماً.'),
('joker-2019', 'محمد الأحمد', 'ar', 9.5, 'خواكين فينيكس فاق كل توقعاتي. تجربة مشاهدة استثنائية.'),
('whiplash', 'ريم الغامدي', 'ar', 9.5, 'الدقائق الأخيرة من أعظم ما شاهدت في حياتي. JK سيمونز مرعب ورائع.'),
('capernaum', 'لمياء السالم', 'ar', 10, 'بكيت من أول دقيقة. نادين لبكي فنانة استثنائية وزين طفل معجزة.'),
('the-message', 'عبدالله القحطاني', 'ar', 9.5, 'فخر لكل عربي ومسلم. إنتاج ضخم لا مثيل له في السينما العربية.'),
('dune-part-two', 'طارق الشمري', 'ar', 9, 'فيلنوف خلق شيئاً استثنائياً. التصوير الأفضل في تاريخ الخيال العلمي.'),
('gladiator', 'Anna Kowalski', 'de', 9, 'Russell Crowe ist unvergleichlich. Der Film bleibt im Gedächtnis.'),
('the-pianist', 'Yuki Tanaka', 'ja', 9.5, 'アドリアン・ブロディの演技は忘れられない。涙が止まらなかった。');
