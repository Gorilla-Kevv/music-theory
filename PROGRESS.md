# PROGRESS

## 进度看板

- 当前正在开发任务：阶段 21 电子书内嵌与书库严格 1:1 重构（完成）
- 下一阶段任务：书库深化流水线（逐章读内嵌原书升级笔记）→ SoundQuest 元音乐理论（C63 建设中）待读 → 图谱学习路径
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

## 阶段 14 五线谱与琴键长按持续发声 [计划时间：10.24 02:20 BY solo-agent][完成时间：10.24 02:40 BY solo-agent]

- 分支：dev
- 任务定位：用户反馈谱面点击"只能短按一次且不持续显示"；目标是指针按住即持续发声、钢琴高亮跟随按住时间，松手淡出；快速点击与键盘操作保持原有行为。
- 已完成：
  - 14.1 音频引擎新增 `holdStart(midis) → id` / `holdEnd(id)`：长按声部走独立 `holdBus`（→ dry/reverb），不经过 `bus`，因此示例播放/停止互不影响；引擎强制最短发声 0.35s（快速点按也可听）、松手 setTargetAtTime ~0.3s 淡出；采样声部按自然衰减结束，合成回退带 8s 硬上限。
  - 14.2 新增共享 hook `useHeldPreview`（src/hooks）：统一管理 flash（一次性点击 900ms 高亮）与 press/release（按住高亮 + 松手 600ms 停留），以 key 支持多点按住，release 对未按住的 key 为 no-op，卸载时释放全部 hold。
  - 14.3 `StaffNotation` 命中区与 `PianoKeyboard` 琴键接入 pointer 事件（down/up/cancel/leave + contextmenu 阻止 + touch-none/select-none），按下时命中区显示钴蓝边框；键盘激活（click `detail===0`）仍走 `previewNote/previewChord` 一次性试听。`ExampleFigure` 与首页 hero 谱例均接线。
- 未完成：无。
- 改动文件：src/lib/audio.ts、src/context/TransportContext.tsx、src/hooks/useHeldPreview.ts（新增）、src/components/StaffNotation.tsx、src/components/PianoKeyboard.tsx、src/components/ExampleFigure.tsx、src/routes/Home.tsx、.impeccable/hold-check.mjs（新增交互测试）、AGENTS.md、PRODUCT.md、HANDOFF.md、PROGRESS.md
- 测试结果：
  - `npm run typecheck` 与 `npm run build` 通过。
  - CDP 真实鼠标长按 `/theory/ii-v-i` 的 Dm9 命中区：按住 300ms/1000ms 时 5 个琴键 `aria-pressed=true` 持续点亮，松手 120ms 后仍亮（停留），900ms 后归零；全程无运行时异常（`.impeccable/review/hold-check.json`）。
  - 测试坑：命中区在首屏之下时必须先 `scrollIntoView`，否则 CDP 坐标落在视口外、`elementFromPoint` 返回 null。
- 风险：`touch-none` 使触摸起手落在音符/琴键上时不能从该点滚动页面（可玩性优先）；长按声部不受全局 `stop()` 影响，属预期。
- 下一阶段入口：9.6 Sposobin 深度字段 → 9.7 confusions → 9.8 图谱学习路径。
- 本次文档更新时间：10.24 02:40

## 阶段 15 左栏分类目录与右栏 ON THIS PAGE [计划时间：10.24 03:00 BY solo-agent][完成时间：10.24 03:15 BY solo-agent]

