# PROGRESS

## 进度看板

- 当前正在开发任务：阶段 41 已完成（混音诊断/路由总线/多轨编配/WAV 分析）
- 下一阶段任务：true peak/频谱/LRA 与混音目标评估；用户实际 LLM 端点验证；线上内容维护
- 可提前进行的任务：更多编曲模板（鼓组/节奏型）、混音参考曲线、Agent 侧路径查询
- 未完成的任务：全量教材正文（版权边界，不做）；Sposobin 60 章仍为章名级初稿（电子版无法获取，搁置）；面板 Agent 的真实 LLM 配置待用户填写；VST3 未排期

## 已完成阶段简表（1–28，详见 git log 与各阶段提交）

| 阶段 | 成果 |
|---|---|
| 1 | 产品事实、技术栈（Vite+React+TS+Tailwind v4）、Blue Note 视觉方向锁定 |
| 2 | 知识 schema、24 概念、29 谱例、76 引用、knowledge.json 导出 |
| 3 | 音频引擎、VexFlow 谱例、MiniSearch 检索、SM-2 复习、听辨训练 |
| 4 | 应用外壳与六个页面、⌘K 全局检索、论文式引用、三视口无溢出 |
| 5 | Agent 知识包、TypeScript API、CLI、MCP 形状 tool schema |
| 6 | 构建验证、可访问性收尾、DESIGN/HANDOFF 文档、首版提交 |
| 7 | 和声库扩至 37 概念/42 谱例、书库 118 章目+59 笔记、四可视化、可点击谱面、Salamander 采样 |
| 8 | start.bat 快速启动（ASCII+CRLF） |
| 9 | Levine/Laitz 全章覆盖、37 条白话拆解、/atlas 体系图谱 |
| 10 | B 站调查驱动：新增 6 个现代和声概念（中古调式/调式互换/四度/混合/无功能属/固定结构）→ 43 概念 |
| 11 | 逐调式谱例补全（共用 C 大调集合）、dominant-path 相邻属和弦可视化 → 52 谱例 |
| 12 | B 站台账 v1（68 条视频/7 已读，get_video_research） |
| 13 | 台账多合集化（Yulia 10 集、风格化创作 31 集独立板块、专栏支持）；新增 J-13 旋律小调调式 → 44 概念/111 条台账 |
| 14 | 五线谱与琴键长按持续发声（holdStart/holdEnd，高亮跟随） |
| 15 | 左栏当前分类可折叠概念目录；ON THIS PAGE 移至概念页右栏深色卡片 |
| 16 | 专栏文章归档（属降十和弦 CV53580498，kind:article）→ 112 条台账 |
| 17 | 分类目录整栏可点击切换 |
| 18 | 修复内容页无法下滚（限高容器 scrollIntoView 波及 window 的嵌套滚动陷阱） |
| 19 | 站点目录驱动扩充：节拍切分/旋律动机/五声音阶/和弦外音/挂留/对称音阶 → 50 概念 |
| 20 | 来源政策两层制（三本书+SoundQuest）；入库泛音列/连接系统论/轴心体系/新里曼/LCC；Sposobin 补全 60/60 |
| 21 | 内嵌两本电子书（Laitz 4e PDF+Levine 中译 EPUB，gitignore）；书库严格 1:1 重构（Laitz 改按第 4 版 33 章，全库 117 处引用重写）；书库=源数据/知识库=笔记新逻辑 |
| 22 | 书库深化批次 1：Laitz 4/5/9/10/18/19/21 + Levine 2/3/13 |
| 23 | 书库深化批次 2：Laitz 6/7/8/11/13 + Levine 14/15/17 |
| 24 | 书库深化批次 3：Laitz 12/14/15/16/17 + Levine 7/9/10 |
| 25 | 书库深化批次 4：Laitz 20/22/23/24 + Levine 1/4/16/18 |
| 26 | 书库深化批次 5：Laitz 25/26/27（大曲式）+ Levine 11/12/19/20 |
| 27 | 书库深化收尾批：Laitz 28–32 + Levine 6/8/21/22/23——**两本书 57 章全部读透** |
| 28 | SoundQuest 第二批：调性引力/ Shuffle/王道进行/流行转调/Clave → 60 概念/70 谱例/202 引用 |

