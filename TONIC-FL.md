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

### 1. 启动桥与 FL

```bat
cd F:\schoolCompWorks\clone\music-theory
npm install
npm run fl:bridge -- --launch-fl --panel
```

- 如果 FL 没在运行，桥会用 WebView2 调试端口启动 `FL64.exe`。
- 如果 FL 已在运行但没有调试端口，脚本**不会关闭 FL**，请先保存工程，关闭后重新执行上面的命令。
- 看到 `[TONIC-FL] 面板：http://127.0.0.1:5127/panel` 后，在 FL 里打开一次 **Gopher** 面板（工具栏 Gopher / `Alt+F1`）。
- Gopher 页面出现后，桥会自动把它切到 TONIC 面板。

> 关闭 FL 再正常启动即可恢复官方 Gopher；也可以用浏览器的 `http://127.0.0.1:5127/panel` 单独使用面板。

### 2. 面板用法

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

**知识工具**：`search_theory`、`get_concept`、`get_concept_sources`、`search_sources`、`get_source_note`、`get_book_outline`、`list_examples`、`get_related`、`get_review_queue`、`get_video_research`、`get_bibliography`、`get_citation_policy`。

**FL 工具**：`get_fl_payload`、`apply_example`、`fl_status`、`fl_list_tools`、`fl_call_tool`。

### 4. Agent 必须遵守的规则

MCP 已内置 instructions，外部 Agent 也建议使用以下规则（可直接放进项目 `AGENTS.md` 或系统提示）：

1. 任何理论问题先 `search_theory`；需要解释/引用时 `get_concept` / `get_concept_sources`。
2. 每条理论断言必须带工具返回的章节级 locator，不编造引用、页码或原文。
3. 写钢琴卷帘前先 `get_fl_payload` 核对音符，再 `apply_example`；不要凭空生成 MIDI。
4. 其他 FL 操作先 `fl_list_tools`，再 `fl_call_tool`；执行前说明意图，写入后报告实际 payload / 读回音符数。
5. FL 2026 的 `open_piano_roll_for_channel` 参数是 `target_channel`（1-based 索引或通道名），不是 `channel`。
6. `run_piano_roll_script` 只作用于当前钢琴卷帘；没有打开钢琴卷帘时先打开通道。

## 已验证

- FL 2026（`C:\Program Files\Image-Line\FL Studio 2026\FL64.exe`）启动后，CDP 目标为 Gopher WebView2，内置 MCP 返回 **48 个工具**。
- 面板搜索 `ii–V–I` → 显示 5 条章节引用 → 写入 FL Keys 通道 → 读回 **15 个音符**（PPQ 96）。
- 外部 MCP 的 `fl_status` / `fl_list_tools` / `apply_example` 全链路成功，读回 15 个音符。
- 面板 Agent 用 mock 端点验证了 **五种协议**的工具循环：OpenAI Chat Completions、OpenAI Responses、Anthropic Messages、Google Gemini、Ollama 原生均先调用 `get_concept_sources`，再返回带章节 locator 的回答。
- 面板设置里协议下拉、保存、OpenAI Responses 聊天链路已实测。

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
- 测试脚本曾临时添加 FL Keys 通道并写入示例，已清理；不会修改你的原始 808 通道。