- 分支：dev
- 任务定位：用户要求 ① 左侧栏显示 `/library?category=` 当前分类的概念目录，进入概念页后该目录可点击展开/收起；② 概念页 ON THIS PAGE 从左栏底部移到右栏，与站点导航做出区分。
- 已完成：
  - 15.1 左栏 CATALOG：当前分类行内嵌该分类全部概念的目录（编号 + 标题），当前概念以 acid 色高亮；分类行尾 chevron 按钮切换展开/收起（`aria-expanded`），状态持久化到 localStorage `tonic.rail.catalog.v1`，默认展开；分类名本身仍是到 `/library?category=` 的链接。
  - 15.2 布局：左栏中部（主导航 + CATALOG）改为 `dark-scroll` 可滚动容器，目录展开过长时容器内滚动，REVIEW QUEUE 仍然贴底；删除原左栏底部的 ON THIS PAGE 块。
  - 15.3 概念页右栏顶部新增深色 ON THIS PAGE 卡片（`hidden lg:block`，ink 底 + 滚动追踪），与右侧纸质元数据卡形成明暗区分；`useActiveSection` 45% 阈值与当前项 `scrollIntoView({block:'nearest'})` 行为保留；移动端继续使用页面顶部的 `<details>` 大纲（数据源与桌面卡片统一为 `outlineItems`）。
- 未完成：无。
- 改动文件：src/components/Shell.tsx、src/routes/ConceptPage.tsx、.impeccable/rail-check.mjs、.impeccable/rail-state-check.mjs（新增交互/状态检查脚本）、AGENTS.md、HANDOFF.md、PROGRESS.md
- 测试结果：
  - `npm run typecheck` 与 `npm run build` 通过。
  - CDP 交互测试（`.impeccable/rail-check.mjs`）：和声分类目录 23 项 → 点击收起 0 项（aria-label 翻转、localStorage=closed）→ 再展开 23 项，PASS。
  - 状态检查（`rail-state-check.mjs`）：`/library?category=harmony` 目录无高亮项；概念页当前项高亮。
  - 截图：概念页 1280 左栏目录 + 右栏深色大纲卡渲染正确；375/768 `scrollWidth` 无横向溢出。
- 风险：目录展开时左栏中部进入内部滚动（内容超过视口高度时）；移动端不受影响（目录仅 lg 显示）。
- 下一阶段入口：9.6 Sposobin 深度字段 → 9.7 confusions → 9.8 图谱学习路径。
- 本次文档更新时间：10.24 03:15

## 阶段 16 B 站专栏归档：属降十和弦归纳 [计划时间：10.24 03:35 BY solo-agent][完成时间：10.24 03:45 BY solo-agent]

- 分支：dev
- 任务定位：用户提供截图（Nat不会弹吉他《【作曲: 如何在传统中创新】学个妙和声之"属降十和弦"》），要求按既有调研规范归纳入库；首次引入专栏文章类型。
- 内容归纳（仅入台账，不进理论正文——文章论断为作者个人综合，未做三本书章节级定位）：
  - 布鲁斯 V7#9（Hendrix 和弦）在布鲁斯中失去部分属功能，文中以 X7#9 指音响而非功能 → 呼应 `non-functional-dominants`（属七音响 ≠ 属功能）。
  - I7#9 同时包含 3 与等音 b3（#9），可读作 Im7 add10；古典用解决方向判 b10/#9，布鲁斯用音阶（同主音大/小调五声皆可）判断 → 呼应 `extensions-alterations` 与 `blues`。
  - 4m（iv）可用近关系/同主音小调的音（b6），也可反过来读作"IV major omit 3 add #9"；iv 上 9 与 #9 并用 → 呼应 `modal-mixture-color`。
  - 结论：大三和弦的 #9/b10 本质是同主音/近关系大小调的色彩争夺；往大调解决用 #9，往小调解决用 b13。