关键事故与定规（勿重蹈）：限高容器内跟随高亮只滚容器本身（阶段 18）；deepSummary 内不用未转义英文双引号、Edit 前看块边界（阶段 25）；Laitz 引用一律第 4 版章名；标签无边框/可点有边框（阶段 16 前）；电子书永不入 git。

## 阶段 29 知识库扩充：SoundQuest 第三批 + 文档压缩 [计划时间：10.24 20:00 BY solo-agent][完成时间：10.24 20:30 BY solo-agent]

- 分支：dev
- 已完成：
  - 29.0 文档压缩：PROGRESS.md 阶段 1–28 压缩为简表（461→约 60 行），保留看板、每阶段一行成果与“关键事故与定规”备忘。
  - 29.1 F-15 `gaijitsu-ks` 外质与 K·S 分析（M17–21）：各度数外质性格（Root 力量朴素/3rd·7th 色彩/奇稳偶紧）、K·S 两轴诊断（本质+外质）、关键位置检查与“浪费弹药”。
  - 29.2 H-31 `line-cliche` 和弦内的半音线（C45）：机制（一动半音余声部固定、3rd 不动）、bass 版=高音持续音、用法哲学（大胆反复用）。
  - 29.3 H-32 `harmonization` 旋律和声化三步法（M48–51）：定奇偶（从结尾倒推）→定根音（挪三度换外质）→定性质；现代警戒（理论可行≠好听、混浊容忍度看曲风）；Sposobin 第四章作 Tier 1 呼应。
  - 29.4 三条白话拆解（63/63）；图谱新增 6 条前置链。
- 统计：63 概念（基础 15 / 和声 32 / 爵士 16）/ 73 谱例 / 212 引用；图谱 172 关联 / 70 前置。站点来源概念累计 13 条。
- 测试结果：typecheck / knowledge（63/73/212）/ build 通过；`/theory/gaijitsu-ks` 375 无溢出、`/theory/harmonization` 1280 渲染正确。
- 下一阶段入口：站点待读（C63 元音乐理论、C74/75 多义论建设中；延伸音 C47–49、经过和弦 C50、转位系统 C39–40 可作第四批）；或图谱学习路径/Sposobin 电子版。
- 本次文档更新时间：10.24 20:30

## 阶段 30 知识库扩充：SoundQuest 第四批 + J-04 补强 [计划时间：10.24 20:30 BY solo-agent][完成时间：10.24 20:40 BY solo-agent]

- 分支：dev
- 已完成：
  - 30.1 F-16 `metatheory` 元音乐理论（C63）：三阶段（形式化/符号化/组织化）、两主义（理性/经验）、论点隔离、开放/封闭体系与三个限制；正文明示为站点原创元框架，不产生和弦规则。
  - 30.2 H-33 `harmonic-polysemy` 和声多义性（C74/C75）：五类信息源、枢纽和弦/共同音/特定音、假设→判定→确定、异名同音与过渡、拿坡里式/悖论型；以 Laitz 19/24/9 作 Tier 1 呼应。
  - 30.3 H-34 `passing-chords` 经过和弦（C50）：根音省略体、♯Io7/♯IVo7/♯IIo7/♭IIIo7、半减七互换、非中间用法与禁忌；以 Levine 13、Laitz 8 作 Tier 1 呼应。
  - 30.4 J-04 `extensions-alterations` 补强：新增「半音禁忌与延伸音的选择」小节（C47–C49；半音上方回避、属七例外、IIm7 13 音、Levine 的“小心轻放”），并补深拆段落。
  - 30.5 三条白话拆解（66/66）；图谱新增 9 条前置链；C39–40 转位/持续音/混合和弦确认由 `bass-line`、`hybrid-chords` 覆盖，不重复建条。
- 统计：66 概念（基础 16 / 和声 34 / 爵士 16）/ 76 谱例 / 240 引用；66 条白话拆解；图谱 188 关联 / 79 前置。站点来源概念累计 16 条。
- 测试结果：typecheck / knowledge（66/76/240）/ build 通过；`/theory/metatheory` 375 无横向溢出；`/theory/harmonic-polysemy`、`/theory/passing-chords`、`/theory/extensions-alterations` 1280 渲染、检索与 CLI 查询通过。
- 下一阶段入口：图谱学习路径（前置链筛选/章节级来源高亮）；Sposobin 电子版到位后深化；或书库笔记接入复习卡。
- 本次文档更新时间：10.24 20:40

