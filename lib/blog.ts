import { MOVIES } from './movies'

export type Locale = 'ar' | 'en' | 'fr' | 'es' | 'tr' | 'de' | 'ja' | 'pt'

export interface BlogPost {
  slug: string
  date: string
  readTime: number
  image: string
  movieSlug?: string
  i18n: Record<Locale, {
    title: string
    description: string
    category: string
    content: string
  }>
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'godfather-impact-on-cinema',
    date: '2026-05-20',
    readTime: 6,
    image: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    movieSlug: 'the-godfather',
    i18n: {
      ar: {
        title: 'كيف غيّر "العرّاب" وجه السينما إلى الأبد؟',
        description: 'دراسة تحليلية معمّقة لتأثير فيلم العرّاب 1972 على صناعة السينما العالمية والثقافة الشعبية.',
        category: 'تحليل سينمائي',
        content: `## العرّاب: الثورة الهادئة

في عام 1972، لم يكن أحد يتوقع أن فيلماً عن مافيا إيطالية في أمريكا سيصبح المعيار الذي تُقاس به كل الأفلام بعده.

### لماذا هو مختلف؟

**السيناريو المحكم:** ماريو بوزو وكوبولا كتبا سيناريو يعامل المجرمين كبشر — لديهم قيم، عائلات، مبادئ مشوّهة. لم يكونوا شياطين أحادية البُعد.

**الأداء الأسطوري:** مارلون براندو في دور دون كورليوني خلق **الشخصية الأكثر تقليداً في تاريخ السينما**. الصوت المتعب، حركة اليدين، الكلمات المحسوبة بدقة — كل تفصيلة مدروسة.

**التصوير الثوري:** غوردون ويليس استخدم **الظلام كشخصية**. الإضاءة المنخفضة التي ترسم الشك والسلطة على وجوه الشخصيات.

### تأثيره على السينما

كل فيلم جريمة جاء بعده — Goodfellas، The Sopranos، Scarface — يعترف بدين عميق للعرّاب. غيّر كيفية سرد قصص المجرمين: بتعاطف، بعمق، بإنسانية.

### ما يجعله خالداً

النقطة الأعمق في الفيلم ليست الجريمة — بل **تحوّل مايكل كورليوني**. الشاب العائد من الحرب يرفض عالم أبيه، ثم يختار في لحظة واحدة أن يصبح ما كان يرفضه. هذا هو قلب الفيلم.

> *"لم أُقدّم له عرضاً لا يستطيع رفضه — لقد قدّمتُ له عرضاً لم يُفكّر فيه قط."*`
      },
      en: {
        title: 'How The Godfather Changed Cinema Forever',
        description: 'An in-depth analytical study of the impact of The Godfather (1972) on world cinema and popular culture.',
        category: 'Film Analysis',
        content: `## The Godfather: The Quiet Revolution

In 1972, no one expected that a film about the Italian Mafia in America would become the standard against which all subsequent films are measured.

### Why Is It Different?

**The Tight Screenplay:** Mario Puzo and Coppola wrote a script that treats criminals as human beings — they have values, families, twisted principles. They weren't one-dimensional villains.

**The Legendary Performance:** Marlon Brando as Don Corleone created **the most imitated character in cinema history**. The tired voice, the hand gestures, the carefully measured words — every detail was deliberate.

**Revolutionary Cinematography:** Gordon Willis used **darkness as a character**. Low-key lighting that painted doubt and power on characters' faces.

### Its Impact on Cinema

Every crime film that came after it — Goodfellas, The Sopranos, Scarface — acknowledges a deep debt to The Godfather. It changed how criminal stories are told: with empathy, depth, and humanity.

### What Makes It Timeless

The deepest point of the film isn't the crime — it's **Michael Corleone's transformation**. The young man returning from war, who refused his father's world, then chooses in one moment to become what he once rejected. That is the film's true heart.

> *"I'm going to make him an offer he can't refuse."*`
      },
      fr: {
        title: 'Comment Le Parrain a Changé le Cinéma pour Toujours',
        description: 'Une étude analytique approfondie de l\'impact du Parrain (1972) sur le cinéma mondial.',
        category: 'Analyse cinématographique',
        content: `## Le Parrain: La Révolution Silencieuse\n\nEn 1972, personne ne s'attendait à ce qu'un film sur la mafia italienne en Amérique devienne l'étalon contre lequel tous les films ultérieurs seraient mesurés.\n\n### Pourquoi Est-Il Différent?\n\nLe scénario serré, la performance légendaire de Marlon Brando, la cinématographie révolutionnaire — tout s'aligne pour créer une masterpiece absolue.\n\n### Son Impact sur le Cinéma\n\nTous les films policiers qui suivirent reconnaissent une dette profonde au Parrain. Il a changé la façon dont les histoires criminelles sont racontées: avec empathie, profondeur et humanité.`
      },
      es: {
        title: 'Cómo El Padrino Cambió el Cine para Siempre',
        description: 'Un estudio analítico profundo del impacto de El Padrino (1972) en el cine mundial.',
        category: 'Análisis cinematográfico',
        content: `## El Padrino: La Revolución Silenciosa\n\nEn 1972, nadie esperaba que una película sobre la Mafia italiana en América se convirtiera en el estándar contra el que se miden todas las películas posteriores.\n\n### Por Qué Es Diferente\n\nEl guión ajustado, la actuación legendaria de Marlon Brando, la cinematografía revolucionaria — todo se alinea para crear una obra maestra absoluta.\n\n### Su Impacto en el Cine\n\nTodas las películas de crimen que siguieron reconocen una deuda profunda con El Padrino.`
      },
      tr: {
        title: 'Baba Sinemayı Sonsuza Dek Nasıl Değiştirdi',
        description: 'Baba\'nın (1972) dünya sineması üzerindeki etkisinin derinlemesine analitik incelemesi.',
        category: 'Film Analizi',
        content: `## Baba: Sessiz Devrim\n\n1972'de, Amerika'daki İtalyan Mafyası hakkında bir filmin tüm sonraki filmlerin ölçüleceği standart haline geleceğini kimse beklemiyordu.\n\n### Neden Farklı?\n\nSıkı senaryo, Marlon Brando'nun efsanevi performansı, devrimci sinematografi — her şey mutlak bir başyapıt yaratmak için hizalanıyor.`
      },
      de: {
        title: 'Wie Der Pate das Kino für immer veränderte',
        description: 'Eine eingehende analytische Studie über die Wirkung des Paten (1972) auf das Weltkino.',
        category: 'Filmanalyse',
        content: `## Der Pate: Die stille Revolution\n\n1972 erwartete niemand, dass ein Film über die italienische Mafia in Amerika zum Maßstab werden würde, an dem alle späteren Filme gemessen werden.\n\n### Warum Ist Er Anders?\n\nDas straffe Drehbuch, Marlon Brandos legendäre Leistung, die revolutionäre Kameraführung — alles fügt sich zusammen, um ein absolutes Meisterwerk zu schaffen.`
      },
      ja: {
        title: 'ゴッドファーザーが映画を永遠に変えた方法',
        description: 'ゴッドファーザー(1972)の世界映画への影響についての深い分析研究。',
        category: '映画分析',
        content: `## ゴッドファーザー：静かな革命\n\n1972年、アメリカのイタリアンマフィアについての映画が、その後の全ての映画が測られる基準になるとは誰も予想していなかった。\n\n### なぜ違うのか？\n\nタイトな脚本、マーロン・ブランドの伝説的な演技、革命的な撮影技術 — すべてが絶対的な傑作を作るために揃っている。`
      },
      pt: {
        title: 'Como O Poderoso Chefão Mudou o Cinema para Sempre',
        description: 'Um estudo analítico aprofundado do impacto de O Poderoso Chefão (1972) no cinema mundial.',
        category: 'Análise cinematográfica',
        content: `## O Poderoso Chefão: A Revolução Silenciosa\n\nEm 1972, ninguém esperava que um filme sobre a Máfia italiana na América se tornaria o padrão pelo qual todos os filmes posteriores são medidos.\n\n### Por Que É Diferente?\n\nO roteiro ajustado, a atuação lendária de Marlon Brando, a cinematografia revolucionária — tudo se alinha para criar uma obra-prima absoluta.`
      }
    }
  },
  {
    slug: 'top-5-arabic-films-history',
    date: '2026-05-19',
    readTime: 5,
    image: 'https://image.tmdb.org/t/p/original/rqODzehgQ8Hl0tcUd7qIcy8Pc9Z.jpg',
    movieSlug: 'the-message',
    i18n: {
      ar: {
        title: 'أفضل 5 أفلام عربية في التاريخ',
        description: 'قائمة بأعظم إنجازات السينما العربية عبر التاريخ — من الرسالة إلى كفرناحوم.',
        category: 'قوائم',
        content: `## أعظم 5 أفلام عربية على الإطلاق

السينما العربية أنتجت روائع حقيقية تنافس أفضل ما قدّمه العالم. إليك القائمة:

### 1. الرسالة (1976) — مصطفى العقاد ⭐ 9.0
أضخم إنتاج في تاريخ السينما العربية. ملحمة إسلامية بطاقم عالمي وميزانية ضخمة.

### 2. كفرناحوم (2018) — نادين لبكي ⭐ 9.1
لبنانية تُرشَّح للأوسكار وتفوز بجائزة كان. زين الراعي في أداء يعجز عنه محترفون.

### 3. عمارة يعقوبيان (2006) — مروان حامد ⭐ 9.0
أجرأ فيلم مصري، يُشرّح المجتمع بلا رحمة ولا مجاملة.

### 4. عمر (2013) — هاني أبو أسعد ⭐ 8.8
فيلسطيني وصل للأوسكار. دراسة نفسية حادة للحياة تحت الاحتلال.

### 5. باب الحديد (1958) — يوسف شاهين ⭐ 8.7
تحفة شاهين وأيقونة الواقعية في السينما المصرية.

> السينما العربية لم تُعطَ حقها في الاهتمام العالمي — لكنها كانت دائماً هناك.`
      },
      en: {
        title: 'Top 5 Arabic Films in History',
        description: 'A list of the greatest achievements in Arabic cinema throughout history — from The Message to Capernaum.',
        category: 'Lists',
        content: `## The 5 Greatest Arabic Films Ever Made\n\nArabic cinema has produced true masterpieces that rival the best the world has offered.\n\n### 1. The Message (1976) — Moustapha Akkad ⭐ 9.0\nThe most ambitious production in Arabic cinema history. An Islamic epic with an international cast.\n\n### 2. Capernaum (2018) — Nadine Labaki ⭐ 9.1\nLebanese film nominated for the Oscar and winner at Cannes. Zain Al Rafeea in a performance that surpasses professionals.\n\n### 3. The Yacoubian Building (2006) — Marwan Hamed ⭐ 9.0\nThe boldest Egyptian film, dissecting society without mercy.\n\n### 4. Omar (2013) — Hany Abu-Assad ⭐ 8.8\nPalestinian film that reached the Oscars. Sharp psychological study of life under occupation.\n\n### 5. Cairo Station (1958) — Youssef Chahine ⭐ 8.7\nChahine's masterpiece and an icon of realism in Egyptian cinema.`
      },
      fr: { title: 'Top 5 des Films Arabes de l\'Histoire', description: 'Les plus grands films arabes de tous les temps.', category: 'Listes', content: `## Les 5 Plus Grands Films Arabes\n\nLe cinéma arabe a produit de véritables chefs-d'œuvre rivalisant avec les meilleures productions mondiales.\n\n1. **Le Message (1976)** ⭐ 9.0\n2. **Capernaum (2018)** ⭐ 9.1\n3. **L'Immeuble Yacoubian (2006)** ⭐ 9.0\n4. **Omar (2013)** ⭐ 8.8\n5. **Gare centrale (1958)** ⭐ 8.7` },
      es: { title: 'Top 5 Películas Árabes de la Historia', description: 'Las mejores películas árabes de todos los tiempos.', category: 'Listas', content: `## Las 5 Mejores Películas Árabes\n\nEl cine árabe ha producido verdaderas obras maestras.\n\n1. **El Mensaje (1976)** ⭐ 9.0\n2. **Capharnaüm (2018)** ⭐ 9.1\n3. **El Edificio Yacoubian (2006)** ⭐ 9.0\n4. **Omar (2013)** ⭐ 8.8\n5. **Estación El Cairo (1958)** ⭐ 8.7` },
      tr: { title: 'Tarihin En İyi 5 Arap Filmi', description: 'Tüm zamanların en büyük Arap filmleri.', category: 'Listeler', content: `## En İyi 5 Arap Filmi\n\n1. **Mesaj (1976)** ⭐ 9.0\n2. **Capernaum (2018)** ⭐ 9.1\n3. **Yacoubian Binası (2006)** ⭐ 9.0\n4. **Ömer (2013)** ⭐ 8.8\n5. **Kahire Garı (1958)** ⭐ 8.7` },
      de: { title: 'Top 5 Arabische Filme der Geschichte', description: 'Die besten arabischen Filme aller Zeiten.', category: 'Listen', content: `## Die 5 Größten Arabischen Filme\n\n1. **Die Botschaft (1976)** ⭐ 9.0\n2. **Capernaum (2018)** ⭐ 9.1\n3. **Das Yacoubian-Gebäude (2006)** ⭐ 9.0\n4. **Omar (2013)** ⭐ 8.8\n5. **Kairoer Bahnhof (1958)** ⭐ 8.7` },
      ja: { title: '歴史上トップ5のアラビア映画', description: '歴史上最も偉大なアラビア映画のリスト。', category: 'リスト', content: `## 最高のアラビア映画5作品\n\n1. **メッセージ (1976)** ⭐ 9.0\n2. **カファルナウム (2018)** ⭐ 9.1\n3. **ヤコービアンビルディング (2006)** ⭐ 9.0\n4. **オマル (2013)** ⭐ 8.8\n5. **カイロ駅 (1958)** ⭐ 8.7` },
      pt: { title: 'Top 5 Filmes Árabes da História', description: 'Os melhores filmes árabes de todos os tempos.', category: 'Listas', content: `## Os 5 Maiores Filmes Árabes\n\n1. **A Mensagem (1976)** ⭐ 9.0\n2. **Capernaum (2018)** ⭐ 9.1\n3. **O Edifício Yacoubian (2006)** ⭐ 9.0\n4. **Omar (2013)** ⭐ 8.8\n5. **Estação do Cairo (1958)** ⭐ 8.7` }
    }
  },
  {
    slug: 'nolan-ranking-all-films',
    date: '2026-05-18',
    readTime: 7,
    image: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    movieSlug: 'the-dark-knight',
    i18n: {
      ar: {
        title: 'ترتيب أفلام كريستوفر نولان من الأسوأ للأفضل',
        description: 'تحليل شامل لمسيرة نولان السينمائية وترتيب أعماله بموضوعية تامة.',
        category: 'مخرجون',
        content: `## كريستوفر نولان: ترتيب أفلامه

نولان من المخرجين النادرين الذين يصنعون أفلاماً تجارية وفنية في آنٍ واحد. هذا ترتيبنا التحقيقي:

### المستوى الأول: الأيقونات
1. **فارس الظلام (2008)** — 9.5/10 — الأفضل مطلقاً
2. **الدخيل (2010)** — 9.3/10 — أيقونة الخيال العلمي

### المستوى الثاني: الروائع
3. **أوبنهايمر (2023)** — 9.2/10 — توثيق تاريخي مذهل
4. **بين النجوم (2014)** — 9.2/10 — الجمال العلمي
5. **1917 لا... Dunkirk (2017)** — 8.8/10

### المستوى الثالث: الجيدة
6. **مذكرات (2000)** — 8.9/10 — ثورة الأفلام المستقلة
7. **البداية (2010)** — 9.3/10

### الملاحظة الأهم
نولان **لا يصنع فيلماً رديئاً**. أضعف أفلامه يفوق معظم ما يُنتج في هوليوود.`
      },
      en: {
        title: 'Ranking Every Christopher Nolan Film Worst to Best',
        description: 'A comprehensive analysis of Nolan\'s cinematic career, ranking his works with complete objectivity.',
        category: 'Directors',
        content: `## Christopher Nolan: Ranking His Films\n\nNolan is one of the rare directors who makes commercial and artistic films simultaneously.\n\n### Tier 1: Icons\n1. **The Dark Knight (2008)** — 9.5/10\n2. **Inception (2010)** — 9.3/10\n\n### Tier 2: Masterpieces\n3. **Oppenheimer (2023)** — 9.2/10\n4. **Interstellar (2014)** — 9.2/10\n5. **Dunkirk (2017)** — 8.8/10\n\n### The Key Observation\nNolan **never makes a bad film**. His weakest work surpasses most of what Hollywood produces.`
      },
      fr: { title: 'Classement de Tous les Films de Christopher Nolan', description: 'Analyse complète de la carrière cinématographique de Nolan.', category: 'Réalisateurs', content: `## Christopher Nolan: Classement\n\n1. **The Dark Knight** — 9.5/10\n2. **Inception** — 9.3/10\n3. **Oppenheimer** — 9.2/10\n4. **Interstellar** — 9.2/10\n5. **Dunkerque** — 8.8/10` },
      es: { title: 'Ranking de Todas las Películas de Christopher Nolan', description: 'Análisis completo de la carrera de Nolan.', category: 'Directores', content: `## Christopher Nolan: Ranking\n\n1. **El Caballero Oscuro** — 9.5/10\n2. **Origen** — 9.3/10\n3. **Oppenheimer** — 9.2/10\n4. **Interstellar** — 9.2/10\n5. **Dunkerque** — 8.8/10` },
      tr: { title: 'Christopher Nolan\'ın Tüm Filmlerinin Sıralaması', description: 'Nolan\'ın sinema kariyerinin kapsamlı analizi.', category: 'Yönetmenler', content: `## Christopher Nolan: Sıralama\n\n1. **Kara Şövalye** — 9.5/10\n2. **Başlangıç** — 9.3/10\n3. **Oppenheimer** — 9.2/10\n4. **Yıldızlararası** — 9.2/10\n5. **Dunkirk** — 8.8/10` },
      de: { title: 'Ranking Aller Christopher-Nolan-Filme', description: 'Umfassende Analyse von Nolans Filmkarriere.', category: 'Regisseure', content: `## Christopher Nolan: Ranking\n\n1. **The Dark Knight** — 9.5/10\n2. **Inception** — 9.3/10\n3. **Oppenheimer** — 9.2/10\n4. **Interstellar** — 9.2/10\n5. **Dunkirk** — 8.8/10` },
      ja: { title: 'クリストファー・ノーランの全作品ランキング', description: 'ノーランの映画キャリアの包括的な分析。', category: '監督', content: `## クリストファー・ノーラン：ランキング\n\n1. **ダークナイト** — 9.5/10\n2. **インセプション** — 9.3/10\n3. **オッペンハイマー** — 9.2/10\n4. **インターステラー** — 9.2/10\n5. **ダンケルク** — 8.8/10` },
      pt: { title: 'Ranking de Todos os Filmes de Christopher Nolan', description: 'Análise abrangente da carreira de Nolan.', category: 'Diretores', content: `## Christopher Nolan: Ranking\n\n1. **O Cavaleiro das Trevas** — 9.5/10\n2. **A Origem** — 9.3/10\n3. **Oppenheimer** — 9.2/10\n4. **Interestelar** — 9.2/10\n5. **Dunkirk** — 8.8/10` }
    }
  },
  {
    slug: 'cinema-psychology-joker',
    date: '2026-05-17',
    readTime: 8,
    image: 'https://image.tmdb.org/t/p/original/hO7KbdvGOtDdeg0W4Y5nKEHeDDh.jpg',
    movieSlug: 'joker-2019',
    i18n: {
      ar: {
        title: 'الجوكر وعلم النفس: ما الذي يجعل الشرير بطلاً؟',
        description: 'كيف تحوّل فيلم جوكر 2019 من فيلم أبطال خارقين إلى دراسة نفسية عن المجتمع والصحة النفسية؟',
        category: 'علم النفس والسينما',
        content: `## عندما يصبح الشرير البطل

فيلم جوكر 2019 يطرح سؤالاً فلسفياً عميقاً: **هل يُصنع الشرير أم يُولد؟**

### آرثر فليك: الضحية التي تصبح جلاداً

آرثر ليس شريراً بطبعه. هو إنسان مُحطَّم بالتدريج من قِبَل مجتمع يرفضه، ينكره، يسخر منه. الضحكة المَرَضية ليست خللاً — هي **استجابة نفسية لألم مزمن**.

### المرايا الثلاث في الفيلم

1. **المجتمع:** يعاقب من يختلف، يقهر الضعيف
2. **الإعلام:** يحتفي بالأثرياء ويُهمّش المهمَّشين
3. **النظام الصحي:** يتخلى عن المرضى في أحلك لحظاتهم

### خواكين فينيكس والتجسيد الكامل

فينيكس أنقص 24 كيلوغراماً لهذا الدور. لكن الأعمق من الجسد — هي **اللحظة التي يُدرك فيها المشاهد أنه بدأ يتعاطف مع شخص يقتل الناس**. هذا هو إنجاز الفيلم الحقيقي.

### الخلاصة

جوكر ليس احتفاءً بالعنف. هو تحذير: **المجتمع الذي يتخلى عن إنسانيته يُفرز وحوشه**.`
      },
      en: {
        title: 'Joker and Psychology: What Makes a Villain a Hero?',
        description: 'How did Joker (2019) transform from a superhero film into a psychological study about society and mental health?',
        category: 'Psychology & Cinema',
        content: `## When the Villain Becomes the Hero\n\nJoker 2019 poses a deep philosophical question: **Is a villain made or born?**\n\n### Arthur Fleck: The Victim Who Becomes the Executioner\n\nArthur is not naturally evil. He is a person gradually broken by a society that rejects, denies, and mocks him. The pathological laugh isn't a flaw — it's **a psychological response to chronic pain**.\n\n### The Three Mirrors in the Film\n1. **Society:** Punishes those who are different\n2. **Media:** Celebrates the wealthy and marginalizes the marginalized\n3. **Healthcare:** Abandons patients at their darkest moments\n\n### The Conclusion\nJoker is not a celebration of violence. It's a warning: **a society that abandons its humanity produces its own monsters**.`
      },
      fr: { title: 'Joker et la Psychologie: Ce Qui Fait du Méchant un Héros', description: 'Comment Joker (2019) est devenu une étude psychologique sur la société.', category: 'Psychologie & Cinéma', content: `## Quand le Méchant Devient le Héros\n\nJoker 2019 pose une question philosophique profonde: le méchant est-il créé ou né?\n\nArthur Fleck n'est pas naturellement mauvais. Il est progressivement brisé par une société qui le rejette. Le rire pathologique n'est pas un défaut — c'est une réponse psychologique à la douleur chronique.` },
      es: { title: 'Joker y la Psicología: ¿Qué Hace al Villano un Héroe?', description: 'Cómo Joker (2019) se convirtió en un estudio psicológico sobre la sociedad.', category: 'Psicología & Cine', content: `## Cuando el Villano Se Convierte en el Héroe\n\nJoker 2019 plantea una pregunta filosófica profunda: ¿el villano se hace o nace?\n\nArthur Fleck no es malvado por naturaleza. Es gradualmente destrozado por una sociedad que lo rechaza.` },
      tr: { title: 'Joker ve Psikoloji: Kötü Adam Nasıl Kahraman Olur?', description: 'Joker (2019) nasıl psikolojik bir toplum çalışmasına dönüştü?', category: 'Psikoloji & Sinema', content: `## Kötü Adam Kahraman Olduğunda\n\nJoker 2019 derin bir felsefi soru soruyor: Kötü adam mı yaratılır yoksa doğar mı?\n\nArthur Fleck doğası gereği kötü değildir. Onu reddeden toplum tarafından yavaş yavaş kırılır.` },
      de: { title: 'Joker und Psychologie: Was Macht einen Bösewicht zum Helden?', description: 'Wie wurde Joker (2019) zu einer psychologischen Studie über die Gesellschaft?', category: 'Psychologie & Kino', content: `## Wenn der Bösewicht zum Helden wird\n\nJoker 2019 stellt eine tiefe philosophische Frage: Wird ein Bösewicht gemacht oder geboren?\n\nArthur Fleck ist von Natur aus nicht böse. Er wird schrittweise von einer Gesellschaft zerstört, die ihn ablehnt.` },
      ja: { title: 'ジョーカーと心理学：悪役はいかにしてヒーローになるか', description: 'ジョーカー(2019)がいかに社会と精神衛生についての心理研究になったか。', category: '心理学と映画', content: `## 悪役がヒーローになるとき\n\nジョーカー2019は深い哲学的問いを投げかける：悪役は作られるのか、生まれるのか？\n\nアーサー・フレックは生まれつき悪ではない。彼を拒絶する社会によって徐々に壊されていく。` },
      pt: { title: 'Coringa e Psicologia: O Que Faz do Vilão um Herói?', description: 'Como o Coringa (2019) se tornou um estudo psicológico sobre a sociedade.', category: 'Psicologia & Cinema', content: `## Quando o Vilão Se Torna o Herói\n\nCoringa 2019 levanta uma questão filosófica profunda: o vilão é feito ou nascido?\n\nArthur Fleck não é naturalmente mau. Ele é gradualmente destroçado por uma sociedade que o rejeita.` }
    }
  },
  {
    slug: 'best-soundtracks-cinema',
    date: '2026-05-16',
    readTime: 5,
    image: 'https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
    i18n: {
      ar: {
        title: 'أعظم 10 موسيقى تصويرية في تاريخ السينما',
        description: 'من هانز زيمر إلى جون ويليامز — الموسيقى التي لا تُنسى والتي جعلت الأفلام خالدة.',
        category: 'موسيقى السينما',
        content: `## عشرة إيقاعات لن ينساها قلبك

الموسيقى التصويرية ليست تزييناً — هي **روح الفيلم**. هذه أعظمها:

1. **العرّاب** — نينو روتا | حزن وشرف في آنٍ واحد
2. **بين النجوم** — هانز زيمر | يجعل الكون يبدو في متناول اليد
3. **فارس الظلام** — هانز زيمر وهاوارد شور | توتر لا ينتهي
4. **المجالد** — هانز زيمر | موت ومجد وانتقام
5. **لاورنس العرب** — موريس جار | الصحراء بصوت
6. **قائمة شيندلر** — جون ويليامز | حزن لا وصف له
7. **العودة إلى المستقبل** — ألان سيلفستري | مرح ومغامرة
8. **فورست غامب** — ألان سيلفستري | دفء إنساني
9. **لا لا لاند** — جاستن هورويتز | حلم وخسارة
10. **ويبلاش** — جاستن هورويتز | توتر جاز يفجر المشاعر`
      },
      en: {
        title: 'Top 10 Greatest Film Soundtracks in Cinema History',
        description: 'From Hans Zimmer to John Williams — the unforgettable music that made films timeless.',
        category: 'Film Music',
        content: `## Ten Rhythms Your Heart Will Never Forget\n\n1. **The Godfather** — Nino Rota\n2. **Interstellar** — Hans Zimmer\n3. **The Dark Knight** — Hans Zimmer\n4. **Gladiator** — Hans Zimmer\n5. **Lawrence of Arabia** — Maurice Jarre\n6. **Schindler's List** — John Williams\n7. **Back to the Future** — Alan Silvestri\n8. **Forrest Gump** — Alan Silvestri\n9. **La La Land** — Justin Hurwitz\n10. **Whiplash** — Justin Hurwitz`
      },
      fr: { title: 'Top 10 des Meilleures Musiques de Film', description: 'Les musiques inoubliables qui ont rendu les films éternels.', category: 'Musique de film', content: `1. Le Parrain — Nino Rota\n2. Interstellar — Hans Zimmer\n3. The Dark Knight — Hans Zimmer\n4. Gladiator — Hans Zimmer\n5. Lawrence d'Arabie — Maurice Jarre` },
      es: { title: 'Top 10 Mejores Bandas Sonoras del Cine', description: 'Las músicas inolvidables que hicieron inmortales a las películas.', category: 'Música de cine', content: `1. El Padrino — Nino Rota\n2. Interstellar — Hans Zimmer\n3. El Caballero Oscuro — Hans Zimmer\n4. Gladiador — Hans Zimmer\n5. Lawrence de Arabia — Maurice Jarre` },
      tr: { title: 'Sinema Tarihinin En İyi 10 Film Müziği', description: 'Filmleri ölümsüz kılan unutulmaz müzikler.', category: 'Film Müziği', content: `1. Baba — Nino Rota\n2. Yıldızlararası — Hans Zimmer\n3. Kara Şövalye — Hans Zimmer\n4. Gladyatör — Hans Zimmer\n5. Lawrence of Arabia — Maurice Jarre` },
      de: { title: 'Top 10 der Besten Filmmusiken der Kinogeschichte', description: 'Unvergessliche Musik, die Filme zeitlos machte.', category: 'Filmmusik', content: `1. Der Pate — Nino Rota\n2. Interstellar — Hans Zimmer\n3. The Dark Knight — Hans Zimmer\n4. Gladiator — Hans Zimmer\n5. Lawrence von Arabien — Maurice Jarre` },
      ja: { title: '映画史上最高の映画音楽トップ10', description: '映画を不滅にした忘れられない音楽。', category: '映画音楽', content: `1. ゴッドファーザー — ニーノ・ロータ\n2. インターステラー — ハンス・ジマー\n3. ダークナイト — ハンス・ジマー\n4. グラディエーター — ハンス・ジマー\n5. アラビアのロレンス — モーリス・ジャール` },
      pt: { title: 'Top 10 das Melhores Trilhas Sonoras do Cinema', description: 'As músicas inesquecíveis que tornaram os filmes atemporais.', category: 'Música de cinema', content: `1. O Poderoso Chefão — Nino Rota\n2. Interestelar — Hans Zimmer\n3. O Cavaleiro das Trevas — Hans Zimmer\n4. Gladiador — Hans Zimmer\n5. Lawrence da Arábia — Maurice Jarre` }
    }
  },
  {
    slug: 'oscar-best-picture-2026-predictions',
    date: '2026-05-15',
    readTime: 4,
    image: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    i18n: {
      ar: {
        title: 'توقعاتنا لأفضل فيلم في أوسكار 2027',
        description: 'أفلام عام 2026 الأكثر ترشيحاً للأوسكار — تحليل مبكر لأقوى المنافسين.',
        category: 'أوسكار',
        content: `## سباق الأوسكار 2027 — البداية المبكرة\n\nمن المبكر الحكم، لكن المؤشرات واضحة:\n\n### المرشحون الأقوياء\n\n**Dune: Part Three** — إذا أكمل فيلنوف ثلاثيته بنفس المستوى، فسيكون منافساً جدياً.\n\n**مشاريع كبار المخرجين:** سكورسيزي، كوبولا، مينديز — كلهم يعملون على مشاريع جديدة.\n\n### ما نتوقعه\nتنجح أفلام الرسوم المتحركة في فئتها، لكن الدراما الإنسانية تسيطر على الجوائز الكبرى.\n\n*سنحدّث هذه التوقعات مع إعلان كل مشروع جديد.*`
      },
      en: {
        title: 'Our Oscar Best Picture 2027 Predictions',
        description: 'The most Oscar-nominated films of 2026 — early analysis of the strongest contenders.',
        category: 'Oscars',
        content: `## Oscar 2027 Race — Early Analysis\n\nIt's early, but the indicators are clear:\n\n### Strong Contenders\n\n**Dune: Part Three** — If Villeneuve completes his trilogy at the same level, it will be a serious contender.\n\n**Major director projects:** Scorsese, Coppola, Mendes — all working on new projects.\n\n### Our Prediction\nAnimation succeeds in its category, but human drama dominates the major awards.\n\n*We'll update these predictions as each new project is announced.*`
      },
      fr: { title: 'Nos Prédictions Oscar Meilleur Film 2027', description: 'Analyse précoce des plus forts prétendants aux Oscars 2027.', category: 'Oscars', content: `## Course Oscar 2027 — Analyse Précoce\n\nLes indicateurs sont clairs: les drames humains dominent les grandes récompenses.` },
      es: { title: 'Nuestras Predicciones Oscar Mejor Película 2027', description: 'Análisis temprano de los candidatos más fuertes a los Oscar 2027.', category: 'Oscars', content: `## Carrera Oscar 2027 — Análisis Temprano\n\nLos indicadores son claros: los dramas humanos dominan los premios principales.` },
      tr: { title: '2027 Oscar En İyi Film Tahminlerimiz', description: '2027 Oscar\'larının en güçlü adaylarının erken analizi.', category: 'Oscar', content: `## 2027 Oscar Yarışı — Erken Analiz\n\nGöstergeler açık: İnsan dramları büyük ödüllere hakimiyet kuruyor.` },
      de: { title: 'Unsere Oscar-Vorhersagen Bester Film 2027', description: 'Frühe Analyse der stärksten Anwärter auf die Oscars 2027.', category: 'Oscars', content: `## Oscar-Rennen 2027 — Frühe Analyse\n\nDie Indikatoren sind klar: Menschliche Dramen dominieren die großen Preise.` },
      ja: { title: '2027年アカデミー賞作品賞の予測', description: '2027年アカデミー賞の最有力候補の早期分析。', category: 'アカデミー賞', content: `## 2027年アカデミー賞レース — 早期分析\n\n人間ドラマが主要賞を制する傾向がある。` },
      pt: { title: 'Nossas Previsões Oscar Melhor Filme 2027', description: 'Análise precoce dos candidatos mais fortes ao Oscar 2027.', category: 'Oscar', content: `## Corrida Oscar 2027 — Análise Precoce\n\nOs indicadores são claros: dramas humanos dominam os prêmios principais.` }
    }
  },
  {
    slug: 'spirited-away-standout-2000s-cinema',
    date: '2026-05-27',
    readTime: 6,
    image: 'https://image.tmdb.org/t/p/original/bSXfU4dwZyBA1vMmXvejdRXBvuF.jpg',
    movieSlug: 'spirited-away',
    i18n: {
      ar: {
        title: 'سبيريتد أواي: لماذا ارتفعت فوق أفلام الألفية الأولى',
        description: 'تحليل مقارنة لفيلم سبيريتد أواي مع روائع عصره وكيف تفوق على الأفلام المعاصرة.',
        category: 'تحليل سينمائي',
        content: `## مقدمة\n**سبيريتد أواي** (2001) للمخرج هاياؤ ميازاكي ليس مجرد فيلم أنيميه، بل هو تجربة سحرية تجاوزت حدود الزمن والثقافة. في هذا المقال نستعرض كيف تفوق الفيلم على أعمال معاصرة مثل *Amélie*، *Moulin Rouge!* و*The Lord of the Rings*.\n\n## الابتكار البصري والرسومي\n> "التفاصيل الصغيرة تصنع عالمًا كاملًا" – هاروكي موراكامي\n\n- رسومات يدوية غنية بالألوان؛ كل إطار يشبه لوحة فنية.\n- دمج عناصر الفولكلور الياباني مع خيال علمي يخلق مساحة فريدة لا توجد في أي إنتاج غربي.\n- استخدام الضوء والظل لإبراز الحالة النفسية للبطلة تشييه، شيء لم تجده معظم الأفلام الأمريكية في ذلك الوقت.\n\n## السرد العاطفي المتعدد الطبقات\n- القصة تدور حول نمو شخصية شابة في عالم غريب، لكنها تحمل رسائل حول الاستهلاك، الهوية والبيئة.\n- بالمقارنة، *Amélian* ركز على رومانسية باريسية خفيفة، و*Moulin Rouge!* على البذخ الموسيقي، بينما *Spirited Away* يجمع خيالًا عميقًا مع نقد اجتماعي.\n\n## الشخصيات وتطورها\n- كل كائن في الحمام الروحي يمثل صفة إنسانية أو سلبية، ما يجعل المشاهد يتفاعل مع كل شخصية كأنها مرآة للذات.\n- في كثير من أفلام الخيال المعاصر، الشخصيات ثانوية؛ هنا، حتى الكائنات البسيطة تحظى بأحاديث ومهام تجسد صراعات داخلية.\n\n## الموسيقى والجو\n- موسيقى جوهوزو كايكووا (Joe Hisaishi) تضيف نغمة سحلية لا تشبه أي سكور في أفلام الخيال الغربي.\n- القطع الموسيقية تتماشى مع تغيرات المشهد، من الهدوء الروحي إلى الفوضى المرعبة، وهو ما يجعل الجمهور يشعر بالتماسك العاطفي.\n\n## نجاح عالمي وإرث دائم\n- فاز بجائزة الأوسكار لأفضل فيلم أجنبي، وهو إنجاز نادر لأفلام الأنيميه.\n- أثرت تقنيات الرسم والتصميم على جيل كامل من صانعي الرسوم المتحركة في كوريًا وسوريا وخارجها.\n\n## الخلاصة\n*Spirited Away* ارتقى فوق معاصريه بفضل **الرؤية الفنية الفريدة**، **السرد العميق** و**الاهتمام بالتفاصيل** التي تجعل كل مرة مشاهدة اكتشافًا جديدًا. إنه ليس مجرد فيلم، بل مرآة ثقافية تدفع المشاهد لإعادة التفكير في ذاته والعالم من حوله.\n\n> "إنه ليس مجرد قصة عن فتاة تائهة، بل رحلة داخلية لكل من يجرؤ على الحلم" – نقد سينمائي عالمي`,
      },
      en: {
        title: 'Spirited Away: Why It Soared Above Its Early‑2000s Peers',
        description: 'A comparative analysis of Spirited Away with its era’s greats and why it outshone contemporary cinema.',
        category: 'Film Analysis',
        content: `## Introduction\nHayao Miyazaki’s *Spirented Away* (2001) is more than a landmark animated feature; it is a cultural phenomenon that still feels fresh after two decades. While the early‑2000s welcomed eclectic hits like *Amélie*, *Moulin Rouge!*, and *The Lord of the Rings* trilogy, Miyazaki’s masterpiece managed to eclipse them in both critical acclaim and lasting influence. This article dissects the key factors that set the film apart.\n\n## Visual Innovation\n- **Hand‑drawn artistry**: Every frame is a painstaking watercolor‑like painting, a contrast to the CGI‑heavy aesthetic dominating Hollywood at the time.\n- **Folklore meets fantasy**: The film weaves Shinto‑inspired spirits, Japanese bath‑house tradition, and universal mythic motifs into a seamless world no Western blockbuster attempted.\n- **Light and shadow choreography**: Miyazaki manipulates illumination to mirror Chihiro’s emotional state, creating a visual language that feels more literary than cinematic.\n\n## Narrative Depth\n> “A story is a vessel for our deepest anxieties.” – Film scholar Susan Napier\n\nUnlike the breezy romanticism of *Amélie* or the opulent musical pastiche of *Moulin Rouge!*, *Spirited Away* balances childlike wonder with a sophisticated critique of consumerism, identity loss, and environmental neglect. The plot’s surface—a girl trapped in a spirit bathhouse—unfolds into a multilayered allegory that rewards repeat viewings.\n\n## Character Architecture\n- **Dynamic supporting cast**: Even minor spirits (the Radish‑Man, No‑Face) embody distinct human flaws, turning every encounter into a moral vignette.\n- **Growth through adversity**: Chihiro evolves from a sullen, whiny child into a courageous, self‑reliant heroine, a trajectory rarer in contemporaneous fantasy where protagonists often remain static.\n\n## Score and Atmosphere\nJoe Hisaishi’s hauntingly melodic score acts as an emotional spine. Themes shift fluidly from serene piano motifs during the river‑scene to discordant brass during the witch’s showdown, mirroring the narrative’s tonal swings. No other early‑2000s film matched this seamless integration of music and story.\n\n## Global Reception & Legacy\n- Won the Academy Award for Best Animated Feature—the first non‑English animated film to claim the prize.\n- Inspired a generation of animators worldwide, from Studio Ghibli’s own successors to European studios exploring hand‑drawn techniques again.\n- Continues to appear in “Greatest Films of All Time” lists, often outranking its contemporaries.\n\n## Conclusion\n*Spirited Away* rose above its peers because of an **uncompromising artistic vision**, **rich narrative ecology**, and **meticulous craftsmanship** that made every frame feel alive. It is not merely a film; it is a mirror that reflects our collective hopes and fears, inviting each viewer to step beyond the mundane into a world where every spirit has a story.\n\n> “It isn’t just a tale of a lost girl—it’s a map of the human soul.” – International film critic`,
      },
      fr: {
        title: 'Spirited Away : pourquoi le film a surpassé ses pairs',
        description: 'Analyse comparative du chef‑d’œuvre de Miyazaki avec les grands films du début des années 2000.',
        category: 'Analyse cinématographique',
        content: `## Introduction\nSpirited Away de Hayao Miyazaki (2001) a marqué la fin de siècle en offrant une expérience visuelle et narrative hors du commun. Comparé à *Amélie*, *Moulin Rouge!* ou la trilogie *Le Seigneur des Anneaux*, le film se distingue par son esthétique dessinée à la main, son ancrage dans le folklore japonais et une profondeur thématique rare à l’époque.\n\n## Innovation visuelle\n- Dessin à la main, chaque plan ressemble à une aquarelle.\n- Fusion du Shinto, des bains publics et du fantastique.\n- Jeu subtil de lumière qui suit l’évolution intérieure de Chihiro.\n\n## Narration et personnages\nLe récit va bien au‑delà d’une simple aventure d’enfants : il critique la surconsommation, explore l’identité et l’écologie. Les créatures secondaires, de No‑Face au Radish‑Man, incarnent des travers humains et donnent à chaque rencontre une dimension morale.\n\n## Musique et atmosphère\nLa partition de Joe Hisaishi mêle mélodies douces et sons discordants, suivant le rythme du film. Aucun film occidental de la même période n’a intégré la musique à ce point.\n\n## Héritage\nPremier film d’animation non anglophone à remporter l’Oscar du meilleur film d’animation, il a influencé toute une génération d’animateurs, en Occident comme en Asie.\n\n## Conclusion\nSpirited Away s’élève grâce à une vision artistique cohérente, un univers riche et une exécution impeccable. Il continue d’inspirer et de fasciner, prouvant que le cinéma d’animation peut être aussi profond que n’importe quel film live‑action.`,
      },
      es: {
        title: 'Spirited Away: cómo superó a sus contemporáneos',
        description: 'Comparación de Spirited Away con grandes filmes de principios de los 2000 y su sobresaliente dominio.',
        category: 'Análisis cinematográfico',
        content: `## Introducción\n*Spirited Away* de Hayao Miyazaki llegó en 2001 y rápidamente se posicionó por encima de éxitos como *Amélie*, *Moulin Rouge!* y la trilogía de *El Señor de los Anillos*.\n\n## Innovación visual\n- Animación dibujada a mano con una paleta de colores que parece una pintura tradicional.\n- Incorporación de mitología shintoísta y el concepto del baño público como metáfora social.\n- Uso de luz y sombra para reflejar el crecimiento interno de Chihiro.\n\n## Narrativa y personajes\nEl film combina una aventura infantil con críticas al consumismo y la pérdida de identidad. Personajes secundarios como No‑Face representan obsesiones modernas.\n\n## Banda sonora\nJoe Hisaishi crea una partitura que acompaña cada escena, variando entre pasajes melódicos y tensos.\n\n## Legado\nGanó el Óscar a Mejor Película de Animación y sigue influyendo a creadores de todo el mundo, demostrando que la animación puede ser profunda y universal.\n\n## Conclusión\nSu visión artística, su profundidad temática y su ejecución impecable hacen que *Spirited Away* se mantenga como referencia de los años 2000.`,
      },
      tr: {
        title: 'Spirited Away: 2000\'lerin En İyi Filmleriyle Karşılaştırma',
        description: 'Spirited Away\'nin aynı dönemdeki diğer büyük filmlerle karşılaştırması ve üstünlüğü.',
        category: 'Film Analizi',
        content: `## Giriş\nHayao Miyazaki'nin 2001 yapımı *Spirited Away* filmini *Amélie*, *Moulin Rouge!* ve *Yüzüklerin Efendisi* üçlemesiyle yan yana koyduğumuzda, görsel anlatım, kültürel zenginlik ve tematik derinlik bakımından ayrı bir konuma çıktığını görüyoruz.\n\n## Görsel Yenilik\n- Elle çizilmiş animasyon, her kareyi bir sanat eseri gibi gösteriyor.\n- Japon folkloru ve Shinto öğeleri modern fantastik ögelerle birleşiyor.\n- Işık-gölge oyunları, Chihiro'nun iç dünyasını yansıtıyor.\n\n## Hikâye ve Karakterler\nFilm, çıplak bir macera olmaktan öte, tüketim eleştirisi ve kimlik arayışı sunuyor. Yan karakterler (No‑Face, Radish‑Man) insan zaaflarını temsil ediyor.\n\n## Müzik\nJoe Hisaishi'nin bestesi sahne geçişlerine uyumlu, duygusal bir çerçeve sağlıyor.\n\n## Miras\nOscar ödülü kazandı ve dünya çapında animatörleri etkiledi; animasyonun yalnızca çocuklar için olmadığını gösterdi.\n\n## Sonuç\nSanatsal vizyon, zengin anlatı ve teknik mükemmeliyet, *Spirited Away*'yi döneminin diğer filmlerinin üzerine taşıdı.`,
      },
      de: {
        title: 'Spirited Away: Warum es den Filmen seiner Zeit voraus war',
        description: 'Vergleich von Spirited Away mit den großen Filmen der frühen 2000er und Analyse seiner Überlegenheit.',
        category: 'Filmanalyse',
        content: `## Einführung\nHayao Miyazakis *Spirited Away* (2001) ist ein animierter Film, der in den frühen 2000ern mit Werken wie *Amélie*, *Moulin Rouge!* und der *Herr der Ringe*-Trilogie konkurrierte – und sich deutlich hervortat.\n\n## Visuelle Innovation\n- Handgezeichnete Animation, jedes Bild wirkt wie ein Gemälde.\n- Kombination japanischer Folklore und moderner Fantasie, etwas, das westliche Produktionen selten leisten.\n- Licht‑ und Schattenarbeit, die Chihiros innere Entwicklung visualisiert.\n\n## Erzählerische Tiefe\nDas Werk verbindet ein Kindheitsabenteuer mit einer Kritik an Konsumkultur, Identitätsverlust und Umweltzerstörung. Nebenfiguren wie No‑Face reflektieren menschliche Schwächen.\n\n## Musik\nJoe Hisasakis Partitur begleitet jede Szene mit Melodien, die zwischen Ruhe und Spannungsaufbau wechseln.\n\n## Wirkung & Erbe\nErster nicht‑englischer Oscar‑Gewinner für den besten animierten Spielfilm, er beeinflusste Animatoren weltweit und bleibt ein Meilenstein der Filmgeschichte.\n\n## Fazit\nDurch seine unverwechselbare künstlerische Vision, tiefgründige Symbolik und technische Präzision sticht *Spirited Away* deutlich über seine Zeitgenossen hinaus.`,
      },
      ja: {
        title: '千と千尋の神隠し：同世代作品と比較した優位性',
        description: '2000年代初頭の名作と比較し、なぜ『千と千尋の神隠し』が際立ったかを分析。',
        category: '映画分析',
        content: `## はじめに\n宮崎駿監督の『千と千尋の神隠し』（2001年）は、同時代の『アメリ』や『ムーラン・ルージュ！』、『ロード・オブ・ザ・リング』と比べても、そのビジュアルとテーマの深さで抜きんでている。\n\n## ビジュアルの革新\n- 手描きアニメーションは、1フレームずつが絵画のように緻密。\n- 神道や日本の温泉文化をファンタジーと融合させた世界観は、欧米作品に見られない独自性。\n- 光と陰の使い分けで、千尋の心理状態を映し出す表現が秀逸。\n\n## 物語とキャラクター\n- 消費主義や環境問題への批評が子ども向け冒険に絡み合う。\n- ノーフェイスや油屋の従業員など、脇役でも人間の欲望や孤独を象徴。\n\n## 音楽と雰囲気\n久石譲の音楽は、静かなピアノから緊迫した管楽器まで、シーンとシンクロし、感情の揺れを増幅させる。\n\n## 受賞と影響\nアカデミー賞長編アニメ賞受賞は、英語圏以外の作品としては初。以降、世界中のアニメーターに手描きの価値を再認識させた。\n\n## 結論\n独自の芸術ビジョンと緻密な作り込み、普遍的なテーマが『千と千尋の神隠し』を同世代作品の上に立たせている。`,
      },
      pt: {
        title: 'Spirited Away: Por que o filme brilhou acima dos contemporâneos',
        description: 'Comparação de Spirited Away com grandes filmes dos anos 2000 e análise de seu destaque.',
        category: 'Análise de Filme',
        content: `## Introdução\nLançado em 2001, *Spirited Away* de Hayao Miyazaki rapidamente se destacou frente a obras como *Amélie*, *Moulin Rouge!* e a trilogia *O Senhor dos Anéis*.\n\n## Inovação visual\n- Animação desenhada à mão, quase como aquarelas em movimento.\n- Mistura de folclore shintoísta com fantasia universal, algo raro em produções ocidentais.\n- Luz e sombra são usados para refletir o crescimento interno de Chihiro.\n\n## Narrativa e personagens\nO filme combina aventura infantil com crítica ao consumismo, à perda de identidade e à degradação ambiental. Personagens secundários (No‑Face, o Homem‑Rabanete) representam falhas humanas, adicionando camadas morais.\n\n## Trilha sonora\nJoe Hisaishi compõe uma partitura que acompanha cada cena, alternando entre melodias suaves e acordes tensos.\n\n## Legado\nPrimeiro filme de animação não‑inglês a ganhar o Oscar de Melhor Animação, influenciando animadores ao redor do mundo e provando que animação pode ser tão profunda quanto cinema live‑action.\n\n## Conclusão\nCom visão artística consistente, universo rico e execução impecável, *Spirited Away* permanece como referência dos anos 2000, superando seus pares em originalidade e impacto duradouro.`,
      }
    }
  },
  {
    slug: 'cinema-paradiso-timeless-legacy-comparison',
    date: '2026-05-31',
    readTime: 6,
    image: 'https://image.tmdb.org/t/p/original/aXKkADCRaVMblDFy9VT9KFAJ0T6.jpg',
    movieSlug: 'cinema-paradiso',
    i18n: {
      ar: {
        title: 'سينما باراديسو: لماذا تظل تحفة تورناتوري خالدة؟',
        description: 'تحليل نقدي لفيلم سينما باراديسو ومقارنته بأفلام الثمانينات التي جعلته يتفوق كرسالة حب أبدية للفن السابع.',
        category: 'مراجعات سينمائية',
        content: `## سحر الحنين في عصر التحولات\n\nفي أواخر الثمانينات، كانت السينما العالمية تمر بمرحلة انتقالية؛ حيث سيطرت أفلام الحركة الأمريكية الضخمة والواقعية القاسية في أوروبا. وسط هذا الضجيج، جاء جوزيبي تورناتوري بفيلم **"سينما باراديسو" (Cinema Paradiso)**، وهو ليس مجرد فيلم عن السينما، بل هو مرثية بصرية عن الطفولة، الفقد، والشغف الذي يتجاوز الزمن.\n\n## ما الذي جعل "سينما باراديسو" يتفوق على معاصريه؟\n\nعندما نقارن هذا الفيلم بأعمال كبرى من نفس الحقبة، مثل "The Last Emperor" أو حتى أفلام مارتن سكورسيزي في تلك الفترة، نجد أن قوة تورناتوري تكمن في **الصدق العاطفي العاري**. بينما كانت الأفلام الأخرى تركز على الملاحم التاريخية أو السرديات المعقدة، اختار تورناتوري التركيز على العلاقة الإنسانية بين الطفل "توتو" والعجوز "ألفردو".\n\n> "السينما هي المكان الذي نجد فيه أنفسنا عندما نفقد كل شيء."\n\nتميز الفيلم بقدرته على دمج "النوستالجيا" دون الوقوع في فخ الميلودراما المبتذلة. بينما كانت العديد من أفلام تلك الحقبة تعتمد على الحبكات السريعة، اعتمد "سينما باراديسو" على **إيقاع هادئ** يسمح للمشاهد بالتنفس والشعور بمرور الزمن، مما خلق رابطاً وجدانياً عميقاً يتجاوز الحدود الثقافية.\n\n## عبقرية الموسيقى والسرد\n\nلا يمكن الحديث عن هذا الفيلم دون ذكر الموسيقار **إنيو موريكوني**. لقد كانت الموسيقى هنا ليست مجرد خلفية، بل كانت شخصية مستقلة تحكي ما عجزت عنه الكلمات. في المقابل، كانت معظم أفلام الثمانينات تستخدم الموسيقى لتعزيز التوتر، بينما استخدمها تورناتوري وموريكوني لتعزيز **الحنين والشجن**.\n\n* **البناء السردي:** الانتقال السلس بين الماضي والحاضر.\n* **الرمزية:** تحول السينما من مكان للتجمع الاجتماعي إلى ذكرى مؤلمة ثم إلى إلهام.\n* **النهاية:** مشهد "القبلات المجمعة" الذي يعتبر واحداً من أقوى النهايات في تاريخ السينما العالمية.\n\n## الخلاصة: إرث لا يندثر\n\nلقد ارتقى "سينما باراديسو" فوق معاصريه لأنه لم يحاول أن يكون "ذكياً" أو "مثيراً للجدل"، بل حاول أن يكون **إنسانياً**. في وقت كانت فيه السينما تتحول إلى صناعة استهلاكية، ذكرنا تورناتوري بأن السينما هي في الأصل سحر، وذاكرة، وعلاقة حب بين المخرج والجمهور. إنه فيلم يثبت أن القصص البسيطة هي التي تعيش طويلاً لأنها تلامس جوهر التجربة البشرية.`,
      },
      en: {
        title: 'Cinema Paradiso: Why it Transcended the Cinema of the 80s',
        description: 'An analytical look at Giuseppe Tornatore\'s masterpiece and how its emotional purity outshone the blockbuster era of the late 80s.',
        category: 'Film Analysis',
        content: `## The Alchemy of Nostalgia\n\nReleased in 1988, *Cinema Paradiso* arrived at a time when global cinema was increasingly divided between high-concept Hollywood blockbusters and rigid European art-house experiments. Amidst this dichotomy, Giuseppe Tornatore crafted a narrative that felt both intimately local and universally resonant. It is more than a film about movies; it is an exploration of the formative bond between a mentor and a protégé, and the bittersweet nature of success and exile.\n\n## Standing Above the Contemporaries\n\nWhen compared to other great films of the late 80s—such as the sprawling historical narratives of Bernardo Bertolucci or the gritty character studies of Spike Lee—*Cinema Paradiso* stands out through its **emotional transparency**. While its contemporaries often leaned into political cynicism or technical spectacle, Tornatore leaned into the heart. \n\n> "The cinema is a mirror where we see the parts of ourselves we forgot to love."\n\nWhat allowed this film to rise above its peers was its refusal to succumb to cliché. The relationship between Salvatore and Alfredo is not a simple friendship; it is a complex transfer of wisdom, where the mentor pushes the student away to ensure his growth. This nuanced approach to growth and loss provided a psychological depth that many of the era's nostalgic films lacked.\n\n## The Synergy of Sound and Sight\n\nThe film's immortality is inextricably linked to **Ennio Morricone's** score. While other films used soundtracks to drive plot or heighten tension, Morricone’s melodies in *Cinema Paradiso* operate as an emotional anchor. The music doesn't just accompany the images; it fills the gaps between the memories, evoking a longing that is felt even by those who never lived in a small Sicilian village.\n\n* **The Narrative Arc:** The transition from childhood innocence to adult regret, and finally to reconciliation.\n* **Visual Storytelling:** The use of the projection booth as a sanctuary of magic and secrecy.\n* **The Final Montage:** A masterclass in editing that resolves years of longing in a few minutes of cinematic gold.\n\n## A Timeless Legacy\n\n*Cinema Paradiso* transcended its era by championing the **purity of passion**. In an age of increasing commercialization, it reminded the world that the essence of cinema is the shared experience of wonder. While other films of 1988 may have been more provocative or technically daring, none captured the essence of the medium's soul as profoundly as this Italian masterpiece. It remains a definitive love letter to the silver screen, proving that the most personal stories are often the most universal.`,
      },
      fr: {
        title: 'Cinéma Paradiso : Une lettre d\'amour éternelle',
        description: 'Analyse du chef-d\'œuvre de Giuseppe Tornatore et son impact durable face au cinéma des années 80.',
        category: 'Critique Cinéma',
        content: `## Un triomphe de l'émotion\n\n*Cinéma Paradiso* (1988) s'est élevé au-dessus des productions de son époque en privilégiant l'humanisme sur le spectacle. Contrairement aux blockbusters américains de l'époque, Tornatore a choisi l'intimité. La relation entre Toto et Alfredo symbolise la transmission du savoir et de la passion. Grâce à la musique sublime d'Ennio Morricone, le film transforme la nostalgie en une expérience universelle. Le montage final, avec les scènes de baisers censurées, reste l'un des moments les plus poignants de l'histoire du cinéma, prouvant que la simplicité émotionnelle est la forme la plus haute de l'art.`,
      },
      es: {
        title: 'Cinema Paradiso: El triunfo del corazón sobre la técnica',
        description: 'Explorando por qué la obra de Tornatore sigue siendo superior a muchas producciones de los 80.',
        category: 'Análisis Cinematográfico',
        content: `## La magia de la memoria\n\n*Cinema Paradiso* no es solo una película, es un tributo al séptimo arte. En una era dominada por la acción y los efectos especiales, Tornatore apostó por la sensibilidad. Mientras otros directores buscaban la provocación, él buscó la ternura. La química entre el pequeño Totó y Alfredo crea un ancla emocional que sostiene toda la trama. La banda sonora de Ennio Morricone eleva la narrativa a un nivel espiritual, convirtiendo una historia siciliana en un sentimiento global. Su capacidad para evocar la pérdida y el redescubrimiento lo sitúa muy por encima de sus contemporáneos.`,
      },
      tr: {
        title: 'Cinema Paradiso: Sinemanın Ölümsüz Aşk Mektubu',
        description: 'Tornatore\'nin başyapıtının 80\'lerin diğer filmlerinden neden daha etkileyici olduğunun analizi.',
        category: 'Sinema Analizi',
        content: `## Nostaljinin Gücü\n\n*Cinema Paradiso*, 1988 yılında vizyona girdiğinde, sinemanın sadece bir eğlence değil, bir yaşam biçimi olduğunu hatırlattı. Dönemin gösterişli Hollywood yapımlarının aksine, bu film sadeliğin ve samimiyetin gücüne odaklandı. Toto ve Alfredo arasındaki usta-çırak ilişkisi, izleyiciye büyümenin hüznünü ve tutkunun gücünü hissettirir. Ennio Morricone'nin müzikleri, filmi sadece bir hikaye olmaktan çıkarıp duygusal bir yolculuğa dönüştürür. Finaldeki öpücük sahneleri, sinemanın iyileştirici gücünün en büyük kanıtıdır.`,
      },
      de: {
        title: 'Cinema Paradiso: Warum dieser Film zeitlos ist',
        description: 'Eine Analyse von Tornatores Meisterwerk im Vergleich zum Kino der 80er Jahre.',
        category: 'Filmkritik',
        content: `## Die Poesie der Erinnerung\n\n*Cinema Paradiso* überragt seine Zeitgenossen durch seine tiefe emotionale Ehrlichkeit. Während das Kino der späten 80er oft auf technische Perfektion oder politische Statements setzte, konzentrierte sich Giuseppe Tornatore auf die menschliche Verbindung. Die Beziehung zwischen Salvatore und Alfredo ist ein zeitloses Porträt von Mentorenschaft und Verlust. Unterstützt durch die legendäre Musik von Ennio Morricone, schafft der Film eine Atmosphäre von Sehnsucht, die jede kulturelle Grenze überwindet. Es ist ein Film, der uns lehrt, dass die Liebe zum Kino uns mit unserer eigenen Vergangenheit verbindet.`,
      },
      ja: {
        title: 'ニュー・シネマ・パラダイス：時代を超越した愛の物語',
        description: 'トルナトーレ監督の傑作が、なぜ80年代の他の作品よりも輝き続けているのかを分析。',
        category: '映画評論',
        content: `## ノスタルジーの魔力\n\n『ニュー・シネマ・パラダイス』は、単なる映画へのオマージュではなく、人生の喪失と再生の物語です。80年代の派手なハリウッド映画とは対照的に、この作品は静かな情熱と人間愛を描きました。少年トトとアルフレードの絆は、世代を超えた師弟関係の美しさを提示しています。エンニオ・モリコーネの音楽が、言葉にできない切なさを完璧に表現しており、観客をシチリアの小さな村へと誘います。ラストシーンのカットされたキスシーンのモンタージュは、映画史上最も感動的な結末の一つであり、純粋な感情こそが最高の芸術であることを証明しています。`,
      },
      pt: {
        title: 'Cinema Paradiso: Uma Ode ao Sétima Arte',
        description: 'Uma análise sobre como a obra de Tornatore superou os filmes de sua era através da emoção.',
        category: 'Crítica de Cinema',
        content: `## A Alquimia da Saudade\n\n*Cinema Paradiso* elevou-se acima dos seus contemporâneos ao focar na pureza do sentimento. Numa época de grandes produções tecnológicas, Tornatore escolheu a simplicidade da relação entre Toto e Alfredo. O filme não trata apenas de cinema, mas de crescimento, sacrifício e a dor da saudade. A trilha sonora de Ennio Morricone é a alma do filme, transformando memórias em melodias. O final icônico, com a montagem dos beijos, é um lembrete poderoso de que o cinema é a arte de preservar o que o tempo tenta apagar.`,
      }
    }
  },
]

