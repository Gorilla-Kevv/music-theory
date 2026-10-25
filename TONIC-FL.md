# TONIC × FL Studio 2026

TONIC 的乐理知识库通过两条路径接进 FL Studio 2026：

1. **外部 Agent（Qoder / Claude Desktop / 任意 MCP 客户端）**：TONIC MCP 提供知识、章节引用与 FL 操作代理。
2. **FL 内 Gopher 面板**：本地桥把 FL 的 Gopher WebView2 切到 TONIC 面板，可在 DAW 内查概念、写入钢琴卷帘，或用本地/云端 LLM 对话。

两条路径共用同一套乐理数据与 FL 2026 内置 MCP，不需要 loopMIDI，也不需要安装第三方 FL 控制器。

## 架构

```text
Qoder / Claude Desktop
  └─ tonic-mcp (stdio, npm run mcp)
       ├─ 知识工具：search_theory / get_concept / get_concept_sources / ...
       ├─ get_fl_payload：谱例 → MIDI 音符 + 章节引用
       └─ FL 工具代理：apply_example / fl_status / fl_list_tools / fl_call_tool
              │ HTTP 127.0.0.1:5127
              ▼
       fl-bridge (npm run fl:bridge)
         ├─ CDP → FL 2026 Gopher WebView2 → script_handler → FL 内置 MCP（48 tools）
         ├─ /panel 本地面板（查概念 / 写入 / Agent）
         └─ 写后读回钢琴卷帘音符数
```

FL 2026 的 Gopher 面板是一个 WebView2 页面；FL 向该页面注入 `script_handler` 主机对象。给它赋 JSON-RPC 的 `tools/call` 就能执行 FL 自己的 MCP 工具，其中 `run_piano_roll_script` 接受完整的 `flpianoroll` Python。TONIC 桥通过 `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222` 启动 FL，再用 CDP 连接 Gopher 页面，复用这套官方控制通道。

## 快速开始

### 1. 一键启动（Windows，推荐）

在项目根双击 **`start-tonic-fl.bat`**：

- 桥未运行时：启动桥，并以 WebView2 调试端口启动 FL 2026；
- 桥已运行时：不再重复启动，并尝试把 Gopher 切回 TONIC 面板；
- 终端窗口需要保持打开；关掉窗口就是停止桥。

等价的命令：

```bat
npm run fl:start      :: 启动桥 + FL + 面板
npm run fl:attach     :: FL 已带调试端口时，只启动桥并切面板
```

如果 FL 已在运行但没有调试端口，脚本**不会关闭 FL**。请先保存工程，关闭 FL，再运行上面的命令。

### 2. 手动启动

```bat
cd F:\schoolCompWorks\clone\music-theory
npm install
npm run fl:bridge -- --launch-fl --panel
```

- 看到 `[TONIC-FL] 面板：http://127.0.0.1:5127/panel` 后，在 FL 里打开一次 **Gopher** 面板（工具栏 Gopher / `Alt+F1`）。
- Gopher 页面出现后，桥会自动把它切到 TONIC 面板。
- 桥连接成功后，`start-tonic-fl.bat` 会调用 `/api/panel` 把已打开的 Gopher 再切回 TONIC；如果 Gopher 还没打开，先按 `Alt+F1`。

> 关闭 FL 再正常启动即可恢复官方 Gopher；也可以用浏览器的 `http://127.0.0.1:5127/panel` 单独使用面板。

### 3. 面板用法

**查概念**

- 搜索概念 / 和弦 / 术语；
- 查看摘要、章节依据（Levine / Laitz / Sposobin）与跨书章节；
- 选择谱例 → `写入`（追加）或 `清空写入`（替换当前钢琴卷帘）；
- 可选填通道号（1-based）；省略则写入当前已打开的钢琴卷帘；
- 写入后桥会读回实际音符数，面板显示“读回 N 个音符”。

**Agent**

面板「设置」里的 **API 协议**支持五种，按端点实际协议选择：