## 阶段 31 图谱第二阶段：学习路径与章节级来源 [计划时间：10.24 20:45 BY solo-agent][完成时间：10.24 22:20 BY solo-agent]

- 分支：dev
- 已完成：
  - 31.1 图谱链计算：`getPrerequisiteChain`/`getNextChain` 按 DAG 深度汇总完整先修/后续闭包；多条路径合并，先修由远到近、后续由近到远；带深度上限防环。
  - 31.2 Atlas 双视图：`VIEW` 切换关系图 / 学习路径；路径模式只保留 `prerequisite` 边、隐藏系统枢纽，过滤到目标概念的先修/后续节点与有章节支撑的书源；支持 `/atlas?mode=path&focus=<slug>` 深链与“清除选择”。
  - 31.3 路径摘要：目标概念、完整先修/后续链、各书支撑章节计数、跳转章节；正常模式隐藏摘要，避免与详情面板重复。
  - 31.4 章节级来源：详情面板列出 `getChaptersForConcept` 的全部章节深链（滚动列表），书源节点加虚线环并标注“支撑 N 章”；正常/路径模式都生效。
  - 31.5 按用户指示搁置 Sposobin 60 章深化（电子版无法获取），AGENTS/HANDOFF/PRODUCT/PROGRESS 同步记录。
- 测试结果：typecheck / knowledge（66/76/240）/ build 通过；`/atlas?mode=path&focus=ii-v-i` 1280 与 375 无横向溢出，路径摘要 13 先修 / 0 后续 / 5 章节；`/atlas?focus=tonal-distance` 正常模式 24 章节深链；学习路径切换、清除选择、URL 参数与节点数实测。
- 统计不变：66 概念 / 76 谱例 / 240 引用；图谱 188 关联 / 79 前置。
- 下一阶段入口：书库笔记接入复习卡；FL Studio 适配；或图谱第三阶段（路径布局/跨书章节对照）。
- 本次文档更新时间：10.24 22:20

## 阶段 32 上线 GitHub Pages [计划时间：10.24 22:30 BY solo-agent][完成时间：10.24 22:53 BY solo-agent]

- 分支：dev；仓库 `Gorilla-Kevv/music-theory`（公开）；线上地址 `https://gorilla-kevv.github.io/music-theory/`
- 已完成：
  - 32.1 Pages 子路径：Vite `base` 由 `GITHUB_PAGES=true` 切换为 `/music-theory/`；`BrowserRouter basename` 读 `import.meta.env.BASE_URL`；Agent 知识包链接走 `BASE_URL`。
  - 32.2 SPA 回退：CI 复制 `dist/index.html` → `dist/404.html`；线上深链 `/music-theory/theory/ii-v-i` 实测通过。
  - 32.3 电子书隔离：`__EMBEDDED_BOOKS__` 在 Pages 构建为 false（本地 dev 仍显示“打开原书本章”）；workflow `rm -rf public/books books` 并断言 `dist/books` 不存在；线上 `/books/*` 全部 404。
  - 32.4 Actions 部署：`.github/workflows/deploy.yml`（push dev 触发：npm ci → build → 404 → artifact → deploy-pages）；Pages 以 `build_type=workflow` 启用，默认分支设为 dev。
  - 32.5 修正首页页脚 Laitz 版次（第 5 版 → 第 4 版）。
- 验证：typecheck / build 通过；本地 Pages 模拟（`GITHUB_PAGES=true` build + preview）与线上 1280/375 渲染、深链、`/atlas?mode=path&focus=ii-v-i`、`audio/salamander/C4.mp3` 与 `knowledge.json` 200、电子书路径 404 均实测。
- 统计不变：66 概念 / 76 谱例 / 240 引用；图谱 188 关联 / 79 前置。
- 下一阶段入口：书库笔记接入复习卡；FL Studio 适配；或图谱第三阶段（路径布局/跨书章节对照）。
- 本次文档更新时间：10.24 22:53

## 阶段 33 书库笔记接入复习卡 [计划时间：10.24 23:00 BY solo-agent][完成时间：10.24 23:28 BY solo-agent]

