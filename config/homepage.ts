export interface FeatureItem {
  icon: string
  title: string
  description: string
}

export interface HeroSection {
  title: string
  subtitle: string
  description: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton: {
    text: string
    href: string
  }
}

export interface HomepageConfig {
  hero: HeroSection
  features: FeatureItem[]
  examples: {
    title: string
    description: string
    codeExample: string
    mathExample: string
  }
  cta: {
    title: string
    description: string
    buttonText: string
    buttonHref: string
  }
  footer: {
    copyright: string
  }
}

export const homepageConfig: HomepageConfig = {
  hero: {
    title: "现代化文档系统",
    subtitle: "基于 Next.js 构建的高性能文档框架",
    description: "支持 Markdown、LaTeX、代码高亮、智能搜索等功能，让您专注于内容创作。",
    primaryButton: {
      text: "开始阅读",
      href: "/docs",
    },
    secondaryButton: {
      text: "查看文档",
      href: "/docs",
    },
  },
  features: [
    {
      icon: "BookOpen",
      title: "Markdown 支持",
      description: "完整支持 GitHub Flavored Markdown，包括表格、代码块、任务列表等",
    },
    {
      icon: "Code",
      title: "LaTeX 数学公式",
      description: "内置 KaTeX 支持，轻松编写和渲染复杂的数学公式",
    },
    {
      icon: "Search",
      title: "智能搜索",
      description: "全文搜索功能，支持内容高亮和快速跳转",
    },
    {
      icon: "Palette",
      title: "暗黑模式",
      description: "优雅的明暗主题切换，保护您的眼睛",
    },
    {
      icon: "Zap",
      title: "GSAP 动画",
      description: "流畅的页面动画和交互效果，提升用户体验",
    },
    {
      icon: "Globe",
      title: "中文优化",
      description: "针对中文内容优化的排版和字体渲染",
    },
  ],
  examples: {
    title: "支持丰富的内容格式",
    description: "从简单的文本到复杂的数学公式，一切都能完美呈现",
    codeExample: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    mathExample: "E = mc²",
  },
  cta: {
    title: "开始创建您的文档",
    description: "只需几分钟即可搭建专业的文档网站，让知识分享变得更简单",
    buttonText: "立即开始",
    buttonHref: "/docs",
  },
  footer: {
    copyright: "© 2024 文档系统. 基于 Next.js 构建，开源免费使用。",
  },
}
