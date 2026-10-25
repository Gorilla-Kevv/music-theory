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
- 非目标（当前）：账户/云同步、全量教材正文、FL Studio 原生插件/VST。

## 结构

- 关键目录：
  - `src/content/`：知识事实源（66 概念、76 谱例、240 引用、66 条白话拆解）。
  - `src/content/graph/`：体系图谱数据（6 枢纽 / 66 概念 / 188 关联 / 79 前置；ATLAS_HEIGHT 随概念数自适应）。
  - `src/content/bilibili.ts`：B 站课程调研台账（5 合集/板块 · 112 条视频与文章 / 20 条已读 / 92 条仅编目）。
  - `src/content/books/`：三本书 117 章（真实原书结构）+ 117 条笔记；Levine 24 章（中译 EPUB 深链）、Laitz 33 章（4e，PDF 页码深链）、Sposobin 60 章（无电子版）。
  - `src/lib/`：音频（采样 + 合成回退）、搜索、SRS（`cards.ts` 卡片目录 + `review.ts` 状态/迁移）、听辨、音符/谱面工具、Agent API。
  - `src/components/`：外壳、检索面板、五线谱（可点击命中区）、钢琴、谱例、可视化、试听坞。
  - `src/routes/`：`/`、`/library`、`/books`、`/atlas`、`/theory/:slug`、`/drill`、`/references`、`/agent`。
  - `src/hooks/`：左轨章节大纲的 scroll spy。
  - `scripts/`：知识包构建、CLI、`tonic-mcp.ts`（stdio MCP）、`fl-bridge.ts` / `fl-cdp.ts` / `fl-payload.ts`（FL 2026 桥）。
  - `fl-panel/`：Gopher WebView2 内的 TONIC 面板（查概念 / 写入 Piano Roll / 多协议 LLM Agent）。
  - `TONIC-FL.md`：FL 2026 安装、MCP 配置、Agent 规则与故障排查。
  - `public/knowledge.json`：构建时生成的 Agent 知识包。
  - `public/audio/salamander/`：Salamander 钢琴采样子集与 `LICENSE.txt`。
- 入口文件：`src/main.tsx`、`src/App.tsx`、`index.html`。
- 核心接口：
  - `src/lib/theory-api.ts`：`searchTheory`、`listExamples`、`getRelated`、`searchSources`、`getBookOutline`、`getSourceNote`、`getConceptSources`、`getReviewQueue`、`buildKnowledgePack`、`TOOL_SCHEMAS`。
  - `src/content/graph/index.ts`：`ATLAS_GRAPH`、`ATLAS_HUBS`、`ATLAS_STATS`、`getConceptHubs`、`getPrerequisites`、`getNextConcepts`。
  - `src/content/bilibili.ts`：`BILIBILI_COLLECTIONS`（合集元数据 + 板块）、`BILIBILI_VIDEOS`、`getBilibiliVideo`；`theoryApi.videos({ status, query, theme, collection })` 与 CLI `videos` 查询同一台账；专栏文章用 `kind: "article"` + CV 号。
  - `src/lib/audio.ts`：`AudioEngine.play/stop/replay/setTempo/toggleLoop/previewNote/previewChord/previewSequence/preloadSamples`。
  - `src/lib/search.ts`：CJK bigram + Latin token 的 MiniSearch，精确短语优先。
  - `src/lib/review.ts`：SM-2 轻量实现 + v1→v2 迁移；卡片目录在 `src/lib/cards.ts`；localStorage key `tonic.review.v2`。
  - `src/lib/ear.ts`：听辨题生成与 `tonic.ear.v1` 统计。
- 数据模型：`src/content/types.ts`（Concept / Section / Example / CitationRef / BibliographyEntry / HarmonyDimension / VisualizationKind）；`src/content/books/types.ts`（BookOutline / BookChapter / NoteSeed）。

## 决策与坑

