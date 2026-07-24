import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import AppData from './models/AppData.js';
import Feedback from './models/Feedback.js';
import Theme from './models/Theme.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Default Initial Seed Data
const DEFAULT_THEME = {
  key: 'main_theme',
  primaryColor: '#a855f7',
  secondaryColor: '#ec4899',
  bgColor: '#0b071e',
  cardRadius: '16px',
  enableGlow: true,
  enableAnimations: true,
  darkMode: true,
};

const DEFAULT_DATA = {
  key: 'main_content',
  hero: {
    name: {
      en: 'Angla Stacy',
      ko: '앙라 스테이시',
      ja: 'アングラ・ステイシー',
      zh: '安格拉·史黛西',
      fr: 'Angla Stacy',
      de: 'Angla Stacy',
      ar: 'أنغلا ستاسي',
      bn: 'আংলা স্টেসি',
      es: 'Angla Stacy',
      hi: 'आंग्ला स्टेसी',
      it: 'Angla Stacy',
      pt: 'Angla Stacy',
      ru: 'Англа Стэйси',
    },
    subtitle: "Hello, I'm",
    description: {
      en: 'A passionate individual exploring ideas, creating solutions & building the future.',
      ko: '아이디어를 탐구하고, 솔루션을 창조하며, 미래를 건설하는 열정적인 사람입니다.',
      ja: 'アイデアを探求し、ソリューションを創造し、未来を築く情熱的な人物。',
      zh: '一个充满热情的人，探索想法、创造解决方案并构建未来。',
      fr: 'Une personne passionnée par l\'exploration d\'idées, la création de solutions et la construction de l\'avenir.',
      de: 'Eine leidenschaftliche Persönlichkeit, die Ideen erforscht, Lösungen schafft und die Zukunft baut.',
      ar: 'شخص شغوف باستكشاف الأفكار، وابتكار الحلول، وبناء المستقبل.',
      bn: 'আইডিয়া অন্বেষণ, সমাধান তৈরি এবং ভবিষ্যৎ গড়ার প্রতি আগ্রহী একজন উৎসাহী ব্যক্তি।',
      es: 'Una persona apasionada que explora ideas, crea soluciones y construye el futuro.',
      hi: 'विचारों की खोज, समाधान निर्माण और भविष्य के निर्माण के प्रति उत्साही व्यक्ति।',
      it: 'Una persona appassionata che esplora idee, crea soluzioni e costruisce il futuro.',
      pt: 'Uma pessoa apaixonada por explorar ideias, criar soluções e construir o futuro.',
      ru: 'Увлечённый человек, исследующий идеи, создающий решения и строящий будущее.',
    },
    avatar: '',
    heroBg: '',
  },
  logo: {
    logoText: {
      en: 'AS',
      ko: 'AS',
      ja: 'AS',
      zh: 'AS',
      fr: 'AS',
      de: 'AS',
      ar: 'AS',
      bn: 'AS',
      es: 'AS',
      hi: 'AS',
      it: 'AS',
      pt: 'AS',
      ru: 'AS',
    },
    logoImage: '',
    brandName: {
      en: 'AnglaStacy',
      ko: 'AnglaStacy',
      ja: 'AnglaStacy',
      zh: 'AnglaStacy',
      fr: 'AnglaStacy',
      de: 'AnglaStacy',
      ar: 'AnglaStacy',
      bn: 'AnglaStacy',
      es: 'AnglaStacy',
      hi: 'AnglaStacy',
      it: 'AnglaStacy',
      pt: 'AnglaStacy',
      ru: 'AnglaStacy',
    },
  },
  about: {
    bio: {
      en: 'I am a Senior Frontend Engineer with over 6 years of experience specializing in building beautiful, highly interactive web applications. I focus on pixel-perfect details, immersive animations, and clean architectures that deliver world-class user experiences and blow users away.',
      ko: '저는 6년 이상의 경력을 가진 시니어 프론트엔드 엔지니어로, 아름답고 인터랙티브한 웹 애플리케이션 구축을 전문으로 합니다. 완벽한 디테일, 몰입감 있는 애니메이션, 깔끔한 아키텍처에 집중합니다.',
      ja: '6年以上の経験を持つシニアフロントエンドエンジニアです。美しくインタラクティブなWebアプリケーションの構築を専門とし、完璧なディテール、没入感のあるアニメーション、クリーンなアーキテクチャに注力しています。',
      zh: '我是一名拥有6年以上经验的资深前端工程师，专注于构建美观、高度交互的Web应用。我注重像素级细节、沉浸式动画和干净的架构。',
      fr: 'Ingénieur Frontend Senior avec plus de 6 ans d\'expérience spécialisé dans la création d\'applications web élégantes et interactives.',
      de: 'Ich bin ein Senior Frontend Engineer mit über 6 Jahren Erfahrung, spezialisiert auf die Entwicklung schöner, hochgradig interaktiver Webanwendungen.',
      ar: 'أنا مهندس واجهات أمامية ذو خبرة تزيد عن 6 سنوات متخصص في بناء تطبيقات ويب تفاعلية وجذابة.',
      bn: 'আমি ৬ বছরেরও বেশি অভিজ্ঞতাসম্পন্ন একজন সিনিয়র ফ্রন্টএন্ড প্রকৌশলী। সুন্দর এবং প্রতিক্রিয়াশীল ওয়েব অ্যাপ্লিকেশন তৈরিতে আমি বিশেষজ্ঞ।',
      es: 'Soy un Ingeniero Frontend Senior con más de 6 años de experiencia especializado en la creación de aplicaciones web interactivas.',
      hi: 'मैं 6 से अधिक वर्षों के अनुभव वाला एक सीनियर फ्रंटएंड इंजीनियर हूं, सुंदर और इंटरैक्टिव वेब एप्लिकेशन बनाने में विशेषज्ञ।',
      it: 'Sono un Senior Frontend Engineer con oltre 6 anni di esperienza nella creazione di applicazioni web belle e interattive.',
      pt: 'Sou um Engenheiro Frontend Sênior com mais de 6 anos de experiência na criação de aplicações web bonitas e interativas.',
      ru: 'Я старший фронтенд-инженер с более чем 6-летним опытом создания красивых и интерактивных веб-приложений.',
    },
    skills: [
      { name: 'React / Next.js', level: 95, category: 'Frontend' },
      { name: 'TypeScript', level: 92, category: 'Frontend' },
      { name: 'Tailwind CSS', level: 98, category: 'Frontend' },
      { name: 'Framer Motion', level: 90, category: 'Frontend' },
      { name: 'Zustand & State Management', level: 88, category: 'Frontend' },
      { name: 'UI/UX & Figma', level: 85, category: 'Design' },
    ],
    experience: [
      {
        id: 'exp1',
        year: '2024 - Present',
        role: {
          en: 'Senior UI/UX Engineer', ko: '시니어 UI/UX 엔지니어', ja: 'シニア UI/UX エンジニア', zh: '高级 UI/UX 工程师',
          fr: 'Ingénieur UI/UX Senior', de: 'Senior UI/UX Engineer', ar: 'كبير مهندسي UI/UX', bn: 'সিনিয়র ইউআই/ইউএক্স প্রকৌশলী',
          es: 'Ingeniero UI/UX Senior', hi: 'सीनियर UI/UX इंजीनियर', it: 'Ingegnere UI/UX Senior', pt: 'Engenheiro UI/UX Sênior', ru: 'Старший инженер UI/UX',
        },
        company: 'Vortex Labs',
        description: {
          en: 'Led development of highly animated React applications, designing state-of-the-art interactive dashboards and custom UI frameworks.',
          ko: '고도로 애니메이션된 React 애플리케이션 개발을 주도하고, 최첨단 인터랙티브 대시보드와 커스텀 UI 프레임워크를 설계했습니다.',
          ja: '高度にアニメーション化されたReactアプリケーションの開発をリードし、最先端のインタラクティブダッシュボードとカスタムUIフレームワークを設計しました。',
          zh: '主导高度动画化的React应用开发，设计最先进的交互式仪表板和自定义UI框架。',
          fr: 'Direction du développement d\'applications React dynamiques et conception de tableaux de bord interactifs sur mesure.',
          de: 'Leitung der Entwicklung animierter React-Anwendungen und Design moderner interaktiver Dashboards.',
          ar: 'قيادة تطوير تطبيقات React تفاعلية وتصميم لوحات تحكم متقدمة.',
          bn: 'উচ্চ অ্যানিমেটেড প্রতিক্রিয়া অ্যাপ্লিকেশন তৈরি এবং কাস্টম ফ্রেমওয়ার্কের ডিজাইনে নেতৃত্ব প্রদান।',
          es: 'Lideré el desarrollo de aplicaciones React altamente animadas y el diseño de paneles interactivos.',
          hi: 'उच्च एनिमेटेड React अनुप्रयोगों के विकास का नेतृत्व और कस्टम UI फ्रेमवर्क डिजाइन किया।',
          it: 'Guidato lo sviluppo di applicazioni React animate e progettazione di dashboard interattive.',
          pt: 'Liderei o desenvolvimento de aplicações React animadas e design de dashboards interativos.',
          ru: 'Руководил разработкой анимированных React-приложений и дизайном интерактивных дашбордов.',
        },
      },
      {
        id: 'exp2',
        year: '2022 - 2024',
        role: {
          en: 'Frontend Developer', ko: '프론트엔드 개발자', ja: 'フロントエンド開発者', zh: '前端开发工程师',
          fr: 'Développeur Frontend', de: 'Frontend-Entwickler', ar: 'مطور واجهات أمامية', bn: 'ফ্রন্টএন্ড ডেভেলপার',
          es: 'Desarrollador Frontend', hi: 'फ्रंटएंड ডেভেলپر', it: 'Sviluppatore Frontend', pt: 'Desenvolvedor Frontend', ru: 'Фронтенд-разработчик',
        },
        company: 'PixelForge Studio',
        description: {
          en: 'Created premium, glassmorphic customer landing pages with responsive animations and state management stores.',
          ko: '반응형 애니메이션과 상태 관리를 갖춘 프리미엄 글래스모피즘 랜딩 페이지를 제작했습니다.',
          ja: 'レスポンシブアニメーションと状態管理を備えたプレミアムなグラスモーフィズムランディングページを制作しました。',
          zh: '创建了具有响应式动画和状态管理的高级玻璃拟态登陆页面。',
          fr: 'Création de pages d\'atterrissage haut de gamme au design glassmorphique avec des animations réactives.',
          de: 'Erstellung hochwertiger Glassmorphism-Landingpages mit responsiven Animationen.',
          ar: 'بناء صفحات هبوط فاخرة بتصميم زجاجي ورسوم متحركة متجاوبة.',
          bn: 'প্রিমিয়াম গ্লাস মরফিক ল্যান্ডিং পেজ তৈরি করা।',
          es: 'Creé páginas de destino premium con animaciones responsivas.',
          hi: 'रेस्पॉन्सिव एनिमेशन के साथ प्रीमियम ग्लासमॉर्फिक लैंडिंग पेज बनाए।',
          it: 'Creato landing page premium con animazioni responsive.',
          pt: 'Criei landing pages premium com animações responsivas.',
          ru: 'Создал премиальные лендинги с адаптивными анимациями.',
        },
      },
      {
        id: 'exp3',
        year: '2020 - 2022',
        role: {
          en: 'UI Designer & Web Developer', ko: 'UI 디자이너 & 웹 개발자', ja: 'UIデザイナー & Web開発者', zh: 'UI设计师兼Web开发工程师',
          fr: 'Designer UI & Développeur Web', de: 'UI-Designer & Webentwickler', ar: 'مصمم UI ومطور ويب', bn: 'ইউআই ডিজাইনার এবং ওযেব ডেভেলপার',
          es: 'Diseñador UI y Desarrollador Web', hi: 'UI डिज़ाइनर और वेब डेवलपर', it: 'Designer UI e Sviluppatore Web', pt: 'Designer UI e Desenvolvedor Web', ru: 'UI-дизайнер и веб-разработчик',
        },
        company: 'Aether Tech',
        description: {
          en: 'Designed and built clean, modular websites for client startups. Focused on SEO, accessibility, and high performance.',
          ko: '클라이언트 스타트업을 위한 깔끔하고 모듈화된 웹사이트를 설계하고 구축했습니다. SEO, 접근성 및 고성능에 중점을 두었습니다.',
          ja: 'クライアントのスタートアップ向けにクリーンでモジュール式のウェブサイトを設計・構築しました。SEO、アクセシビリティ、高パフォーマンスに重点を置きました。',
          zh: '为客户初创企业设计和构建了简洁、模块化的网站。专注于SEO、可访问性和高性能。',
          fr: 'Conception et création de sites web modulaires pour startups, axés sur le SEO et la performance.',
          de: 'Konzeption und erstellung modularer Websites für Start-ups mit Fokus auf SEO und Performance.',
          ar: 'تصميم وبناء مواقع ويب حديثة للشركات الناشئة مع التركيز على الأداء والـ SEO.',
          bn: 'এসইও এবং উচ্চ পারফরম্যান্সের সাথে প্রতিক্রিয়াশীল ওয়েব সাইট তৈরি করা।',
          es: 'Diseñé y construí sitios web modulares para startups enfocados en SEO y rendimiento.',
          hi: 'SEO और उच्च प्रदर्शन पर केंद्रित स्टार्टअप के लिए मॉड्यूलर वेबसाइटें डिज़ाइन और बनाईं।',
          it: 'Progettato e costruito siti web modulari per startup con focus su SEO e performance.',
          pt: 'Projetei e construí sites modulares para startups focados em SEO e performance.',
          ru: 'Разработал модульные сайты для стартапов с фокусом на SEO и производительность.',
        },
      },
    ],
  },
  socials: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/anglastacy', username: '/anglastacy', sortOrder: 1, isActive: true },
    { id: '2', name: 'Telegram', url: 'https://t.me/anglastacy', username: '/anglastacy', sortOrder: 2, isActive: true },
    { id: '3', name: 'WhatsApp', url: 'https://wa.me/1234567890', username: '/anglastacy', sortOrder: 3, isActive: true },
    { id: '4', name: 'Facebook', url: 'https://facebook.com/anglastacy', username: '/anglastacy', sortOrder: 4, isActive: true },
    { id: '5', name: 'TikTok', url: 'https://tiktok.com/@anglastacy', username: '/anglastacy', sortOrder: 5, isActive: true },
    { id: '6', name: 'Snapchat', url: 'https://snapchat.com/add/anglastacy', username: '/anglastacy', sortOrder: 6, isActive: true },
  ],
  services: [
    {
      id: '1',
      title: {
        en: 'Personal Services', ko: '개인 서비스', ja: 'パーソナルサービス', zh: '私人定制服务',
        fr: 'Services Personnalisés', de: 'Persönliche Services', ar: 'خدمات شخصية', bn: 'ব্যক্তিগত সেবা',
        es: 'Servicios Personales', hi: 'व्यक्तिगत सेवाएं', it: 'Servizi Personali', pt: 'Serviços Pessoais', ru: 'Персональные Услуги',
      },
      description: {
        en: 'Discreet, professional and tailored experiences to meet your individual needs.',
        ko: '개인의 요구에 맞춘 신중하고 전문적인 맞춤형 경험을 제공합니다.',
        ja: '個人のニーズに合わせた、慎重でプロフェッショナルなオーダーメイド体験を提供します。',
        zh: '为满足您个人需求而量身定制的专业服务体验。',
        fr: 'Des expériences discrètes, professionnelles et sur mesure adaptées à vos besoins.',
        de: 'Diskrete, professionelle und maßgeschneiderte Erlebnisse für Ihre individuellen Bedürfnisse.',
        ar: 'تجارب سرية واحترافية ومصممة خصيصاً لتلبية احتياجاتك الفردية.',
        bn: 'আপনার ব্যক্তিগত প্রয়োজন মেটাতে বিচক্ষণ, পেশাদার এবং কাস্টমাইজড অভিজ্ঞতা।',
        es: 'Experiencias discretas, profesionales y personalizadas para sus necesidades.',
        hi: 'आपकी व्यक्तिगत आवश्यकताओं को पूरा करने के लिए पेशेवर और अनुकूलित अनुभव।',
        it: 'Esperienze discrete, professionali e su misura per le tue esigenze.',
        pt: 'Experiências discretas, profissionais e sob medida para suas necessidades.',
        ru: 'Профессиональные индивидуальные услуги, адаптированные к вашим потребностям.',
      },
      iconName: 'UserHeart', iconColor: '#c084fc',
    },
    {
      id: '2',
      title: {
        en: 'Casual Encounters', ko: '캐주얼 만남', ja: 'カジュアルミート', zh: '日常会面',
        fr: 'Rencontres Décontractées', de: 'Zwanglose Treffen', ar: 'لقاءات ودية', bn: 'নৈমিত্তিক সাক্ষাৎ',
        es: 'Encuentros Casuales', hi: 'सामान्य मुलाकातें', it: 'Incontri Casuali', pt: 'Encontros Casuais', ru: 'Случайные Встречи',
      },
      description: {
        en: 'Enjoy relaxed and spontaneous meetups with like-minded people.',
        ko: '마음이 맞는 사람들과 편안하고 자연스러운 만남을 즐겨보세요.',
        ja: '同じ趣味や価値観を持つ人々と、リラックスした気軽な交流をお楽しみください。',
        zh: '与志同道合的人享受轻松自然的会面。',
        fr: 'Profitez de moments détendus et spontanés avec des personnes partageant les mêmes idées.',
        de: 'Genießen Sie entspannte und spontane Treffen mit gleichgesinnten Menschen.',
        ar: 'استمتع بلقاءات مريحة وتلقائية مع أشخاص يشاركونك نفس الاهتمامات.',
        bn: 'সমমনা মানুষদের সাথে আরামদায়ক এবং স্বতঃস্ফূর্ত সাক্ষাৎ উপভোগ করুন।',
        es: 'Disfrute de encuentros relajados y espontáneos con personas afines.',
        hi: 'समान विचारधारा वाले लोगों के साथ आरामदायक और सहज मुलाकातों का आनंद लें।',
        it: 'Goditi incontri rilassati e spontanei con persone affini.',
        pt: 'Desfrute de encontros relaxados e espontâneos com pessoas afins.',
        ru: 'Наслаждайтесь непринужденными и спонтанными встречами с единомышленниками.',
      },
      iconName: 'Heart', iconColor: '#ec4899',
    },
    {
      id: '3',
      title: {
        en: 'Short Term Relationships', ko: '단기 관계', ja: '短期パートナーシップ', zh: '短期关系',
        fr: 'Relations à Court Terme', de: 'Kurzzeitige Verbindungen', ar: 'علاقات قصيرة المدى', bn: 'স্বল্পমেয়াদী সম্পর্ক',
        es: 'Relaciones a Corto Plazo', hi: 'अल्पकालिक संबंध', it: 'Relazioni a Breve Termine', pt: 'Relacionamentos de Curto Prazo', ru: 'Краткосрочные Отношения',
      },
      description: {
        en: 'Build meaningful connections and enjoy companionship for the short term.',
        ko: '의미 있는 인연을 맺고 단기간 동안 동반자 관계를 즐겨보세요.',
        ja: '意味のあるつながりを築き、短期間の素敵な交友関係をお楽しみください。',
        zh: '建立有意义的联系，享受短期的美好陪伴。',
        fr: 'Créez des liens significatifs et profitez d\'une compagnie agréable à court terme.',
        de: 'Knüpfen Sie wertvolle Kontakte und genießen Sie angenehme Gesellschaft.',
        ar: 'بناء روابط ذات معنى والاستمتاع برفقة ممتازة على المدى القريب.',
        bn: 'অর্থবহ সংযোগ গড়ুন এবং স্বল্পমেয়াদে সাহচর্য উপভোগ করুন।',
        es: 'Construya conexiones significativas y disfrute de compañía a corto plazo.',
        hi: 'सार्थक संबंध बनाएं और अल्पकालिक साहचर्य का आनंद लें।',
        it: 'Costruisci connessioni significative e goditi la compagnia a breve termine.',
        pt: 'Construa conexões significativas e aproveite a companhia a curto prazo.',
        ru: 'Стройте значимые связи и наслаждайтесь краткосрочным общением.',
      },
      iconName: 'CalendarHeart', iconColor: '#60a5fa',
    },
    {
      id: '4',
      title: {
        en: 'Dating', ko: '데이팅', ja: 'デーティング', zh: '约会交友',
        fr: 'Rencontres Amoureuses', de: 'Dating & Partnersuche', ar: 'تعارف وزواج', bn: 'ডেটিং',
        es: 'Citas', hi: 'डेटिंग', it: 'Appuntamenti', pt: 'Namoro', ru: 'Знакомства',
      },
      description: {
        en: 'Find genuine connections and explore potential for long-term relationships.',
        ko: '진정한 관계를 찾고 장기적인 관계의 가능성을 탐색해보세요.',
        ja: '真のつながりを見つけ、長期的な関係の可能性を探りましょう。',
        zh: '寻找真诚的联系，探索长期关系的可能性。',
        fr: 'Trouvez de vraies connexions et explorez le potentiel d\'une relation durable.',
        de: 'Finden Sie echte Verbindungen und entdecken Sie Möglichkeiten für langfristige Beziehungen.',
        ar: 'العثور على روابط حقيقية واستكشاف فرص العلاقات المستدامة.',
        bn: 'সত্যিকারের সংযোগ খুঁজুন এবং দীর্ঘমেয়াদী সম্পর্কের সম্ভাবনা অন্বেষণ করুন।',
        es: 'Encuentre conexiones genuinas y explore el potencial de relaciones a largo plazo.',
        hi: 'वास्तविक संबंध खोजें और दीर्घकालिक रिश्तों की संभावना तलाशें।',
        it: 'Trova connessioni genuine ed esplora il potenziale per relazioni a lungo termine.',
        pt: 'Encontre conexões genuínas e explore o potencial para relacionamentos de longo prazo.',
        ru: 'Найдите настоящие связи и исследуйте потенциал долгосрочных отношений.',
      },
      iconName: 'DoubleHeart', iconColor: '#f97316',
    },
  ],
  projects: [
    {
      id: '1',
      title: {
        en: 'Nova SaaS Dashboard', ko: 'Nova SaaS 대시보드', ja: 'Nova SaaS ダッシュボード', zh: 'Nova SaaS 仪表板',
        fr: 'Tableau de Bord Nova SaaS', de: 'Nova SaaS Dashboard', ar: 'لوحة تحكم Nova SaaS', bn: 'নোভা SaaS ড্যাশবোর্ড',
        es: 'Panel de Control Nova SaaS', hi: 'Nova SaaS डैशबोर्ड', it: 'Dashboard Nova SaaS', pt: 'Painel Nova SaaS', ru: 'Панель управления Nova SaaS',
      },
      description: {
        en: 'A modern, high-performance analytic dashboard featuring dynamic charts, glassmorphic layout, and live data telemetry streams.',
        ko: '동적 차트, 글래스모피즘 레이아웃 및 실시간 데이터 텔레메트리를 갖춘 현대적인 고성능 분석 대시보드입니다.',
        ja: 'ダイナミックチャート、グラスモーフィズムレイアウト、リアルタイムデータストリーミングを備えた最新の高性能分析ダッシュボード。',
        zh: '具有动态图表、玻璃拟态布局和实时数据遥测的现代高性能分析仪表板。',
        fr: 'Tableau de bord d\'analyse moderne et performant avec graphiques dynamiques et flux de données en direct.',
        de: 'Ein modernes Analyse-Dashboard mit dynamischen Diagrammen und Echtzeit-Datenstreams.',
        ar: 'لوحة تحكم تحليلية حديثة وعالية الأداء تحتوي على مخططات بيانية وتدفق بيانات مباشر.',
        bn: 'গতিশীল চার্ট এবং গ্লাস মরফিক লেআউট সহ আধুনিক ড্যাশবোর্ড।',
        es: 'Un panel de control analítico moderno y de alto rendimiento con gráficos dinámicos.',
        hi: 'डायनामिक चार्ट और ग्लासमॉर्फिक लेआउट वाला आधुनिक एनालिटिक डैशबोर्ड।',
        it: 'Una dashboard analitica moderna con grafici dinamici e flussi dati in tempo reale.',
        pt: 'Um painel analítico moderno com gráficos dinâmicos e dados em tempo real.',
        ru: 'Современная аналитическая панель с динамическими графиками и данными в реальном времени.',
      },
      image: '', liveLink: '#', githubLink: '#', tags: ['React', 'TypeScript', 'Tailwind', 'Recharts'],
    },
    {
      id: '2',
      title: {
        en: 'Aether Crypto Terminal', ko: 'Aether 크립토 터미널', ja: 'Aether クリプトターミナル', zh: 'Aether 加密终端',
        fr: 'Terminal Crypto Aether', de: 'Aether Crypto Terminal', ar: 'منصة Aether للعملات الرقمية', bn: 'ইথার ক্রিপ্টো টার্মিনাল',
        es: 'Terminal Crypto Aether', hi: 'Aether क्रिप्टो टर्मिनल', it: 'Terminale Crypto Aether', pt: 'Terminal Crypto Aether', ru: 'Криптотерминал Aether',
      },
      description: {
        en: 'Real-time cryptocurrency tracking platform featuring smooth dark luxury animations, customized theme selectors, and state management.',
        ko: '부드러운 다크 럭셔리 애니메이션, 커스텀 테마 선택기 및 상태 관리를 갖춘 실시간 암호화폐 추적 플랫폼입니다.',
        ja: 'スムーズなダークラグジュアリーアニメーション、カスタムテーマセレクター、状態管理を備えたリアルタイム暗号通貨追跡プラットフォーム。',
        zh: '具有流畅暗色奢华动画、自定义主题选择器和状态管理的实时加密货币跟踪平台。',
        fr: 'Plateforme de suivi des cryptomonnaies en temps réel avec des animations sombres élégantes.',
        de: 'Echtzeit-Krypto-Tracking-Plattform mit eleganten Dark-Mode-Animationen.',
        ar: 'منصة متابعة العملات الرقمية في الوقت الفعلي مع رسوم متحركة داكنة فاخرة.',
        bn: 'রিয়েল-টাইম ক্রিপ্টো ট্র্যাকিং প্ল্যাটফর্ম।',
        es: 'Plataforma de seguimiento de criptomonedas en tiempo real.',
        hi: 'रियल-टाइम क्रिप्टोकरेंसी ट्रैकिंग प्लेटफॉर्म।',
        it: 'Piattaforma di tracciamento criptovalute in tempo reale.',
        pt: 'Plataforma de rastreamento de criptomoedas em tempo real.',
        ru: 'Платформа отслеживания криптовалют в реальном времени.',
      },
      image: '', liveLink: '#', githubLink: '#', tags: ['Vite', 'Zustand', 'Tailwind', 'Framer Motion'],
    },
  ],
  testimonials: [
    {
      id: '1', name: 'Sarah Connor', avatar: '', rating: 5,
      comment: {
        en: 'Angla is an absolute wizard! The landing page is incredibly premium, responsive, and was built ahead of schedule. Highly recommended!',
        ko: 'Angla는 정말 마법사입니다! 랜딩 페이지가 놀랍도록 프리미엄하고 반응형이며, 일정보다 앞서 완성되었습니다. 강력히 추천합니다!',
        ja: 'Anglaは本物の魔法使いです！ランディングページは信じられないほどプレミアムでレスポンシブで、予定より早く完成しました。強くお勧めします！',
        zh: 'Angla 是绝对的天才！落地页非常高端、响应迅速，且提前完成。强烈推荐！',
        fr: 'Angla est un véritable magicien ! La page est incroyable, réactive et livrée en avance.',
        de: 'Angla ist ein echter Zauberer! Die Landingpage ist extrem hochwertig und vor dem Zeitplan fertig geworden.',
        ar: 'أنغلا محترف للغاية! صفحة الهبوط ممتازة ورائعة وتم تسليمها قبل الموعد.',
        bn: 'আংলা একজন জাদুকর! তার তৈরি করা ল্যান্ডিং পেজটি অত্যন্ত প্রিমিয়াম এবং প্রতিক্রিয়াশীল।',
        es: '¡Angla es un mago absoluto! La página es increíblemente premium y receptiva.',
        hi: 'Angla एक शानदार जादूगर हैं! लैंडिंग पेज अविश्वसनीय रूप से प्रीमियम है।',
        it: 'Angla è un vero mago! La landing page è incredibilmente premium.',
        pt: 'Angla é um verdadeiro mago! A landing page é incrivelmente premium.',
        ru: 'Angla — настоящий волшебник! Лендинг невероятно премиальный и отзывчивый.',
      },
    },
    {
      id: '2', name: 'David Miller', avatar: '', rating: 5,
      comment: {
        en: 'Working with Angla was an absolute pleasure. The design aesthetics and attention to detail are on another level.',
        ko: 'Angla와 함께 일하는 것은 정말 즐거웠습니다. 디자인 미학과 세부 사항에 대한 관심이 차원이 다릅니다.',
        ja: 'Anglaとの仕事は本当に楽しかったです。デザインの美学と細部への注意は次元が違います。',
        zh: '与 Angla 合作是一件非常愉快的事。设计美学和细节把控达到了极致水平。',
        fr: 'Travailler avec Angla a été un plaisir absolu. L\'esthétique et l\'attention aux détails sont au sommet.',
        de: 'Die Zusammenarbeit mit Angla war ein absolutes Vergnügen. Die Ästhetik und Liebe zum Detail sind herausragend.',
        ar: 'العمل مع أنغلا كان تجربة رائعة جداً. الجماليات والاهتمام بالتفاصيل في أعلى مستوى.',
        bn: 'আংলার সাথে কাজ করার অভিজ্ঞতা চমৎকার ছিল।',
        es: 'Trabajar con Angla fue un placer absoluto.',
        hi: 'Angla के साथ काम करना बेहद खुशी की बात थी।',
        it: 'Lavorare con Angla è stato un piacere assoluto.',
        pt: 'Trabalhar com Angla foi um prazer absoluto.',
        ru: 'Работать с Angla было абсолютным удовольствием.',
      },
    },
  ],
  seo: {
    title: 'Angla Stacy | Portfolio',
    description: 'Welcome to the premium portfolio of Angla Stacy. Explore full-stack applications, interactive UI/UX designs, and clean frontend engineering projects.',
    keywords: 'React, TypeScript, Portfolio, UI/UX Designer, Tailwind CSS, Frontend Developer',
  },
};