| 协议 | 请求端点 | Base URL 示例 | 鉴权 |
|---|---|---|---|
| OpenAI Chat Completions | `/chat/completions` | `https://api.openai.com/v1`；Qwen 兼容模式 `https://maas.qianwenai.../compatible-mode/v1` | `Authorization: Bearer` |
| OpenAI Responses | `/responses` | 同上（需要服务端支持 Responses） | `Authorization: Bearer` |
| Anthropic Messages | `/v1/messages` | `https://api.anthropic.com` | `x-api-key` |
| Google Gemini | `/v1beta/models/{model}:generateContent` | `https://generativelanguage.googleapis.com` | `x-goog-api-key` |
| Ollama 原生 | `/api/chat` | `http://127.0.0.1:11434` | 无（本地） |

- Base URL 填到 `/v1` 即可，路径由面板按协议补齐；不要重复填 `/chat/completions` 等端点。
- 模型名自由填写（如 `qwen3.8-max`、`claude-...`、`gemini-...`、`llama3.1`）。
- Agent 会先查 TONIC，再回答或调用 `apply_example` / FL 工具；工具轨迹显示在对话下方。
- OpenAI Chat / Responses / Anthropic / Gemini / Ollama 的工具调用都已适配；若模型不支持工具，自动降级为纯文本回答。
- 配置只存本机 localStorage。

**API 填在哪里、存在哪里**

1. 打开 TONIC 面板，点右侧 **「设置」**，或在 Agent 页点 **「LLM 设置」**。
2. 选 **API 协议**，填 **Base URL / Model / API Key**，点 **保存设置**，面板会跳回 Agent。
3. 配置保存在面板所在浏览器环境的 `localStorage["tonic.fl.llm.v1"]`，**不会写入仓库、`knowledge.json` 或桥的磁盘文件**；聊天时由面板随请求发给本机桥，桥只转发到你填的 LLM 端点。
4. 关键区别：**FL 的 Gopher WebView2 和普通 Chrome/Edge 是两套独立存储**。在浏览器面板里填过的 Key，不会自动出现在 Gopher 里；要用 FL 内面板，就在 Gopher 面板里再填一次。
5. 同一地址（`http://127.0.0.1:5127`）+ 同一 WebView2 配置下，重启 FL/桥后配置仍在；清除站点数据、换端口或换浏览器配置后会丢失，需要重填。
6. API Key 目前没有导出/导入功能；不要把 `localStorage` 里的内容提交到仓库或截图外发。

### 3. 外部 Agent（Qoder / Claude）

先启动桥：

```bat
npm run fl:bridge -- --panel
```

然后在 MCP 客户端注册 TONIC MCP。以下 JSON 适用于 Qoder / Claude Desktop 的 `mcpServers` 配置（把路径换成你的实际项目路径）：

```json
{
  "mcpServers": {
    "tonic": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": [
        "F:\\schoolCompWorks\\clone\\music-theory\\node_modules\\tsx\\dist\\cli.mjs",
        "F:\\schoolCompWorks\\clone\\music-theory\\scripts\\tonic-mcp.ts"
      ],
      "cwd": "F:\\schoolCompWorks\\clone\\music-theory",
      "env": {
        "TONIC_FL_BRIDGE": "http://127.0.0.1:5127"
      }
    }
  }
}
```

也可以直接运行 `npm run mcp` 验证 stdio 服务（它会等待标准输入输出，不会自己退出）。

**外部 harness 的两种接法**

