# PROGRESS

## 进度看板

- 当前正在开发任务：阶段 33 已完成（书库笔记接入复习卡）
- 下一阶段任务：FL Studio 侧适配；图谱第三阶段（路径布局/跨书章节对照）；线上内容维护
- 可提前进行的任务：Agent 侧路径查询、跨书章节对照
- 未完成的任务：全量教材正文（版权边界，不做）；stdio MCP server；Sposobin 60 章仍为章名级初稿（电子版无法获取，搁置）

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
