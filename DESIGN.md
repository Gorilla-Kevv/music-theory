# DESIGN — TONIC · 主音

<!-- impeccable:design -->

## Direction

**Blue Note 现代主义 / 唱片封套作为知识框架。** 深墨色外壳像唱片内袋，纸面正文像内页说明；钴蓝、镉橙与酸性黄绿承担分类与信号。大字、目录编号、发丝分隔线与方形控件取代常见的圆角 SaaS 卡片。谱例不是插图，而是页面的一等内容：五线谱、琴键与试听坞共用同一份音符数据。

服务对象是长时间阅读、查证与编曲的用户；因此读列保持安静，世界只拥有“框架”：左侧导航、分类色块、标题、谱例卡、试听坞与引用标记。

## Tokens

### Color

| Token | Hex | 用途 | 关键对比 |
|---|---|---|---|
| `ink` | `#0B0D10` | 外壳、试听坞、深色面板、正文 | 与 `paper` 18.5:1 |
| `ink-2` | `#14171C` | 深色内层 | — |
| `ink-3` | `#1E222A` | 深色悬停 | — |
| `paper` | `#F1F0E9` | 主阅读底 | — |
| `paper-2` | `#E7E6DD` | 次级底、侧栏、统计条 | `muted` 5.46:1 |
| `paper-3` | `#D8D7CD` | 弱边界/禁用 | — |
| `cobalt` | `#2447FF` | 基础分类、主行动、首页英雄底 | `paper` 文字 5.37:1 |
| `cobalt-ink` | `#1734C5` | 纸面链接、上标、焦点语义 | 7.88:1 |
| `cadmium` | `#FF5A1F` | 和声、播放/停止信号 | `ink` 文字 6.24:1 |
| `cadmium-ink` | `#B5320C` | 纸面上的橙色文字 | 5.36:1 |
| `acid` | `#D6F33F` | 爵士分类、进度、活跃强调 | `ink` 文字 15.52:1；钴蓝底 4.90:1 |
| `muted` | `#565B62` | 次级正文、占位符 | 5.99:1 |
| `line` | `#D1D0C6` | 纸面分隔线 | 非文本 |
| `line-dark` | `#2B2F37` | 深色分隔线 | 非文本 |

规则：
- 深色底上的小字最低 `paper/60`（6.48:1）；不再使用 `/30`–`/45` 的文字。
- 钴蓝底上的正文与元数据使用**不透明** `paper`；不要用 `paper/65`（仅 3.09:1）。
- 镉橙底上的文字用不透明 `ink`；`ink/80` 仅在必须分层时使用（4.92:1）。
- 酸性黄绿底上的文字用 `ink`。
- 纸面底上的强调色使用 `cobalt-ink` 或 `cadmium-ink`，不用纯品牌色直接写小字。

### Type

| Voice | Face | Usage |
|---|---|---|
| Display | **Anton**（`@fontsource/anton`，自托管） | 英文大标题、`TONIC`、编号、分类大字 |
| Chinese display | Microsoft YaHei / Noto Sans SC，800 | 中文大标题；与 Anton 混排 |
| Reading / UI | Segoe UI, Noto Sans SC, Microsoft YaHei | 正文、按钮、说明 |
| Data / label | Cascadia Mono, Consolas | 编号、章节定位、引用上标、元数据 |

尺度：12 / 13 / 14 / 16 / 18 / 20 / 24 / 32 / 48 / 64 / 96 / 144px；正文 17px，行高 1.8–1.85；读列 65–68ch；展示字 tracking 约 -0.02em，中文标题 -0.03em。

### Space / radius / elevation

- 间距取自 4px 基数的 Tailwind 阶：4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64。
- 圆角：卡片 `2px`（`--radius-card`），小控件才使用 `999px`（`--radius-pill`）。刻意不采用 12–16px 的通用 SaaS 圆角。
- 深度：不使用投影；层级由**实色块、1px 分隔线与底色差**承担。唯一例外是检索面板的一层深度阴影（需要与背景分离）。
- 卡片不嵌套；谱例卡、侧栏面板是独立功能块，不把面板塞进面板。

## Layout

- 桌面：固定左轨 248px；主内容 `max-width: 1400px`；底部试听坞 72px；左轨底部止于试听坞上方。
- 阅读：正文列 65–68ch；概念页右栏 290px，桌面 sticky；正文在前、右栏在后，移动端自然堆叠。
- 分类架：桌面 3 列，移动端 1 列；每架显示 4 条 + “查看全部”。
- 断点：375 / 768 / 1280；移动端 375 是主检查宽度，headless Chrome 需 CDP emulation（原生窗口最小 500）。
- 固定元素：左轨 `bottom: 72px`；试听坞 `fixed bottom-0`；移动端顶部 56px 导航。所有页面 `main` 留 112px 底部空间，避免内容被坞遮住。

