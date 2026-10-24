# AGENTS — TONIC 知识规则

> 本文件即用户所称的 `agent.md`（项目根标准文件名 `AGENTS.md`）。任何接手本项目的 Agent 在写内容、写页面或扩展接口之前，先读本文件。

## 使命

TONIC 是一个本地优先的个人乐理强化工作台。核心不是“多讲一点理论”，而是把三本教材整理成**可检索、可听、可引用、可与 Agent 同步**的知识结构，尤其是和声的功能、走向、色彩、明暗与关系。

## 来源政策（两层来源制，2026-10-24 用户拍板修订）

**分层逻辑（用户 2026-10-24 确立）**：**书库 = 源知识数据**（原书真实章目 + 章节定位 + 内嵌电子书深链）；**知识库 = 总结精炼、白话解释的个人笔记 + 拓展知识**（不在书里的、自己收集的内容，如 SoundQuest 框架与 B 站调研启发）。书库回答"原书哪里说了什么"，知识库回答"我们怎么理解、怎么用"。

理论来源分两层，**所有主题都可入库**：

1. **Tier 1 · 主教材**（优先，理论断言的首选依据）：
   - Mark Levine, *The Jazz Theory Book*（Sher Music, 1995；中译本《爵士乐宝典》赵贝露译，上海音乐出版社 2017，**EPUB 已内嵌**，24 章章序与英文原版一致）。
   - Steven G. Laitz & Michael R. Callahan, *The Complete Musician*, **4th ed.**（OUP, © 2016，**英文原版 PDF 已内嵌**，1A/1B + 32 章共九个 Part）。
   - 伊·杜波夫斯基、斯·叶甫谢耶夫、伊·斯波索宾、符·索科洛夫《和声学教程》第 3 版（陈敏译，人民音乐出版社，2021）——**电子版无法获取，深化任务搁置（2026-10-24 用户决定）**。
   - 引用给到**章节级 locator**（章号 + 章名/小节名）。Laitz 一律按第 4 版章名（与第 5 版不同！）；持有电子版的书可附 PDF 页码（内嵌深链 `#page=N`）。
2. **Tier 2 · SoundQuest 站点**（`source: "soundquest"`，补三本书覆盖不到的主题）：
   - 日文原站 soundquest.jp / 中译站 music-theory.aizcutei.com（《自由派音乐理论》）。
   - 用于站点自创理论框架（连接系统论、轴心体系、新里曼理论、Lydian Chromatic Concept、元音乐理论、多义论、经过和弦等）与三本书未覆盖的主题（泛音列等）。
   - 引用给到**篇章级 locator**（如 `和弦篇 C64「轴心体系」`）；条目内容为 WebFetch 抓取后的原创归纳。

**不变的红线**：

- **电子书文件永不入库**：原书 PDF/EPUB 及解包内容在 `/books/` 与 `/public/books/`（均已 gitignore），只存在于用户本地、通过本地站点私下阅读；不得提交、分发或把正文复制进任何仓库文件。
- 不得复制、OCR、扫描或逐字搬运任何来源的正文——书籍与站点条目全部是原创改写/归纳，短引文仅在必要时使用并标注。
- 不虚构页码/小节名；持有电子版的书（Laitz/Levine）页码从原书核对写入，未持有的（Sposobin）只标到章。
- 区分“来源结论”与“编辑综合”：跨源综合要说明是编辑层比较；站点自创理论（轴心体系、LCC、元音乐理论、多义论等）正文明示它是“创作工具/公设/元框架”，并保留学界批评（如轴心体系的 Kárpáti 批评、LCC 的论证薄弱），不冒充定论。
- 书库笔记现状（2026-10-24 收尾批后）：**Levine 24/24 与 Laitz 33/33 已逐章读内嵌电子书正文并按原文重写 deepSummary/analysis（读透）**；Sposobin 60/60 为章名级初稿笔记，电子版无法获取，深化任务已搁置。

## 和声知识模型

新增或修改和声概念时，至少标注以下维度（`src/content/types.ts` 的 `HarmonyDimension`）：

- `function` 功能：T–PD–D–T、主/下属/属的角色与替代。
- `direction` 走向：根音运动、低音线、模进、终止与和声节奏。
- `color` 色彩：协和/不协和、张力、延伸音、变化音与语境。
- `brightness` 明暗：大调/小调、同主音交替、借用和弦与那不勒斯。
- `relationship` 关系：调性距离、共同和弦、枢轴、等音与替代关系。
- `rhythm` 和声节奏：变化速率、节拍位置、密度与句法。