- **MCP（推荐）**：`tonic-mcp.ts` 是标准 stdio MCP server，Qoder、Claude Desktop、Claude Code 等任意 MCP 客户端都能接。已用真实 MCP 客户端验证：列出 **22 个工具**；`fl_status` 返回 `attached: true` 与 48 个 FL 内置工具；`get_concept_sources("ii-v-i")` 返回 Levine 章节级来源。知识工具不依赖 FL；只有 `apply_example` / `fl_*` 需要桥在跑。
- **HTTP（给非 MCP 的脚本/harness）**：桥在 `127.0.0.1:5127` 暴露 `GET /api/status`、`GET /api/search`、`GET /api/fl/report`、`POST /api/fl/route|levels|write|compose`、`POST /api/apply` 等端点。任何本地 harness 都可以直接 `fetch` 这些端点；数据不出本机。
- 外部 harness 不需要打开 FL 内的 TONIC 面板；面板和 MCP 共用同一个桥。但 FL 必须由桥启动（或带 9222 调试端口启动）并打开过 Gopher，否则 FL 工具没有控制通道。

**知识工具**：`search_theory`、`get_concept`、`get_concept_sources`、`search_sources`、`get_source_note`、`get_book_outline`、`list_examples`、`get_related`、`get_review_queue`、`get_video_research`、`get_bibliography`、`get_citation_policy`。

**FL 工具**：`get_fl_payload`、`apply_example`、`fl_status`、`fl_list_tools`、`fl_call_tool`，以及操作封装层：

| 工具 | 类型 | 用途 |
|---|---|---|
| `fl_session_report` | 只读 | 通道路由、混音器电平/声像、插件链、发送、命名问题的结构诊断；不测量峰值/LUFS |
| `fl_route` | 写入 | 把通道路由到混音器轨道，返回 verified 结果 |
| `fl_set_levels` | 写入 | 设置混音器轨道绝对 dB/声像/静音/独奏，返回 verified 结果 |
| `fl_write_notes` | 写入 | 任意 MIDI 音符写入当前/指定钢琴卷帘，写后读回音符数 |
| `fl_compose` | 写入 | 多通道/多段作曲：每段可用 TONIC 谱例或显式音符，指定 channel/mode/startBeat/transpose |

面板中的 **FL** 标签页可直接刷新 session 结构诊断；路由、电平、多段写入可交给面板 Agent 或外部 MCP Agent。

### 4. Agent 必须遵守的规则

MCP 已内置 instructions，外部 Agent 也建议使用以下规则（可直接放进项目 `AGENTS.md` 或系统提示）：

1. 任何理论问题先 `search_theory`；需要解释/引用时 `get_concept` / `get_concept_sources`。
2. 每条理论断言必须带工具返回的章节级 locator，不编造引用、页码或原文。
3. 写钢琴卷帘前先 `get_fl_payload` 核对音符，再 `apply_example`；不要凭空生成 MIDI。
4. 其他 FL 操作先 `fl_list_tools`，再 `fl_call_tool`；执行前说明意图，写入后报告实际 payload / 读回音符数。
5. FL 2026 的 `open_piano_roll_for_channel` 参数是 `target_channel`（1-based 索引或通道名），不是 `channel`。
6. `run_piano_roll_script` 只作用于当前钢琴卷帘；没有打开钢琴卷帘时先打开通道。

## FL 内启动方式与 VST3

- 目前 FL 2026 可用的扩展面是 **Gopher / 内置 MCP**，没有公开“在工具栏加第三方按钮”的 API。TONIC 的 FL 内入口就是 Gopher（`Alt+F1`）：桥通过 CDP 把 Gopher 页面切到本地面板，所以不能靠新增一个 FL 原生按钮来启动桥。
- 当前最快的启动方式就是 **双击 `start-tonic-fl.bat`**；想更顺手，可以右键把它发送到桌面快捷方式或固定到任务栏。
- 可选：把桥加入 Windows 启动项/计划任务，让 `127.0.0.1:5127` 常驻；之后每次只需启动 FL 并打开 Gopher。代价是后台常驻一个 Node 进程，且 FL 必须由带调试端口的实例启动（或先关闭重开）。
- **VST3 技术上可行，但不是把现有 HTML 面板“打包一下”**：需要独立的 C++/JUCE（或 iPlug2）工程、VST3 SDK、WebView2 嵌入、安装器与签名；插件实例还得启动或连接本机桥才能控制 FL，而且它是工程内的一个插件，不是全局启动器。工作量远大于当前面板，不建议只为“少点一次 bat”做。
- 更轻的替代是 **Tauri/Electron 托盘启动器**：一个常驻图标，点一下启动桥并打开面板；如果以后要做“更像应用”的启动体验，优先这个而不是 VST3。

