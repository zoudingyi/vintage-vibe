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

## 编码风格与命名约定

沿用现有 React 函数组件模式，并保持组件小而明确。导出可复用组件的文件使用 PascalCase 命名，例如 `System.jsx`；路由视图保持 `src/views/<name>/index.jsx` 结构。使用 2 空格缩进、单一职责函数和清晰的 prop 命名。除非规则确实属于全局样式，否则 CSS 应靠近其所服务的组件或视图。项目使用 Create React App 的 ESLint 预设：`react-app` 和 `react-app/jest`。

## 测试指南

测试使用 Jest、React Testing Library 和 `@testing-library/jest-dom`，并通过 `src/setupTests.js` 配置。将聚焦的测试放在其覆盖行为附近，遵循现有 `*.test.js` 模式，例如 `src/App.test.js`。测试可见行为和用户交互，而不是实现细节。提交前运行 `pnpm test`；如需本地一次性检查，使用 `CI=true pnpm test --watchAll=false`。

## 提交与 Pull Request 指南

近期提交使用 emoji 加带范围的 conventional-style 消息，例如 `:sparkles: feat(components): taskbar component.` 或 `:truck: mv(components): move Taskbar`。提交信息应简短、使用祈使语气，并限定在变更区域内。Pull Request 应包含简要摘要；若涉及 UI 变更，应附截图或录屏；有相关 issue 时应链接，并说明已运行的测试或构建命令。

## 安全与配置提示

不要提交密钥或机器特定配置。自定义构建变更应保留在 `config-overrides.js` 中；在依赖任何新的环境变量前，先在 README 中记录它们。

## 回归验证规则

- 修复窗口尺寸或布局问题时，必须分别验证普通、手动缩放、最大化和紧凑模式，并确认 `react-draggable` 外框、可见窗口、内容区及缩放手柄的几何关系一致；不能只依据最大化状态宣告问题已解决。

## Agent skills

### Issue tracker

Issues and PRDs are tracked in this repository's GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the canonical `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix` labels. See `docs/agents/triage-labels.md`.

### Domain docs

This repository uses a single-context domain documentation layout. See `docs/agents/domain.md`.
