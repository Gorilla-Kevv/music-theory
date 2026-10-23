# PROGRESS

## 进度看板

- 当前正在开发任务：阶段 13 台账扩展（新合集 + 风格化创作板块 + 旋律小调概念，已读 7 → 19）
- 下一阶段任务：9.6 Sposobin 27 条笔记深度字段 → 9.7 Levine/Laitz 剩余 `confusions` → 图谱学习路径（未排期）
- 可提前进行的任务：把书库笔记接入复习卡、FL Studio 侧适配
- 未完成的任务：全量教材正文（版权边界，不做）；MCP server；Sposobin 33 章仅有目录；Levine/Laitz 剩余 `confusions`

## 阶段 1 产品事实、技术栈与视觉方向锁定 [计划时间：10.23 09:40 BY TraeCode][完成时间：10.23 18:18 BY TraeCode]

- 分支：dev
- 已完成：PRODUCT.md、Vite + React + TS + Tailwind v4 脚手架、Blue Note 现代主义视觉方向、设计 token 初稿、Provider 骨架。
- 未完成：无
- 改动文件：PRODUCT.md、package.json、vite.config.ts、tsconfig.json、index.html、src/index.css、src/context/*.tsx
- 测试结果：`npm run typecheck` 通过。
- 风险：无。
- 下一阶段入口：阶段 2，建立 content schema 与知识库。
- 本次文档更新时间：10.23 18:35

## 阶段 2 知识 schema、24 概念、29 谱例与 76 条引用 [计划时间：10.23 10:10 BY TraeCode][完成时间：10.23 18:22 BY TraeCode]

- 分支：dev
- 已完成：三本著作书目与章节级定位；基础 8、功能和声 8、爵士 8；每条概念含正文、谱例、复习卡、别名与关联；`public/knowledge.json` 导出。
- 未完成：无
- 改动文件：src/content/types.ts、helpers.ts、bibliography.ts、foundations.ts、harmony.ts、jazz.ts、index.ts、scripts/build-knowledge.ts
- 测试结果：`npm run knowledge` → 24 concepts / 29 examples / 76 citations。
- 风险：引用只到章节级，不写页码；若需精确页码，应按手头版本补录。
- 下一阶段入口：阶段 3，接入音频、五线谱、搜索与复习。
- 本次文档更新时间：10.23 18:35

## 阶段 3 音频引擎、VexFlow 谱例、模糊检索、SM-2 复习与听辨 [计划时间：10.23 18:23 BY TraeCode][完成时间：10.23 18:26 BY TraeCode]

- 分支：dev
- 已完成：Web Audio 合成与试听坞；VexFlow 五线谱与钢琴键盘高亮；MiniSearch 中英文索引与精确短语优先；SM-2 式复习；音程/和弦/调式听辨。
- 未完成：无
- 改动文件：src/lib/audio.ts、theory.ts、search.ts、review.ts、ear.ts、storage.ts、format.ts、src/components/StaffNotation.tsx、PianoKeyboard.tsx、ExampleFigure.tsx、TransportDock.tsx
- 测试结果：CDP 真实点击播放后 4 个琴键 `aria-pressed=true`，试听坞显示 0:01/0:10；复习评分写入 `tonic.review.v1`；听辨统计写入 `tonic.ear.v1`；检索“三全音替代”返回 1 条。
- 风险：音频为合成音色，不追求钢琴采样还原；VexFlow 包体较大。
- 下一阶段入口：阶段 4，完成页面与视觉系统。
- 本次文档更新时间：10.23 18:35

## 阶段 4 应用外壳与六个页面 [计划时间：10.23 18:27 BY TraeCode][完成时间：10.23 18:30 BY TraeCode]

- 分支：dev
- 已完成：工作台、知识库、概念详情、复习与听辨、参考文献、Agent 接口；全局检索 Cmd/Ctrl+K；移动端导航；固定试听坞；论文式上下标引用。
- 未完成：无
- 改动文件：src/App.tsx、src/main.tsx、src/components/Shell.tsx、SearchDialog.tsx、ui.tsx、category.ts、src/routes/*.tsx
- 测试结果：375/768/1280 三视口截图；`document.documentElement.scrollWidth` 等于视口宽度，无横向溢出；`impeccable detect --json` 返回 `[]`。
- 风险：BrowserRouter 部署到静态服务器时需要 SPA fallback。
- 下一阶段入口：阶段 5，完成 Agent 知识包、CLI 与状态同步。
- 本次文档更新时间：10.23 18:35

## 阶段 5 Agent 知识包、TypeScript API、CLI 与学习状态同步 [计划时间：10.23 18:31 BY TraeCode][完成时间：10.23 18:33 BY TraeCode]

- 分支：dev
- 已完成：`theoryApi` 查询层；`window.TONIC` 浏览器接口；`npm run theory -- search|concept|examples|refs|queue|tools`；learning state 导出/导入；MCP 形状的 7 个 tool schema。
- 未完成：stdio MCP server 本体（按首版范围留到下一阶段）。
- 改动文件：src/lib/theory-api.ts、scripts/theory-cli.ts、src/routes/Agent.tsx、package.json、public/knowledge.json
- 测试结果：CLI 检索“三全音替代”返回 J-05；`window.TONIC.search('五度圈')` 返回 2 条；pack meta 为 24/29/76。
- 风险：CLI 的 `queue` 需要网页导出的 `review-state.json`，不直接读取浏览器 localStorage。
- 下一阶段入口：阶段 6，最终验证、文档与提交。
- 本次文档更新时间：10.23 18:35

## 阶段 6 构建验证、可访问性收尾、设计文档与提交 [计划时间：10.23 18:34 BY TraeCode][完成时间：10.23 18:42 BY TraeCode]

- 分支：dev
- 已完成：`npm run typecheck`、`npm run build`、知识包重新生成、`impeccable detect --json` 无发现、三视口截图、对比度修正、移动端菜单焦点陷阱、复习卡键盘操作、DESIGN.md 与 HANDOFF.md。
- 未完成：无（首版范围）
- 改动文件：PRODUCT.md、PROGRESS.md、HANDOFF.md、DESIGN.md、src/**、scripts/**、public/knowledge.json、vite.config.ts
- 测试结果：构建成功；主入口与 vendor chunk 分离（react / vexflow / search）；控制台仅 Vite 与 React DevTools 信息，无运行时错误。
- 风险：VexFlow chunk 约 311KB gzip；`public/knowledge.json` 在 `prebuild` 中自动刷新。
- 下一阶段入口：无；后续从 HANDOFF.md 的“下一步”继续。
- 本次文档更新时间：10.23 18:42

## 阶段 7 和声知识库、书库、左侧大纲、可视化与谱面/采样交互 [计划时间：10.23 19:10 BY TraeCode][完成时间：10.23 21:33 BY TraeCode]

- 分支：dev
- 已完成：
  - P0：新增 9 个和声概念（终止四六、模进、减七、和声节奏、色彩、明暗、调性距离、低音线、乐句）与 4 个爵士概念；扩充到 37 概念 / 42 谱例 / 118 条引用。
  - 三本书整理为 118 个完整章目 + 59 条原创章节笔记（Levine 24/12、Laitz 34/20、Sposobin 60/27），新增 `/books` 书库与章节笔记阅读器。
  - P1：概念页左轨新增 ON THIS PAGE 大纲，滚动高亮并在左轨内部保持可见；移动端折叠大纲；分类导航按当前概念或 `/library?category=` 高亮。
  - P1：五度圈、调式轮、半音尺、张力光谱四个交互可视化，点击即试听。
  - P1：五线谱每个音符/和弦叠加可点击命中区，点击发声并联动钢琴高亮。
  - P2：用本地 Salamander 钢琴采样（C3–C5，9 个采样，CC BY 3.0）替换纯合成音色，保留合成器回退。
  - AGENTS.md 固化来源、版权、和声维度与 Agent 查询规则。
- 未完成：全量教材正文（版权边界，不复制）；stdio MCP server（schema 已固定）。
- 改动文件：src/content/books/*、harmony-advanced.ts、jazz-advanced.ts、src/routes/Books.tsx、src/components/VisualizationCard.tsx、Shell.tsx、StaffNotation.tsx、ExampleFigure.tsx、src/lib/audio.ts、theory-api.ts、scripts/theory-cli.ts、public/audio/salamander/*、AGENTS.md、PRODUCT.md、DESIGN.md、HANDOFF.md
- 测试结果：
  - `npm run typecheck` 通过。
  - 真实点击谱面 Dm9 命中区 → 钢琴高亮 D3/F3/A3/C4/E4；9 个 Salamander 采样均成功加载。
  - 五度圈 12 个扇区、点击 A 后中心显示 A / 3♯；书库 Laitz 34 章 / 20 笔记；`searchSources('转调', {book:'sposobin'})` 返回 14 条。
  - 375 宽度 `scrollWidth=375`，无横向溢出；左轨点击分类后对应分类钴蓝高亮。
- 风险：教材笔记需持续人工校订；采样仅覆盖 C3–C5 后移调；`getBoundingBox` 命中区依赖 VexFlow 布局。
- 下一阶段入口：补充更多章节笔记；包装 stdio MCP server；将书库笔记接入复习卡。
- 本次文档更新时间：10.23 21:33

## 阶段 8 快速启动 bat [计划时间：10.23 21:37 BY TraeCode][完成时间：10.23 21:45 BY TraeCode]

- 分支：dev
- 已完成：`start.bat` 双击启动；检查 Node/npm；首次自动安装依赖；检测 5173 是否已有 TONIC；非 TONIC 占用则报错；启动 Vite 后 3 秒打开浏览器；支持 `TONIC_NO_OPEN=1` 只启动服务。
- 未完成：无
- 改动文件：start.bat、HANDOFF.md、AGENTS.md、PROGRESS.md
- 测试结果：首次运行 → Vite ready + HTTP 200；第二次运行 → `[READY] TONIC is already running`；ASCII + CRLF 下无乱码。
- 风险：端口被其他应用占用时会阻止启动，避免误开别的站点；需要用户关闭占用或修改端口。
- 下一阶段入口：无。
- 本次文档更新时间：10.23 21:45

## 阶段 9 两本教材深度覆盖、白话拆解与体系图谱 [计划时间：10.23 22:05 BY TraeCode][完成时间：10.23 23:30 BY TraeCode]

- 分支：dev
- 任务定位：用户当前唯一优先任务。目标不是“再多写一点”，而是把 The Complete Musician 与《爵士乐宝典》整理成可检索、可解释、可视化的专业进阶知识结构；该阶段会持续迭代，不把“字典式目录”视为完成。
- 已完成：
  - 9.1 书库覆盖：Levine 24/24 章、Laitz 34/34 章均有原创笔记与 `deepSummary`；三本书合计 85 条笔记（Levine 24 / Laitz 34 / Sposobin 27）。
  - 9.2 深度字段：`NoteSeed` / `BookChapter` 新增 `deepSummary`、`analysis`、`crossBook`、`visualHint`、`confusions`；Books 页渲染“深入归纳 / 跨书对应 / 可视化映射 / 常见误解”。
  - 9.3 白话拆解：新增 37 条 `deepDive`，覆盖基础 8 + 和声 17 + 爵士 12 全部概念；概念页新增 `IN PLAIN LANGUAGE / 白话拆解` 板块，左轨与移动端大纲同步；引用进入页末注释。
  - 9.4 体系图谱：新增 `/atlas`，3 来源 / 6 系统枢纽 / 37 概念 / 86 关联 / 25 前置；支持分类与六维筛选、悬停/点击邻域高亮、`?focus=slug` 深链；概念页右栏新增“ATLAS / 体系位置”。
  - 9.5 视觉与可读性：图谱从 4 列密排调整为 1000 高分层布局，标签截断到 8 字，来源→枢纽按真实相关性连接；1280 与 375 截图检查通过，移动端仅图内横向滚动，页面无横向溢出。
- 未完成（下一批，按优先级）：
  - 9.6 Sposobin 27 条笔记补 `deepSummary` / `analysis` / `crossBook`；其余 33 章仍只有目录，不伪造摘要。
  - 9.7 Levine/Laitz 剩余章节补 `confusions`（当前 12/24、14/34）；基础 8 条白话拆解已完成（37/37）。
  - 9.8 体系图第二阶段：章节级来源高亮、学习路径/前置链模式、概念页与图谱的章节联动。
  - 9.9 书库笔记接入复习卡；为长笔记增加“要点回链概念”的跳转。
- 改动文件：src/content/deep-dives.ts、src/content/graph/index.ts、src/routes/Atlas.tsx、src/routes/ConceptPage.tsx、src/components/Shell.tsx、src/content/books/levine.ts、src/content/books/laitz.ts、src/content/books/types.ts、src/content/types.ts、src/content/index.ts、src/routes/Books.tsx、AGENTS.md、PRODUCT.md、DESIGN.md、HANDOFF.md、PROGRESS.md
- 测试结果：
  - `npm run typecheck` 通过。
  - `npm run knowledge` → 37 concepts / 42 examples / 136 citations；书库 24+34+27=85 notes。
  - 概念页 `/theory/cadential-six-four` 出现白话拆解与左轨大纲项；书库 `levine-13` 显示深入归纳、跨书对应、可视化映射。
  - 1280 截图检查通过；375 下 `scrollWidth=375`，体系图在容器内横向滚动。
- 风险：
  - 深度笔记与白话解释仍需人工校订；所有定位只到章，不写页码。
  - 教材正文版权边界：不复制、不 OCR、不整段搬运；用户若持有合法电子版，只能在本地私有阅读器中使用，不进入仓库。
  - 图谱是编辑关系，不是唯一理论体系；后续增加边时必须避免噪声与“每本书连所有枢纽”。
- 下一阶段入口：9.6 → 9.7 → 9.8 → 9.9；完成后再评估阶段 10。
- 本次文档更新时间：10.23 23:30

## 阶段 10 现代和声与中古调式扩展（B 站课程调查）[计划时间：10.23 23:40 BY TraeCode][完成时间：10.24 00:20 BY TraeCode]

- 分支：dev
- 调查方式：用 `bili-duty` 读取 B 站合集「爵士和声理论」（mid 1405367071 / season 762895，共 68 集）的完整目录；按主题抽取 7 集字幕做结构化调查：上02 调式音阶、下44 调式特征音、下45 Lydian、下50 四度和声、下51 组合和弦、下52 固定结构/无功能和声、下34 相邻属和弦。
- 调查结论（作为选题地图，不作为理论来源）：现有库缺 6 个现代和声节点——中古调式特征音/调式终止、七种调式互换、四度和声、混合/复合/斜杠和弦、无功能属和弦、固定结构/平行和弦。
- 已完成：
  - 10.1 新增 6 个概念（H-18..H-23）：`modal-characteristics`、`modal-interchange`、`quartal-harmony`、`hybrid-chords`、`non-functional-dominants`、`constant-structure`。
  - 10.2 每个概念含 2 节正文、可听谱例、复习卡、关联概念与维度；保留“只引用三本书”的硬约束（Laitz 1A/1C/21/22/28/29/30、Levine 2/3/5/13/14、Sposobin 27/48/55/56）。
  - 10.3 新增 6 条白话拆解，deep dive 覆盖 43/43。
  - 10.4 分类“功能和声”更名为“和声”（HARMONY），描述扩展为功能、调式、四度排列与无功能和声；图谱新增 7 条前置链。
  - 10.5 统计更新：43 概念 / 48 谱例 / 164 条引用 / 43 条白话拆解；图谱 3 来源 / 6 枢纽 / 43 概念 / 104 关联 / 32 前置。
- 未完成：
  - 10.6 逐调式扩展：为 Lydian、Mixolydian、Dorian、Phrygian、Aeolian 各补一个独立谱例/案例（当前只有 Dorian 综合例）。
  - 10.7 把“相邻属和弦”的渐进转调做成可视化路径（图谱或五度圈叠加）。
  - 10.8 Sposobin 深度字段与 Levine/Laitz `confusions` 仍按阶段 9 队列推进。
- 改动文件：src/content/harmony-advanced.ts、src/content/deep-dives.ts、src/content/graph/index.ts、src/content/index.ts、src/components/SearchDialog.tsx、AGENTS.md、PRODUCT.md、DESIGN.md、HANDOFF.md、PROGRESS.md
- 测试结果：
  - `npm run typecheck` 通过。
  - `npm run knowledge` → 43 concepts / 48 examples / 164 citations；分类 8 + 23 + 12。
  - 图谱统计 → 104 关联 / 32 前置。
- 风险：
  - B 站课程只用于发现主题与组织顺序，具体理论断言仍必须回到三本书；视频中的说法若三本书无法定位，不写入知识库。
  - 现代和声术语（hybrid/poly/constant structure）在三本书中的译名不完全统一，正文采用“英文术语 + 中文解释”，避免伪造原书原话。
  - 新增概念集中在高级层，初学者需要先完成基础/功能和声路径；图谱前置链已补但学习路径模式尚未做。
- 下一阶段入口：10.6 → 10.7，然后回到 9.6/9.7。
- 本次文档更新时间：10.24 00:20

## 阶段 11 调式谱例补全与相邻属和弦可视化（完成 10.6 / 10.7）[计划时间：10.24 00:30 BY solo-agent][完成时间：10.24 00:55 BY solo-agent]

- 分支：dev
- 任务定位：执行阶段 10 遗留的 10.6、10.7 两项，不打断 9.6/9.7 队列。
- 已完成：
  - 11.1（=10.6）`modal-characteristics` 新增 4 条调式谱例：E Phrygian（i–bII–i）、F Lydian（I–II–I）、G Mixolydian（I–bVII–I）、A Aeolian（i7–bVI–i7）。五条谱例（含原 D Dorian）共用 C 大调集合，只换主音，呼应概念正文“七种调式共用同一组音高”；正文增加“同一集合试听”提示块。谱例总数 48 → 52。
  - 11.2（=10.7）新增第五种可视化 `dominant-path`（相邻属和弦路径）：在五度圈上叠加 C7→D7→Eb7→Ab7→Db 路径，橙线为相邻上行（无功能），钴蓝线为下行五度（功能解决）；点击节点试听对应属七/目标三和弦，中心显示该步的判断说明；“播放整条进行”复用概念谱例 `ex-adjacent-dominants` 与全局试听坞。挂载到 `non-functional-dominants` 概念页。
- 未完成：9.6 / 9.7 / 9.8 / 9.9 按原队列继续。
- 改动文件：src/content/harmony-advanced.ts、src/content/types.ts、src/components/VisualizationCard.tsx、public/knowledge.json、AGENTS.md、PRODUCT.md、HANDOFF.md、PROGRESS.md
- 测试结果：
  - `npm run typecheck` 通过；`npm run build` 通过（prebuild 刷新 knowledge.json）。
  - `npm run knowledge` → 43 concepts / 52 examples / 164 citations。
  - 1280 全页截图：`/theory/non-functional-dominants` 可视化路径、图例、中心信息渲染正确；`/theory/modal-characteristics` 显示 FIG.03–07 五条调式谱例。
  - 375 视口两页 `scrollWidth=375`，无横向溢出。
- 风险：dominant-path 的 D7→Eb7 直线横穿圈面，属预期对比（相邻属和弦本就不沿圈走）；后续若加更多路径叠加，需要考虑分层开关，避免噪声。
- 下一阶段入口：9.6 Sposobin 深度字段 → 9.7 confusions → 9.8 图谱学习路径。
- 本次文档更新时间：10.24 00:55

## 阶段 12 B 站课程调研台账（已读/已编目，避免重复搜索）[计划时间：10.24 01:05 BY solo-agent][完成时间：10.24 01:30 BY solo-agent]

- 分支：dev
- 任务定位：把已经检索/读取过的 B 站课程视频写进知识库，让 Agent 与人工在下一轮调研前先查台账，避免重复搜索。
- 已完成：
  - 12.1 新增 `src/content/bilibili.ts`：记录合集「爵士和声理论」（mid 1405367071 / season 762895）全部 68 条视频元数据；每条含 BV、标题、上/下集号、时长、发布日期、链接、状态、主题标签。
  - 12.2 状态区分 `read`（已读字幕并写一句话结论）与 `catalogued`（仅登记目录）：当前 7 条已读、61 条仅编目；已读条目映射到 `usedIn` 概念并标注 `readAt`。
  - 12.3 `/references` 新增 `VIDEO RESEARCH` 台账：已读视频显示集号、标题、BV、结论、主题与概念链接；未读视频折叠在 `<details>` 中。
  - 12.4 Agent 接口：`get_video_research`、`window.TONIC.videos({ status, query, theme })`、CLI `npm run theory -- videos [--status read] [--query ...]`；`knowledge.json` 增加 `videoResearch` 与 `meta.videoCount/videoReadCount`。
  - 12.5 AGENTS.md 固化台账规则：只存元数据与原创一句话结论，不存字幕/正文；视频不作为理论依据，新增前先查 BV 去重。
- 未完成：
  - 12.6 后续每读一集，把 `status` 改为 `read`，补 `takeaway`、`usedIn`、`readAt`；未读集保持 `catalogued`。
  - 12.7 若要扩展到其他 UP 主或合集，先建第二个 season 条目，不要混进当前合集。
- 改动文件：src/content/bilibili.ts、src/content/index.ts、src/lib/theory-api.ts、scripts/theory-cli.ts、src/routes/References.tsx、src/routes/Agent.tsx、AGENTS.md、PRODUCT.md、DESIGN.md、HANDOFF.md、PROGRESS.md、public/knowledge.json
- 测试结果：
  - `npm run typecheck` 通过。
  - `npm run knowledge` → 43 concepts / 52 examples / 164 citations；`meta.videoCount=68`、`meta.videoReadCount=7`。
  - `npm run theory -- videos --status read` 返回 7 条；`--query 调式` 能命中已读条目。
  - `/references` 台账在 1280/375 渲染正常，未读条目默认折叠。
- 风险：
  - 台账是抓取时的快照；B 站标题、时长、播放量可能变化，不把播放量写入台账。
  - 视频标题与结论只是索引，不是理论依据；所有概念正文仍只引用三本书。
- 下一阶段入口：回到 9.6 Sposobin 深度字段 → 9.7 confusions → 9.8 图谱学习路径。
- 本次文档更新时间：10.24 01:30

## 阶段 13 台账扩展：新合集、风格化创作板块与旋律小调概念 [计划时间：10.24 01:40 BY solo-agent][完成时间：10.24 01:55 BY solo-agent]

- 分支：dev
- 任务定位：按用户给定的新 B 站内容继续提取并填充知识：新爵士合集（mid 278407980 / season 3336077）、独立板块「风格化创作」（mid 15099599 / season 247985，无人声视频用多模态读帧）、两条合集外补充视频；同时把调研→入库→同步固化为工作规范。
- 已完成：
  - 13.1 台账升级为多合集结构：`BILIBILI_COLLECTIONS`（4 合集：jazz-harmony 68 / jazz-academy 10 / stylized-creation 31 / jazz-extras 2，合计 111 条）；视频新增 `collection` 与 `via`（subtitle / asr / frames）字段；`BILIBILI_SEASON` 退役。
  - 13.2 新读取 12 条（已读总数 7 → 19）：补充视频 2 条（扩展音总览、排列“滚雪球”学习法）；jazz-academy EP01/02/04/07/09/10（调式记忆与明暗排序、一个和弦一个调、调式爵士、斜线和弦、旋律小调和声——EP02 无字幕轨走 Gemini ASR）；风格化创作 4 条无人声视频（Mixolydian 摇滚、Phrygian 史诗张力、中世纪神秘色彩、单和弦铺歌）用关键帧多模态读取。
  - 13.3 知识填充：新增概念 J-13 `melodic-minor-modes`（旋律小调调式与调式和弦，Levine 第 3 章定位）——2 节正文、C 旋律小调三调式谱例、复习卡、白话拆解、图谱前置（minor-scales / chord-scale → melodic-minor-modes）、levine-03 书库映射；EP09/EP10/补充视频的 `usedIn` 全部落到现有概念。
  - 13.4 `/references` 台账页改为合集卡片总览 + 已读卡片带板块与 VIA 标记 + 编目列表按合集分组；`get_video_research` 与 `window.TONIC.videos` 支持 `collection` 参数。
  - 13.5 AGENTS.md 固化「B 站调研工作规范」（编目→读取→归板块→同步→收尾六步），后续同类需求不再需要用户提醒。
- 未完成：9.6 / 9.7 / 9.8 按原队列继续；jazz-academy EP03/05/06/08 与风格化创作其余 27 条保持 `catalogued` 待读。
- 改动文件：src/content/bilibili.ts、src/content/jazz-advanced.ts、src/content/deep-dives.ts、src/content/graph/index.ts、src/content/books/levine.ts、src/lib/theory-api.ts、src/routes/References.tsx、.impeccable/capture-section.mjs（新增区块截图脚本）、AGENTS.md、PRODUCT.md、HANDOFF.md、PROGRESS.md、public/knowledge.json
- 测试结果：
  - `npm run typecheck` 与 `npm run build` 通过。
  - `npm run knowledge` → 44 concepts / 53 examples / 166 citations；`meta.videoCount=111`、`videoReadCount=19`。
  - 图谱统计 → 3 来源 / 6 枢纽 / 44 概念 / 108 关联 / 34 前置。
  - `npm run theory -- videos --status read` 返回 19 条（跨四个合集）。
  - 截图：`/references` 1280 合集卡片与已读卡片渲染正确，375 `scrollWidth=375` 无溢出；`/theory/melodic-minor-modes` 概念页完整（正文、别名、来源、图谱位置、白话拆解）。
- 风险：风格化创作板块是编曲演示，主题标签偏配器/律动，理论映射以调式类概念为主；无人声视频的 `via: "frames"` 结论只覆盖画面文字与谱面信息。
- 下一阶段入口：9.6 Sposobin 深度字段 → 9.7 confusions → 9.8 图谱学习路径。
- 本次文档更新时间：10.24 01:55