- 已完成：
  - 16.1 用带登录 cookie 的文章搜索 API（`search_type=article`）定位文章 CV53580498（2026-10-23 发布，719 字，作者 mid 8934095），并取回 `x/article/view` 元数据。
  - 16.2 台账 schema 新增 `kind?: "video" | "article"`（`bvid` 存 CV 号、duration 0）与 `via: "text"`；新合集 `theory-articles`（B 站专栏归档·和声随笔，爵士和声板块）。
  - 16.3 文章条目以 `read` 入库，themes 布鲁斯/7#9 和弦/等音读法/大小调色彩，`usedIn` → blues / extensions-alterations / non-functional-dominants / modal-mixture-color；台账总数 111 → 112，已读 19 → 20。
  - 16.4 `/references` 已读卡片新增「专栏 ARTICLE」钴蓝标记，说明文案改为"课程视频与专栏文章"；AGENTS.md 工作规范第 2 步补充专栏文章的定位与读取路径。
- 未完成：文章论断未写入概念正文（来源政策：三本书无法定位的综合判断不进知识库）；若后续在 Levine 布鲁斯/变化属七相关章节完成定位，可再考虑给 `blues` 或 `extensions-alterations` 增补 7#9 谱例。
- 改动文件：src/content/bilibili.ts、src/routes/References.tsx、AGENTS.md、HANDOFF.md、PROGRESS.md、public/knowledge.json
- 测试结果：
  - `npm run typecheck`、`npm run knowledge`（44/53/166 不变）、`npm run build` 通过。
  - `npm run theory -- videos --query 属降十` 返回 CV53580498（READ / 专栏）。
  - `/references` 截图：112 VIDEOS / 92 CATALOGUED / 20 READ，五个合集卡片（新增专栏归档），文章卡片含专栏 ARTICLE + VIA TEXT 标记与 4 个概念映射。
- 风险：`bvid` 字段复用存 CV 号属于务实折中；若后续文章数量增多，考虑把字段改名为通用 `refId`（需要同步 Agent 接口说明）。
- 下一阶段入口：9.6 Sposobin 深度字段 → 9.7 confusions → 9.8 图谱学习路径。
- 本次文档更新时间：10.24 03:45

## 阶段 19 站点目录驱动的知识扩充（新增 6 概念）[计划时间：10.24 10:40 BY solo-agent][完成时间：10.24 11:05 BY solo-agent]

- 分支：dev
- 调查方式：用户提供 music-theory.aizcutei.com（自由派音乐理论，SoundQuest 中译）全站目录截图与日文原站 soundquest.jp。按来源政策，站点目录只作为**选题地图**（PRODUCT.md 已将其列为信息组织参考），全部理论断言回三本书定位后入库。
- 调查结论（选题地图 → 缺口盘点）：现有 44 概念缺少——节拍/切分（节奏领域空白）、旋律与动机发展（旋律领域空白）、和弦外音（分析刚需）、挂留和弦、对称音阶（全音/八音/增）、五声音阶（基础音阶缺位）。站点中无法在三本书定位的主题不入库：连接系统论、轴心体系、Lydian Chromatic Concept、新里曼理论、元音乐理、泛音列（Laitz/Sposobin 目录无对应章节）。
- 已完成：
  - 19.1 基础 +3：F-09 `meter-syncopation`（Laitz 1B/02）、F-10 `melody-motives`（Laitz 02/04）、F-11 `pentatonic-scales`（Laitz 30 + Levine 09）。
  - 19.2 和声 +2：H-24 `non-chord-tones`（Laitz 04/10 + Sposobin 36/38——Sposobin 和弦外音全章首次启用）、H-25 `suspended-chords`（Laitz 04 + Levine 03）。
  - 19.3 爵士 +1：J-14 `symmetric-scales`（Laitz 28/29 + Levine 03）。
  - 19.4 每个概念含 2 节正文、可听谱例（切分对比、动机移位、五声线、外音旋律、Gsus4→G7→Cmaj7、C7♯5/C7♭9 对称对比）、复习卡、维度与关联；6 条白话拆解（deep dive 覆盖 50/50）。
  - 19.5 图谱：新增 11 条前置链（节拍→和声节奏/乐段、旋律→乐段、外音→终止四六、挂留→四度和声、减七→对称、和弦音阶→对称、五声→外部五声等）；`ATLAS_HEIGHT` 1120 → 1320 容纳 13 行节点。
