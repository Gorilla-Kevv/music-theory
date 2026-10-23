# HANDOFF

## 项目

- 路径：`f:\schoolCompWorks\clone\music-theory`
- 技术栈：Vite 6 + React 18 + TypeScript + Tailwind CSS v4；VexFlow 4、MiniSearch、React Router 6；Web Audio API 合成音频。
- 当前分支：`dev`
- 环境路径：
  - Node：`C:\Program Files\nodejs\node.exe`（v24.16.0）
  - npm：11.13.0
  - 本地开发：`http://127.0.0.1:5173/`
  - 预览：`npm run preview` → `http://127.0.0.1:4173/`
  - Chrome：`C:\Program Files\Google\Chrome\Application\chrome.exe`
  - Edge：`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

## 分支清单

- `dev`：唯一分支，首版开发与提交所在分支。尚无 `main`；是否建立稳定分支由用户决定。

## 目标

- 目标：本地优先的个人乐理强化工作台；检索、可听谱例、章节级引用、间隔复习与 Agent 查询共用一套知识 schema。
- 非目标（首版）：账户/云同步、全量乐理教材、音频采样库、stdio MCP server、FL Studio 原生插件。

## 结构

- 关键目录：
  - `src/content/`：知识事实源（24 概念、29 谱例、76 条引用）。
  - `src/lib/`：音频、搜索、SRS、听辨、音符/谱面工具、Agent API。
  - `src/components/`：外壳、检索面板、五线谱、钢琴、谱例、试听坞。
  - `src/routes/`：`/`、`/library`、`/theory/:slug`、`/drill`、`/references`、`/agent`。
  - `scripts/`：知识包构建与 CLI。
  - `public/knowledge.json`：构建时生成的 Agent 知识包。
- 入口文件：`src/main.tsx`、`src/App.tsx`、`index.html`。
- 核心接口：
  - `src/lib/theory-api.ts`：`searchTheory`、`listExamples`、`getRelated`、`getReviewQueue`、`buildKnowledgePack`、`TOOL_SCHEMAS`。
  - `src/lib/audio.ts`：`AudioEngine.play/stop/replay/setTempo/toggleLoop/previewNote`。
  - `src/lib/search.ts`：CJK bigram + Latin token 的 MiniSearch，精确短语优先。
  - `src/lib/review.ts`：SM-2 轻量实现；localStorage key `tonic.review.v1`。
  - `src/lib/ear.ts`：听辨题生成与 `tonic.ear.v1` 统计。
- 数据模型：`src/content/types.ts`（Concept / Section / Example / CitationRef / BibliographyEntry）。

## 决策与坑

- 引用采用**章节级定位**，不写页码：三本书有多个版次/译本，页码会漂移。书目与章目已通过 OUP 官方目录、图书馆书目记录核对；不要为了“看起来更学术”而补造页码。
- `BrowserRouter` 需要 SPA fallback。直接双击 `dist/index.html` 会失败；用 `npm run dev` 或 `npm run preview`，静态托管需把未知路径重写到 `index.html`。
- 音频必须由用户手势触发；无外部采样，全部 Web Audio 合成。Chrome headless 截图测试需 `--autoplay-policy=no-user-gesture-required` 才能稳定观察播放态。
- VexFlow 包体较大（约 311KB gzip）。`vite.config.ts` 已按 `react / vexflow / search` 拆 vendor chunk；首页仍会加载 VexFlow，因为 hero 谱例是核心证明。
- Chrome headless 的 `--window-size=375` 实际最小布局宽度为 500，不能用来验证 375。使用 `.impeccable/capture.mjs` 的 CDP `Emulation.setDeviceMetricsOverride`；截图已按 375/768/1280 生成。
- npm 缓存已改到项目内 `.npm-cache`（被 gitignore），避免沙箱拒绝写入 `D:\DevCache`。
- 搜索对中文使用单字 + bigram 索引；同时用“精确短语优先”收窄结果（例如“五度圈”返回 2 条而不是 17 条）。修改检索逻辑时同时验证中文、英文、和弦记号三类查询。
- 引用上标用 `CitedText` 把末 4 字与上标包在 `whitespace-nowrap` 内，避免 `[1]` 单独掉到下一行。
- 移动端菜单与检索面板都做了焦点陷阱与 Escape 关闭；新增模态层请沿用。

## 命令

- 安装：`npm install`（缓存已指向项目内 `.npm-cache`）
- 开发：`npm run dev`
- 构建：`npm run build`（`prebuild` 自动刷新 `public/knowledge.json`）
- 预览：`npm run preview`
- 类型检查：`npm run typecheck`
- 知识包：`npm run knowledge`
- CLI：`npm run theory -- search "三全音替代" --json`
- CLI 复习队列：`npm run theory -- queue --state ./tonic-review-state.json --json`
- UI 检测：`impeccable detect --json src index.html`（当前返回 `[]`）

## 状态

- 当前状态：v0.1 垂直切片完成；24 概念 / 29 谱例 / 76 条引用；构建通过；三视口无横向溢出；播放、检索、复习、听辨、Agent API 均已实测。
- 验收标准：
  - `npm run typecheck` 与 `npm run build` 通过。
  - `/` 可在 375/768/1280 正常渲染；hero 谱例可播放并高亮琴键。
  - `/theory/ii-v-i` 含引用上标、页末注释、谱例、相关概念。
  - `/drill` 可完成“显示答案 → 评分 → 下一卡”，并写入 localStorage。
  - `/library` 检索“五度圈”返回精确结果；清空恢复 24 条。
  - `/agent` 可导出学习状态；`window.TONIC` 与 CLI 可查询同一知识包。
- 下一步：
  1. 需要时新增 stdio MCP server，直接复用 `TOOL_SCHEMAS` 与 `theoryApi`。
  2. 按 `src/content` schema 扩充概念；同时更新 `PRODUCT.md` 的版本说明。
  3. FL Studio 侧读取 `public/knowledge.json` 的事件级音符，或调用 CLI 的 `--json` 输出。
  4. 若要精确页码，按用户手头版本补 `CitationRef.locator`，不要批量猜。
- 本次文档更新时间：10.23 18:42 BY TraeCode
