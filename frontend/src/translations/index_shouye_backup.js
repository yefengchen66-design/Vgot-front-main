import { pricingTranslations } from './pricing.js';
import { partnerTranslations } from './partner.clean.js';

// Fully sanitized multilingual translations (UTF-8, no mojibake)
export const translations = {
  en: {
    pricing: pricingTranslations.en,
    partner: partnerTranslations.en,
    nav: {
      home: 'Home',
      features: 'Features',
      solutions: 'Solutions',
      pricing: 'Pricing',
      partner: 'Partner Program',
      help: 'Help',
      login: 'Log in',
      startFree: 'Start Free Trial'
    },
    hero: {
      badge: 'AI-Powered Video Creation Platform',
      headline1: 'One-Stop AI E-Commerce Video Workflow',
      headline2: 'Create Viral E-Commerce Videos in Seconds',
      subheading: 'From script creation to SORA video generation and AI expert narration—VGOT covers the full e-commerce video lifecycle.',
      sellingPoint1: 'Free Script Creation & Extraction',
      sellingPoint2: 'Smart One-Click Prompt Duplication',
      sellingPoint3: 'Ultra-Fast Video Generation (Up to 10 Min)',
      sellingPoint4: 'AI 4K Quality Enhancement',
      ctaPrimary: 'Start Creating Free',
      ctaSecondary: 'View Pricing',
      stats: 'Trusted by 10,000+ creators',
      videosGenerated: '2M+ videos generated'
    },
    trustLogos: { title: 'Trusted by leading platforms' },
    features: {
      title: 'Say Goodbye to Complexity—Reinvent E-Commerce Video Creation with AI',
      subtitle: 'Ideation, generation, enhancement, publishing—all in one place.',
      scriptGenerator: { title: 'Script Master', description: 'Generate from product data or extract trending scripts—no writer\'s block.' },
      soraVideo: { title: 'Smart Prompt Engine', description: 'Extract key prompts behind viral videos for fast replication.' },
      digitalExpert: { title: 'Long-Form Creator', description: 'Produce expert review / tutorial / storytelling videos with AI presenters.' },
      videoTools: { title: 'Intelligent Toolkit', description: 'Background removal, subtitles, translation, enhancement—streamlined.' }
    },
    painPoints: {
      title: 'Struggling With These?',
      slowScript: { title: 'Slow Script Writing', description: 'Hours drafting? AI delivers in seconds.' },
      complexTools: { title: 'Fragmented Tools', description: 'Juggling editing, subtitles & effects platforms? Centralize.' },
      poorQuality: { title: 'Inconsistent Quality', description: 'Low-res output or awkward narration? Get studio polish.' },
      timeConsuming: { title: 'Heavy Post-Production', description: 'Automation cuts editing time by up to 90%.' }
    },
    useCases: {
      title: 'Ideal for Every E-Commerce Scenario',
      productDemo: { title: 'Product Demos', description: 'Showcase core value with clear narration.' },
      unboxing: { title: 'Unboxing Videos', description: 'Generate exciting branded unboxings.' },
      tutorial: { title: 'How-To Guides', description: 'Educate with structured step-by-step flows.' },
      testimonial: { title: 'Customer Stories', description: 'Transform testimonials into compelling narratives.' },
      comparison: { title: 'Comparisons', description: 'Side-by-side breakdown to aid purchase decisions.' },
      socialMedia: { title: 'Social Ads', description: 'Optimize for TikTok / Instagram / YouTube instantly.' }
    },
    howItWorks: {
      title: '3 Steps to High-Converting Video',
      step1: { title: 'Input or Extract', description: 'Paste product URL, upload references, or extract scripts.' },
      step2: { title: 'Customize & Generate', description: 'Select style, voice, length—SORA renders fast.' },
      step3: { title: 'Enhance & Publish', description: 'Add subtitles, translate, polish and export.' }
    },
    valueProposition: {
      title: 'Why Choose VGOT',
      speed: { title: '10x Faster', description: 'Minutes instead of hours.' },
      quality: { title: 'Studio Grade', description: 'AI-enhanced 4K & pro audio.' },
      cost: { title: '80% Cost Savings', description: 'No expensive crews or multiple licenses.' },
      ease: { title: 'Zero Learning Curve', description: 'Intuitive interface from day one.' }
    },
    pricingTeaser: {
      title: 'Transparent Plans for Creators',
      description: 'Start free and scale as you grow—no hidden fees.',
      ctaPrimary: 'View Full Pricing',
      freeTag: 'Free Forever',
      proTag: 'Most Popular',
      enterpriseTag: 'Custom Solutions'
    },
    partnerProgram: {
      title: 'Join the Partner Program',
      description: 'Earn recurring commissions by promoting VGOT.',
      commission: 'Up to 30% Commission',
      support: 'Dedicated Partner Support',
      resources: 'Marketing Assets Included',
      ctaPrimary: 'Become a Partner'
    },
    footer: {
      tagline: 'Empower e-commerce with AI video creation.',
      product: 'Product',
      features: 'Features',
      pricing: 'Pricing',
      useCases: 'Use Cases',
      company: 'Company',
      about: 'About Us',
      blog: 'Blog',
      careers: 'Careers',
      support: 'Support',
      help: 'Help Center',
      docs: 'Documentation',
      contact: 'Contact',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      rights: '© 2024 VGOT. All rights reserved.'
    }
  },
  'zh-CN': {
    pricing: pricingTranslations['zh-CN'],
    partner: partnerTranslations['zh-CN'],
    nav: {
      home: '首页',
      features: '功能',
      solutions: '解决方案',
      pricing: '定价',
      partner: '合作伙伴计划',
      help: '帮助',
      login: '登录',
      startFree: '免费试用'
    },
    hero: {
      badge: 'AI 视频创作平台',
      headline1: '一站式 AI 电商视频工作流',
      headline2: '秒级生成爆款电商视频',
      subheading: '从脚本生成到 SORA 视频再到数字讲解——VGOT 覆盖完整电商视频生产流程。',
      sellingPoint1: '免费脚本生成与提取',
      sellingPoint2: '智能一键提示词复制',
      sellingPoint3: '最快 10 分钟视频生成',
      sellingPoint4: 'AI 驱动 4K 画质增强',
      ctaPrimary: '免费开始创作',
      ctaSecondary: '查看定价',
      stats: '已获 10,000+ 创作者信任',
      videosGenerated: '已生成 2,000,000+ 视频'
    },
    trustLogos: { title: '获得领先平台信任' },
    features: {
      title: '告别复杂——用 AI 重新定义电商视频创作',
      subtitle: '从脚本构思到视频发布，VGOT 提供你所需的一切。',
      scriptGenerator: { title: '脚本大师', description: '自动从商品信息生成或智能提取热门视频脚本，灵感不断。' },
      soraVideo: { title: '智能提示词', description: '分析并抽取视频生成关键提示，轻松复刻成功。' },
      digitalExpert: { title: '长视频生成', description: '数字虚拟讲解助你打造评测 / 教学 / 讲解内容。' },
      videoTools: { title: '智能工具箱', description: '去背景、字幕、翻译、增强一站式完成。' }
    },
    painPoints: {
      title: '是否在为这些问题烦恼？',
      slowScript: { title: '脚本耗时', description: '每支视频要花数小时写脚本？AI 秒级生成。' },
      complexTools: { title: '工具繁杂', description: '多个平台来回切换？一站整合。' },
      poorQuality: { title: '质量不稳定', description: '画质差或讲解欠专业？AI 提升一致性。' },
      timeConsuming: { title: '后期耗时', description: '剪辑流程冗长？自动化最高缩短 90%。' }
    },
    useCases: {
      title: '适用于所有电商场景',
      productDemo: { title: '产品演示', description: '用清晰讲解展示核心卖点。' },
      unboxing: { title: '开箱视频', description: '快速生成吸引人的开箱内容。' },
      tutorial: { title: '使用教程', description: '结构化步骤教学提升留存。' },
      testimonial: { title: '客户故事', description: '把口碑转化为高质量视频。' },
      comparison: { title: '产品对比', description: '并列展示帮助决策。' },
      socialMedia: { title: '社交媒体广告', description: '一键优化适配 TikTok / Instagram / YouTube。' }
    },
    howItWorks: {
      title: '三步生成爆款视频',
      step1: { title: '输入或提取', description: '输入商品链接 / 上传参考 / 提取热门脚本。' },
      step2: { title: '定制与生成', description: '选择风格、声音、时长，SORA 快速生成。' },
      step3: { title: '增强与发布', description: '字幕 / 翻译 / 优化后直接发布。' }
    },
    valueProposition: {
      title: '为什么选择 VGOT',
      speed: { title: '快 10 倍', description: '传统方式数小时，这里几分钟。' },
      quality: { title: '专业画质', description: 'AI 增强 4K 输出 + 专业声音。' },
      cost: { title: '节省 80% 成本', description: '无需昂贵团队或多套软件。' },
      ease: { title: '零学习门槛', description: '界面简单即开用。' }
    },
    pricingTeaser: {
      title: '透明定价覆盖不同阶段',
      description: '免费开始，随成长灵活升级。',
      ctaPrimary: '查看完整定价',
      freeTag: '永久免费',
      proTag: '最受欢迎',
      enterpriseTag: '定制方案'
    },
    partnerProgram: {
      title: '加入合作伙伴计划',
      description: '推广 VGOT 获得循环分佣。',
      commission: '最高 30% 分佣',
      support: '专属支持',
      resources: '营销素材提供',
      ctaPrimary: '成为伙伴'
    },
    footer: {
      tagline: '用 AI 视频创作能力赋能你的电商业务。',
      product: '产品',
      features: '功能',
      pricing: '定价',
      useCases: '使用场景',
      company: '公司',
      about: '关于我们',
      blog: '博客',
      careers: '招聘',
      support: '支持',
      help: '帮助中心',
      docs: '文档',
      contact: '联系',
      legal: '法律',
      privacy: '隐私政策',
      terms: '服务条款',
      cookies: 'Cookie 政策',
      rights: '© 2024 VGOT. 保留所有权利。'
    }
  },
  'zh-TW': {
    pricing: pricingTranslations['zh-TW'],
    partner: partnerTranslations['zh-TW'],
    nav: {
      home: '首頁',
      features: '功能',
      solutions: '解決方案',
      pricing: '定價',
      partner: '合作夥伴計畫',
      help: '支援',
      login: '登入',
      startFree: '免費試用'
    },
    hero: {
      badge: 'AI 影片創作平台',
      headline1: '一站式 AI 電商影片工作流',
      headline2: '秒級生成爆款電商影片',
      subheading: '從腳本生成到 SORA 影片再到數位講解——VGOT 涵蓋完整電商影片製作流程。',
      sellingPoint1: '免費腳本生成與提取',
      sellingPoint2: '智慧一鍵提示詞複製',
      sellingPoint3: '最快 10 分鐘影片生成',
      sellingPoint4: 'AI 驅動 4K 畫質增強',
      ctaPrimary: '免費開始創作',
      ctaSecondary: '查看定價',
      stats: '獲得 10,000+ 創作者信任',
      videosGenerated: '已生成 2,000,000+ 影片'
    },
    trustLogos: { title: '獲得領先平台信賴' },
    features: {
      title: '告別複雜——用 AI 重新定義電商影片創作',
      subtitle: '從腳本構思到影片發佈，VGOT 提供你所需的一切。',
      scriptGenerator: { title: '腳本大師', description: '自動生成或智慧提取熱門影片腳本，靈感不斷。' },
      soraVideo: { title: '智慧提示詞', description: '分析並抽取影片生成關鍵提示，輕鬆複製成功。' },
      digitalExpert: { title: '長影片生成', description: '數位講解助你打造評測 / 教學 / 故事內容。' },
      videoTools: { title: '智慧工具箱', description: '去背、字幕、翻譯、增強一站式完成。' }
    },
    painPoints: {
      title: '是否為這些問題困擾？',
      slowScript: { title: '腳本耗時', description: '每支影片寫腳本需耗時？AI 秒級生成。' },
      complexTools: { title: '工具分散', description: '剪輯 / 字幕 / 特效多平台？統一整合。' },
      poorQuality: { title: '品質不穩定', description: '畫質差或講解不專業？AI 提升一致性。' },
      timeConsuming: { title: '後期冗長', description: '剪輯流程過長？自動化可縮短最高 90%。' }
    },
    useCases: {
      title: '適用於所有電商場景',
      productDemo: { title: '產品演示', description: '用清晰講解呈現核心賣點。' },
      unboxing: { title: '開箱影片', description: '快速生成吸睛開箱內容。' },
      tutorial: { title: '使用教學', description: '結構化步驟教學提升留存。' },
      testimonial: { title: '客戶故事', description: '將口碑轉化為高品質影片。' },
      comparison: { title: '產品對比', description: '並列展示協助決策。' },
      socialMedia: { title: '社群廣告', description: '一鍵優化 TikTok / Instagram / YouTube。' }
    },
    howItWorks: {
      title: '三步生成爆款影片',
      step1: { title: '輸入或提取', description: '輸入商品連結 / 上傳參考 / 提取熱門腳本。' },
      step2: { title: '自訂與生成', description: '選擇風格、聲音、時長，SORA 快速生成。' },
      step3: { title: '增強與發佈', description: '字幕 / 翻譯 / 優化後直接發佈。' }
    },
    valueProposition: {
      title: '為何選擇 VGOT',
      speed: { title: '快 10 倍', description: '傳統方式數小時，這裡僅需數分鐘。' },
      quality: { title: '專業畫質', description: 'AI 增強 4K 輸出 + 專業聲音。' },
      cost: { title: '節省 80% 成本', description: '不需昂貴團隊或多套工具。' },
      ease: { title: '零學習門檻', description: '介面直覺即開用。' }
    },
    pricingTeaser: {
      title: '透明定價支援不同階段',
      description: '免費開始，隨成長彈性升級。',
      ctaPrimary: '查看完整定價',
      freeTag: '永久免费',
      proTag: '最受歡迎',
      enterpriseTag: '客製方案'
    },
    partnerProgram: {
      title: '加入合作夥伴計畫',
      description: '推廣 VGOT 獲得循環分潤。',
      commission: '最高 30% 分潤',
      support: '專屬支援',
      resources: '行銷素材提供',
      ctaPrimary: '成為夥伴'
    },
    footer: {
      tagline: '以 AI 影片創作能力賦能你的電商業務。',
      product: '產品',
      features: '功能',
      pricing: '定價',
      useCases: '使用場景',
      company: '公司',
      about: '關於我們',
      blog: '部落格',
      careers: '職缺',
      support: '支援',
      help: '協助中心',
      docs: '文件',
      contact: '聯絡',
      legal: '法律',
      privacy: '隱私政策',
      terms: '服務條款',
      cookies: 'Cookie 政策',
      rights: '© 2024 VGOT. 保留所有權利。'
    }
  },
  es: {
    pricing: pricingTranslations.es,
    partner: partnerTranslations.es,
    nav: {
      home: 'Inicio',
      features: 'Características',
      solutions: 'Soluciones',
      pricing: 'Precios',
      partner: 'Programa de Socios',
      help: 'Ayuda',
      login: 'Iniciar sesión',
      startFree: 'Prueba Gratuita'
    },
    hero: {
      badge: 'Plataforma de Creación de Video con IA',
      headline1: 'Workflow Integral de Video E-Commerce con IA',
      headline2: 'Crea Videos Virales en Segundos',
      subheading: 'De la generación de guiones a videos SORA y narración experta—VGOT cubre todo tu flujo de video para e-commerce.',
      sellingPoint1: 'Creación y Extracción de Guiones Gratis',
      sellingPoint2: 'Duplicación Inteligente de Prompts',
      sellingPoint3: 'Generación Ultrarrápida (Hasta 10 Min)',
      sellingPoint4: 'Mejora de Calidad 4K con IA',
      ctaPrimary: 'Comienza Gratis',
      ctaSecondary: 'Ver Precios',
      stats: 'Confiado por 10,000+ creadores',
      videosGenerated: 'Más de 2M de videos generados'
    },
    trustLogos: { title: 'Confiado por plataformas líderes' },
    features: {
      title: 'Adiós a la Complejidad—Reinventa la Creación de Video E-Commerce con IA',
      subtitle: 'Ideación, generación, publicación: todo en uno.',
      scriptGenerator: { title: 'Maestro de Guiones', description: 'Genera automáticamente o extrae de videos populares.' },
      soraVideo: { title: 'Prompt Inteligente', description: 'Extrae prompts clave para replicar el éxito.' },
      digitalExpert: { title: 'Videos Largos Profesionales', description: 'Crea reseñas / tutoriales / storytelling con avatares digitales.' },
      videoTools: { title: 'Kit de Herramientas Inteligente', description: 'Subtítulos, traducción, mejora y más.' }
    },
    painPoints: {
      title: '¿Cansado de Estos Retos?',
      slowScript: { title: 'Guiones Lentos', description: '¿Horas escribiendo? La IA acelera el proceso.' },
      complexTools: { title: 'Herramientas Fragmentadas', description: 'Múltiples plataformas para tareas distintas? Unifica.' },
      poorQuality: { title: 'Calidad Inconsistente', description: '¿Metraje pobre o locución débil? Mejora con IA.' },
      timeConsuming: { title: 'Edición Demorada', description: 'Automatización reduce hasta 90% del tiempo.' }
    },
    useCases: {
      title: 'Perfecto para Cada Escenario',
      productDemo: { title: 'Demostraciones', description: 'Muestra características con narración clara.' },
      unboxing: { title: 'Unboxing', description: 'Genera contenido de apertura atractivo.' },
      tutorial: { title: 'Tutoriales', description: 'Guías paso a paso fáciles de seguir.' },
      testimonial: { title: 'Testimonios', description: 'Convierte opiniones en historias convincentes.' },
      comparison: { title: 'Comparaciones', description: 'Videos lado a lado para decidir.' },
      socialMedia: { title: 'Anuncios Sociales', description: 'Optimiza para TikTok / Instagram / YouTube.' }
    },
    howItWorks: {
      title: 'Tres Pasos Simples',
      step1: { title: 'Ingresar o Extraer', description: 'URL, referencias o extracción de guiones.' },
      step2: { title: 'Personalizar y Generar', description: 'Estilo, voz y duración; SORA crea rápido.' },
      step3: { title: 'Mejorar y Publicar', description: 'Subtítulos, traducción y distribución directa.' }
    },
    valueProposition: {
      title: 'Por Qué VGOT Destaca',
      speed: { title: '10x Más Rápido', description: 'Horas se convierten en minutos.' },
      quality: { title: 'Calidad de Estudio', description: 'Salida 4K mejorada con IA.' },
      cost: { title: 'Ahorro del 80%', description: 'Menos costes en producción y licencias.' },
      ease: { title: 'Cero Curva de Aprendizaje', description: 'Interfaz intuitiva desde el primer día.' }
    },
    pricingTeaser: {
      title: 'Precios Claros para Creadores',
      description: 'Empieza gratis y escala sin tarifas ocultas.',
      ctaPrimary: 'Ver Precios Completos',
      freeTag: 'Gratis para Siempre',
      proTag: 'Más Popular',
      enterpriseTag: 'Soluciones Personalizadas'
    },
    partnerProgram: {
      title: 'Únete al Programa de Socios',
      description: 'Gana comisiones recurrentes promocionando VGOT.',
      commission: 'Hasta 30% Comisión',
      support: 'Soporte Dedicado',
      resources: 'Materiales de Marketing Incluidos',
      ctaPrimary: 'Hazte Socio'
    },
    footer: {
      tagline: 'Impulsa tu e-commerce con creación de video impulsada por IA.',
      product: 'Producto',
      features: 'Características',
      pricing: 'Precios',
      useCases: 'Casos de Uso',
      company: 'Compañía',
      about: 'Acerca de',
      blog: 'Blog',
      careers: 'Carreras',
      support: 'Soporte',
      help: 'Centro de Ayuda',
      docs: 'Documentación',
      contact: 'Contacto',
      legal: 'Legal',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      cookies: 'Política de Cookies',
      rights: '© 2024 VGOT. Todos los derechos reservados.'
    }
  }
};