- 分支：dev；push 后由 Actions 自动重新部署线上
- 已完成：
  - 33.1 卡片目录 `src/lib/cards.ts`：概念卡 66 + 书库章节 keyPoints 卡 117 + 章节常见误解卡 26 = 209；id 规则（概念＝slug、章节＝`chapter:<id>`、误解＝`chapter:<id>:q<n>`）与书源徽标。
  - 33.2 状态 v2：`ReviewRecord.cardId`、存储键 `tonic.review.v2`；`normalizeReviewState` 自动迁移 v1 的 `conceptSlug`；导出/导入与 CLI `queue --state` 兼容 v1/v2。
  - 33.3 Drill：来源筛选（全部 209 / 概念 66 / 书库 143）、书库卡书源徽标与多行答案、章节笔记链接、四格统计（DUE/NEW/BOOK/ACCURACY）、进度分解（概念 x/66 · 书库 y/143）。
  - 33.4 书库章节页新增“加入复习 / 已在复习队列 / 今天到期”动作；概念页改用同一 card id API；Home 统计条与文案同步。
  - 33.5 `knowledge.json` 增加 `reviewCards` 209 条与 `meta.reviewCardCount/bookCardCount`；`get_review_queue` tool schema 描述更新。
- 测试：typecheck / build 通过；Drill 书库筛选、显示多行答案、评分写入 `tonic.review.v2`；Books/Concept“加入复习”写入成功；v1 state 经 CLI 迁移可用；Pages 构建（`/music-theory/` 下 209 卡）实测；375/1280 无横向溢出。
- 统计：66 概念 / 76 谱例 / 240 引用 / 66 条白话拆解 / 209 张复习卡（概念 66 + 书库 143）；图谱 188 关联 / 79 前置不变。
- 下一阶段入口：FL Studio 适配；图谱第三阶段（路径布局/跨书章节对照）；线上内容维护。
- 本次文档更新时间：10.24 23:28

## 阶段 34 图谱第三阶段：画布交互 + 路径布局 + 跨书对照 [计划时间：10.25 00:00 BY solo-agent][完成时间：10.25 00:10 BY solo-agent]

- 分支：dev；push 后由 Actions 自动重新部署线上
- 已完成：
  - 34.1 遮挡修复：`/atlas` 在没有正在试听的谱例时隐藏全局试听坞；地图由“整页长图 + 横向滚动”改为固定高度画布（`h-[68vh] min-h-[420px]`），不再被底部栏压住。
  - 34.2 画布交互：滚轮以指针为中心缩放（0.4–3.2）、左键拖拽平移、`适应`（路径取路径包围盒 / 全局取全图）、`重置`、全屏。修复 pointerdown 立即 `setPointerCapture` 导致 click 被重定向、节点点选失效的问题——改为拖动超过 4px 才捕获指针，并在拖拽结束后短暂抑制 click。
  - 34.3 路径布局：`getPathDepths` 提供先修/后续深度；path 模式有目标概念时按深度自动分列（左＝最远先修、中＝目标、右＝后续），隐藏列标签与图例并自动取景；无目标时仍显示全局前置图。
  - 34.4 跨书对照：详情面板按书分组列出支撑章节（章号 + 标题 + 摘要，两行截断），路径摘要保留各书章节计数；书源节点继续标注“支撑 N 章”。
- 测试：typecheck / build 通过；CDP 实测滚轮 scale 1→1.57、拖拽 translate 变化、点选节点仍能打开详情；`/atlas?mode=path&focus=ii-v-i` 14 个概念节点紧凑布局、自动取景、无 SOURCES/CONCEPTS 列标签；375/1280 无横向溢出；非 atlas 页面试听坞正常显示。
- 统计不变：66 概念 / 76 谱例 / 240 引用 / 66 条白话 / 209 张复习卡；图谱 188 关联 / 79 前置。
- 下一阶段入口：FL Studio 适配；线上内容维护；图谱细节打磨（可选）。
- 本次文档更新时间：10.25 00:10

## 阶段 35 张力光谱补全：试听 + 五线谱/钢琴 [计划时间：10.25 00:20 BY solo-agent][完成时间：10.25 00:35 BY solo-agent]

