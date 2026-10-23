# PROGRESS

## 进度看板

- 当前正在开发任务：无；阶段 7 已完成
- 下一阶段任务：补充更多章节笔记 / stdio MCP server（未排期）
- 可提前进行的任务：把书库笔记接入复习卡、FL Studio 侧适配
- 未完成的任务：全量教材正文（版权边界，不做）；MCP server

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