当前结构：

```text
src/content/
  foundations.ts       基础 16 条（含节拍与切分、旋律与动机、五声音阶、泛音列、调性引力论、Shuffle/Swing、外质与 K·S 分析、元音乐理论）
  harmony.ts           和声基础 8 条
  harmony-advanced.ts  和声深化 26 条（功能/走向/色彩/明暗/关系/节奏 + 中古调式、调式互换、四度、混合和弦、无功能属和弦、固定结构、和弦外音、挂留、连接系统论、轴心体系、新里曼、王道进行、流行转调、line cliché、旋律和声化、和声多义性、经过和弦）
  jazz.ts              爵士 8 条
  jazz-advanced.ts     爵士深化 8 条（旋律小调调式、对称音阶、LCC、Clave）
  deep-dives.ts        66 条白话拆解（全部概念）
  bilibili.ts          B 站课程调研台账：5 个合集/板块，112 条视频与文章 / 20 条已读 / 92 条仅编目
  graph/index.ts       体系图谱：3 书源 + 站点 / 6 枢纽 / 66 概念 / 188 关联 / 79 前置
  books/               三本书的完整章目 + 原创章节笔记（117 章目 / 117 条笔记；Levine/Laitz 与内嵌电子书逐一对应）
  bibliography.ts      书目（含 soundquest 站点条目）、版次、定位政策
```

## 书库结构

- 每本书一个 `BookOutline`：完整章目（章号、原书章名、中文对照、Part/上册下册、内嵌电子书定位）。
- 已展开章节带 `summary`、`keyPoints`、`concepts`（知识库 slug）、`dimensions`；深度笔记再带 `deepSummary`、`analysis`、`crossBook`、`visualHint`、`confusions`。
- 当前覆盖：Levine 24/24 章、Laitz 34 章（4e：1A/1B + 32 章）、Sposobin 60/60 章（118/118 条笔记）。Levine/Laitz 章节结构已与用户持有的电子版逐一核对（EPUB 目录 / PDF 书签），每章带 `sourceFile`（EPUB HTML）或 `pdfPage`（PDF 页码）深链。
- **电子书内嵌**：`/books/`（用户原件）与 `/public/books/`（jazz-baodian EPUB 解包 + complete-musician-4e.pdf），均 gitignore；书籍页面提供"打开原书本章"深链。Sposobin 无电子版，无深链。
- 书库页面：`/books`；Agent 接口：`get_book_outline`、`get_source_note`、`search_sources`、`window.TONIC.bookOutline/sourceNote/searchSources`。
- 新增笔记：先确认章节 locator → 写 ≤200 字原创摘要 → 列 2–4 个关键点 → 写 `deepSummary`/`analysis`/`crossBook` → 映射到现有/新增概念 → 标维度。不要在 book 数据里放大段原文。
- 深度字段也受来源约束：`deepSummary` 与 `analysis` 可以跨书综合，但必须能在三本书中找到章节级支撑；`crossBook` 只写真实存在的章号与章名。

## 体系图谱（Atlas）

- 页面：`/atlas`；数据：`src/content/graph/index.ts`。
- 分层：教材来源（Levine / Laitz / Sposobin）→ 系统枢纽（基础语法、功能与句法、色彩与张力、明暗与调式、关系与转调、爵士语言）→ 概念节点（66）。
- 边类型：`source` 来源支撑、`system` 体系归属、`related` 概念关联、`prerequisite` 学习前置。
- 交互：`VIEW` 切换关系图 / 学习路径；分类/维度筛选；悬停或点击节点高亮邻域；选中节点显示维度、前置、后续、支撑章节与概念入口；支持 `/atlas?focus=<slug>` 深链。
- 学习路径模式（`/atlas?mode=path&focus=<slug>`）：只保留 `prerequisite` 边，隐藏系统枢纽，图中只显示目标概念的先修/后续闭包与有章节支撑的书源；链按 DAG 深度排序（多条路径合并，不是唯一线性顺序），可清除选择回到全局前置图。
- 章节级来源：选中概念时详情面板列出 `getChaptersForConcept` 的全部章节深链（`/books?book=…&chapter=…`）；图中对应书源节点加环并标注“支撑 N 章”。正常模式与路径模式都生效。
- 新增概念时同步检查：`graph/index.ts` 的枢纽归属、`PREREQUISITES` 前置链、`related` 关联；图谱不得出现指向不存在 slug 的边。