## Components

- **分类色块**：`cobalt / cadmium / acid` 三块整面，黑色或纸白文字；分类英文名 + 中文名 + 数量。分类在左轨中同时作为**导航状态**：当前概念所属分类、或 `/library?category=` 对应分类使用钴蓝实底 + `aria-current`，不覆盖导航本身。
- **章节大纲**：概念页左轨在分类下方增加 `ON THIS PAGE` 面板，列页首、正文小节、白话拆解、谱例、可视化、注释；滚动时高亮当前节，并让左轨内部滚动保持当前项可见。移动端用 `<details>` 折叠大纲，不挤占正文。
- **方形按钮**：2px 圆角、无阴影；播放按钮为镉橙方块 + 墨色图标；停止时换成方块图标。悬停从橙转墨，避免“橙底橙字”。
- **谱例卡**：纸面底、墨色发丝边；顶部 `FIG. 01 / PROGRESSION / 76 BPM`；五线谱 SVG 上叠加透明命中区，点击音符/和弦即发声并联动下方钢琴高亮；钢琴键盘也可直接点击。谱例状态由 `aria-pressed` 与颜色共同表达。
- **钢琴键盘**：C3–C5，白键象牙底、黑键墨色；白键分隔 55% 墨色；活动键钴蓝/镉橙。琴键随容器宽度自动缩放，移动端不横向溢出。
- **检索面板**：纸面面板 + 墨色激活行；输入、结果、快捷键与“精确短语优先”在同一面板内完成；`role="dialog"`，焦点陷阱与 Escape 关闭。
- **引用标记**：正文末的方括号上标，`cobalt-ink`，链接到页末注释；注释给出版本、章名与定位，不写页码。末 4 字与上标使用 `whitespace-nowrap`，避免孤行。
- **复习卡**：纸面卡 + 分类色顶条；问题在墨色标题层，答案在分隔线后；评分按钮四档，`1–4` 快捷键；不用进度环。
- **听辨**：三种模式按钮、选项网格、即时反馈；与复习统计并列展示，不制造积分/排行榜。
- **试听坞**：固定墨色底；左为播放/停止，中为标题与酸性进度，右为速度与循环。空态给出“播放任意谱例后…”的明确指引。
- **书库**：`/books` 用三本“封套”切换；左列完整章目（可搜索、按维度筛选），右列章节笔记（原创摘要、关键点、深入归纳、分析清单、跨书对应、可视化映射、常见误解、概念映射、引用定位）。移动端把左列换成章节下拉。章节蓝点只表示“已展开原创笔记”，不伪造未读正文。
- **白话拆解**：概念页正文之后增加 `IN PLAIN LANGUAGE / 白话拆解` 板块，钴蓝左线 + 纸面底；每条解释带章节级引用上标，进入页末注释。它解释“为什么容易误解、怎么判断、怎么练”，不重复 summary，也不复制教材原文。
- **体系图谱**：`/atlas` 用分层 SVG：左侧三本教材来源、中间六个系统枢纽、右侧 43 个概念节点；实线表示来源/体系，虚线表示关联，长虚线表示学习前置。分类/维度可筛选；悬停或点击高亮邻域，选中节点在下方给出维度、前置、后续、概念与书库入口。移动端横向滚动查看全图，页面本身不横向溢出。
- **可视化**：五度圈、调式轮、半音尺、张力光谱、相邻属和弦路径（dominant-path）。全部为交互 SVG/数据控件；点击即试听，活动扇区/刻度使用钴蓝或镉橙，并带键盘可达的 `role="button"`、`aria-label`。五度圈外圈慢速旋转虚线仅作世界特征，`prefers-reduced-motion` 下停止。
- **B 站调研台账**：`/references` 底部 `VIDEO RESEARCH` 区域；已读视频显示集号、标题、BV、一句话结论、主题标签与映射概念；仅编目视频折叠在 `<details>` 中。台账只记录元数据与阅读状态，不保存字幕，不作为理论依据。
- **空状态**：说明为什么为空、下一步去哪里；不使用插画或 emoji。

## Motion

- `sleeve-in`：首页英雄色块从左侧 `clip-path` 展开，560ms，`cubic-bezier(0.16, 1, 0.3, 1)`。
- `rise-in`：检索面板出现，420ms，位移 10px + 淡入。
- 其余交互以颜色/描边/位移 0–150ms 为主；不做滚动进场动画。
- `prefers-reduced-motion: reduce` 下全部动画降至 0.01ms。