- 统计更新：50 概念（基础 11 / 和声 25 / 爵士 14）/ 59 谱例 / 181 引用 / 50 白话拆解；图谱 3 来源 / 6 枢纽 / 50 概念 / 129 关联 / 45 前置。
- 未完成：挂留和弦的 Levine 小节名（“sus 与 Phrygian 和弦”）建议下次持书核对；泛音列、多调性等待定位主题留作后续；9.6/9.7 队列不变。
- 改动文件：src/content/foundations.ts、harmony-advanced.ts、jazz-advanced.ts、deep-dives.ts、graph/index.ts、public/knowledge.json、AGENTS.md、PRODUCT.md、HANDOFF.md、PROGRESS.md
- 测试结果：
  - `npm run typecheck`、`npm run knowledge`（50/59/181）、`npm run build` 通过。
  - `npm run theory -- search 和弦外音` 命中 H-24。
  - 截图：`/theory/non-chord-tones` 1280 完整渲染（正文/白话拆解/右栏大纲/别名/来源）；`/atlas` 显示 50 CONCEPTS · 129 RELATIONS · 45 PREREQUISITES，基础 11 / 和声 25 / 爵士 14；375 `scrollWidth=375`。
  - 回归：`scroll-trace.mjs` 在新页 `/theory/symmetric-scales` 滚动全程正常（阶段 18 修复未被破坏）。
- 下一阶段入口：9.6 Sposobin 深度字段 → 9.7 confusions → 9.8 图谱学习路径。
- 本次文档更新时间：10.24 11:05

## 阶段 20 来源政策放开、站点理论入库与 Sposobin 补全 [计划时间：10.24 11:30 BY solo-agent][完成时间：10.24 12:00 BY solo-agent]

- 分支：dev
- 用户指令：① 取消“站点自己的理论框架不搬”，以前丢弃的内容全部入库；② 审查三本书的书库解读（“看起来和原版没有任何关系”）。
- 已完成：
  - 20.1 来源政策改为两层制：Tier 1 三本书（章节级 locator，不变）；Tier 2 SoundQuest 站点（`source: "soundquest"`，篇章级 locator 如 `和弦篇 C64「轴心体系」`）。`SourceId` 扩展、书目加站点条目、References/Books 样式跟进。红线不变：全部原创归纳，不复制正文。
  - 20.2 站点理论入库 5 条（WebFetch 抓取页面后原创归纳）：F-12 `harmonic-series` 泛音列（C4）、H-26 `connection-system` 连接系统论（C15/C16/C23）、H-27 `axis-system` 轴心体系（C64，含 Kárpáti 批评）、H-28 `neo-riemannian` 新里曼 PLR（超流派）、J-15 `lydian-chromatic-concept` LCC（C65，明示“公设非定理”）。每条含正文、可听谱例、复习卡、白话拆解、图谱前置（11 条新前置链）。元音乐理论（C63）站点建设中（404），记入待读。
  - 20.3 Sposobin 书库笔记 27 → 60/60 全覆盖：补 04/05/06/07/10–13/15/16/23–25/27/29/30/33/36–45/48/51/52/54/55/58 共 33 条（基于章名的初稿，概念映射到 non-chord-tones/voice-leading/tonal-distance 等现有 slug；待持书深化）。
  - 20.4 统计：55 概念（基础 12 / 和声 28 / 爵士 15）/ 65 谱例 / 188 引用 / 55 白话拆解；图谱 147 关联 / 54 前置；书库 118/118。