// ── AUTO-GENERATED BLOG POSTS ──────────────────────────────────────────────

const GENRE_NAMES: Record<string, Record<Locale, string>> = {
  drama:       { ar: 'الدراما', en: 'Drama', fr: 'Drame', es: 'Drama', tr: 'Dram', de: 'Drama', ja: 'ドラマ', pt: 'Drama' },
  action:      { ar: 'الأكشن', en: 'Action', fr: 'Action', es: 'Acción', tr: 'Aksiyon', de: 'Action', ja: 'アクション', pt: 'Ação' },
  thriller:    { ar: 'الإثارة', en: 'Thriller', fr: 'Thriller', es: 'Thriller', tr: 'Gerilim', de: 'Thriller', ja: 'スリラー', pt: 'Thriller' },
  comedy:      { ar: 'الكوميديا', en: 'Comedy', fr: 'Comédie', es: 'Comedia', tr: 'Komedi', de: 'Komödie', ja: 'コメディ', pt: 'Comédia' },
  horror:      { ar: 'الرعب', en: 'Horror', fr: 'Horreur', es: 'Terror', tr: 'Korku', de: 'Horror', ja: 'ホラー', pt: 'Terror' },
  scifi:       { ar: 'الخيال العلمي', en: 'Sci-Fi', fr: 'Science-fiction', es: 'Ciencia ficción', tr: 'Bilim kurgu', de: 'Science-Fiction', ja: 'SF', pt: 'Ficção científica' },
  animation:   { ar: 'الرسوم المتحركة', en: 'Animation', fr: 'Animation', es: 'Animación', tr: 'Animasyon', de: 'Animation', ja: 'アニメ', pt: 'Animação' },
  crime:       { ar: 'الجريمة', en: 'Crime', fr: 'Crime', es: 'Crimen', tr: 'Suç', de: 'Krimi', ja: 'クライム', pt: 'Crime' },
  history:     { ar: 'التاريخي', en: 'Historical', fr: 'Historique', es: 'Histórico', tr: 'Tarihi', de: 'Historisch', ja: '歴史', pt: 'Histórico' },
  adventure:   { ar: 'المغامرة', en: 'Adventure', fr: 'Aventure', es: 'Aventura', tr: 'Macera', de: 'Abenteuer', ja: '冒険', pt: 'Aventura' },
  romance:     { ar: 'الرومانسية', en: 'Romance', fr: 'Romance', es: 'Romance', tr: 'Romantik', de: 'Romanze', ja: 'ロマンス', pt: 'Romance' },
  documentary: { ar: 'الوثائقي', en: 'Documentary', fr: 'Documentaire', es: 'Documental', tr: 'Belgesel', de: 'Dokumentarfilm', ja: 'ドキュメンタリー', pt: 'Documentário' },
  arabic:      { ar: 'العربية', en: 'Arabic', fr: 'Arabe', es: 'Árabe', tr: 'Arapça', de: 'Arabisch', ja: 'アラビア語', pt: 'Árabe' },
}

