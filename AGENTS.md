# 仓库指南

## 项目结构与模块组织

这是一个基于 React 18 和 `react-app-rewired` 构建的作品集应用。应用代码位于 `src/`。路由配置在 `src/router.js`，顶层应用装配在 `src/App.js` 和 `src/index.js`。可复用 UI 放在 `src/components/`，页面级视图放在 `src/views/<view-name>/`，并将对应的局部 CSS 放在各视图旁边。共享全局样式位于 `src/globals.css`。静态图片、图标和 SVG 存放在 `src/assets/`；浏览器公开资源存放在 `public/`。

## 构建、测试与开发命令

- `npm start` - 通过 `react-app-rewired` 启动本地开发服务器。
- `pnpm start` - 通过 `react-app-rewired` 启动本地开发服务器。
- `pnpm test` - 以 watch 模式运行 Jest 和 React Testing Library。
- `pnpm build` - 在 `build/` 中生成生产构建产物。
- `pnpm install` - 根据 `pnpm-lock.yaml` 安装依赖。

优先使用 pnpm 命令，因为该仓库包含 `pnpm-lock.yaml`；除非明确要切换包管理器，否则避免混用并产生其他 lockfile 更新。

## Cloudflare 部署与更新

该项目通过 Cloudflare Workers Static Assets 发布，Worker 名称为 `vintage-vibe`，部署配置以仓库根目录的 `wrangler.jsonc` 为准。`pnpm build` 生成 `build/`，Wrangler 将该目录作为静态资源上传，并使用 `single-page-application` 回退支持 `/home`、`/about` 等客户端路由。

Cloudflare Workers Builds 当前使用以下配置：

- 构建命令：`pnpm build`。
- 生产部署命令：`npx wrangler deploy`。
- 非生产分支版本命令：`npx wrangler versions upload`。
- 生产分支：`refactor`。
- 非生产分支构建：启用。

推送到 `refactor` 时，Cloudflare 依次执行构建命令和生产部署命令，并更新正式 `workers.dev` 地址。推送到其他分支时，Cloudflare 依次执行构建命令和版本命令，只生成可供验证的预览版本，不应覆盖当前生产部署。合并功能分支到 `refactor` 后的推送才会触发正式更新。

本地检查 Cloudflare 部署内容时，先执行 `pnpm build`，再执行 `pnpm exec wrangler deploy --dry-run`；本地优先使用 `pnpm exec` 以确保调用锁文件安装的 Wrangler。只有用户明确要求实际发布时，才执行 `pnpm exec wrangler deploy`；不要把真实部署命令当作普通验证步骤，也不要在未获授权时推送分支。

`public/audio/` 是被 Git 忽略的本地媒体目录。手动执行 `pnpm build` 会将其复制到 `build/audio/`，随后通过本地 `pnpm exec wrangler deploy` 可把音频与网页临时发布到同一个 Worker。部署前应确认 `build/audio/` 存在并抽查目标文件。由于 GitHub 自动构建无法取得这些未跟踪音频，后续任何基于远程仓库的自动部署都会发布一个不含本地音频的新版本；因此这种方式只适合临时演示，不能视为持久音频托管方案。

部署验证至少包括：生产构建成功、Wrangler dry-run 成功、站点根路径可访问、直接访问 `/home` 和 `/about` 不返回 404；若本次为包含本地音频的手动部署，还要验证至少一个 `/audio/...` 地址可以播放。

## 编码风格与命名约定

沿用现有 React 函数组件模式，并保持组件小而明确。导出可复用组件的文件使用 PascalCase 命名，例如 `System.jsx`；路由视图保持 `src/views/<name>/index.jsx` 结构。使用 2 空格缩进、单一职责函数和清晰的 prop 命名。除非规则确实属于全局样式，否则 CSS 应靠近其所服务的组件或视图。项目使用 Create React App 的 ESLint 预设：`react-app` 和 `react-app/jest`。

## 测试指南

测试使用 Jest、React Testing Library 和 `@testing-library/jest-dom`，并通过 `src/setupTests.js` 配置。将聚焦的测试放在其覆盖行为附近，遵循现有 `*.test.js` 模式，例如 `src/App.test.js`。测试可见行为和用户交互，而不是实现细节。提交前运行 `pnpm test`；如需本地一次性检查，使用 `CI=true pnpm test --watchAll=false`。

## 提交与 Pull Request 指南

近期提交使用 emoji 加带范围的 conventional-style 消息，例如 `:sparkles: feat(components): taskbar component.` 或 `:truck: mv(components): move Taskbar`。提交信息应简短、使用祈使语气，并限定在变更区域内。Pull Request 应包含简要摘要；若涉及 UI 变更，应附截图或录屏；有相关 issue 时应链接，并说明已运行的测试或构建命令。

## 安全与配置提示

不要提交密钥或机器特定配置。自定义构建变更应保留在 `config-overrides.js` 中；在依赖任何新的环境变量前，先在 README 中记录它们。

用户明确提供并批准用于功能开发的本地媒体素材，不应在后续实现过程中重复以素材权限问题阻塞开发；除非用户主动要求，否则不额外开展发布授权审查。

Vaporwave Radio 的全局声音默认开启，并保持 25% 的低初始音量，确保用户首次点击播放即可听到音乐；相关设置文案与测试必须保持一致。

## 回归验证规则

- 修复窗口尺寸或布局问题时，必须分别验证普通、手动缩放、最大化和紧凑模式，并确认 `react-draggable` 外框、可见窗口、内容区及缩放手柄的几何关系一致；不能只依据最大化状态宣告问题已解决。
- 修复多窗口焦点或层级问题时，必须在窗口发生重叠的场景下分别验证点击底层窗口内容区和拖动其标题栏都能将该窗口置于顶层，并核对活动窗口状态与实际 `z-index` 一致。
- 在 React95 控件中加入自定义预览、图标或装饰性子元素时，必须在真实浏览器中检查其计算样式和几何尺寸，确认组件库样式没有将其压缩为零宽度或覆盖预期布局。
- 不应把缺少明显、可验证运行时效果的配置项暴露给用户；新增设置前必须确认各选项之间存在可观察差异，并为该差异提供行为测试。

## Agent skills

### Issue tracker

Issues and PRDs are tracked in this repository's GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the canonical `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix` labels. See `docs/agents/triage-labels.md`.

### Domain docs

This repository uses a single-context domain documentation layout. See `docs/agents/domain.md`.