## Accessibility

- 正文/占位符 ≥4.5:1；大字号 ≥3:1；关键交互边界 ≥3:1。
- 全局 `:focus-visible` 使用 `currentColor` 2px 外描边，适配深/浅底。
- 完整键盘路径：检索 `⌘/Ctrl+K` 或 `/`；结果 ↑↓ + Enter；评分 1–4；标签页 ←/→；模态 Escape + Tab 陷阱。
- 音频不自动播放；首次播放由用户手势创建/恢复 AudioContext。
- 颜色不是唯一状态：活动琴键同时有 `aria-pressed`；分类同时有文字与色块；试听状态有文字 `PLAYING/READY/LOCAL`。
- 响应式检查：375 / 768 / 1280 均无横向溢出；`document.documentElement.scrollWidth === innerWidth`。

## Content & citation system

- 单一事实源：`src/content/` 的 `Concept` 同时驱动页面、搜索、音频、复习、书库与 Agent 输出。
- 当前 43 个概念（基础 8 / 和声 23 / 爵士 12）、48 个谱例、164 条章节级引用、43 条白话拆解；和声概念按功能、走向、色彩、明暗、关系、和声节奏标注维度。
- 每段理论断言至少一条 `CitationRef`；`collectCitations` 按页内出现顺序编号，页末“注释”复用同一编号。
- 三本书目：
  - Levine, *The Jazz Theory Book*（Sher Music, 1995；中译本上海音乐出版社 2017）。
  - Laitz & Callahan, *The Complete Musician*, 5th ed.（Oxford University Press, 2023）。
  - 斯波索宾等《和声学教程》第 3 版（陈敏译，人民音乐出版社，2021）。
- 本地书库：三本书的完整章目（24 + 34 + 60 = 118 章）+ 85 条原创章节笔记；Levine 24/24、Laitz 34/34 条带深度归纳，Sposobin 27/60；笔记含摘要、关键点、深入归纳、跨书对应、常见误解、概念映射与维度，不复制教材正文。
- 体系图：`src/content/graph/index.ts` 提供 3 来源 / 6 枢纽 / 43 概念 / 104 关联 / 32 前置；图只表达本库编辑关系，不声称是唯一理论体系。
- 只标注到章（或章内小节名），不写页码；引用体例页明确说明，避免伪造学术定位。
- 中英混排：中文正文 + 英文术语/和弦记号/书目原文；不翻译曲名与术语缩写。

## Agent surface

- `public/knowledge.json`：书目、43 概念、52 谱例、164 条引用、118 章目、85 条章节笔记、B 站调研台账、工具 schema、引用政策。
- `window.TONIC`：浏览器只读查询接口，便于浏览器型 Agent。
- `npm run theory`：Node CLI，输出表格或 `--json`；学习状态由网页导出后传入。
- `TOOL_SCHEMAS` 已按 MCP `tools/list` 形状命名：`search_theory`、`get_concept`、`list_examples`、`get_related`、`search_sources`、`get_book_outline`、`get_source_note`、`get_review_queue`、`get_bibliography`、`get_citation_policy`、`get_video_research`。
- 首版不启动 server；接口与 schema 稳定，下一阶段直接包装。
- 书库接口：`window.TONIC.bookOutline(book)`、`sourceNote(chapterId)`、`searchSources(query, { book, dimension })`；CLI 同步暴露。

## Avoid

- 渐变文字、玻璃拟态、装饰性 blur、彩色左边框、硬偏移阴影。
- 大圆角 + 软阴影的通用卡片；把知识条目做成电商卡。
- 用 emoji 代替图标；用无意义插画填充知识页。
- 自动播放音频、用颜色单独表达状态、用低透明度小字换取“高级感”。
- 编造页码、把章节级引用伪装成精确引用。
- 把教材正文扫描/OCR/整段复制进仓库；书库只放原创笔记与章目索引。
- 用运行时 CDN 音源替代本地采样；钢琴采样必须随构建产物一起离线可用，并保留许可文件。

## Verification references

- 截图目录：`.impeccable/review/final-*.png` 与 `p1-*.png`（375 / 768 / 1280；被 gitignore，本地保留）。
- 机械检测：`impeccable detect --json src index.html` → `[]`。
- 交互证据：`.impeccable/review/after-play.png`（播放态琴键高亮）、`p1-staff-hover-2.png`（谱面命中区）、`p1-circle-visual.png`（五度圈）。
- 音频证据：本地 `public/audio/salamander/*.mp3` + `LICENSE.txt`；运行时请求均为同源文件。