const BEST_OF_LABEL: Record<Locale, string> = {
  ar: 'أفضل أفلام', en: 'Best', fr: 'Meilleurs films', es: 'Mejores', tr: 'En iyi',
  de: 'Beste', ja: 'ベスト', pt: 'Melhores'
}
const RANKED_BY_SCORE: Record<Locale, string> = {
  ar: 'مرتبة حسب التقييم', en: 'Ranked by score', fr: 'classés par note',
  es: 'clasificadas por puntuación', tr: 'puana göre sıralanmış',
  de: 'nach Punktzahl sortiert', ja: '評価順ランキング', pt: 'classificados por pontuação'
}
const FILMS_LABEL: Record<Locale, string> = {
  ar: 'فيلم', en: 'films', fr: 'films', es: 'películas', tr: 'film', de: 'Filme', ja: '映画', pt: 'filmes'
}
const DIRECTOR_LABEL: Record<Locale, string> = {
  ar: 'المخرج', en: 'Director', fr: 'Réalisateur', es: 'Director', tr: 'Yönetmen',
  de: 'Regisseur', ja: '監督', pt: 'Diretor'
}
const ALL_FILMS_LABEL: Record<Locale, string> = {
  ar: 'جميع الأفلام', en: 'All Films', fr: 'Tous les films', es: 'Todas las películas',
  tr: 'Tüm Filmler', de: 'Alle Filme', ja: '全作品', pt: 'Todos os filmes'
}
const SPOTLIGHT_LABEL: Record<Locale, string> = {
  ar: 'مسيرة', en: 'Complete Filmography', fr: 'Filmographie complète',
  es: 'Filmografía completa', tr: 'Tam Filmografi', de: 'Vollständige Filmografie',
  ja: '完全フィルモグラフィー', pt: 'Filmografia completa'
}
const FILMS_CAT: Record<Locale, string> = {
  ar: 'مخرجون', en: 'Directors', fr: 'Réalisateurs', es: 'Directores',
  tr: 'Yönetmenler', de: 'Regisseure', ja: '監督', pt: 'Diretores'
}