- 分支：dev；push 后由 Actions 自动重新部署线上
- 背景：用户反馈 `/theory/harmonic-color` 的张力光谱“点击和弦没有声音、下方缺少五线谱与钢琴”。
- 排查：CDP 实测（无 autoplay 豁免、可信鼠标事件）点击色块后 AudioContext 为 `running`、4 个采样源 `AudioBufferSourceNode.start` 启动——音频代码路径本身有声；判断“没声音”的观感来自首次点击需下载/解码 9 个采样、且点击除改变选中态外没有视觉反馈。为消除该问题：
  - 35.1 组件挂载即 `audioEngine.preloadSamples()` 预热采样，首次点击无需等待 mp3 下载。
  - 35.2 色块下方新增对应和弦的五线谱（可点击/长按音符）与钢琴键盘（可点击/长按琴键），点击色块会 `previewChord` 并发亮琴键；PLAY 走全局试听坞并同步高亮当前音符。
  - 35.3 `TENSION_CHORDS` 补充每个和弦的音名拼写，生成 `Example` 供谱面渲染；`PLAY` 标题为“和弦名 · 张力试听”。
- 测试：typecheck / build 通过；点击 Dm7 后琴键高亮 D4/F4/A4/C5；PLAY 切到“停止 Cmaj7”且试听坞显示 PLAYING；375/1280 无横向溢出；谱面 SVG 554×150 正常渲染。
- 统计不变：66 概念 / 76 谱例 / 240 引用 / 66 条白话 / 209 张复习卡。
- 下一阶段入口：FL Studio 适配；线上内容维护；图谱/可视化细节打磨。
- 本次文档更新时间：10.25 00:35

## 阶段 36 交付文档同步 [计划时间：10.25 01:00 BY solo-agent][完成时间：10.25 01:20 BY solo-agent]

- 分支：dev
- 任务定位：把 AGENTS / PRODUCT / DESIGN / HANDOFF / PROGRESS 对齐到当前代码与线上交付，清理阶段 11–35 留下的旧统计与旧交互描述。
- 已完成：
  - 36.1 统计对齐：66 概念（基础 16 / 和声 34 / 爵士 16）、76 谱例、240 引用、117 章目、117 条章节笔记、66 条白话拆解、209 张复习卡（概念 66 + 书库 143）。
  - 36.2 版次修正：全库统一 Laitz **第 4 版**（2016，1A/1B + 02–32 共 33 章）；修正 AGENTS 中“1A/1B + 32 章 / Laitz 34 章”的旧写法；书目补 SoundQuest Tier 2。
  - 36.3 交互对齐：DESIGN 的章节大纲改为右栏深色 ON THIS PAGE；HANDOFF 的复习状态改为 `tonic.review.v2`；图谱画布改为固定高度 + 缩放/拖拽 + 路径模式；张力光谱补充五线谱/钢琴。
  - 36.4 交付边界：电子书仅本地（`/books/`、`/public/books/` gitignore，线上隐藏深链）；引用默认章节级，持有电子版可附 PDF 页码，不伪造页码。
  - 36.5 B 站台账：5 个合集/板块（爵士和声理论、学院派爵士理论、风格化创作、合集外公开课、专栏归档）、112 条视频与文章、20 条已读；`/references` 展示 5 张合集卡。
  - 36.6 验收文案：`/library` 清空恢复 66 条；`/references` 20 条已读；`/atlas` 路径视图、张力光谱、复习卡 v2 的验收描述更新。
- 改动文件：AGENTS.md、PRODUCT.md、DESIGN.md、HANDOFF.md、PROGRESS.md
- 测试结果：
  - 文档统计与 `src/content` 实际导出核对一致：66 / 76 / 240 / 117 / 117 / 66 / 209 / 5 / 112 / 20；图谱 188 关联 / 79 前置。
  - `npm run typecheck`、`npm run build` 通过（本轮仅文档，不改代码）。
- 风险：
  - 文档中的线上验收项依赖 GitHub Pages 当前部署；若 Actions 未跑最新 commit，线上可能与本地差一版。
  - Sposobin 无电子版，60 章仍为章名级笔记；不要在文档中写成“已读透”。
- 下一阶段入口：FL Studio 适配；线上内容维护；图谱/可视化细节打磨；stdio MCP server（未排期）。
- 本次文档更新时间：10.25 01:20