- 书库审查结论（对用户如实汇报）：Levine/Laitz 24+34 条与 Sposobin 前 27 条有 summary/deepSummary，但**全部笔记未经书的正文核对**（无正文可用），是从章目+专业知识写的原创重构——这是“看起来和原版没关系”的根本原因；Sposobin 新补 33 条仅章名级。深化路径已写入 HANDOFF：用户把合法电子版放本地 gitignore 目录，Agent 逐章读后升级笔记（仍不复制原文）。
- 测试结果：`npm run typecheck` / `npm run knowledge`（55/65/188）/ `npm run build` 通过；`/books?book=sposobin` 显示 60 NOTES；`/theory/axis-system` 375 无横向溢出。
- 风险：站点自创理论（轴心/LCC）的条目已明示学界批评与“工具非真理”定位；站点持续增删页面，locator 以抓取时目录为准。
- 下一阶段入口：书库深化（等电子版）→ 元音乐理论待读 → 图谱学习路径。
- 本次文档更新时间：10.24 12:00

## 阶段 17 分类目录整栏可点击 [计划时间：10.24 04:00 BY solo-agent][完成时间：10.24 04:05 BY solo-agent]

- 分支：dev
- 任务定位：用户反馈折叠切换不应只靠行尾小 chevron 按钮——当前分类整条栏都要可以点击。
- 已完成：左栏 CATALOG 当前分类行由「链接 + 小按钮」改为**整栏切换按钮**（点任意位置展开/收起，`aria-expanded` 与 localStorage 持久化不变，chevron 仅作指示并随 hover 变 acid 色）；非当前分类行保持为 `/library?category=` 跳转链接。去掉了当前分类行上的 `aria-current`（该行不再导航，当前页语义由 LIBRARY 导航项承担）。
- 测试结果：`npm run typecheck` / `npm run build` 通过；`rail-check.mjs` 直接对 5173 dev 服务实测：点击分类栏中部（名称区）23 项 → 收起 0 项 → 再展开 23 项，PASS。
- 本次文档更新时间：10.24 04:05

## 阶段 18 修复内容页无法向下滚动 [计划时间：10.24 04:20 BY solo-agent][完成时间：10.24 04:35 BY solo-agent]

- 分支：dev
- 问题定位：用户报告内容页无法翻滚向下查看。CDP 诊断（scroll-trace.mjs 给 scrollTo/scrollIntoView 打补丁）：滚动到 900px → activeSection 变为"白话拆解" → 右栏 ON THIS PAGE 卡片的跟随 effect 调用 `scrollIntoView({block:"nearest"})`，因活动链接位于卡片 `max-h-[46vh]` 内部裁剪区之外，浏览器按"最近"算法把 **window** 也滚回去（900→532→502 死循环收敛），每次向下滚动都被弹回。根因是阶段 15 把大纲挪进右栏限高卡片时引入的嵌套滚动陷阱；旧左栏容器足够高从不裁剪，故此前未暴露。
- 修复：ConceptPage 大纲跟随 effect 不再用 scrollIntoView，改为 getBoundingClientRect 差值只调整卡片内部容器的 `scrollTop`——window 滚动完全不受影响，卡片内跟随行为保留。
- 改动文件：src/routes/ConceptPage.tsx、.impeccable/scroll-check.mjs、scroll-probe.mjs、scroll-trace.mjs、outline-follow-check.mjs（新增诊断/回归脚本）、HANDOFF.md、PROGRESS.md
- 测试结果：
  - `npm run typecheck`、`npm run build` 通过。
  - `scroll-trace.mjs` 在 /theory/roman-numerals 与 /theory/melodic-minor-modes：requested→actual 全部一致（200/500/900/1500/2300），修复前 900 即被弹回 502。
  - `outline-follow-check.mjs`：卡片限高压到 120px 后滚到页底 → scrollY=2322、活动项"本页引用"在卡片可视区内、list.scrollTop>0（内部跟随正常）。
- 风险与教训：任何在限高滚动容器内"跟随高亮"的实现都必须只滚容器本身；HANDOFF 已把该陷阱记入决策与坑。
- 下一阶段入口：9.6 Sposobin 深度字段 → 9.7 confusions → 9.8 图谱学习路径。
- 本次文档更新时间：10.24 04:35

