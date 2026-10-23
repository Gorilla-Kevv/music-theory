# HANDOFF

## 项目

- 路径：`f:\schoolCompWorks\clone\music-theory`
- 技术栈：Vite 6 + React 18 + TypeScript + Tailwind CSS v4；VexFlow 4、MiniSearch、React Router 6；Web Audio API + 本地 Salamander 钢琴采样（C3–C5，合成器回退）。
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
- 非目标（当前）：账户/云同步、全量教材正文、stdio MCP server、FL Studio 原生插件。

## 结构

- 关键目录：
  - `src/content/`：知识事实源（44 概念、53 谱例、166 条引用、44 条白话拆解）。
  - `src/content/graph/`：体系图谱数据（3 来源 / 6 枢纽 / 44 概念 / 108 关联 / 34 前置）。
  - `src/content/bilibili.ts`：B 站课程调研台账（5 合集/板块 · 112 条视频与文章 / 20 条已读 / 92 条仅编目）。
  - `src/content/books/`：三本书的 118 个章目与 85 条原创章节笔记（Levine 24 / Laitz 34 / Sposobin 27），其中 Levine 24/24、Laitz 34/34 带深度归纳。
  - `src/lib/`：音频（采样 + 合成回退）、搜索、SRS、听辨、音符/谱面工具、Agent API。
  - `src/components/`：外壳、检索面板、五线谱（可点击命中区）、钢琴、谱例、可视化、试听坞。
  - `src/routes/`：`/`、`/library`、`/books`、`/atlas`、`/theory/:slug`、`/drill`、`/references`、`/agent`。
  - `src/hooks/`：左轨章节大纲的 scroll spy。
  - `scripts/`：知识包构建与 CLI。
  - `public/knowledge.json`：构建时生成的 Agent 知识包。
  - `public/audio/salamander/`：Salamander 钢琴采样子集与 `LICENSE.txt`。
- 入口文件：`src/main.tsx`、`src/App.tsx`、`index.html`。
- 核心接口：
  - `src/lib/theory-api.ts`：`searchTheory`、`listExamples`、`getRelated`、`searchSources`、`getBookOutline`、`getSourceNote`、`getConceptSources`、`getReviewQueue`、`buildKnowledgePack`、`TOOL_SCHEMAS`。
  - `src/content/graph/index.ts`：`ATLAS_GRAPH`、`ATLAS_HUBS`、`ATLAS_STATS`、`getConceptHubs`、`getPrerequisites`、`getNextConcepts`。
  - `src/content/bilibili.ts`：`BILIBILI_COLLECTIONS`（合集元数据 + 板块）、`BILIBILI_VIDEOS`、`getBilibiliVideo`；`theoryApi.videos({ status, query, theme, collection })` 与 CLI `videos` 查询同一台账；专栏文章用 `kind: "article"` + CV 号。
  - `src/lib/audio.ts`：`AudioEngine.play/stop/replay/setTempo/toggleLoop/previewNote/previewChord/previewSequence/preloadSamples`。
  - `src/lib/search.ts`：CJK bigram + Latin token 的 MiniSearch，精确短语优先。
  - `src/lib/review.ts`：SM-2 轻量实现；localStorage key `tonic.review.v1`。
  - `src/lib/ear.ts`：听辨题生成与 `tonic.ear.v1` 统计。
- 数据模型：`src/content/types.ts`（Concept / Section / Example / CitationRef / BibliographyEntry / HarmonyDimension / VisualizationKind）；`src/content/books/types.ts`（BookOutline / BookChapter / NoteSeed）。

## 决策与坑