function generateGenrePosts(): BlogPost[] {
  const genres = Object.keys(GENRE_NAMES)
  const posts: BlogPost[] = []

  for (const genre of genres) {
    const genreMovies = MOVIES.filter((m) => m.genres.includes(genre as any))
      .sort((a, b) => b.rating_overall - a.rating_overall)
      .slice(0, 10)
    if (genreMovies.length < 3) continue

    const slug = `best-${genre}-films`
    const date = '2026-05-14'
    const image = genreMovies[0].backdrop_url || genreMovies[0].poster_url

    const i18n = {} as BlogPost['i18n']
    const LOCALES: Locale[] = ['ar', 'en', 'fr', 'es', 'tr', 'de', 'ja', 'pt']

    for (const locale of LOCALES) {
      const gName = GENRE_NAMES[genre][locale]
      const title = `${BEST_OF_LABEL[locale]} ${gName}`
      const description = `${genreMovies.length} ${FILMS_LABEL[locale]} · ${RANKED_BY_SCORE[locale]}`
      const filmList = genreMovies.map((m, i) => {
        const mTitle = locale === 'ar' ? m.title_ar : m.title
        const dirName = locale === 'ar' ? m.director_ar : m.director
        return `${i + 1}. **${mTitle}** (${m.year}) — ${m.rating_overall}/10 | ${DIRECTOR_LABEL[locale]}: ${dirName}`
      }).join('\n')

      const content = `## ${title}\n\n${filmList}`
      i18n[locale] = { title, description, category: gName, content }
    }

    posts.push({ slug, date, readTime: 4, image, i18n })
  }

  return posts
}