## 白话拆解（Deep Dive）

- 数据：`src/content/deep-dives.ts`；由 `CONCEPTS` 自动合并到 `concept.deepDive`。
- 目的：把术语密集的段落改写成可理解的判断顺序、听觉抓手与练习步骤；不是教材正文的译文或摘录。
- 每个 block 至少一条 `cites`；引用沿用 `CitationRef` 章节级 locator；`collectCitations` 会把 deep dive 引用纳入页末注释。
- 当前覆盖 66/66：基础 16 + 和声 34 + 爵士 16 全部有白话拆解。
- 新增 deep dive 时优先写“为什么容易误解”“判断顺序”“一句话/练习”，避免重复 summary。

## B 站课程台账（Video Research）

- 数据：`src/content/bilibili.ts`；页面：`/references` 的 `VIDEO RESEARCH` 区域。
- 目的：记录已读取/已编目的课程视频，避免 Agent 与人工重复搜索；**视频不作为理论依据**，只用于发现主题与组织顺序。
- 结构：多合集（`BILIBILI_COLLECTIONS`）+ 板块。当前 5 个合集：`jazz-harmony`（爵士和声理论 · 爵士-没有派对，68 集）、`jazz-academy`（学院派作曲·爵士理论 · Yulia Music Note，10 集）、`stylized-creation`（**风格化创作** · Gray-Frezical，31 集，独立板块）、`jazz-extras`（同一 UP 的合集外公开课，2 条）、`theory-articles`（B 站专栏归档·和声随笔，按条归档）。视频条目用 `collection` 字段归属。
- 状态：`read`（已读并做笔记）与 `catalogued`（只登记目录）。新增视频先查 BV 是否已存在，不重复登记。
- 字段：`bvid`、`title`、`episode`、`chapter`、`duration`、`published`、`url`、`status`、`themes`、`collection`；专栏文章用 `kind: "article"`（`bvid` 字段存 CV 号，`duration: 0`），已读视频再加 `via`（`subtitle` 字幕 / `asr` 转写 / `frames` 关键帧 / `text` 图文正文）、`usedIn`（映射概念 slug）、`takeaway`（一句话结论）、`readAt`。
- 不保存字幕、转写或视频正文；只保存元数据与原创一句话结论。台账中的结论不能替代三本书的章节级引用。
- Agent 接口：`get_video_research`（支持 `collection` 参数）、`window.TONIC.videos({ status, query, theme, collection })`、CLI `npm run theory -- videos [--status read] [--query ...]`；离线包 `knowledge.json` 含 `videoResearch.collections/videos` 与 `meta.videoCount/videoReadCount`。

### B 站调研工作规范（已固化，无需用户提醒）

用户给出新的 B 站合集或视频链接时，按以下流程一次做完，不要中途请示：

1. **编目**：合集用 `https://api.bilibili.com/x/polymer/web-space/seasons_archives_list?mid=<mid>&season_id=<id>&page_num=1&page_size=100` 拉全量目录；单视频用 `bili.mjs video <BV>`。与 `bilibili.ts` 现有 BV 查重，只登记新条目。
2. **读取**：按主题挑与知识库相关的视频读内容——有字幕轨用 `bili.mjs subtitle`（落盘 UTF-8 后读，避免终端乱码）；无字幕轨用 `bili-duty-local` 的 `data/.venv-asr/Scripts/python.exe data/asr-gemini.py <BV>` 转写；无人声/演示视频用 `shot.mjs` 取关键帧 + 多模态读屏；**专栏文章**先用带登录 cookie 的文章搜索 API（`search_type=article`）定位 CV 号，再读图文正文（`via: "text"`）。读过的记 `status: "read"` 并写 `via`、`takeaway`（一句话）、`usedIn`（映射到现有概念 slug）；只编目的记 `catalogued`。
3. **归板块**：按内容判断合集归属——爵士和声理论类进 `爵士和声` 板块；编曲/配乐/风格演示类进 `风格化创作` 板块（`stylized-creation`）；合集外单视频进 `jazz-extras`。新合集要同时在 `BILIBILI_COLLECTIONS` 登记。
4. **同步**：`bilibili.ts` 是唯一事实源——改完跑 `npm run knowledge`（刷新 `public/knowledge.json`），页面 `/references` 与 Agent 接口自动生效；涉及新概念时同步图谱前置、书库 `concepts` 映射与白话拆解。
5. **收尾**：更新 AGENTS.md / PRODUCT.md / HANDOFF.md / PROGRESS.md 统计，typecheck + build 验证后提交 dev。
6. 纪律不变：视频结论不进理论正文；理论断言仍必须回三本书定位。

