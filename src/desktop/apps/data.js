export const careerProfile = {
  name: '邹定一',
  title: 'Frontend Systems Engineer',
  location: '成都，中国',
  experience: '8 年',
  summary:
    '专注复杂业务系统、前端架构与工程效率，具备 React / Vue 双技术栈和从 0 到 1 的交付经验。能够覆盖技术选型、组件体系、工程规范与跨端产品落地。',
  github: 'https://github.com/zoudingyi',
  email: 'mailto:18483641399@163.com'
};

export const technicalStack = [
  {
    id: 'interface',
    index: '01',
    title: 'Interface Systems',
    description: '面向复杂交互与长期演进的组件化前端。',
    technologies: ['React', 'Vue 2 / 3', 'TypeScript', 'JavaScript', 'Sass / Less']
  },
  {
    id: 'architecture',
    index: '02',
    title: 'Architecture',
    description: '从应用边界、渲染策略到状态模型的系统设计。',
    technologies: [
      'Next.js / SSR',
      '微前端',
      '模块化 SPA',
      'Zustand / Redux',
      'Pinia / Vuex'
    ]
  },
  {
    id: 'engineering',
    index: '03',
    title: 'Engineering',
    description: '围绕交付质量、构建效率与团队协作完善工程链路。',
    technologies: [
      'Vite / Webpack',
      'Node.js',
      'Git',
      'ESLint / Prettier',
      'CI / CD'
    ]
  },
  {
    id: 'delivery',
    index: '04',
    title: 'Product Delivery',
    description: '覆盖企业后台、数据可视化与多终端业务场景。',
    technologies: [
      '管理系统',
      '移动 H5',
      '微信小程序',
      'ECharts',
      'OAuth2'
    ]
  }
];

export const workExperience = [
  {
    company: '成都直新科技有限公司',
    department: '研发部',
    period: '2021.03 — 2024.06',
    role: '前端工程师',
    summary:
      '负责海外营销业务系统的前端开发、管理与重构，并承担系统模板、组件库和脚手架的架构与落地。',
    highlights: [
      '推动 Vue 3 + Vite 管理系统模板与通用组件体系建设',
      '参与前端技术选型、技术支持、规范及使用文档建设',
      '交付企业内部 AI 应用，覆盖多模型、知识库与 OAuth2 登录'
    ]
  },
  {
    company: '成都区融未来网络科技有限公司',
    department: '迪富项目组',
    period: '2020.03 — 2021.02',
    role: '前端工程师',
    summary:
      '参与数字资产交易平台及后台管理系统的持续迭代、维护与重构，支持 React 与 Vue 技术栈。',
    highlights: [
      '负责交易与管理端业务功能的开发和性能优化',
      '使用 ECharts 实现 K 线等金融数据可视化',
      '协同维护 TypeScript、Redux、Webpack 工程体系'
    ]
  },
  {
    company: '四川萃菁池科技有限公司',
    department: '研发部',
    period: '2018.05 — 2020.03',
    role: '前端工程师',
    summary:
      '参与智慧校园产品的管理端与 H5 微服务开发，为多所高校提供面向师生的移动信息化服务。',
    highlights: [
      '维护 8 个管理端及 15+ 个运行于校园 App 的 H5 微服务',
      '参与 TFinfo 与移动智慧校园核心产品的持续交付',
      '覆盖 Vue、Vuex、ECharts、Webpack 与 Node.js 脚本开发'
    ]
  }
];

export const projects = [
  {
    id: 'vintage-vibe',
    name: 'Vintage Vibe',
    category: 'PERSONAL SYSTEM',
    period: '2024 — NOW',
    role: '设计与开发',
    summary:
      '一个可交互的复古桌面作品集，将窗口管理、状态持久化、主题系统、浏览器和音频播放器组织为统一体验。',
    status: '持续迭代',
    stack: 'React, react95, styled-components, Jest, Web Audio API',
    highlights: [
      '基于 reducer 管理窗口生命周期、焦点、层级与布局',
      '支持多主题、桌面设置、本地会话恢复与响应式紧凑模式'
    ],
    github: 'https://github.com/zoudingyi/vintage-vibe',
    linkLabel: 'OPEN GITHUB'
  },
  {
    id: 'zhixin-assistant',
    name: '直新小助',
    category: 'ENTERPRISE AI',
    period: '2023.11 — 2024.05',
    role: '核心开发者',
    summary:
      '企业私有化部署的 AI Web 应用，接入 Claude、GPT-4 与 Gemini Pro，并结合内部知识库提供业务能力。',
    status: '企业内部交付',
    stack: 'Next.js, TypeScript, App Router, Zustand, SWR, Sass, OAuth2',
    highlights: [
      '负责 PC 与移动端的功能开发、迭代和个性化能力定制',
      '通过 OAuth2 接入企业身份体系，组织多模型与知识库交互'
    ]
  },
  {
    id: 'management-system',
    name: '系统模板与通用组件',
    category: 'DESIGN SYSTEM',
    period: '2022.03 — 2024.02',
    role: '独立开发者',
    summary:
      '面向内部业务系统的 Vue 3 前端模板与可复用组件库，统一工程基线、交互模式和开发体验。',
    status: '多系统复用',
    stack: 'Vue 3, Pinia, Vue Router, Element Plus, Vite, Sass, Axios',
    highlights: [
      '支持按需加载、自动导入和统一代码规范，降低新项目启动成本',
      '将表单与表格二次封装为 JSON 配置式组件并配套文档'
    ],
    demo: 'https://zoudingyi.github.io/manage-system-docs/',
    linkLabel: 'OPEN DOCUMENTATION'
  },
  {
    id: 'difu',
    name: '迪富数字资产平台',
    category: 'FINTECH PLATFORM',
    period: '2020.03 — 2021.02',
    role: '核心开发者',
    summary:
      '支持现货、合约与资产管理的数字资产交易平台，包含用户侧产品和后台运营系统。',
    status: '业务迭代与重构',
    stack: 'React, TypeScript, Ant Design, Redux, ECharts, Webpack',
    highlights: [
      '负责存量项目优化、后台重构与持续功能迭代',
      '实现 K 线及交易数据可视化，服务高信息密度业务场景'
    ]
  },
  {
    id: 'smart-campus',
    name: '移动智慧校园',
    category: 'EDTECH PLATFORM',
    period: '2018.05 — 2020.03',
    role: '核心开发者',
    summary:
      '以校园 App 为入口、由多个 H5 微服务组成的高校信息化平台，覆盖管理、教务、办公与校园生活。',
    status: '多高校稳定运行',
    stack: 'Vue, Vuex, Vue Router, iView, ECharts, Webpack, Node.js',
    highlights: [
      '负责 8 个管理端与 15+ 个 H5 微服务的开发和维护',
      '适配多所高校业务场景，支持一个 App 承载多个服务模块'
    ]
  }
];