## 阶段 37 FL Studio 2026 集成：MCP + CDP 桥 + Gopher 面板 [计划时间：10.25 00:40 BY solo-agent][完成时间：10.25 01:35 BY solo-agent]

- 分支：dev；FL 2026 已安装（`C:\Program Files\Image-Line\FL Studio 2026\FL64.exe`）
- 已完成：
  - 37.1 `tonic-mcp.ts`：stdio MCP，17 个工具（11 知识 + `get_fl_payload`/`apply_example`/`fl_status`/`fl_list_tools`/`fl_call_tool`），MCP instructions 强制“先查知识、带章节 locator、再写 FL”。
  - 37.2 `fl-cdp.ts`：以 `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222` 启动 FL，CDP 连 Gopher WebView2，向页面注入 `script_handler` 单飞 Promise 桥；直接复用 FL 2026 官方内置 MCP（实测 48 工具），不装第三方 FL MCP、不需要 loopMIDI。
  - 37.3 `fl-bridge.ts` + `fl-panel/`：本地 HTTP（127.0.0.1:5127）提供知识搜索、概念/章节引用、谱例写入、状态；Gopher 自动切到 TONIC 面板；面板含查概念/ Agent/设置三页，Agent 使用 OpenAI-compatible `/chat/completions` 做工具循环。
  - 37.4 写入链路：`fl-payload.ts` 把谱例转 FL 音符与 `flpianoroll` Python；`apply_example` 写当前/指定钢琴卷帘，写后抛异常读回 `fp.score.noteCount` 返回 `verifiedNotes`；修正 `open_piano_roll_for_channel` 的 `target_channel` 参数。
  - 37.5 文档 `TONIC-FL.md`（安装/两种 Agent 模式/MCP 配置/故障排查/安全边界）；AGENTS/HANDOFF/PRODUCT/PROGRESS 同步。
  - 37.6 站点 `/agent` 页同步：stdio MCP/FL 桥命令、MCP 工具映射说明与 TONIC-FL 链接；扩展点列表更新。
- 测试结果：
  - MCP stdio：17 工具、搜索五度圈、ii–V–I payload、跨书章节引用通过。
  - FL：Gopher CDP 连接成功、48 个内置工具；添加 FL Keys 测试通道 → 写入 ii–V–I（15 音符）→ 读回 `TONIC_NOTES=15;PPQ=96`；外部 MCP `apply_example` 与 Gopher 面板写入均成功。
  - 面板 Agent 用 mock LLM 验证：先调用 `get_concept_sources`，再返回带 Levine/Laitz locator 的回答；工具轨迹显示正常。
  - 清理：删除测试 FL Keys 通道（原始 808 通道保留）、清空面板 mock LLM 配置。
- 统计不变：66 概念 / 76 谱例 / 240 引用 / 66 条白话 / 209 张复习卡。
- 下一阶段入口：把面板 Agent 接到用户实际 LLM；补更多 FL 组合动作（进行/音阶批量写入、通道/混音）；或把 FL 面板入口加到站点文档。
- 本次文档更新时间：10.25 01:35

## 阶段 38 面板 Agent 多协议 LLM [计划时间：10.25 20:40 BY solo-agent][完成时间：10.25 21:10 BY solo-agent]

- 分支：dev
- 已完成：
  - 38.1 统一 Agent 消息/工具循环；新增协议适配器：OpenAI Chat Completions、OpenAI Responses、Anthropic Messages、Google Gemini、Ollama 原生；服务端按协议补端点、鉴权头与工具 schema。
  - 38.2 面板设置新增「API 协议」下拉与协议提示（5 项），保存到 localStorage；默认 OpenAI Chat Completions；Qwen compatible-mode 可切换 OpenAI Responses 或 Chat Completions。
  - 38.3 Responses 的 function_call/function_call_output、Anthropic 的 tool_use/tool_result、Gemini 的 functionCall/functionResponse、Ollama 的 tool_calls 均已解析；模型不支持工具时自动降级纯文本。
  - 38.4 TONIC-FL.md、AGENTS、PRODUCT、站点 `/agent` 页同步多协议说明。