- 引用采用**章节级定位**，不写页码：三本书有多个版次/译本，页码会漂移。书目与章目已通过 OUP 官方目录、图书馆书目记录核对；不要为了“看起来更学术”而补造页码。
- 书库是**完整章目 + 原创笔记**，不是教材电子版：不得 OCR、扫描或整段复制正文。新增 `books/*.ts` 笔记时只写原创摘要、关键点、概念映射与维度。
- 谱面点击命中区来自 VexFlow `StaveNote.getBoundingBox()`，按行叠加 `rowIndex * 150`；如果改 `ROW_HEIGHT` 或给 SVG 加缩放，需要同步修正命中区坐标。命中区按钮是透明绝对定位按钮，可用 Tab 与 Enter。
- 钢琴采样：Salamander Grand Piano V3（Alexander Holm，CC BY 3.0）本地子集；文件名 `C3, Ds3, Fs3, A3, C4, Ds4, Fs4, A4, C5`。首次用户手势预取，`ensureSamples` 解码后使用；失败自动回退合成器。替换/新增采样必须保留许可文件。
- 概念页 `ON THIS PAGE` 在右栏深色卡片（`max-h-[46vh]` 内部滚动），用 `useActiveSection` 的 45% 视口阈值；当前项用 `scrollIntoView({block:'nearest'})` 在卡片内部滚动，避免页面跳动。左侧栏 CATALOG 当前分类下嵌概念目录，chevron 按钮折叠（状态存 localStorage `tonic.rail.catalog.v1`），折叠不会误伤非当前分类；导航+目录区在 `dark-scroll` 容器内滚动。分类高亮同时服务于概念页与 `/library?category=`；目录项只在当前概念页高亮（`isCurrent`）。
- `BrowserRouter` 需要 SPA fallback。直接双击 `dist/index.html` 会失败；用 `npm run dev` 或 `npm run preview`，静态托管需把未知路径重写到 `index.html`。
- 音频必须由用户手势触发；当前使用本地 Salamander 采样 + Web Audio 合成回退，无运行时外网请求。Chrome headless 截图测试需 `--autoplay-policy=no-user-gesture-required` 才能稳定观察播放态。
- 采样解码是异步的：`play` 会先进入 playing 态并在 `ensureSamples` 完成后调度；如果采样加载失败，`playPreparedVoice` 自动走合成器。不要把这个回退删掉。
- VexFlow 包体较大（约 311KB gzip）。`vite.config.ts` 已按 `react / vexflow / search` 拆 vendor chunk；首页仍会加载 VexFlow，因为 hero 谱例是核心证明。
- Chrome headless 的 `--window-size=375` 实际最小布局宽度为 500，不能用来验证 375。使用 `.impeccable/capture.mjs` 的 CDP `Emulation.setDeviceMetricsOverride`；截图已按 375/768/1280 生成。
- npm 缓存已改到项目内 `.npm-cache`（被 gitignore），避免沙箱拒绝写入 `D:\DevCache`。
- 搜索对中文使用单字 + bigram 索引；同时用“精确短语优先”收窄结果（例如“五度圈”返回 2 条而不是 17 条）。修改检索逻辑时同时验证中文、英文、和弦记号三类查询。
- 引用上标用 `CitedText` 把末 4 字与上标包在 `whitespace-nowrap` 内，避免 `[1]` 单独掉到下一行。
- 概念页的白话拆解 `deepDive` 由 `CONCEPTS` 在 `src/content/index.ts` 自动合并；`collectCitations` 同时收集 deep dive 引用，所以页末注释会包含白话段落的来源。新增 deep dive 时不要绕过 `cite()`。
- 体系图布局是“4 列网格 + 6 个系统枢纽”的 MLP 式分层：概念坐标由 `conceptPosition` 生成，改行距/列距时要同步检查 SVG 底部图例（`ATLAS_HEIGHT` 1000，图例在 y=968）与标签截断（`truncate` 默认 8 字）。
- 图谱边语义固定：`source` 来源支撑、`system` 体系归属、`related` 概念关联、`prerequisite` 学习前置；`SOURCE_HUBS` 只连接实际相关的来源与枢纽，不要恢复成“每本书连所有枢纽”的噪声图。`/atlas?focus=<slug>` 是概念页“在体系图中查看”的深链。
- 长按发声：`AudioEngine.holdStart/holdEnd` 独立于 `bus`（走 `holdBus` → dry/reverb），所以示例播放/停止不会切断长按；引擎强制最短发声 0.35s、松手 ~0.3s 淡出，合成回退有 8s 硬上限防无限延音。命中区/琴键用 pointer 事件（按下/抬起/移出/取消），键盘激活靠 click `detail===0` 区分；`useHeldPreview` hook 以 key 管理多个 hold，release 对未按住的 key 是 no-op。CDP 测试用 `.impeccable/hold-check.mjs`（注意先 `scrollIntoView`，否则坐标在视口外）。
- 移动端菜单与检索面板都做了焦点陷阱与 Escape 关闭；新增模态层请沿用。

## 命令