- 引用默认采用**章节级定位**：三本书有多个版次/译本，页码会漂移。书目与章目已通过 OUP 官方目录、图书馆书目记录核对；持有电子版的书（Laitz/Levine）可附原书 PDF/EPUB 深链页码，未持有的 Sposobin 只标章。**不得为了“看起来更学术”而补造页码或小节名。**
- SoundQuest 中译站部分篇章对无浏览器 UA 的 curl 会返回伪 404（正文其实是“内容还没准备好”）；抓取时带 `Mozilla/5.0` UA。C63 元音乐理论、C74/75 多义论已于阶段 30 补录。
- 书库是**源知识数据**（2026-10-24 新逻辑，用户确立）：书库=原书真实章目+章节定位+内嵌电子书深链；知识库（概念）=总结精炼、白话解释的个人笔记+拓展知识。不得 OCR、扫描或整段复制正文。
- 🔴 **内嵌电子书（2026-10-24）**：用户持有 Laitz《The Complete Musician》**第 4 版**英文 PDF（957 页，OUP © 2016，文件在 `/books/`，已复制到 `/public/books/complete-musician-4e.pdf`）与 Levine《爵士乐宝典》中译 EPUB（赵贝露译，解包到 `/public/books/jazz-baodian/`）。`/books/` 与 `/public/books/` 均 gitignore——**永不提交、不分发**。章节深链：Laitz 用 `#page=N`（pdfPage 来自 PDF 书签逐章核对），Levine 用解包 HTML（sourceFile）。⚠️ Laitz 第 4 版章名与第 5 版完全不同（无 1C，Ch17=模进、Ch18=副属、Ch19=转调），全库 117 处 laitz 引用已按 4e 重写；后续新增引用必须用 4e 章名。Levine EPUB 缺第二十四章「聆听」正文（索引提及、文件缺失），该章无深链。
- **书库深化流水线（已完成两本书）**：逐章读内嵌原书 → 升级该章笔记（deepSummary/analysis/confusions 以原文为准，仍原创改写）。批次 1（阶段 22）：Laitz 4/5/9/10/18/19/21 + Levine 2/3/13。批次 2（阶段 23）：Laitz 6/7/8/11/13 + Levine 14/15/17。批次 3（阶段 24）：Laitz 12/14/15/16/17 + Levine 7/9/10。批次 4（阶段 25）：Laitz 20/22/23/24 + Levine 1/4/16/18。批次 5（阶段 26）：Laitz 25/26/27 + Levine 11/12/19/20。收尾批（阶段 27）：Laitz 28–32 + Levine 6/8/21/22/23。**结果：Laitz 33/33、Levine 24/24 全部读透（57 章 deepSummary 以原文为准）；Sposobin 电子版无法获取，60 章深化任务已搁置（2026-10-24 用户决定）**。提取脚本模式：pypdf 按 pdfPage 范围导出文本 / EPUB 解包 HTML 去标签（存 $TEMP/tonic-deepen）；⚠️ Ch30 型谱例密集章 pypdf 输出会被 /g 字形污染，按散文关键词定位阅读。⚠️ 编辑 books/*.ts 的 DEEPEN 块时先看块边界避免重复键；deepSummary 字符串里不要用未转义的英文双引号。
- 谱面点击命中区来自 VexFlow `StaveNote.getBoundingBox()`，按行叠加 `rowIndex * 150`；如果改 `ROW_HEIGHT` 或给 SVG 加缩放，需要同步修正命中区坐标。命中区按钮是透明绝对定位按钮，可用 Tab 与 Enter。
- 钢琴采样：Salamander Grand Piano V3（Alexander Holm，CC BY 3.0）本地子集；文件名 `C3, Ds3, Fs3, A3, C4, Ds4, Fs4, A4, C5`。首次用户手势预取，`ensureSamples` 解码后使用；失败自动回退合成器。替换/新增采样必须保留许可文件。
- 概念页 `ON THIS PAGE` 在右栏深色卡片（`max-h-[46vh]` 内部滚动），用 `useActiveSection` 的 45% 视口阈值；当前项用 `scrollIntoView({block:'nearest'})` 在卡片内部滚动，避免页面跳动。左侧栏 CATALOG 当前分类下嵌概念目录，**当前分类整栏是折叠切换按钮**（点任意位置切换，状态存 localStorage `tonic.rail.catalog.v1`）；非当前分类仍是跳转 `/library?category=` 的链接；导航+目录区在 `dark-scroll` 容器内滚动。分类高亮同时服务于概念页与 `/library?category=`；目录项只在当前概念页高亮（`isCurrent`）。
- `BrowserRouter` 需要 SPA fallback。直接双击 `dist/index.html` 会失败；用 `npm run dev` 或 `npm run preview`，静态托管需把未知路径重写到 `index.html`。
- 音频必须由用户手势触发；当前使用本地 Salamander 采样 + Web Audio 合成回退，无运行时外网请求。Chrome headless 截图测试需 `--autoplay-policy=no-user-gesture-required` 才能稳定观察播放态。
- 采样解码是异步的：`play` 会先进入 playing 态并在 `ensureSamples` 完成后调度；如果采样加载失败，`playPreparedVoice` 自动走合成器。不要把这个回退删掉。
- VexFlow 包体较大（约 311KB gzip）。`vite.config.ts` 已按 `react / vexflow / search` 拆 vendor chunk；首页仍会加载 VexFlow，因为 hero 谱例是核心证明。
- Chrome headless 的 `--window-size=375` 实际最小布局宽度为 500，不能用来验证 375。使用 `.impeccable/capture.mjs` 的 CDP `Emulation.setDeviceMetricsOverride`；截图已按 375/768/1280 生成。
- npm 缓存已改到项目内 `.npm-cache`（被 gitignore），避免沙箱拒绝写入 `D:\DevCache`。
- 搜索对中文使用单字 + bigram 索引；同时用“精确短语优先”收窄结果（例如“五度圈”返回 2 条而不是 17 条）。修改检索逻辑时同时验证中文、英文、和弦记号三类查询。
- 引用上标用 `CitedText` 把末 4 字与上标包在 `whitespace-nowrap` 内，避免 `[1]` 单独掉到下一行。
- 概念页的白话拆解 `deepDive` 由 `CONCEPTS` 在 `src/content/index.ts` 自动合并；`collectCitations` 同时收集 deep dive 引用，所以页末注释会包含白话段落的来源。新增 deep dive 时不要绕过 `cite()`。
- 体系图布局是“4 列网格 + 6 个系统枢纽”的 MLP 式分层：概念坐标由 `conceptPosition` 生成，`ATLAS_HEIGHT` 随概念行数自适应；改行距/列距时要同步检查 SVG 底部图例位置与标签截断（`truncate` 默认 8 字），避免新增概念把末行或图例裁掉。
- 图谱边语义固定：`source` 来源支撑、`system` 体系归属、`related` 概念关联、`prerequisite` 学习前置；`SOURCE_HUBS` 只连接实际相关的来源与枢纽，不要恢复成“每本书连所有枢纽”的噪声图。`/atlas?focus=<slug>` 是概念页“在体系图中查看”的深链。
- 长按发声：`AudioEngine.holdStart/holdEnd` 独立于 `bus`（走 `holdBus` → dry/reverb），所以示例播放/停止不会切断长按；引擎强制最短发声 0.35s、松手 ~0.3s 淡出，合成回退有 8s 硬上限防无限延音。命中区/琴键用 pointer 事件（按下/抬起/移出/取消），键盘激活靠 click `detail===0` 区分；`useHeldPreview` hook 以 key 管理多个 hold，release 对未按住的 key 是 no-op。CDP 测试用 `.impeccable/hold-check.mjs`（注意先 `scrollIntoView`，否则坐标在视口外）。
- 🔴 FL Studio 2026 集成：不使用第三方 FL MCP/loopMIDI。`fl-bridge.ts` 以 `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222` 启动 FL，CDP 连 Gopher WebView2，通过 `script_handler.runJson` 调 FL 内置 MCP（实测 48 工具；`run_piano_roll_script` 可跑 `flpianoroll` Python）。`tonic-mcp.ts` 提供知识工具 + `get_fl_payload`/`apply_example`/`fl_*` 代理；Gopher 面板可切到 `fl-panel/`，内置知识搜索、跨书引用、写入与 OpenAI-compatible Agent。写后读回靠 `raise Exception("TONIC_NOTES=...")`（FL 脚本无 stdout）；`open_piano_roll_for_channel` 参数是 `target_channel`。桥不主动关闭用户 FL；测试通道/音符要清理。面板 Agent 的 LLM 层用统一 AgentMessage + 工具循环，协议适配在 `requestModel`：OpenAI Chat（ChatMessage/tool_calls）、OpenAI Responses（input/function_call/function_call_output）、Anthropic（messages/tool_use/tool_result）、Gemini（contents/functionCall/functionResponse）、Ollama（/api/chat）；端点由 Base URL 自动补齐，模型不支持工具时降级纯文本。
- 🔴 FL 操作封装层（阶段 39）：`fl_session_report`（结构诊断：未路由通道、未命名通道、推子 > +0.5 dB / ≤ -24 dB、硬声像、发送、共享混音轨、主轨插件）、`fl_route`、`fl_set_levels`（绝对 dB/pan/mute/solo）、`fl_write_notes`（append/replace/startBeat）、`fl_compose`（多通道/多段，可引用 TONIC 谱例）。四个写操作都做写后快照 verify；mute/solo 快照不可读，报告里要说明。⚠️ `get_session_context` 返回文本可能双重编码或带未转义引号，必须走 `flResultText`（截至 `"isError"` 前）+ `flResultJson`（先直接 parse，失败再 unescape `\n`/`\r`/`\t`/`\"`），不能裸 `JSON.parse`。**session 报告不是音频测量**：没有峰值/LUFS/频谱，Mix Doctor 需先导出音频（未做）。
- 🔴 FL 启动与 API 存放：根目录 `start-tonic-fl.bat`（ASCII + CRLF）是推荐入口——桥未运行时 `npm run fl:start` 启动桥 + FL，桥已运行时 POST `/api/panel` 把 Gopher 切回 TONIC；`npm run fl:attach` 只附加已带调试端口的 FL。面板 API 配置只在「设置」里填，存 `localStorage["tonic.fl.llm.v1"]`（origin `http://127.0.0.1:5127`）；**Gopher WebView2 与普通浏览器存储互相独立**，要各自填；桥不落盘。FL 没有公开的第三方工具栏按钮 API，VST3 需要独立原生工程（未排期），当前用 bat / 桌面快捷方式。
- 🔴 可视化预览的音频：张力光谱/五度圈等点击走 `audioEngine.previewChord`；CDP 实测点击后 AudioContext `running`、4 个采样源启动，代码路径有声。组件挂载即 `preloadSamples()` 预热（避免首次点击等 9 个 mp3 下载造成“没声音”的错觉）；若排查外放问题先看系统输出设备与标签页静音，再看 AudioContext 状态。
- 🔴 图谱画布交互：地图是固定高度画布（`react` 状态 `view{scale,x,y}` 作用于 `<g transform>`，`preserveAspectRatio="xMidYMin slice"`），滚轮缩放以指针为中心、左键拖拽平移（位移除以 `viewportInViewBox.factor`）；**不要在 pointerdown 就 `setPointerCapture`**——那会把 click 重定向到容器、点选节点失效；只在拖动超过 4px 后捕获，并在 pointerup 后短暂置 `suppressClickRef` 抑制拖拽收尾的 click。`/atlas` 空试听时隐藏 TransportDock。
- 🔴 复习卡 v2：卡片 id 概念＝slug、章节＝`chapter:<chapterId>`、误解＝`chapter:<chapterId>:q<n>`；状态键 `tonic.review.v2`，加载/导入时自动迁移 v1 的 `conceptSlug` 字段；`getReviewQueue` 接受 unknown state（v1/v2），CLI `queue --state` 同步放宽。新增卡片只从 `keyPoints`/`confusions` 生成，不用整段 `deepSummary`。
- 🔴 GitHub Pages 部署：`dev` push 触发 Actions；Vite `base` 由 `GITHUB_PAGES=true` 切到 `/music-theory/`，`BrowserRouter basename` 读 `import.meta.env.BASE_URL`；SPA 深链靠 `dist/404.html`；电子书只在本地（`__EMBEDDED_BOOKS__` 控制深链，CI 删目录并断言 `dist/books` 不存在）。本地 `npm run build` 仍按根路径并包含电子书，别把本地 dist 当线上产物。
- 🔴 图谱学习路径模式：URL 为 `/atlas?mode=path&focus=<slug>`；只保留 `prerequisite` 边并隐藏系统枢纽，图中只显示目标先修/后续闭包与有章节支撑的书源；先修/后续链由 DAG 深度计算（远→近/近→远），多条路径合并，不代表唯一线性顺序；清除选择保留 `mode=path`。章节来源用 `getChaptersForConcept` 全量列出，书源节点显示“支撑 N 章”。
- 🔴 嵌套滚动陷阱：在 `overflow-y-auto` 限高容器（如右栏 ON THIS PAGE 卡片 `max-h-[46vh]`）里对裁剪区外的元素调用 `scrollIntoView({block:"nearest"})`，浏览器会连滚 window——把正在阅读的页面弹回卡片可见位置，表现为"内容页无法向下滚动"。正确做法是只调内部容器的 `scrollTop`（用 getBoundingClientRect 差值计算，见 ConceptPage 的 outline 跟随 effect）。诊断脚本：`.impeccable/scroll-trace.mjs`（给 scrollTo/scrollIntoView 打补丁记录调用方）、`scroll-check.mjs`、`outline-follow-check.mjs`。
- 移动端菜单与检索面板都做了焦点陷阱与 Escape 关闭；新增模态层请沿用。

## 命令

- 安装：`npm install`（缓存已指向项目内 `.npm-cache`）
- 开发：`npm run dev`
- 快速启动：双击项目根 `start.bat`（首次运行自动安装依赖；已运行时直接打开；`TONIC_NO_OPEN=1` 可只启动服务不打开浏览器）
- 构建：`npm run build`（`prebuild` 自动刷新 `public/knowledge.json`）
- 预览：`npm run preview`
- 线上部署：push `dev` 触发 `.github/workflows/deploy.yml` → GitHub Pages `https://gorilla-kevv.github.io/music-theory/`；构建 base `/music-theory/`，`dist/index.html` 复制为 `404.html` 做 SPA 回退。
- 线上构建纪律：workflow 在 `npm ci` 后 `rm -rf public/books books` 并断言 `dist/books` 不存在；`__EMBEDDED_BOOKS__` 在 Pages 构建为 false，电子书深链自动隐藏。**本地 `dist/` 含电子书，绝不可手动上传或打包分发。**
- 类型检查：`npm run typecheck`
- 知识包：`npm run knowledge`
- CLI：`npm run theory -- search "三全音替代" --json`
- CLI 书库：`npm run theory -- books` / `npm run theory -- source levine-13` / `npm run theory -- sources "转调" --book sposobin --dimension relationship`
- CLI 复习队列：`npm run theory -- queue --state ./tonic-review-state.json --json`
- TONIC MCP：`npm run mcp`（stdio；知识与 FL 工具 22 个）
- FL 一键启动：双击 `start-tonic-fl.bat`；或 `npm run fl:start`（桥 + FL）/ `npm run fl:attach`（FL 已带调试端口）
- FL 桥/面板：`npm run fl:bridge -- --launch-fl --panel`（已运行的 FL 用 `--panel`）
- UI 检测：`impeccable detect --json src index.html`（当前返回 `[]`）

## 状态

- 当前状态：v0.4 进行中；已上线 GitHub Pages：`https://gorilla-kevv.github.io/music-theory/`（Actions 构建，电子书不发布）；66 概念（含站点来源 16 条：泛音列/连接系统论/轴心体系/新里曼/LCC/调性引力/Shuffle/王道进行/流行转调/Clave/外质与 K·S/line cliché/旋律和声化/元音乐理论/和声多义性/经过和弦）/ 76 谱例 / 240 引用 / 66 条白话拆解 / 209 张复习卡（概念 66 + 书库章节笔记 143）；FL 2026 集成已跑通（外部 MCP 22 工具 + Gopher 面板，48 个内置工具，操作封装层含 session 结构诊断/路由/绝对电平/多段写音符并全部写后读回；面板 Agent 支持 OpenAI Chat/Responses、Anthropic、Gemini、Ollama 五协议；`start-tonic-fl.bat` 一键启动）；书库 117/117 章节笔记（真实原书结构：Levine 24、Laitz 4e 33、Sposobin 60），Levine/Laitz 内嵌电子书章节深链，深化流水线见“决策与坑”；B 站台账 5 合集/板块 · 112 条 / 20 条已读；`/atlas` 体系图谱（关系图/学习路径双视图、缩放拖拽画布、路径自动分列取景、完整先修/后续闭包、跨书章节对照）；构建通过；三视口无横向溢出；谱面点击、钢琴、长按发声、五度圈/调式轮/半音尺/张力光谱/相邻属和弦路径、检索、复习、听辨、书库、体系图、Agent API 均已实测。
- 验收标准：
  - `npm run typecheck` 与 `npm run build` 通过。
  - `/` 可在 375/768/1280 正常渲染；hero 谱例可播放并高亮琴键。
  - `/theory/ii-v-i` 含引用上标、页末注释、可点击谱面、相关概念；右栏有深色 ON THIS PAGE 卡片且随滚动高亮；左栏 CATALOG 当前分类展开概念目录，可点击收起/展开（状态持久化）。
  - `/theory/circle-of-fifths` 的五度圈可点击扇区、试听、切大调/关系小调；左轨分类高亮“基础”。
  - `/books` 可切换三本书、按维度筛选、浏览 117 个章目与 117 条笔记；Levine/Laitz 章节显示深入归纳、跨书对应、常见误解；本地 dev 显示“打开原书本章”内嵌电子书深链，线上版自动隐藏。
  - 线上 `https://gorilla-kevv.github.io/music-theory/` 首页、`/theory/ii-v-i` 深链（404.html 回退）、`/atlas?mode=path&focus=ii-v-i`、`audio/salamander/*.mp3`、`knowledge.json` 均可访问；`/books/*` 返回 404（电子书不发布）。
  - `/theory/modal-characteristics` 显示五条调式谱例（D Dorian / E Phrygian / F Lydian / G Mixolydian / A Aeolian，共用 C 大调集合）。
  - `/theory/non-functional-dominants` 的相邻属和弦路径可视化可点击节点试听、播放整条进行；橙线为相邻上行，钴蓝线为下行五度。
  - `/atlas` 可筛选分类/维度、悬停/点击节点追踪邻域，并从概念页深链到指定节点；地图为固定高度画布，滚轮缩放、左键拖拽、适应/重置/全屏均可用且不吞节点点选；`/atlas?mode=path&focus=ii-v-i` 只保留前置边并按先修深度自动分列取景（13 先修 / 0 后续 / 5 支撑章节），清除选择回到全局前置图；`/atlas?focus=tonal-distance` 正常模式按书分组列出 24 个跨书章节（章号 + 标题 + 摘要），无播放内容时试听坞不遮挡地图。
  - `/drill` 可完成“显示答案 → 评分 → 下一卡”，并写入 localStorage；来源筛选（全部 209 / 概念 66 / 书库 143），书库卡显示书源徽标、多行要点答案与“打开章节笔记”链接；状态写入 `tonic.review.v2`。
  - `/library` 检索“五度圈”返回精确结果；清空恢复 66 条。
  - `/references` 台账显示 5 个合集/板块卡片（爵士和声理论 / 学院派爵士理论 / 风格化创作 / 合集外公开课 / 专栏归档）与 20 条已读（含 VIA subtitle/asr/frames/text 标记）。
  - `/theory/metatheory`、`/theory/harmonic-polysemy`、`/theory/passing-chords` 显示引用上标、页末注释、可点击谱面、白话拆解与相关概念；`/theory/extensions-alterations` 含「半音禁忌与延伸音的选择」小节。
  - `/theory/harmonic-color` 的张力光谱：点击六个和弦色块即发声并高亮下方琴键；色块下方渲染所选和弦的五线谱与钢琴（可点/可按），PLAY 走全局试听坞。
  - `/theory/melodic-minor-modes` 渲染 J-13 概念页（七调式代表和弦、C 旋律小调谱例、白话拆解、图谱前置）。
  - `/agent` 可导出学习状态；`window.TONIC` 与 CLI 可查询同一知识包与书库；页面已说明 `npm run mcp`（stdio MCP，22 工具，含 FL 操作封装层 `fl_session_report`/`fl_route`/`fl_set_levels`/`fl_write_notes`/`fl_compose`）与 `npm run fl:bridge -- --launch-fl --panel`（FL 2026 桥）。
- 下一步：
  1. 继续深度内容：Sposobin 电子版无法获取，60 章深化任务已搁置（2026-10-24 用户决定）；Levine/Laitz 的 `confusions` 已在深化批次覆盖，新增概念时继续按章节级来源写。逐调式谱例已完成（阶段 11）。
  2. 图谱第三阶段已完成（阶段 34：画布缩放/拖拽、路径自动分列、跨书章节对照）；后续只做细节打磨，不再扩展视图。
  3. 书库笔记接入复习卡已完成（阶段 33：209 张卡，v2 状态）；后续新增章节卡只从 `keyPoints`/`confusions` 生成。
  4. stdio MCP server 已完成（`npm run mcp`，22 个知识/FL 工具）；后续补 MCP prompts/resources 与更多组合工具。
  5. FL Studio 2026 集成已完成（`npm run fl:bridge -- --launch-fl --panel` 或 `start-tonic-fl.bat`）：CDP 复用官方内置 MCP（48 工具）、Gopher 内嵌 TONIC 面板、操作封装层（结构诊断/路由/电平/写音符/多段 compose）与写后读回；后续接用户实际 LLM 端点、更多编曲动作与真实音频测量。VST3 未做（需独立 C++/JUCE 工程，成本高）；若要做“更像应用”的启动器，优先 Tauri/Electron 托盘。
  6. 若要精确页码，按用户手头版本补 `CitationRef.locator`，不要批量猜；Sposobin 无电子版，深化已搁置。
- 快速启动脚本：`start.bat`。ASCII + CRLF；检查 Node/npm；首次 `npm install`；检测 5173 是否已有 TONIC（不是 TONIC 则报端口占用）；`--strictPort`；3 秒后打开浏览器。
- 本次文档更新时间：10.25 22:05 BY solo-agent（阶段 40 FL 一键启动与外部 harness 说明）