- 测试：typecheck 通过；mock 端点五协议全部完成 `get_concept_sources` 工具循环并返回带 Levine locator 的回答；面板协议下拉 5 项、保存 `openai-responses`、Responses 聊天 UI 实测；FL 桥仍连接 48 工具。
- 统计不变：66 概念 / 76 谱例 / 240 引用 / 66 条白话 / 209 张复习卡。
- 下一阶段入口：用用户实际 Qwen MaaS（`compatible-mode/v1`）/Claude/Gemini/Ollama 端点验证；补更多 FL 组合动作；线上维护。
- 本次文档更新时间：10.25 21:10

## 阶段 39 FL 操作封装层 [计划时间：10.25 21:20 BY solo-agent][完成时间：10.25 21:55 BY solo-agent]

- 分支：dev
- 已完成：
  - 39.1 `fl_session_report`：读取 `get_session_context`，输出通道路由、混音器推子/声像、插件链、发送、命名问题；规则含未路由通道、正增益推子（> +0.5 dB）、过低推子（≤ -24 dB）、硬声像、共享混音轨、主轨插件；明确标注不含峰值/LUFS/频谱。
  - 39.2 `fl_route`：批量通道路由到混音器轨道，执行后用 session 快照逐通道 verify。
  - 39.3 `fl_set_levels`：绝对 dB/声像/静音/独奏，带范围校验与写后 verify（mute/solo 快照不可读，已注明）。
  - 39.4 `fl_write_notes`：任意 MIDI 音符写入当前/指定钢琴卷帘，支持 append/replace/startBeat，写后读回音符数。
  - 39.5 `fl_compose`：多通道/多段写入；每段可用 TONIC 谱例或显式 notes，支持 channel/mode/startBeat/transpose/velocity，逐段读回。
  - 39.6 桥端点 `/api/fl/report|route|levels|write|compose`、面板 Agent 工具、MCP 工具（22 个）与 Gopher 面板 FL 标签页全部接通。
- 关键修复：FL 的 `get_session_context` 返回的文本可能被双重编码/带未转义引号；桥用 `flResultText` + 容错 unescape/递归解析，不能直接 `JSON.parse`。
- 测试结果：报告读取 5 通道 / 18 混音轨、0 risk；临时两个 FL Keys 通道路由到插入 16、设 -12 dB / pan 0.2，verified 通过；`fl_compose` 两段分别写入 2 与 3 个音符并读回一致；MCP `fl_session_report` 通过、工具总数 22；面板 FL 标签页显示 130 BPM / 5 CH / 18 MIXER / 1 info。清理后原始 5 个 808 通道保留、插入 16 恢复 0 dB / pan 0。
- 统计不变：66 概念 / 76 谱例 / 240 引用 / 66 条白话 / 209 张复习卡。
- 边界：session 报告是结构诊断，不是音频测量；`fl_compose` 是多通道写入，不是自动编曲。真正的 Mix Doctor 需要导出音频后做峰值/LUFS/频谱分析（后续）。
- 下一阶段入口：真实音频测量/Mix Doctor；用户实际 LLM 端点验证；线上维护。
- 本次文档更新时间：10.25 21:55

## 阶段 40 FL 一键启动与外部 harness 说明 [计划时间：10.25 22:00 BY solo-agent][完成时间：10.25 22:05 BY solo-agent]

- 分支：dev
- 已完成：
  - 40.1 根目录新增 `start-tonic-fl.bat`（ASCII + CRLF）：桥未运行时启动桥 + FL；桥已运行时调用 `/api/panel` 把 Gopher 切回 TONIC；端口被非 TONIC 应用占用时报错退出。
  - 40.2 新增 npm 脚本 `fl:start`（`--launch-fl --panel`）与 `fl:attach`（`--panel`），bat 与手动命令共用同一入口。
  - 40.3 TONIC-FL.md 补「API 填在哪里、存在哪里」：面板「设置」/「LLM 设置」，localStorage `tonic.fl.llm.v1`，Gopher WebView2 与普通浏览器各自独立，桥不落盘。
  - 40.4 补外部 harness 的两种接法：stdio MCP（22 工具）与非 MCP 脚本可直连的本地 HTTP API；补 FL 无第三方工具栏按钮 API、VST3 成本评估与 Tauri/Electron 托盘替代。
  - 40.5 AGENTS/HANDOFF 同步启动命令、API 存储、VST3 边界。
