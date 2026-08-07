import type { BlogPost, Locale } from './blog-types'

// ── MANUALLY CURATED BLOG POSTS ─────────────────────────────────────────────
// Edit this file to add/update manual listicles and evergreen content.
// The auto-blog script (scripts/auto-blog.mjs) only touches lib/blog.ts.
// Keeping them separate prevents git conflicts.

export const MANUAL_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'best-movies-netflix-2025',
    date: '2026-08-07',
    readTime: 7,
    image: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    i18n: {
      ar: {
        title: 'أفضل 10 أفلام على نتفليكس تستحق المشاهدة الآن',
        description: 'قائمة منتقاة بأفضل أفلام نتفليكس 2025 — من الإثارة إلى الدراما إلى الرعب. كل فيلم قيّمناه وشرحنا لماذا يستحق وقتك.',
        category: 'قوائم',
        content: `## أفضل أفلام نتفليكس الآن

نتفليكس يضم آلاف الأفلام — لكن ليس كلها يستحق وقتك. اخترنا لك أفضل 10 بناءً على التقييمات والتأثير السينمائي.

### 1. The Shawshank Redemption (1994) — 9.3/10
الأعلى تقييماً في تاريخ IMDb. قصة الأمل والصداقة في السجن التي لا تُنسى. **لماذا تشاهده الآن؟** لأنه يذكّرك بأن الإنسانية تنتصر دائماً.

### 2. Inception (2010) — 9.0/10
نولان في أوج إبداعه. طبقات من الأحلام، بصريات مذهلة، وسيناريو يجعلك تفكر لأيام. **تحذير:** ستشاهده مرتين على الأقل.

### 3. The Godfather (1972) — 9.2/10
الأفلام التي يقال عنها "كلاسيكية" كثيرة — لكن العرّاب هو الكلاسيكية المطلقة. كوبولا وبراندو صنعا شيئاً لا يتكرر.

### 4. Parasite (2019) — 9.0/10
أول فيلم غير إنجليزي يفوز بالأوسكار. طبقية اجتماعية مُلبّسة بأسلوب تشويق لا يتوقف.

### 5. Interstellar (2014) — 8.9/10
رحلة عبر الزمن والفضاء والمشاعر الإنسانية. الموسيقى وحدها تستحق المشاهدة.

### 6. Schindler's List (1993) — 9.1/10
سبيلبرغ يوثّق أحد أكثر الفصول المظلمة في التاريخ البشري بأسلوب يحطم القلب ويبني الروح في آنٍ معاً.

### 7. Spirited Away (2001) — 8.8/10
أنيمي ميازاكي الخالد. عوالم لا توجد إلا في الخيال — لكنها تشعر بأنها أكثر واقعية من الواقع.

### 8. Forrest Gump (1994) — 8.7/10
"الحياة مثل علبة الشوكولاتة." تانكريد هانكس في أداء أسطوري عبر خمسة عقود من التاريخ الأمريكي.

### 9. Whiplash (2014) — 8.8/10
الطموح مقابل الإنسانية. Damien Chazelle يصنع فيلماً عن الموسيقى يجعلك تمسك كرسيك من الضغط النفسي.

### 10. Leon: The Professional (1994) — 8.5/10
لوك بيسون يصنع أفضل أفلامه. علاقة غير عادية، أداء استثنائي، وإثارة لا تنقطع.

---

## نصيحة للمشاهدة
بعض هذه الأفلام قد تكون محجوبة في منطقتك — **VPN يحل المشكلة فوراً** ويفتح مكتبة نتفليكس الكاملة.`,
      },
      en: {
        title: 'Top 10 Movies on Netflix Worth Watching Right Now',
        description: 'A curated list of the best Netflix movies in 2025 — from thrillers to drama to horror. We rated each one and explained why it deserves your time.',
        category: 'Lists',
        content: `## Best Movies on Netflix Right Now

Netflix has thousands of films — but not all deserve your time. We picked the best 10 based on ratings and cinematic impact.

### 1. The Shawshank Redemption (1994) — 9.3/10
The highest-rated film in IMDb history. A story of hope and friendship in prison that you'll never forget. **Why watch it now?** It reminds you that humanity always wins.

### 2. Inception (2010) — 9.0/10
Nolan at his creative peak. Layers of dreams, stunning visuals, and a screenplay that keeps you thinking for days. **Warning:** You'll watch it at least twice.

### 3. The Godfather (1972) — 9.2/10
Many films are called "classics" — but The Godfather is the absolute classic. Coppola and Brando created something irreplaceable.

### 4. Parasite (2019) — 9.0/10
The first non-English film to win Best Picture at the Oscars. Social class commentary wrapped in non-stop thriller style.

### 5. Interstellar (2014) — 8.9/10
A journey through time, space, and human emotion. The score alone is worth watching.

### 6. Schindler's List (1993) — 9.1/10
Spielberg documents one of history's darkest chapters in a way that breaks your heart and builds your spirit simultaneously.

### 7. Spirited Away (2001) — 8.8/10
Miyazaki's timeless anime. Worlds that exist only in imagination — yet feel more real than reality.

### 8. Forrest Gump (1994) — 8.7/10
"Life is like a box of chocolates." Tom Hanks in a legendary performance across five decades of American history.

### 9. Whiplash (2014) — 8.8/10
Ambition vs. humanity. Damien Chazelle makes a film about music that has you gripping your seat with psychological tension.

### 10. Leon: The Professional (1994) — 8.5/10
Luc Besson at his finest. An unconventional relationship, exceptional acting, and non-stop thrills.

---

## Streaming Tip
Some of these films may be geo-blocked in your region — a **VPN solves it instantly** and unlocks the full Netflix library.`,
      },
      fr: {
        title: 'Top 10 des films Netflix à regarder maintenant',
        description: 'Une liste sélectionnée des meilleurs films Netflix en 2025 — du thriller au drame en passant par l\'horreur.',
        category: 'Listes',
        content: `## Les meilleurs films sur Netflix maintenant\n\n### 1. The Shawshank Redemption (1994) — 9.3/10\nLe film le mieux noté de l'histoire d'IMDb. Une histoire d'espoir et d'amitié en prison inoubliable.\n\n### 2. Inception (2010) — 9.0/10\nNolan à son sommet créatif. Des couches de rêves, des visuels époustouflants.\n\n### 3. The Godfather (1972) — 9.2/10\nLe classique absolu. Coppola et Brando ont créé quelque chose d'irremplaçable.\n\n### 4. Parasite (2019) — 9.0/10\nPremier film non-anglophone à remporter l'Oscar du meilleur film.\n\n### 5. Interstellar (2014) — 8.9/10\nUn voyage à travers le temps, l'espace et les émotions humaines.\n\n### 6. Schindler's List (1993) — 9.1/10\nSpielberg documente l'un des chapitres les plus sombres de l'histoire.\n\n### 7. Spirited Away (2001) — 8.8/10\nL'anime intemporel de Miyazaki. Des mondes qui n'existent que dans l'imagination.\n\n### 8. Forrest Gump (1994) — 8.7/10\nTom Hanks dans une performance légendaire.\n\n### 9. Whiplash (2014) — 8.8/10\nAmbition contre humanité. Damien Chazelle crée un film sur la musique qui vous happe.\n\n### 10. Leon: The Professional (1994) — 8.5/10\nLuc Besson au meilleur de sa forme.\n\n---\n\n## Conseil de streaming\nCertains de ces films peuvent être géo-bloqués dans votre région — un **VPN résout le problème instantanément**.`,
      },
      es: {
        title: 'Las 10 mejores películas en Netflix para ver ahora',
        description: 'Una lista curada de las mejores películas de Netflix en 2025 — desde thrillers hasta drama y terror.',
        category: 'Listas',
        content: `## Las mejores películas en Netflix ahora\n\n### 1. The Shawshank Redemption (1994) — 9.3/10\nLa película mejor valorada en la historia de IMDb.\n\n### 2. Inception (2010) — 9.0/10\nNolan en su punto álgido creativo. Capas de sueños y visuales impresionantes.\n\n### 3. The Godfather (1972) — 9.2/10\nEl clásico absoluto. Coppola y Brando crearon algo insustituible.\n\n### 4. Parasite (2019) — 9.0/10\nPrimera película no anglófona en ganar el Oscar a la mejor película.\n\n### 5. Interstellar (2014) — 8.9/10\nUn viaje a través del tiempo, el espacio y las emociones humanas.\n\n### 6. Schindler's List (1993) — 9.1/10\nSpielberg documenta uno de los capítulos más oscuros de la historia.\n\n### 7. Spirited Away (2001) — 8.8/10\nEl anime atemporal de Miyazaki.\n\n### 8. Forrest Gump (1994) — 8.7/10\nTom Hanks en una actuación legendaria.\n\n### 9. Whiplash (2014) — 8.8/10\nAmbición contra humanidad.\n\n### 10. Leon: The Professional (1994) — 8.5/10\nLuc Besson en su mejor momento.\n\n---\n\n## Consejo de streaming\nAlgunas películas pueden estar bloqueadas en tu región — un **VPN lo soluciona al instante**.`,
      },
      tr: {
        title: 'Netflix\'te İzlemeye Değer En İyi 10 Film',
        description: 'Thriller\'dan drama ve korku filmlerine kadar 2025\'in en iyi Netflix filmlerinin seçilmiş listesi.',
        category: 'Listeler',
        content: `## Şu An Netflix\'teki En İyi Filmler\n\n### 1. The Shawshank Redemption (1994) — 9.3/10\nIMDb tarihinin en yüksek puanlı filmi.\n\n### 2. Inception (2010) — 9.0/10\nNolan yaratıcılığının zirvesinde.\n\n### 3. The Godfather (1972) — 9.2/10\nMutlak klasik. Coppola ve Brando eşsiz bir şey yarattı.\n\n### 4. Parasite (2019) — 9.0/10\nOscar\'da En İyi Film ödülü kazanan ilk İngilizce olmayan film.\n\n### 5. Interstellar (2014) — 8.9/10\nZaman, uzay ve insan duyguları boyunca bir yolculuk.\n\n### 6-10. Diğer Başyapıtlar\nSchindler\'s List, Spirited Away, Forrest Gump, Whiplash, Leon: The Professional.\n\n---\n\n## Yayın İpucu\nBu filmlerden bazıları bölgenizde coğrafi olarak engellenmiş olabilir — bir **VPN anında çözer**.`,
      },
      de: {
        title: 'Die 10 besten Filme auf Netflix, die es lohnt zu sehen',
        description: 'Eine kuratierte Liste der besten Netflix-Filme 2025 — von Thrillern über Drama bis Horror.',
        category: 'Listen',
        content: `## Die besten Filme auf Netflix jetzt\n\n### 1. The Shawshank Redemption (1994) — 9.3/10\nDer am höchsten bewertete Film in der Geschichte von IMDb.\n\n### 2. Inception (2010) — 9.0/10\nNolan auf dem Höhepunkt seiner Kreativität.\n\n### 3. The Godfather (1972) — 9.2/10\nDer absolute Klassiker. Coppola und Brando schufen etwas Unersetzliches.\n\n### 4. Parasite (2019) — 9.0/10\nErster nicht-englischsprachiger Film, der den Oscar für den besten Film gewann.\n\n### 5. Interstellar (2014) — 8.9/10\nEine Reise durch Zeit, Raum und menschliche Emotionen.\n\n### 6-10. Weitere Meisterwerke\nSchindler\'s List, Spirited Away, Forrest Gump, Whiplash, Leon: The Professional.\n\n---\n\n## Streaming-Tipp\nEinige dieser Filme können in Ihrer Region geo-blockiert sein — ein **VPN löst es sofort**.`,
      },
      ja: {
        title: 'Netflix で今すぐ見る価値のあるトップ10映画',
        description: 'スリラーからドラマ、ホラーまで — 2025年のNetflixベスト映画のキュレーションリスト。',
        category: 'リスト',
        content: `## 今すぐNetflixで見るべき最高の映画\n\n### 1. ショーシャンクの空に (1994) — 9.3/10\nIMDb史上最高評価の映画。\n\n### 2. インセプション (2010) — 9.0/10\nノーランが創造力の頂点に。夢の層、驚異的なビジュアル。\n\n### 3. ゴッドファーザー (1972) — 9.2/10\n究極のクラシック。コッポラとブランドが作った唯一無二の作品。\n\n### 4. パラサイト (2019) — 9.0/10\nアカデミー作品賞を受賞した初の非英語映画。\n\n### 5-10. その他の傑作\nインターステラー、シンドラーのリスト、千と千尋の神隠し、フォレスト・ガンプ、セッション、レオン。\n\n---\n\n## ストリーミングのヒント\nこれらの映画の一部はあなたの地域でブロックされている場合があります — **VPNが即座に解決します**。`,
      },
      pt: {
        title: 'Os 10 melhores filmes da Netflix para assistir agora',
        description: 'Uma lista curada dos melhores filmes da Netflix em 2025 — de thrillers a drama e terror.',
        category: 'Listas',
        content: `## Os melhores filmes na Netflix agora\n\n### 1. The Shawshank Redemption (1994) — 9.3/10\nO filme mais bem avaliado da história do IMDb.\n\n### 2. Inception (2010) — 9.0/10\nNolan no auge criativo. Camadas de sonhos, visuais impressionantes.\n\n### 3. The Godfather (1972) — 9.2/10\nO clássico absoluto. Coppola e Brando criaram algo insubstituível.\n\n### 4. Parasite (2019) — 9.0/10\nPrimeiro filme não-anglófono a ganhar o Oscar de Melhor Filme.\n\n### 5-10. Outras obras-primas\nInterstellar, Schindler\'s List, Spirited Away, Forrest Gump, Whiplash, Leon: The Professional.\n\n---\n\n## Dica de streaming\nAlguns desses filmes podem estar bloqueados geograficamente em sua região — um **VPN resolve instantaneamente**.`,
      },
    },
  },

  {
    slug: 'best-horror-movies-all-time',
    date: '2026-08-07',
    readTime: 8,
    image: 'https://image.tmdb.org/t/p/original/bjXoF1QoqVFkHKZ0CNrQRMQFAyP.jpg',
    i18n: {
      ar: {
        title: 'أفضل 10 أفلام رعب في التاريخ — لمن لا يخافون',
        description: 'قائمة أفضل أفلام الرعب على مر العصور — من الكلاسيكيات الخالدة إلى الأعمال الحديثة التي أعادت تعريف الخوف.',
        category: 'قوائم',
        content: `## أفضل أفلام الرعب في التاريخ

الرعب الحقيقي لا يختفي بعد انتهاء الفيلم — يبقى معك. هذه الأفلام فعلت ذلك.

### 1. The Shining (1980) — كوبريك يُعرّف الرعب
ستانلي كوبريك لم يصنع فيلم رعب عاديًا — بل قصيدة بصرية عن الجنون والعزلة. جاك نيكولسون في أداء لا يُمحى.

**لماذا هو مرعب؟** لأن الخوف لا يأتي من المشاهد — بل من الجو. فندق أوفرلوك نفسه يشعر حيًا.

### 2. Get Out (2017) — الرعب الاجتماعي
جوردان بيل صنع فيلمًا يناقش العنصرية عبر الرعب. فاز بالأوسكار لأفضل سيناريو أصلي.

**اللحظة الأكثر رعبًا:** ليست المشاهد الجامحة — بل الابتسامة الهادئة على وجوه الشخصيات.

### 3. Hereditary (2018) — فيلم الجيل
أري أستر دمّر أعصاب الجمهور في أول أفلامه الروائية الطويلة. شاهده مع الضوء مفتوح.

### 4. The Silence of the Lambs (1991)
الفيلم الوحيد الرعب الذي فاز بالأوسكارات الخمس الكبرى. هانيبال ليكتر أكثر شخصية مرعبة في تاريخ السينما.

### 5. It Follows (2014) — الرعب الفلسفي
ليس عن وحش يطاردك — بل عن حتمية الموت. استعارة بصرية لا تُنسى.

### 6-10. لا تفوّت
- **The Conjuring** (2013) — أرعب جمهور العالم
- **Midsommar** (2019) — رعب في النهار
- **A Quiet Place** (2018) — الصمت كسلاح
- **The Others** (2001) — نيكول كيدمان في نهاية صادمة
- **Psycho** (1960) — هيتشكوك يخترع الرعب الحديث

---

## هل أفلام الرعب محجوبة؟
بعض هذه الأفلام متاح على منصات محجوبة في منطقتك. **VPN يفتحها فوراً.**`,
      },
      en: {
        title: 'Top 10 Horror Movies of All Time — For Those Who Don\'t Scare Easily',
        description: 'The best horror films ever made — from timeless classics to modern works that redefined fear.',
        category: 'Lists',
        content: `## Best Horror Movies of All Time\n\nReal horror doesn't disappear when the film ends — it stays with you. These films did exactly that.\n\n### 1. The Shining (1980)\nKubrick didn't make an ordinary horror film — he made a visual poem about madness and isolation. Jack Nicholson in an unforgettable performance.\n\n### 2. Get Out (2017)\nJordan Peele made a film that discusses racism through horror. Won the Oscar for Best Original Screenplay.\n\n### 3. Hereditary (2018)\nAri Aster destroyed audiences' nerves in his feature debut. Watch it with the lights on.\n\n### 4. The Silence of the Lambs (1991)\nThe only horror film to win all five major Oscars. Hannibal Lecter remains cinema's most terrifying character.\n\n### 5. It Follows (2014)\nNot about a monster chasing you — but about the inevitability of death. An unforgettable visual metaphor.\n\n### 6-10. Don't Miss\n- **The Conjuring** (2013)\n- **Midsommar** (2019)\n- **A Quiet Place** (2018)\n- **The Others** (2001)\n- **Psycho** (1960)\n\n---\n\n## Geo-blocked horror?\nSome of these films are on platforms blocked in your region. A **VPN unlocks them instantly**.`,
      },
      fr: {
        title: 'Les 10 meilleurs films d\'horreur de tous les temps',
        description: 'Les meilleurs films d\'horreur jamais réalisés — des classiques intemporels aux œuvres modernes.',
        category: 'Listes',
        content: `## Les meilleurs films d\'horreur de tous les temps\n\n### 1. The Shining (1980)\nKubrick n\'a pas fait un film d\'horreur ordinaire — il a créé un poème visuel sur la folie.\n\n### 2. Get Out (2017)\nJordan Peele a fait un film qui aborde le racisme à travers l\'horreur. Oscar du meilleur scénario original.\n\n### 3. Hereditary (2018)\nAri Aster a détruit les nerfs du public dans ses débuts.\n\n### 4. The Silence of the Lambs (1991)\nLe seul film d\'horreur à remporter les cinq grands Oscars.\n\n### 5. It Follows (2014)\nPas sur un monstre qui vous poursuit — mais sur l\'inévitabilité de la mort.\n\n### 6-10. À ne pas manquer\nThe Conjuring, Midsommar, A Quiet Place, The Others, Psycho.`,
      },
      es: {
        title: 'Las 10 mejores películas de terror de todos los tiempos',
        description: 'Las mejores películas de terror jamás realizadas — desde clásicos eternos hasta obras modernas.',
        category: 'Listas',
        content: `## Las mejores películas de terror de todos los tiempos\n\n### 1. El resplandor (1980)\nKubrick no hizo una película de terror ordinaria — creó un poema visual sobre la locura.\n\n### 2. Get Out (2017)\nJordan Peele hizo una película que discute el racismo a través del terror.\n\n### 3. Hereditary (2018)\nAri Aster destruyó los nervios del público en su debut.\n\n### 4. El silencio de los inocentes (1991)\nLa única película de terror en ganar los cinco grandes Oscars.\n\n### 5. It Follows (2014)\nNo sobre un monstruo que te persigue — sino sobre la inevitabilidad de la muerte.\n\n### 6-10. No te pierdas\nThe Conjuring, Midsommar, A Quiet Place, The Others, Psycho.`,
      },
      tr: {
        title: 'Tüm Zamanların En İyi 10 Korku Filmi',
        description: 'Şimdiye kadar yapılmış en iyi korku filmleri — zamansız klasiklerden korkunun yeniden tanımlandığı modern eserlere.',
        category: 'Listeler',
        content: `## Tüm Zamanların En İyi Korku Filmleri\n\n### 1. Cinnet (1980)\nKubrick sıradan bir korku filmi yapmadı — delilik ve yalnızlık üzerine görsel bir şiir yarattı.\n\n### 2. Get Out (2017)\nJordan Peele korku aracılığıyla ırkçılığı ele alan bir film yaptı.\n\n### 3. Hereditary (2018)\nAri Aster ilk uzun metrajlı filminde seyircilerin sinirlerini yerle bir etti.\n\n### 4. Kuzuların Sessizliği (1991)\nBeş büyük Oscar\'ı kazanan tek korku filmi.\n\n### 5-10. Kaçırma\nIt Follows, The Conjuring, Midsommar, A Quiet Place, The Others, Psycho.`,
      },
      de: {
        title: 'Die 10 besten Horrorfilme aller Zeiten',
        description: 'Die besten Horrorfilme aller Zeiten — von zeitlosen Klassikern bis zu modernen Werken.',
        category: 'Listen',
        content: `## Die besten Horrorfilme aller Zeiten\n\n### 1. Shining (1980)\nKubrick machte keinen gewöhnlichen Horrorfilm — er schuf ein visuelles Gedicht über Wahnsinn.\n\n### 2. Get Out (2017)\nJordan Peele machte einen Film, der Rassismus durch Horror thematisiert.\n\n### 3. Hereditary (2018)\nAri Aster zerstörte das Nervenkostüm des Publikums in seinem Debüt.\n\n### 4. Das Schweigen der Lämmer (1991)\nDer einzige Horrorfilm, der alle fünf großen Oscars gewann.\n\n### 5-10. Nicht verpassen\nIt Follows, The Conjuring, Midsommar, A Quiet Place, The Others, Psycho.`,
      },
      ja: {
        title: '史上最高のホラー映画トップ10',
        description: 'これまでに作られた最高のホラー映画 — 時代を超えたクラシックから恐怖を再定義した現代作品まで。',
        category: 'リスト',
        content: `## 史上最高のホラー映画\n\n### 1. シャイニング (1980)\nキューブリックは普通のホラー映画を作らなかった — 狂気と孤独についての視覚詩を作った。\n\n### 2. ゲット・アウト (2017)\nジョーダン・ピールがホラーを通して人種差別を語った映画。\n\n### 3. ヘレディタリー (2018)\nアリ・アスターがデビュー長編で観客の神経を破壊した。\n\n### 4. 羊たちの沈黙 (1991)\n5つの主要なオスカーを受賞した唯一のホラー映画。\n\n### 5-10. 見逃せない\nIt Follows、死霊館、ミッドサマー、クワイエット・プレイス、アザーズ、サイコ。`,
      },
      pt: {
        title: 'Os 10 melhores filmes de terror de todos os tempos',
        description: 'Os melhores filmes de terror já feitos — de clássicos atemporais a obras modernas.',
        category: 'Listas',
        content: `## Os melhores filmes de terror de todos os tempos\n\n### 1. O Iluminado (1980)\nKubrick não fez um filme de terror comum — criou um poema visual sobre loucura e isolamento.\n\n### 2. Get Out (2017)\nJordan Peele fez um filme que discute o racismo através do terror.\n\n### 3. Hereditary (2018)\nAri Aster destruiu os nervos do público em sua estreia.\n\n### 4. O Silêncio dos Inocentes (1991)\nO único filme de terror a ganhar os cinco grandes Oscars.\n\n### 5-10. Não perca\nIt Follows, The Conjuring, Midsommar, A Quiet Place, The Others, Psycho.`,
      },
    },
  },

  {
    slug: 'best-movies-watch-tonight',
    date: '2026-08-07',
    readTime: 5,
    image: 'https://image.tmdb.org/t/p/original/qdIMHd4sEfJSckfVJfKQvisL02a.jpg',
    i18n: {
      ar: {
        title: 'ما الفيلم الذي أشاهده الليلة؟ — قائمة حسب مزاجك',
        description: 'لا تعرف ماذا تشاهد؟ اخترنا لك أفضل فيلم لكل مزاج — إثارة، رومانسية، كوميديا، أو مغامرة.',
        category: 'توصيات',
        content: `## ماذا أشاهد الليلة؟

أصعب سؤال بعد يوم طويل. الجواب هنا حسب مزاجك تماماً:

### 😤 أنت متوتر وتريد تفريغ الطاقة
**Whiplash (2014)** — إيقاع لا يتوقف، موسيقى تشعر بها في عظامك، ونهاية تحبس الأنفاس.

### 😢 أنت عاطفي وتريد تبكي
**Life is Beautiful (1997)** — روبرتو بنيني يصنع قصة حب وطفولة وسط أحلك الظروف. احتفظ بمناديل.

### 🧠 أنت مرهق وتريد مشاهدة سهلة
**Forrest Gump (1994)** — دفء إنساني، كوميديا خفيفة، وحكمة تظل معك.

### 😱 أنت تريد الإثارة والخوف
**Inception (2010)** — أحلام داخل أحلام. الخوف هنا ليس من الوحوش — بل من أن تضيع.

### ❤️ أنت مع أحد عزيز
**Cinema Paradiso (1988)** — قصة حب للسينما نفسها. رومانسية هادئة تترك أثراً.

### 🎭 تريد شيئاً يختلف عن كل ما شاهدته
**Parasite (2019)** — جريمة + كوميديا + دراما اجتماعية + رعب. فيلم واحد بأربعة أجناس.

### 👨‍👩‍👧 مع العائلة
**Spirited Away (2001)** — سحر لكل الأعمار. الأطفال يرونه قصة مغامرة، الكبار يرون استعارة عميقة.

### 😴 تريد نوم هانئ بعده
**The Shawshank Redemption (1994)** — الأمل دائماً ينتصر. ستنام مبتسماً.

---

## نصيحة
هذه الأفلام متاحة على منصات متعددة — إذا كانت بعضها محجوبة، **VPN يحلها في دقيقة**.`,
      },
      en: {
        title: 'What Movie Should I Watch Tonight? — A Guide by Mood',
        description: 'Don\'t know what to watch? We picked the best film for every mood — thriller, romance, comedy, or adventure.',
        category: 'Recommendations',
        content: `## What to Watch Tonight?\n\nThe hardest question after a long day. The answer is here, matched to your exact mood:\n\n### 😤 You're tense and need to release energy\n**Whiplash (2014)** — Non-stop rhythm, music you feel in your bones, and a breathtaking ending.\n\n### 😢 You're emotional and want to cry\n**Life is Beautiful (1997)** — Roberto Benigni creates a story of love and childhood in the darkest circumstances. Keep tissues nearby.\n\n### 🧠 You're tired and want easy viewing\n**Forrest Gump (1994)** — Human warmth, gentle comedy, and wisdom that stays with you.\n\n### 😱 You want thrills and fear\n**Inception (2010)** — Dreams within dreams. The fear here isn't from monsters — but from getting lost.\n\n### ❤️ You're with someone special\n**Cinema Paradiso (1988)** — A love story to cinema itself. Quiet romance that leaves a mark.\n\n### 🎭 You want something completely different\n**Parasite (2019)** — Crime + comedy + social drama + horror. One film in four genres.\n\n### 👨‍👩‍👧 With family\n**Spirited Away (2001)** — Magic for all ages.\n\n### 😴 You want peaceful sleep after\n**The Shawshank Redemption (1994)** — Hope always wins. You'll sleep smiling.\n\n---\n\n## Tip\nSome of these films may be geo-blocked — a **VPN solves it in a minute**.`,
      },
      fr: {
        title: 'Quel film regarder ce soir? — Un guide par humeur',
        description: 'Vous ne savez pas quoi regarder? Nous avons choisi le meilleur film pour chaque humeur.',
        category: 'Recommandations',
        content: `## Que regarder ce soir?\n\n### 😤 Vous êtes stressé\n**Whiplash (2014)** — Un rythme implacable et une fin à couper le souffle.\n\n### 😢 Vous êtes émotif\n**La Vie est belle (1997)** — Gardez des mouchoirs à portée de main.\n\n### 🧠 Vous êtes fatigué\n**Forrest Gump (1994)** — Chaleur humaine et sagesse.\n\n### 😱 Vous voulez frissonner\n**Inception (2010)** — Rêves dans des rêves.\n\n### ❤️ En amoureux\n**Cinema Paradiso (1988)** — Une histoire d\'amour au cinéma lui-même.\n\n### 🎭 Vous voulez quelque chose de différent\n**Parasite (2019)** — Crime + comédie + drame social + horreur.\n\n### 👨‍👩‍👧 En famille\n**Le Voyage de Chihiro (2001)** — Magie pour tous les âges.\n\n### 😴 Pour dormir paisiblement\n**Les Évadés (1994)** — L\'espoir triomphe toujours.`,
      },
      es: {
        title: '¿Qué película ver esta noche? — Una guía por estado de ánimo',
        description: '¿No sabes qué ver? Elegimos la mejor película para cada estado de ánimo.',
        category: 'Recomendaciones',
        content: `## ¿Qué ver esta noche?\n\n### 😤 Estás estresado\n**Whiplash (2014)** — Ritmo imparable y un final impresionante.\n\n### 😢 Estás emotivo\n**La vida es bella (1997)** — Ten pañuelos a mano.\n\n### 🧠 Estás cansado\n**Forrest Gump (1994)** — Calidez humana y sabiduría.\n\n### 😱 Quieres emoción\n**Inception (2010)** — Sueños dentro de sueños.\n\n### ❤️ Con alguien especial\n**Cinema Paradiso (1988)** — Una historia de amor al cine mismo.\n\n### 🎭 Quieres algo diferente\n**Parasite (2019)** — Crimen + comedia + drama + terror.\n\n### 👨‍👩‍👧 Con la familia\n**El viaje de Chihiro (2001)** — Magia para todas las edades.\n\n### 😴 Para dormir tranquilo\n**The Shawshank Redemption (1994)** — La esperanza siempre triunfa.`,
      },
      tr: {
        title: 'Bu Gece Ne İzlemeliyim? — Ruh Haline Göre Rehber',
        description: 'Ne izleyeceğinizi bilmiyor musunuz? Her ruh hali için en iyi filmi seçtik.',
        category: 'Öneriler',
        content: `## Bu Gece Ne İzlemeli?\n\n### 😤 Gerginsiniz\n**Whiplash (2014)** — Durdurulamaz ritim ve nefes kesen bir final.\n\n### 😢 Duygusalsınız\n**Hayat Güzeldir (1997)** — Mendil hazırlayın.\n\n### 🧠 Yorgunsunuz\n**Forrest Gump (1994)** — İnsani sıcaklık ve bilgelik.\n\n### 😱 Heyecan istiyorsunuz\n**Inception (2010)** — Rüyalar içinde rüyalar.\n\n### ❤️ Özel biriyle\n**Cinema Paradiso (1988)** — Sinemanın kendisine bir aşk hikayesi.\n\n### 🎭 Farklı bir şey istiyorsunuz\n**Parasite (2019)** — Suç + komedi + drama + korku.\n\n### 👨‍👩‍👧 Aileyle\n**Sen ve Ben (2001)** — Her yaş için sihir.\n\n### 😴 Huzurla uyumak için\n**Esaretin Bedeli (1994)** — Umut her zaman kazanır.`,
      },
      de: {
        title: 'Welchen Film soll ich heute Abend schauen? — Ein Leitfaden nach Stimmung',
        description: 'Wissen Sie nicht, was Sie schauen sollen? Wir haben den besten Film für jede Stimmung ausgewählt.',
        category: 'Empfehlungen',
        content: `## Was heute Abend schauen?\n\n### 😤 Sie sind angespannt\n**Whiplash (2014)** — Unaufhörlicher Rhythmus und ein atemraubendes Ende.\n\n### 😢 Sie sind emotional\n**Das Leben ist schön (1997)** — Halten Sie Taschentücher bereit.\n\n### 🧠 Sie sind müde\n**Forrest Gump (1994)** — Menschliche Wärme und Weisheit.\n\n### 😱 Sie wollen Spannung\n**Inception (2010)** — Träume in Träumen.\n\n### ❤️ Mit jemandem Besonderem\n**Cinema Paradiso (1988)** — Eine Liebesgeschichte an das Kino selbst.\n\n### 🎭 Sie wollen etwas Anderes\n**Parasite (2019)** — Krimi + Komödie + Drama + Horror.\n\n### 👨‍👩‍👧 Mit der Familie\n**Chihiros Reise ins Zauberland (2001)** — Magie für alle Altersgruppen.\n\n### 😴 Für ruhigen Schlaf danach\n**The Shawshank Redemption (1994)** — Hoffnung siegt immer.`,
      },
      ja: {
        title: '今夜何を観る？ — 気分別ガイド',
        description: '何を観るか決められない？すべての気分に最適な映画を選びました。',
        category: 'おすすめ',
        content: `## 今夜何を観る？\n\n### 😤 ストレス発散したい\n**セッション (2014)** — 止まらないリズムと息を呑むエンディング。\n\n### 😢 感情的になりたい\n**ライフ・イズ・ビューティフル (1997)** — ティッシュを用意して。\n\n### 🧠 疲れて楽に観たい\n**フォレスト・ガンプ (1994)** — 人間的な温かさと知恵。\n\n### 😱 スリルと恐怖を求めている\n**インセプション (2010)** — 夢の中の夢。\n\n### ❤️ 大切な人と\n**ニュー・シネマ・パラダイス (1988)** — 映画への愛の物語。\n\n### 🎭 全く違うものを求めている\n**パラサイト (2019)** — 犯罪＋コメディ＋ドラマ＋ホラー。\n\n### 👨‍👩‍👧 家族と\n**千と千尋の神隠し (2001)** — 全年齢向けの魔法。\n\n### 😴 穏やかに眠りたい\n**ショーシャンクの空に (1994)** — 希望は常に勝つ。`,
      },
      pt: {
        title: 'Que filme assistir hoje à noite? — Um guia por humor',
        description: 'Não sabe o que assistir? Escolhemos o melhor filme para cada humor.',
        category: 'Recomendações',
        content: `## O que assistir hoje à noite?\n\n### 😤 Você está estressado\n**Whiplash (2014)** — Ritmo imparável e um final impressionante.\n\n### 😢 Você está emotivo\n**A Vida é Bela (1997)** — Tenha lenços à mão.\n\n### 🧠 Você está cansado\n**Forrest Gump (1994)** — Calor humano e sabedoria.\n\n### 😱 Você quer emoção\n**A Origem (2010)** — Sonhos dentro de sonhos.\n\n### ❤️ Com alguém especial\n**Cinema Paradiso (1988)** — Uma história de amor ao cinema em si.\n\n### 🎭 Você quer algo diferente\n**Parasita (2019)** — Crime + comédia + drama + terror.\n\n### 👨‍👩‍👧 Com a família\n**A Viagem de Chihiro (2001)** — Magia para todas as idades.\n\n### 😴 Para dormir tranquilo depois\n**Um Sonho de Liberdade (1994)** — A esperança sempre vence.`,
      },
    },
  },

  {
    slug: 'christopher-nolan-movies-ranked',
    date: '2026-08-07',
    readTime: 9,
    image: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    movieSlug: 'inception',
    i18n: {
      ar: {
        title: 'كل أفلام كريستوفر نولان مرتبة من الأضعف إلى الأفضل',
        description: 'تقييم شامل لكل أفلام كريستوفر نولان — من Following إلى Oppenheimer. أي نولان تبدأ به؟',
        category: 'تحليل سينمائي',
        content: `## كريستوفر نولان — المخرج الذي يتحدى عقل المشاهد

نولان ليس مجرد مخرج — هو ظاهرة سينمائية. كل فيلم له حدث، وكل فيلم جديد صار مناسبة عالمية.

### الترتيب من الأفضل إلى الأقل (وفق تقييماتنا)

**1. Inception (2010) — 9.0/10** 🏆
الفيلم الذي يجعلك تسأل "هل أنا في حلم الآن؟" لأيام. بصريات ثورية، سيناريو بديع، موسيقى هانز زيمر الأيقونية. ما زال أفضل أفلامه.

**2. The Dark Knight (2008) — 9.1/10**
هيث ليدجر كـ"الجوكر" في أداء غيّر تعريف شخصية الشرير. فيلم أبطال خارقين يتجاوز النوع كلياً.

**3. Interstellar (2014) — 8.9/10**
رحلة مؤثرة عبر الزمن والفضاء والعلاقة بين الآباء والأبناء. النهاية تحتاج مشاهدتين.

**4. Oppenheimer (2023) — 8.8/10**
سيليان مورفي في دور أكثر شخصية معقدة في القرن العشرين. فيلم يجعلك تفكر بالأخلاق والعلم والحرب.

**5. Memento (2000) — 8.5/10**
نولان يسرد القصة بترتيب معكوس — وهذا ليس خدعة، بل هو القصة. التجربة الأكثر إبداعاً في مسيرته المبكرة.

**6. The Prestige (2006) — 8.5/10**
فيلم عن السحر يُخفي نفسه خلف السحر. النهاية ستصدمك.

**7. Dunkirk (2017) — 8.3/10**
حرب بدون أبطال، فقط بشر يحاولون البقاء. التجربة الغامرة أكثر من القصة.

**8. Batman Begins (2005) — 8.2/10**
أعاد تعريف أفلام الأبطال الخارقين. الأصل دائماً مهم.

**9. The Dark Knight Rises (2012) — 8.0/10**
إغلاق محترم للثلاثية لكن تحت ثقل توقعات The Dark Knight.

**10. Insomnia (2002) — 7.8/10**
نولان يجرب الفيلم البوليسي. ناجح لكن غير استثنائي.

**11. Tenet (2020) — 7.5/10**
فكرة مثيرة (الزمن معكوس) لكن التنفيذ أعقد مما يلزم. جميل بصرياً، صعب عاطفياً.

**12. Following (1998) — 7.2/10**
البداية المتواضعة لمخرج عبقري. تحفة بميزانية شبه معدومة.

### الخلاصة
نولان في أسوأ أفلامه أفضل من معظم المخرجين في أفضلهم. ابدأ بـ Inception، وإذا أردت التسلسل الزمني، ابدأ بـ Memento.`,
      },
      en: {
        title: 'Every Christopher Nolan Film Ranked — Worst to Best',
        description: 'A comprehensive ranking of all Christopher Nolan films — from Following to Oppenheimer. Which Nolan do you start with?',
        category: 'Film Analysis',
        content: `## Christopher Nolan — The Director Who Challenges Your Mind\n\n### Ranked Best to Least (Our Ratings)\n\n**1. Inception (2010) — 9.0/10** 🏆\nThe film that makes you ask "Am I dreaming right now?" for days. Revolutionary visuals, brilliant screenplay, iconic Hans Zimmer score.\n\n**2. The Dark Knight (2008) — 9.1/10**\nHeath Ledger as The Joker in a performance that redefined the villain. A superhero film that transcends its genre entirely.\n\n**3. Interstellar (2014) — 8.9/10**\nAn emotionally moving journey through time, space, and the parent-child relationship.\n\n**4. Oppenheimer (2023) — 8.8/10**\nCillian Murphy as the most complex figure of the 20th century.\n\n**5. Memento (2000) — 8.5/10**\nNolan tells the story in reverse order — and this isn't a trick, it IS the story.\n\n**6. The Prestige (2006) — 8.5/10**\nA film about magic that hides itself behind magic. The ending will shock you.\n\n**7. Dunkirk (2017) — 8.3/10**\nWar without heroes, just humans trying to survive.\n\n**8-12.** Batman Begins, The Dark Knight Rises, Insomnia, Tenet, Following.\n\n### Conclusion\nNolan at his worst is better than most directors at their best. Start with Inception.`,
      },
      fr: {
        title: 'Tous les films de Christopher Nolan classés — du pire au meilleur',
        description: 'Un classement complet de tous les films de Christopher Nolan — de Following à Oppenheimer.',
        category: 'Analyse cinématographique',
        content: `## Christopher Nolan — Classement complet\n\n**1. Inception (2010) — 9.0/10** 🏆\nLe film qui vous fait demander "Est-ce que je rêve ?" pendant des jours.\n\n**2. The Dark Knight (2008) — 9.1/10**\nHeath Ledger en Joker dans une performance qui a redéfini le méchant.\n\n**3. Interstellar (2014) — 8.9/10**\nUn voyage émouvant à travers le temps et l\'espace.\n\n**4. Oppenheimer (2023) — 8.8/10**\nCillian Murphy dans le rôle de la figure la plus complexe du XXe siècle.\n\n**5. Memento (2000) — 8.5/10**\nNolan raconte l\'histoire à rebours — et ce n\'est pas un truc, c\'est l\'histoire.\n\n**6-12.** The Prestige, Dunkirk, Batman Begins, TDKR, Insomnia, Tenet, Following.\n\n### Conclusion\nNolan au pire est meilleur que la plupart des réalisateurs au mieux.`,
      },
      es: {
        title: 'Todas las películas de Christopher Nolan clasificadas — de peor a mejor',
        description: 'Un ranking completo de todas las películas de Christopher Nolan — de Following a Oppenheimer.',
        category: 'Análisis cinematográfico',
        content: `## Christopher Nolan — Clasificación completa\n\n**1. Inception (2010) — 9.0/10** 🏆\nLa película que te hace preguntar "¿Estoy soñando ahora?" durante días.\n\n**2. The Dark Knight (2008) — 9.1/10**\nHeath Ledger como El Joker en una actuación que redefinió al villano.\n\n**3. Interstellar (2014) — 8.9/10**\nUn viaje emocionalmente conmovedor a través del tiempo y el espacio.\n\n**4. Oppenheimer (2023) — 8.8/10**\nCillian Murphy como la figura más compleja del siglo XX.\n\n**5. Memento (2000) — 8.5/10**\nNolan cuenta la historia en orden inverso — y esto no es un truco, ES la historia.\n\n**6-12.** The Prestige, Dunkirk, Batman Begins, TDKR, Insomnia, Tenet, Following.`,
      },
      tr: {
        title: 'Christopher Nolan\'ın Tüm Filmleri Sıralandı — Kötüden İyiye',
        description: 'Christopher Nolan\'ın tüm filmlerinin kapsamlı sıralaması — Following\'den Oppenheimer\'a.',
        category: 'Film Analizi',
        content: `## Christopher Nolan — Tam Sıralama\n\n**1. Inception (2010) — 9.0/10** 🏆\nGünlerce "Şu an rüya mı görüyorum?" diye sorduran film.\n\n**2. Kara Şövalye (2008) — 9.1/10**\nHeath Ledger'ın Joker rolü kötü adamı yeniden tanımladı.\n\n**3. Yıldızlararası (2014) — 8.9/10**\nZaman ve uzay boyunca duygusal bir yolculuk.\n\n**4. Oppenheimer (2023) — 8.8/10**\nCillian Murphy 20. yüzyılın en karmaşık figürü rolünde.\n\n**5. Hafıza (2000) — 8.5/10**\nNolan hikayeyi ters sırayla anlatıyor — bu bir numara değil, HİKAYE bu.\n\n**6-12.** The Prestige, Dunkirk, Batman Başlıyor, TDKR, Uykusuzluk, Tenet, Following.`,
      },
      de: {
        title: 'Alle Christopher Nolan Filme gerankt — vom schlechtesten zum besten',
        description: 'Eine umfassende Rangliste aller Christopher Nolan Filme — von Following bis Oppenheimer.',
        category: 'Filmanalyse',
        content: `## Christopher Nolan — Vollständiges Ranking\n\n**1. Inception (2010) — 9.0/10** 🏆\nDer Film, der Sie tagelang fragen lässt: "Träume ich gerade?"\n\n**2. The Dark Knight (2008) — 9.1/10**\nHeath Ledger als Joker in einer Leistung, die den Bösewicht neu definiert hat.\n\n**3. Interstellar (2014) — 8.9/10**\nEine emotional bewegende Reise durch Zeit und Raum.\n\n**4. Oppenheimer (2023) — 8.8/10**\nCillian Murphy als die komplexeste Figur des 20. Jahrhunderts.\n\n**5. Memento (2000) — 8.5/10**\nNolan erzählt die Geschichte in umgekehrter Reihenfolge.\n\n**6-12.** The Prestige, Dunkirk, Batman Begins, TDKR, Insomnia, Tenet, Following.`,
      },
      ja: {
        title: 'クリストファー・ノーランの全映画ランキング — 最低から最高へ',
        description: 'クリストファー・ノーランの全映画の包括的なランキング — フォロウイングからオッペンハイマーまで。',
        category: '映画分析',
        content: `## クリストファー・ノーラン — 完全ランキング\n\n**1. インセプション (2010) — 9.0/10** 🏆\n何日も「今夢を見ているの？」と思わせる映画。\n\n**2. ダークナイト (2008) — 9.1/10**\nヒース・レジャーのジョーカーが悪役を再定義した。\n\n**3. インターステラー (2014) — 8.9/10**\n時間と空間を超えた感動的な旅。\n\n**4. オッペンハイマー (2023) — 8.8/10**\n20世紀最も複雑な人物を演じるキリアン・マーフィー。\n\n**5. メメント (2000) — 8.5/10**\nノーランは物語を逆順で語る — これはトリックではなく、物語そのもの。\n\n**6-12.** プレステージ、ダンケルク、バットマン ビギンズ、TDKR、インソムニア、TENET、フォロウィング。`,
      },
      pt: {
        title: 'Todos os filmes de Christopher Nolan classificados — do pior ao melhor',
        description: 'Um ranking abrangente de todos os filmes de Christopher Nolan — de Following a Oppenheimer.',
        category: 'Análise Cinematográfica',
        content: `## Christopher Nolan — Classificação completa\n\n**1. A Origem (2010) — 9.0/10** 🏆\nO filme que faz você perguntar "Estou sonhando agora?" por dias.\n\n**2. O Cavaleiro das Trevas (2008) — 9.1/10**\nHeath Ledger como Coringa em uma atuação que redefiniu o vilão.\n\n**3. Interestelar (2014) — 8.9/10**\nUma jornada emocionalmente comovente pelo tempo e pelo espaço.\n\n**4. Oppenheimer (2023) — 8.8/10**\nCillian Murphy como a figura mais complexa do século XX.\n\n**5. Amnésia (2000) — 8.5/10**\nNolan conta a história em ordem inversa — e isso não é um truque, É a história.\n\n**6-12.** O Grande Truque, Dunkirk, Batman Begins, TDKR, Insônia, Tenet, Following.`,
      },
    },
  },

  {
    slug: 'oscar-winners-worth-watching-2025',
    date: '2026-08-07',
    readTime: 6,
    image: 'https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsLegHnDmgC73.jpg',
    i18n: {
      ar: {
        title: 'أفلام فازت بالأوسكار وتستحق المشاهدة الآن',
        description: 'ليس كل فائز بالأوسكار جيد — واخترنا فقط الذين فازوا واستحقوا. قائمة بأفضل الفائزين بجائزة أفضل فيلم عبر التاريخ.',
        category: 'قوائم',
        content: `## أفضل فائزين بأوسكار أفضل فيلم عبر التاريخ

الأوسكار أخطأ كثيراً — لكنه أصاب أحياناً. هذه المرات التي أصاب فيها:

### الفائزون الذين اجتازوا اختبار الزمن

**Parasite (2019) — 9.0/10** 🇰🇷
أول فيلم غير إنجليزي يفوز منذ تأسيس الجائزة عام 1929. بونغ جون-هو أثبت أن السينما العالمية لا حدود لها.

**Schindler's List (1993) — 9.1/10**
سبيلبرغ رفض الفوز بالأوسكار قبلها معتقداً أن أفلامه ترفيهية — ثم أثبت أنه يستطيع صنع فن حقيقي.

**The Silence of the Lambs (1991) — 8.8/10**
الفيلم الثالث والأخير في التاريخ الذي يفوز بـ "الأوسكارات الخمس الكبرى" (أفضل فيلم، مخرج، ممثل، ممثلة، سيناريو).

**Forrest Gump (1994) — 8.7/10**
فاز على Pulp Fiction وThe Shawshank Redemption — قرار مثير للجدل حتى اليوم.

**Gladiator (2000) — 8.5/10**
راسل كرو والمصارعون في روما. ملحمة تعود لجذور السينما الكبرى.

**The Godfather (1972) — 9.2/10**
فاز بأوسكار أفضل فيلم، وكان الفوز مستحقاً تماماً.

### الفائزون الأكثر إثارة للجدل
- **Crash (2005)** فاز على Brokeback Mountain — والتاريخ لم يكن لطيفاً معه
- **Shakespeare in Love (1998)** فاز على Saving Private Ryan
- **Chicago (2002)** — موسيقال جيد لكن ليس أفضل عام 2002

### نصيحة
ابدأ بـ Parasite أو Schindler's List — هذان الفيلمان لا يخذلانك أبداً.`,
      },
      en: {
        title: 'Oscar Winners Worth Watching Right Now',
        description: 'Not every Oscar winner is good — we picked only those that won AND deserved it. The best Best Picture winners in history.',
        category: 'Lists',
        content: `## Best Oscar Best Picture Winners in History\n\nThe Oscars have been wrong many times — but sometimes they get it right. Here are those times:\n\n### Winners That Passed the Test of Time\n\n**Parasite (2019) — 9.0/10** 🇰🇷\nFirst non-English film to win since the award was founded in 1929.\n\n**Schindler's List (1993) — 9.1/10**\nSpielberg proved he could make real art.\n\n**The Silence of the Lambs (1991) — 8.8/10**\nOne of only three films to win the "Big Five" Oscars.\n\n**Forrest Gump (1994) — 8.7/10**\nWon over Pulp Fiction and The Shawshank Redemption — still controversial.\n\n**Gladiator (2000) — 8.5/10**\nRussell Crowe and gladiators in Rome. Epic cinema at its roots.\n\n**The Godfather (1972) — 9.2/10**\nWon Best Picture, and the win was completely deserved.\n\n### Most Controversial Winners\n- **Crash (2005)** over Brokeback Mountain — history hasn't been kind\n- **Shakespeare in Love (1998)** over Saving Private Ryan\n\n### Tip\nStart with Parasite or Schindler's List — these films never disappoint.`,
      },
      fr: {
        title: 'Les lauréats des Oscars qui méritent d\'être vus maintenant',
        description: 'Tous les lauréats des Oscars ne sont pas bons — nous n\'avons sélectionné que ceux qui ont gagné ET le méritaient.',
        category: 'Listes',
        content: `## Les meilleurs lauréats de l\'Oscar du meilleur film\n\n**Parasite (2019) — 9.0/10** 🇰🇷\nPremier film non-anglophone à gagner depuis la création du prix en 1929.\n\n**La Liste de Schindler (1993) — 9.1/10**\nSpielberg a prouvé qu\'il pouvait faire du vrai art.\n\n**Le Silence des agneaux (1991) — 8.8/10**\nL\'un des trois seuls films à remporter les "Cinq Grands" Oscars.\n\n**Forrest Gump (1994) — 8.7/10**\nA gagné sur Pulp Fiction et Les Évadés — encore controversé.\n\n**Gladiator (2000) — 8.5/10**\nCinéma épique à l\'état pur.\n\n**Le Parrain (1972) — 9.2/10**\nA remporté le meilleur film, et la victoire était totalement méritée.`,
      },
      es: {
        title: 'Ganadores del Oscar que vale la pena ver ahora',
        description: 'No todos los ganadores del Oscar son buenos — seleccionamos solo los que ganaron Y lo merecían.',
        category: 'Listas',
        content: `## Los mejores ganadores del Oscar a la Mejor Película\n\n**Parasite (2019) — 9.0/10** 🇰🇷\nPrimera película no anglófona en ganar desde que se fundó el premio en 1929.\n\n**La lista de Schindler (1993) — 9.1/10**\nSpielberg demostró que podía hacer arte real.\n\n**El silencio de los inocentes (1991) — 8.8/10**\nUna de las tres únicas películas en ganar los "Cinco Grandes" Oscars.\n\n**Forrest Gump (1994) — 8.7/10**\nGanó sobre Pulp Fiction y The Shawshank Redemption — todavía controvertido.\n\n**Gladiador (2000) — 8.5/10**\nCine épico en su esencia.\n\n**El Padrino (1972) — 9.2/10**\nGanó la Mejor Película, y la victoria fue completamente merecida.`,
      },
      tr: {
        title: 'Şu An İzlemeye Değer Oscar Kazananları',
        description: 'Her Oscar kazananı iyi değil — kazanan VE hak eden filmleri seçtik.',
        category: 'Listeler',
        content: `## Tarihin En İyi En İyi Film Oscar Kazananları\n\n**Parasite (2019) — 9.0/10** 🇰🇷\n1929'dan bu yana ödülü kazanan ilk İngilizce olmayan film.\n\n**Schindler'in Listesi (1993) — 9.1/10**\nSpielberg gerçek sanat yapabileceğini kanıtladı.\n\n**Kuzuların Sessizliği (1991) — 8.8/10**\n"Büyük Beş" Oscar'ı kazanan yalnızca üç filmden biri.\n\n**Forrest Gump (1994) — 8.7/10**\nPulp Fiction ve Esaretin Bedeli üzerinde kazandı — hâlâ tartışmalı.\n\n**Gladyatör (2000) — 8.5/10**\nDestansı sinema özünde.\n\n**Baba (1972) — 9.2/10**\nEn İyi Film ödülünü kazandı ve zafer tamamen hak edilmişti.`,
      },
      de: {
        title: 'Oscar-Gewinner, die es sich lohnt, jetzt zu sehen',
        description: 'Nicht jeder Oscar-Gewinner ist gut — wir haben nur diejenigen ausgewählt, die gewonnen haben UND es verdient haben.',
        category: 'Listen',
        content: `## Die besten Oscar-Gewinner für den besten Film\n\n**Parasite (2019) — 9.0/10** 🇰🇷\nErster nicht-englischsprachiger Film, der seit der Gründung des Preises 1929 gewann.\n\n**Schindlers Liste (1993) — 9.1/10**\nSpielberg bewies, dass er echte Kunst machen konnte.\n\n**Das Schweigen der Lämmer (1991) — 8.8/10**\nEiner von nur drei Filmen, die die "Großen Fünf" Oscars gewannen.\n\n**Forrest Gump (1994) — 8.7/10**\nGewann über Pulp Fiction und Verurteilung zum Tode — noch heute umstritten.\n\n**Gladiator (2000) — 8.5/10**\nEpisches Kino in seiner Essenz.\n\n**Der Pate (1972) — 9.2/10**\nGewann den Besten Film, und der Sieg war völlig verdient.`,
      },
      ja: {
        title: '今すぐ見る価値のあるアカデミー賞受賞作品',
        description: 'すべてのアカデミー賞受賞作品が良いわけではない — 受賞してかつ相応しかったものだけを選びました。',
        category: 'リスト',
        content: `## 歴史上最高のアカデミー作品賞受賞作品\n\n**パラサイト (2019) — 9.0/10** 🇰🇷\n1929年の賞創設以来、初の非英語映画受賞作。\n\n**シンドラーのリスト (1993) — 9.1/10**\nスピルバーグが本物のアートを作れることを証明した。\n\n**羊たちの沈黙 (1991) — 8.8/10**\n「5大」オスカーを受賞した3作品のうちの1つ。\n\n**フォレスト・ガンプ (1994) — 8.7/10**\nパルプ・フィクションとショーシャンクを破って受賞 — 今でも物議を醸している。\n\n**グラディエーター (2000) — 8.5/10**\n根本的な叙事詩映画。\n\n**ゴッドファーザー (1972) — 9.2/10**\n作品賞を受賞し、その受賞は完全に相応しかった。`,
      },
      pt: {
        title: 'Vencedores do Oscar que valem a pena ver agora',
        description: 'Nem todo vencedor do Oscar é bom — selecionamos apenas os que ganharam E mereceram.',
        category: 'Listas',
        content: `## Os melhores vencedores do Oscar de Melhor Filme\n\n**Parasita (2019) — 9.0/10** 🇰🇷\nPrimeiro filme não-anglófono a ganhar desde a fundação do prêmio em 1929.\n\n**A Lista de Schindler (1993) — 9.1/10**\nSpielberg provou que podia fazer arte real.\n\n**O Silêncio dos Inocentes (1991) — 8.8/10**\nUm dos apenas três filmes a ganhar os "Cinco Grandes" Oscars.\n\n**Forrest Gump (1994) — 8.7/10**\nGanhou sobre Pulp Fiction e Um Sonho de Liberdade — ainda controverso.\n\n**Gladiador (2000) — 8.5/10**\nCinema épico em sua essência.\n\n**O Poderoso Chefão (1972) — 9.2/10**\nGanhou o Melhor Filme, e a vitória foi completamente merecida.`,
      },
    },
  },
]