## 已验证

- FL 2026（`C:\Program Files\Image-Line\FL Studio 2026\FL64.exe`）启动后，CDP 目标为 Gopher WebView2，内置 MCP 返回 **48 个工具**。
- 面板搜索 `ii–V–I` → 显示 5 条章节引用 → 写入 FL Keys 通道 → 读回 **15 个音符**（PPQ 96）。
- 外部 MCP 的 `fl_status` / `fl_list_tools` / `apply_example` 全链路成功，读回 15 个音符。
- 面板 Agent 用 mock 端点验证了 **五种协议**的工具循环：OpenAI Chat Completions、OpenAI Responses、Anthropic Messages、Google Gemini、Ollama 原生均先调用 `get_concept_sources`，再返回带章节 locator 的回答。
- 面板设置里协议下拉、保存、OpenAI Responses 聊天链路已实测。
- 操作封装层实测：`fl_session_report` 读取 5 通道/18 混音轨并给结构发现；临时两个 FL Keys 通道路由到插入 16、设 -12 dB / pan 0.2，`fl_compose` 分别写入 2 与 3 个音符并读回一致；清理后恢复 5 个原始通道、插入 16 回 0 dB / pan 0。
- MCP 工具总数 22；面板 FL 标签页显示 BPM/通道/混音器/RISK/WARN/INFO、发现列表与通道路由。
- 外部 MCP 用真实 stdio 客户端复验：22 个工具、`fl_status` 显示桥已附加 48 个 FL 工具、`get_concept_sources` 返回 Levine 章节级来源。
- `start-tonic-fl.bat` 在桥已运行时正确识别、退出码 0，并调用 `/api/panel` 把 Gopher 切回 TONIC；桥未运行时走 `npm run fl:start` 启动桥和 FL。

## 故障排查

| 现象 | 处理 |
|---|---|
| `fl_status` 报桥未运行 | 运行 `npm run fl:bridge -- --panel` |
| 找不到 Gopher WebView | 打开 FL 的 Gopher 面板（Gopher / Alt+F1）；确认 FL 由桥启动或带 `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222` |
| 9222 端口不出现 | 如果 FL 已在运行，先保存并关闭；重新用 `--launch-fl` 启动 |
| 写入报 `target_channel` 错误 | 使用 `open_piano_roll_for_channel({"target_channel":"6"})` 或省略通道直接用当前钢琴卷帘 |
| Agent 没反应 | 在面板「设置」填 Base URL / 模型，并选择与端点匹配的 **API 协议**（Chat Completions / Responses / Anthropic / Gemini / Ollama） |
| 想恢复官方 Gopher | 关闭并正常重启 FL，或在 Gopher 面板重新打开官方页面 |

## 边界与安全

- 桥服务只绑定 `127.0.0.1:5127`；CDP 只连本机 WebView2；不向外部上传知识或工程数据。
- 面板 Agent 只访问你配置的 LLM 端点；API Key 存本机 localStorage。
- FL 2026 内置 MCP 是官方控制面，但 `run_piano_roll_script` 可执行任意 `flpianoroll` Python；只对可信 Agent 开放。
- 不能通过 FL API 加载插件、加载音频或渲染音频；这些仍需在 FL 界面完成。
- `fl_session_report` 是**结构诊断**（推子/声像/路由/插件链），不是音频测量；峰值、LUFS、频谱需要导出音频后另做分析，当前不提供。
- `fl_compose` 是“按给定音符/谱例写入多个钢琴卷帘”，不是自动生成完整编曲；曲式与配器仍由 Agent/用户决定。
- 测试脚本曾临时添加 FL Keys 通道并写入示例，已清理；不会修改你的原始 808 通道。