- 测试：`start-tonic-fl.bat` 在桥已运行时识别成功、退出码 0，并 POST `/api/panel`；真实 stdio MCP 客户端列出 22 工具，`fl_status` 返回 attached + 48 工具，`get_concept_sources("ii-v-i")` 返回 Levine 章节；typecheck 通过。
- 统计不变：66 概念 / 76 谱例 / 240 引用 / 66 条白话 / 209 张复习卡。
- 边界：未做 VST3；FL 没有公开的第三方工具栏按钮 API，快速启动靠 bat/桌面快捷方式。
- 下一阶段入口：用户实际 LLM 端点验证；真实音频测量/Mix Doctor；若要做常驻启动器，优先 Tauri/Electron 托盘。
- 本次文档更新时间：10.25 22:05

## 阶段 41 混音诊断 / 路由总线 / 多轨编配 / WAV 分析 [计划时间：10.25 22:30 BY solo-agent][完成时间：10.25 23:40 BY solo-agent]

- 分支：dev
- 已完成：
  - 41.1 修复 `get_mixer_routing` 的多重转义解析（`flResultJson` 逐级 unescape）；`fl_session_report` 加入通道电平/硬声像/增益叠加、总线/返回轨、发送矩阵、环路、死端、最深路由层级。
  - 41.2 新增只读 `fl_mixer_routing`；新增写入工具 `fl_send`（按矩阵验证发送 level/关闭，默认拒绝反馈环路）与 `fl_bus`（重命名、通道路由、回主发送；默认拒绝覆盖非空轨道；总线名经 `\uXXXX` 转义避免 FL 改名乱码，通道用数值索引路由）。
  - 41.3 新增 `scripts/arranger.ts` 与 `fl_arrange`：从 TONIC 谱例生成 bass/comp/pad/melody/arp；低音按原谱最低音、comp/pad 按音域折叠并就近连接、melody 取和弦音就近、arp 八分循环；默认预览，`write:true` 才写，必须显式 channel。
  - 41.4 新增 `scripts/audio-analyze.ts` 与 CLI `audio:analyze`：解析 PCM 8/16/24/32-bit 与 IEEE float 32/64，计算 sample peak、RMS、crest、DC、削波、立体声相关/宽度、ITU-R BS.1770-4 integrated LUFS 与 short-term max。面板 FL 标签新增 WAV 上传分析；MCP 新增 `analyze_audio`。
  - 41.5 MCP 扩至 27 工具；桥新增 `/api/fl/routing|send|bus|arrange`、`/api/audio/analyze`；AGENTS/TONIC-FL/HANDOFF/PRODUCT/线上 `/agent` 同步。
- 实测：
  - 临时 3 个 FL Keys 通道 → `fl_bus` 把插入 16 命名为 TONIC Test Bus 并路由三通道（verified）→ `fl_send` 16→15 0.5（verified）→ `fl_arrange` 写入 bass 3 / comp 30 / melody 12 音符并逐轨读回一致；清理后删除三通道、插入 16 重置为默认空轨（插入 16）、0 dB/pan 0、主发送 0.8。
  - 负向测试：不存在的通道路由在改名之前报错，插入 16 保持默认；16→15 后再发 15→16 被环路保护拒绝，关闭后矩阵恢复；中文总线名经 `\uXXXX` 转义可正确写入/读回，并已恢复为“插入 16”。
  - WAV：16-bit 正弦 peak -6.02 dBFS / RMS -9.03 / LUFS -6.7 / 相关 1.00；24-bit 反相相关 -1.00 并报 phase；削波文件 35920 样本 / 17960 帧；静音文件只报 `audio-silence`；面板上传与 MCP `analyze_audio`、CLI 三路结果一致。
- 统计不变：66 概念 / 76 谱例 / 240 引用 / 66 条白话 / 209 张复习卡。
- 边界：WAV 只支持 PCM/float，`sample peak` 不是 true peak、不做频谱；FL 不能自动渲染；`fl_arrange` 是确定性声部展开，不是自动编曲；直接 `fl_call_tool` 传中文轨道名给 FL rename 工具可能乱码（`fl_bus` 已转义）。
- 下一阶段入口：真实混音目标评估（LRA/频谱/true peak）、更多编曲模板（鼓组/节奏型）、用户实际 LLM 端点验证；VST3 仍需独立原生工程。
- 本次文档更新时间：10.25 23:40