## 阶段 21 电子书内嵌与书库严格 1:1 重构 [计划时间：10.24 12:20 BY solo-agent][完成时间：10.24 13:00 BY solo-agent]

- 分支：dev
- 用户指令：两本电子版原件到位（`/books/`）；书库章节严格一一对应原书；内容尽量完整并提供原书章节深链（相当于内嵌电子书）；确立新逻辑——书库=源知识数据，知识库=总结精炼/白话解释的个人笔记+拓展知识。
- 盘点结论：`/books/complete-musician-4e.pdf` 为 **Laitz《The Complete Musician》第 4 版英文原版**（OUP © 2016，957 页，书签大纲完整）；`/books/` 的 EPUB 为 **Levine《爵士乐宝典》中译本**（赵贝露译，24 章，章序与英文原版一致）。此前 laitz.ts 按“第 5 版”写的章名与用户手里的书**完全对不上**（第 4 版无 1C 章；Ch17=模进、Ch18=副属、Ch19=转调）。
- 已完成：
  - 21.1 laitz.ts 整体重写：34→**33 章**（4e 真实结构 1A/1B + 2–32，九个 Part），每章带 `pdfPage`（PDF 书签逐章核对，1 起始）；笔记键按 4e 重排（17/18/19 互换、旧 1C 并入 1A），1A 笔记以实读内容加深（巴赫帕蒂塔开场、共同实践框架）。
  - 21.2 全库引用更新：**117 处** laitz locator 改为第 4 版真实章名（foundations/harmony(-advanced)/jazz-advanced/deep-dives/levine crossBook）；引用数 188 → 186（1C 合并）。
  - 21.3 levine.ts：24 章逐章加 `sourceFile`（EPUB 解包 HTML 路径）；第二十四章「聆听」EPUB 未收录（索引提及、文件缺失），如实留空待补。
  - 21.4 电子书内嵌：EPUB 解包至 `public/books/jazz-baodian/`（116MB）、PDF 复制为 `public/books/complete-musician-4e.pdf`（49MB）；`/books/` 与 `/public/books/` 加入 .gitignore——**永不提交、不分发**。
  - 21.5 Books 页深链：章节详情新增“打开原书本章（内嵌 EPUB）/ 打开原书 PDF 第 N 页”按钮；引用定位行附内嵌页码；书目页 laitz 改为第 4 版（© 2016）、levine 标注中译 EPUB 已核对。
  - 21.6 新逻辑写入 AGENTS/PRODUCT：书库=源知识数据（真实章目+定位+深链），知识库=总结精炼/白话/拓展；书库深化流水线入 HANDOFF（优先 Laitz 4/5/9/10/18/19/21 → Levine 2/3/13 → Sposobin 等电子版）。
- 统计更新：117 章目 / 117 笔记（Levine 24、Laitz 33、Sposobin 60）；55 概念 / 65 谱例 / 186 引用不变。
- 测试结果：`npm run typecheck` / `npm run knowledge`（55/65/186）/ `npm run build` 通过；`/books?book=laitz` 显示 33 章真实 4e 结构与 PDF 页码深链；`/books?book=levine` 显示 EPUB 深链按钮；内嵌文件可访问（EPUB HTML 200、PDF 206）；375 无横向溢出。
- 风险：电子书文件只存在本地（gitignore），换机器需重新放置 `/books/` 并重跑解包/复制；Levine 第 24 章深链缺EPUB 正文。
- 下一阶段入口：书库深化流水线（逐章读原书升级笔记）→ Sposobin 电子版 → 图谱学习路径。
- 本次文档更新时间：10.24 13:00

## 阶段 22 书库深化批次 1：Laitz 7 章 + Levine 3 章逐章对原文 [计划时间：10.24 13:10 BY solo-agent][完成时间：10.24 13:50 BY solo-agent]