// Seed initial data if empty
async function seedDefaultData() {
  try {
    const existingData = await AppData.findOne({ key: 'main_content' }).lean();
    if (!existingData) {
      await AppData.create(DEFAULT_DATA);
      console.log('⚡ Initial AppData seeded into MongoDB.');
    }

    const existingTheme = await Theme.findOne({ key: 'main_theme' }).lean();
    if (!existingTheme) {
      await Theme.create(DEFAULT_THEME);
      console.log('⚡ Initial ThemeSettings seeded into MongoDB.');
    }
  } catch (err) {
    console.error('Error seeding default data:', err);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Database Connection Middleware for Vercel Serverless & standalone Express
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') && req.path !== '/api/health') {
    await connectDB();
  }
  next();
});

// App Data Routes
app.get('/api/data', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    let data = await AppData.findOne({ key: 'main_content' }).lean();
    if (!data) {
      const created = await AppData.create(DEFAULT_DATA);
      data = created.toObject();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/data', async (req, res) => {
  try {
    const updated = await AppData.findOneAndUpdate(
      { key: 'main_content' },
      { $set: req.body },
      { new: true, upsert: true, runValidators: false }
    ).lean();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feedbacks Routes
app.get('/api/feedbacks', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback.toObject());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/feedbacks/:id', async (req, res) => {
  try {
    await Feedback.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Theme Routes
app.get('/api/theme', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    let theme = await Theme.findOne({ key: 'main_theme' }).lean();
    if (!theme) {
      const created = await Theme.create(DEFAULT_THEME);
      theme = created.toObject();
    }
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/theme', async (req, res) => {
  try {
    const updated = await Theme.findOneAndUpdate(
      { key: 'main_theme' },
      { $set: req.body },
      { new: true, upsert: true }
    ).lean();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Route
app.post('/api/reset', async (req, res) => {
  try {
    await AppData.deleteOne({ key: 'main_content' });
    await Theme.deleteOne({ key: 'main_theme' });
    await Feedback.deleteMany({});
    
    const newAppData = await AppData.create(DEFAULT_DATA);
    const newTheme = await Theme.create(DEFAULT_THEME);
    
    res.json({ success: true, data: newAppData.toObject(), theme: newTheme.toObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static assets & wildcard fallback in standalone production mode (non-Vercel)
if (!process.env.VERCEL) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server & Connect Database
let isConnected = false;
export async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI environment variable is missing.');
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully.');
    await seedDefaultData();
  } catch (err) {
    console.error('❌ MongoDB Connection Failure:', err);
  }
}

if (MONGODB_URI) {
  connectDB();
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Express Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;
