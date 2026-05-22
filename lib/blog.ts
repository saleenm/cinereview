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
    image: 'https://upload.wikimedia.org/wikipedia/en/0/04/The_message_%281976%29.jpg',
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
    image: 'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1ZIzSFpEaJN.jpg',
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
]

export function getPostOfDay(): BlogPost {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return BLOG_POSTS[dayOfYear % BLOG_POSTS.length]
}

export function getRecentPosts(limit: number = 6): BlogPost[] {
  return BLOG_POSTS.slice(0, limit)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getPostData(post: BlogPost, locale: string) {
  const l = (locale as Locale) in post.i18n ? (locale as Locale) : 'en'
  return { ...post.i18n[l], slug: post.slug, date: post.date, readTime: post.readTime, image: post.image, movieSlug: post.movieSlug }
}