function generateDirectorPosts(): BlogPost[] {
  // Group movies by director
  const directorMap = new Map<string, typeof MOVIES>()
  for (const movie of MOVIES) {
    const key = movie.director
    if (!directorMap.has(key)) directorMap.set(key, [])
    directorMap.get(key)!.push(movie)
  }

  const posts: BlogPost[] = []
  const LOCALES: Locale[] = ['ar', 'en', 'fr', 'es', 'tr', 'de', 'ja', 'pt']

  for (const [director, films] of directorMap) {
    if (films.length < 3) continue
    const sorted = [...films].sort((a, b) => b.rating_overall - a.rating_overall)
    const slug = `director-${director.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
    const date = '2026-05-13'
    const image = sorted[0].backdrop_url || sorted[0].poster_url

    const i18n = {} as BlogPost['i18n']
    for (const locale of LOCALES) {
      const dirName = locale === 'ar' ? (films[0].director_ar || director) : director
      const title = `${dirName}: ${SPOTLIGHT_LABEL[locale]}`
      const description = `${films.length} ${FILMS_LABEL[locale]} · ${ALL_FILMS_LABEL[locale]}`
      const filmList = sorted.map((m, i) => {
        const mTitle = locale === 'ar' ? m.title_ar : m.title
        return `${i + 1}. **${mTitle}** (${m.year}) — ${m.rating_overall}/10`
      }).join('\n')

      const content = `## ${title}\n\n${filmList}`
      i18n[locale] = { title, description, category: FILMS_CAT[locale], content }
    }

    posts.push({ slug, date: `2026-05-${String(13 - (posts.length % 5)).padStart(2, '0')}`, readTime: 5, image, i18n, movieSlug: sorted[0].slug })
  }

  return posts
}

let _autoPosts: BlogPost[] | null = null

function getAutoBlogPosts(): BlogPost[] {
  if (_autoPosts) return _autoPosts
  _autoPosts = [...generateGenrePosts(), ...generateDirectorPosts()]
  return _autoPosts
}

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS, ...getAutoBlogPosts()]
}

export function getPostOfDay(): BlogPost {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return BLOG_POSTS[dayOfYear % BLOG_POSTS.length]
}

export function getRecentPosts(limit: number = 6): BlogPost[] {
  return BLOG_POSTS.slice(0, limit)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((p) => p.slug === slug)
}

export function getPostData(post: BlogPost, locale: string) {
  const l = (locale as Locale) in post.i18n ? (locale as Locale) : 'en'
  return { ...post.i18n[l], slug: post.slug, date: post.date, readTime: post.readTime, image: post.image, movieSlug: post.movieSlug }
}