- 安装：`npm install`（缓存已指向项目内 `.npm-cache`）
- 开发：`npm run dev`
- 快速启动：双击项目根 `start.bat`（首次运行自动安装依赖；已运行时直接打开；`TONIC_NO_OPEN=1` 可只启动服务不打开浏览器）
- 构建：`npm run build`（`prebuild` 自动刷新 `public/knowledge.json`）
- 预览：`npm run preview`
- 类型检查：`npm run typecheck`
- 知识包：`npm run knowledge`
- CLI：`npm run theory -- search "三全音替代" --json`
- CLI 书库：`npm run theory -- books` / `npm run theory -- source levine-13` / `npm run theory -- sources "转调" --book sposobin --dimension relationship`
- CLI 复习队列：`npm run theory -- queue --state ./tonic-review-state.json --json`
- UI 检测：`impeccable detect --json src index.html`（当前返回 `[]`）

## 状态

- 当前状态：v0.3 进行中；44 概念 / 53 谱例 / 166 条引用 / 44 条白话拆解；B 站台账 5 合集/板块 · 112 条视频与文章 / 20 条已读；3 本书 118 章目 / 85 条原创章节笔记（Levine 24/24、Laitz 34/34 带深度归纳）；`/atlas` 体系图谱；构建通过；三视口无横向溢出；谱面点击、钢琴、长按发声、五度圈/调式轮/半音尺/张力光谱/相邻属和弦路径、检索、复习、听辨、书库、体系图、Agent API 均已实测。
- 验收标准：
  - `npm run typecheck` 与 `npm run build` 通过。
  - `/` 可在 375/768/1280 正常渲染；hero 谱例可播放并高亮琴键。
  - `/theory/ii-v-i` 含引用上标、页末注释、可点击谱面、相关概念；右栏有深色 ON THIS PAGE 卡片且随滚动高亮；左栏 CATALOG 当前分类展开概念目录，可点击收起/展开（状态持久化）。
  - `/theory/circle-of-fifths` 的五度圈可点击扇区、试听、切大调/关系小调；左轨分类高亮“基础”。
  - `/books` 可切换三本书、按维度筛选、浏览 118 个章目与 85 条笔记；Levine/Laitz 章节显示深入归纳、跨书对应与常见误解。
  - `/theory/modal-characteristics` 显示五条调式谱例（D Dorian / E Phrygian / F Lydian / G Mixolydian / A Aeolian，共用 C 大调集合）。
  - `/theory/non-functional-dominants` 的相邻属和弦路径可视化可点击节点试听、播放整条进行；橙线为相邻上行，钴蓝线为下行五度。
  - `/atlas` 可筛选分类/维度、悬停/点击节点追踪邻域，并从概念页深链到指定节点。
  - `/drill` 可完成“显示答案 → 评分 → 下一卡”，并写入 localStorage。
  - `/library` 检索“五度圈”返回精确结果；清空恢复 44 条。
  - `/references` 台账显示 4 个合集卡片（爵士和声理论 / 学院派爵士理论 / 风格化创作 / 合集外公开课）与 19 条已读（含 VIA subtitle/asr/frames 标记）。
  - `/theory/melodic-minor-modes` 渲染 J-13 概念页（七调式代表和弦、C 旋律小调谱例、白话拆解、图谱前置）。
  - `/agent` 可导出学习状态；`window.TONIC` 与 CLI 可查询同一知识包与书库。
- 下一步：
  1. 继续深度内容：补 Sposobin 剩余章节笔记与深度字段（9.6）；为 Levine/Laitz 剩余章节补 `confusions`（9.7）。逐调式谱例已完成（阶段 11）。
  2. 体系图第二阶段：增加“学习路径/前置链”筛选与章节级来源高亮；保持现有边语义，不把图变成装饰。
  3. 需要时新增 stdio MCP server，直接复用 `TOOL_SCHEMAS` 与 `theoryApi`。
  4. FL Studio 侧读取 `public/knowledge.json` 的事件级音符，或调用 CLI 的 `--json` 输出。
  5. 若要精确页码，按用户手头版本补 `CitationRef.locator`，不要批量猜。
- 快速启动脚本：`start.bat`。ASCII + CRLF；检查 Node/npm；首次 `npm install`；检测 5173 是否已有 TONIC（不是 TONIC 则报端口占用）；`--strictPort`；3 秒后打开浏览器。
- 本次文档更新时间：10.24 03:45 BY solo-agent