- 分支：dev
- 任务定位：启动 HANDOFF“书库深化流水线”第一批——逐章读内嵌原书，把笔记的 deepSummary/analysis 从“结构重构”升级为“以原文为准”。
- 已完成：
  - 22.1 Laitz 4e 七章全文提取精读（pypdf 逐页）：Ch4 当和声旋律节奏交汇（866 行）、Ch5 调性支柱与声部进行（667）、Ch9 下属功能与乐句模型（544）、Ch10 强拍与半音装饰音（847）、Ch18 副属和弦（945）、Ch19 临时主化与转调（628）、Ch21 调式交替（648）。
  - 22.2 七条 DEEPEN 笔记全部按原文重写，实读要点入笔记：Ch4 的“embellishing tones 弃用 nonharmonic tone”术语选择、《菩提树》旋律-only 分析判错示范、格式塔三原则；Ch5 的终止式完整分类（PAC/IAC/对位终止/HC/皮卡迪）与 4 规则+10 指南；Ch9 的 ii 优于 IV 三论证、弗里吉亚半终止、IV–ii 复合体、乐句模型四图式；Ch10 的 APT/CPT/AN/CN/APP/S/PED 分类网、延留音 P–S–R 与写作四规则、六种变体；Ch18 的造副属两条路、cross relation、副属模进三式；Ch19 的括号分析法、临时主化 vs 转调判据、近关系调两定义、枢轴和弦规则；Ch21 的旋律性/和声性交替二分、♭6 四理由、写作三戒、“交替 vs 副属”章末判据。
  - 22.3 概念映射补正：laitz-04 → non-chord-tones/melody-motives（原只挂 harmonic-rhythm）；laitz-10 → non-chord-tones。
  - 22.4 Levine 三章（中译 EPUB 文本）：Ch2（调式→七和弦、七音“重力”下行、五度圈=练习路径+曲库现实）、Ch3（避免音原话“handle with care note”、#11 术语史、四套音阶和声）、Ch13（重配=作曲、四种形式、V→ii–V、三全音替代半音低音）——DEEPEN 三条重写。
  - 22.5 修正 Levine-01 crossBook 残留的“Laitz 1C：音程”→“Laitz 1A（音程）”。
- 本批读透标记：laitz 04/05/09/10/18/19/21 + levine 02/03/13（共 10/117 章，均以原文核对后重写，仍为原创改写）。
- 测试结果：`npm run typecheck` / `npm run knowledge`（55/65/186）/ `npm run build` 通过；`/books?book=laitz` 渲染深化后的笔记。
- 下一批入口：Laitz Ch6/7/8/11/13（和声化与对位扩展族）→ Levine Ch14 → Ch15/17。
- 本次文档更新时间：10.24 13:50

## 阶段 23 书库深化批次 2：Laitz 对位扩展族 5 章 + Levine 3 章 [计划时间：10.24 14:00 BY solo-agent][完成时间：10.24 14:35 BY solo-agent]