## Agent 查询路径

1. 需要“某个概念怎么解释”：`search_theory` / `get_concept`。
2. 需要“原书哪一章支撑”：`get_concept_sources`（`window.TONIC.sources(slug)`）或 `get_source_note`。
3. 需要“完整章目/某一本书的结构”：`get_book_outline`。
4. 需要“按和声维度找材料”：`search_sources` + `dimension`。
5. 需要“可听例子”：`list_examples`。
6. 需要“今天复习什么”：网页导出的 `review-state.json` → `get_review_queue`。
7. 需要批量离线：`public/knowledge.json`（`npm run knowledge` 生成）。

## 编辑与构建规则

- 单一事实源：页面、搜索、音频、复习、书库、Agent 都从 `src/content` 读取；不要另建一套 JSON 真相。
- 概念与谱例必须可通过 `npm run typecheck`；新增 slug 后检查所有 `related` 与书籍 `concepts` 映射。
- 构建前刷新知识包：`npm run build` 会执行 `prebuild` → `npm run knowledge`。
- 快速启动：双击项目根 `start.bat`；首次自动安装依赖，已运行时直接打开，`TONIC_NO_OPEN=1` 可只启动服务不打开浏览器。脚本为 ASCII + CRLF，修改后不要保存成 UTF-8/LF，否则 cmd 会吃字符。
- 音频：谱例与琴键由本地 Salamander 钢琴采样（C3–C5，CC BY 3.0，Alexander Holm）驱动，附带合成器回退；见 `public/audio/salamander/LICENSE.txt`。不得替换为需要运行时外网请求的 CDN 音源。
- 五线谱音符/和弦必须可点击；点击使用 `previewNote/previewChord`，并联动钢琴高亮。按住（长按）通过 `holdStart/holdEnd` 持续发声，松手淡出，高亮跟随按住时间；键盘激活（Enter/Space 的 click `detail===0`）保持一次性试听。
- 视觉方向：Blue Note 现代主义；平面色块、方形控件、纸面阅读区、墨色外壳；不引入渐变/玻璃拟态/SaaS 圆角卡片。
- 🔴 **标签与控件必须可区分**（2026-10-24 定规）：**静态标签**（别名/主题/维度/VIA/跨书对应等）一律**无边框**——用浅底 chip `bg-ink/5 text-muted`（深色区 `bg-paper/15 text-paper`），永不加 hover；**可点击 chip 链接**（概念号跳转等）用边框 `border-ink/40` 起 + `transition-colors hover:bg-ink hover:text-paper` 反色；**按钮**用实底或粗边框 + hover 反色。边框和 hover 是"可点击"的信号，静态元素不得携带。
- 响应式：375 / 768 / 1280 三视口，无横向溢出；概念页大纲：移动端用 `<details>`，桌面用右栏深色 ON THIS PAGE 卡片；左侧栏为站点导航 + 当前分类的可折叠概念目录（折叠状态存 localStorage `tonic.rail.catalog.v1`）。

## 当前范围

- 66 个概念（基础 16 / 和声 34 / 爵士 16）
- 76 个可听谱例
- 240 条引用（三本书章节级 + SoundQuest 篇章级）
- 3 本书 · 117 个章目（真实原书结构）· 117 条原创章节笔记（Levine 24/24、Laitz 33/33〔4e：1A/1B + 2–32〕、Sposobin 60/60）
- 66 条白话拆解（全部概念）
- B 站调研台账：5 个合集/板块 · 112 条视频与文章 / 20 条已读 / 92 条仅编目（以 `read` 为准）
- 体系图谱：6 枢纽 / 66 概念 / 188 关联 / 79 前置
- 视觉：五度圈、调式轮、半音尺、张力光谱、相邻属和弦路径（dominant-path）、分层体系图、学习路径视图
- 音频：本地 Salamander 采样 + Web Audio 合成回退
- 站点待读：已清空（C63 元音乐理论、C74/75 多义论已于阶段 30 补录；C47–49 延伸音细节并入 J-04，C39–40 转位/持续音/混合和弦由既有条目覆盖）
- 书库深化：Levine/Laitz 已读透；Sposobin 电子版无法获取，深化任务搁置（60/60 章名级笔记保留）
- 未交付：stdio MCP server（schema 已固定）、全量教材正文（版权边界）