- 分支：dev
- 任务定位：书库深化流水线第二批，队列来自阶段 22 的“下一批入口”。
- 已完成：
  - 23.1 Laitz 4e 五章全文提取精读：Ch6 旋律节奏拍号对和声的影响（7044 词）、Ch7 六三和弦（4467）、Ch8 V7 转位与导七（6534）、Ch11 四六和弦（5613）、Ch13 下中音（4515）。
  - 23.2 五条 DEEPEN 按原文重写，实读要点入笔记：Ch6 的二次分析三步（一级全标→2A 结构/装饰→2B 只留结构）、节拍化 vs 次节拍化装饰音、分析三角宣言；Ch7 的勃拉姆斯民歌实验（全原位 vs 六三）、结构/装饰性和声对照表、i6–V6–i 不完全邻音与小调减四度特批；Ch8 的“原位 V7 省着用、转位属七是理想装饰和弦”、V6/5-V4/3-V4/2 各自旋律身份、I–V4/3–I6 七音上行例外、V4/2 躲开的终止；Ch11 的“四六常是表面和声”判读体系（Ped/P/Arp/Cad 四类）、终止四六从延留音演化推导；Ch13 的 vi 双重身份（T 延伸 + 前-前属）、和声琶音 1–6–4、摇滚进行的共同实践改写、阻碍进行、低音级进下行“最古老最受推崇”。
  - 23.3 Levine 三章（中译 EPUB）：Ch14 高级重配（反向/平行进行、“功能并不重要”的平行逻辑、斜线和弦、伪终止 F7→GΔ 等实例）、Ch15 Coltrane（Giant Steps=26 和弦只是 B/G/E♭ 三调中心的 V–I、Countdown=Tune Up 大三度重配、“速度来自准确”）、Ch17 曲式（AABA/ABAC 操作定义、B≠桥段、Rhythm Changes 34→32 小节史、“可预知性与突然性的平衡”）——DEEPEN 三条重写。
- 本批读透标记：laitz 06/07/08/11/13 + levine 14/15/17（累计 18/117 章）。
- 测试结果：`npm run typecheck` / `npm run knowledge`（55/65/186）/ `npm run build` 通过；`/books?book=levine` 渲染正常。
- 下一批入口：Laitz Ch12/14/15/16/17（乐句模型精炼与小曲式）→ Levine Ch07/09/10 → Sposobin 等电子版。
- 本次文档更新时间：10.24 14:35

## 阶段 24 书库深化批次 3：Laitz 5 章（乐句模型与小曲式）+ Levine 3 章 [计划时间：10.24 15:00 BY solo-agent][完成时间：10.24 15:30 BY solo-agent]

- 分支：dev
- 任务定位：书库深化流水线第三批，队列来自阶段 23。
- 已完成：
  - 24.1 Laitz 4e 五章全文提取精读：Ch12 下属精炼乐句模型（4872 词）、Ch14 中音/回指属/根音运动综合（3104）、Ch15 乐段（3019）、Ch16 乐句/双乐段/变化乐段（2800）、Ch17 和声模进（4786）。
  - 24.2 五条 DEEPEN 按原文重写，实读要点入笔记：Ch12 的五种加深手段（非属七七音预备规则、EPM、对位终止、PD 扩展四式、子乐段叠加到 14 小节）与“耳与眼”判读；Ch14 的 iii 双语境、小调 VII=V/III、BRD 与根音运动三分类；Ch15 的乐段完整分类（平行/对比 × 中断/连续/分段，双斜线记号、回指属）；Ch16 的乐句 1:1:2（“家长喊孩子”比喻）、嵌套句与和声节奏加速悖论；Ch17 的模进命名系统（D2(−5/+4) 等）、Escher 悖论、声部和弦、根位减三合法、反转 5–6 模进。
  - 24.3 Levine 三章（中译 EPUB）：Ch07 比波普音阶（“节奏上变得正确”的 Baker 原话、1927 Armstrong 史料、四种形态）、Ch09 五声音阶（1–2–3–5–6、“空气空间与光亮”、1960s 复兴）、Ch10 布鲁斯（音程口诀“小三度全音半音半音小三度全音”、一条音阶压三个和弦的“不可解释”、小调布鲁斯 ♭VI–V–I）——DEEPEN 三条重写。
- 本批读透标记：laitz 12/14/15/16/17 + levine 07/09/10（累计 26/117 章）。
- 测试结果：`npm run typecheck` / `npm run knowledge`（55/65/186）/ `npm run build` 通过。
- 下一批入口：Laitz Ch18 已读（批次1）→ 余 Ch20/22/23/24/25–32（曲式与半音化）→ Levine Ch05/06/08/13 已读 → 余 Ch01/04/16/18 → Sposobin 等电子版。
- 本次文档更新时间：10.24 15:30
