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
       ├─ FL 工具代理：apply_example / fl_status / fl_list_tools / fl_call_tool
       ├─ 操作层：fl_session_report / fl_mixer_routing / fl_route / fl_bus / fl_send / fl_set_levels / fl_write_notes / fl_compose / fl_arrange
       ├─ 实时：live_audio_start / live_audio_status / live_audio_stop
       └─ WAV 分析：analyze_audio
              │ HTTP 127.0.0.1:5127
              ▼
       fl-bridge (npm run fl:bridge)
         ├─ CDP → FL 2026 Gopher WebView2 → script_handler → FL 内置 MCP（48 tools）
         ├─ TONIC Analyzer CLAP（插在 Master/任意 Mixer Insert）→ TCP 5128 → 实时分析
         ├─ Python WASAPI loopback（回退）→ 5s 内存环形缓冲 → 实时 LUFS/true peak/vectorscope
         ├─ /panel 本地面板（查概念 / 写入 / Agent / 混音分析 / 实时矢量示波器）
         └─ 写后读回钢琴卷帘音符数 + 混音矩阵验证
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

**混音分析（FL 标签）**

- 在 FL 里导出 WAV（PCM 16/24/32-bit 或 IEEE float）；
- 打开面板 **FL** 标签 → **MIX ANALYSIS / WAV** → 选择混音 WAV → **分析 WAV**；
- 得到 sample peak、4× 过采样 true peak、RMS、integrated LUFS、short-term min/max、LRA、crest、true-peak crest、peak-to-loudness、DC、削波、立体声相关/宽度、倍频程频谱（31.5 Hz–16 kHz）、多段倍频程热力图、频谱质心与 85% rolloff，以及 risk/warn/info 发现；
- 可选 **参考 WAV**：比较响度、true peak、LRA、crest 与各倍频程占比；频段差值按占比归一化，参考不是投放目标；
- 可选 **目标**：通用流媒体预设（-14 LUFS / -1 dBTP / LRA 3–12，仅通用检查）或自定义 LUFS / LRA 范围 / dBTP；
- 命令行：`npm run audio:analyze -- "F:\Exports\mix.wav" --reference "F:\Exports\ref.wav" --preset streaming`；自定义用 `--lufs -14 --lra-min 3 --lra-max 12 --tp -1`；
- 外部 Agent 用 MCP 工具 `analyze_audio({ path, referencePath, target })`。
- 分析的是 FL 导出的成品 WAV，不是 FL 内部实时总线；true peak 为 4× windowed-sinc 近似（非实验室级表），频谱是声道平均倍频程能量，多段热力图不是逐帧 FFT 瀑布图。

**实时分析（直插调音台 CLAP，推荐）**

- FL 不向外部进程暴露调音台音频；直接监听 Master/任意 Insert 需要插件。TONIC Analyzer CLAP 是纯 pass-through，插在效果槽后把该点音频送到 TONIC。
- 构建：`native\tonic-analyzer\build.bat`（输出 `TONIC-Analyzer.clap`）。
- 安装：**右键 `native\tonic-analyzer\install.bat` → 以管理员身份运行**，复制到 `C:\Program Files\Common Files\CLAP\TONIC\`。FL 2026 的插件管理器只扫描这个系统 CLAP 目录，**不扫描** `%LOCALAPPDATA%\Programs\Common\CLAP`（已由 PluginManager 日志确认）。
- FL：Options → Manage plugins → **Verify plugins / Scan**（必要时 Ctrl+click Scan 全量扫描）；如果插件在 Blacklist 里先移除；扫描结果里勾选 **TONIC Analyzer**。
- 在 **Master 或任意 Mixer Insert** 效果槽插入 **TONIC Analyzer**；打开面板 FL → LIVE ANALYSIS，来源应显示 `FL Mixer CLAP`。
- 这样只分析插入点（Master = 总线；Insert = 指定线），不捕获其他系统声音，不需要导出 WAV。
- 插件是 64-bit CLAP；不修改音频、不增加延迟、不落盘。桥不在时每 2 秒重连，音频不受影响。

**实时分析（系统回环，回退）**

- 首次使用运行根目录 **`setup-live-audio.bat`**：创建 `.venv-audio` 并安装 `PyAudioWPatch`（只装到项目本地，不写系统 Python）。
- 面板 FL 标签 → **LIVE ANALYSIS / WASAPI LOOPBACK** → **开始实时分析**；停止按钮释放音频设备。
- 捕获的是 **Windows 默认输出**（包含 FL 与其他应用），不是 FL 内部总线；如果 FL 输出到其他设备，先在 Windows 里切换默认输出。
- 只在内存保留约 5 秒环形缓冲，**不录音、不落盘、不上传**；必须手动开始；桥退出会结束 Python 捕获进程。
- 实时指标：momentary/short-term LUFS、sample peak、4× true peak、RMS、crest、立体声相关/宽度、削波计数、257 点矢量示波器、10 个倍频程频谱。
- 外部 Agent 用 `live_audio_start` / `live_audio_status` / `live_audio_stop`；有 CLAP 连接时 `/api/live/status` 优先返回 `source: "fl-clap"`。

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

- **MCP（推荐）**：`tonic-mcp.ts` 是标准 stdio MCP server，Qoder、Claude Desktop、Claude Code 等任意 MCP 客户端都能接。已用真实 MCP 客户端验证：列出 **30 个工具**；`fl_status` 返回 `attached: true` 与 48 个 FL 内置工具；`get_concept_sources("ii-v-i")` 返回 Levine 章节级来源。知识工具不依赖 FL；只有 `apply_example` / `fl_*` / `live_*` 需要桥在跑。
- **HTTP（给非 MCP 的脚本/harness）**：桥在 `127.0.0.1:5127` 暴露 `GET /api/status`、`GET /api/search`、`GET /api/fl/report|routing`、`POST /api/fl/route|levels|write|compose|send|bus|arrange`、`POST /api/apply`、`POST /api/audio/analyze`、`GET/POST /api/live/status|start|stop` 等端点。任何本地 harness 都可以直接 `fetch` 这些端点；数据不出本机。
- 外部 harness 不需要打开 FL 内的 TONIC 面板；面板和 MCP 共用同一个桥。但 FL 必须由桥启动（或带 9222 调试端口启动）并打开过 Gopher，否则 FL 工具没有控制通道。

**知识工具**：`search_theory`、`get_concept`、`get_concept_sources`、`search_sources`、`get_source_note`、`get_book_outline`、`list_examples`、`get_related`、`get_review_queue`、`get_video_research`、`get_bibliography`、`get_citation_policy`。

**FL 工具**：`get_fl_payload`、`apply_example`、`fl_status`、`fl_list_tools`、`fl_call_tool`，以及操作封装层：

| 工具 | 类型 | 用途 |
|---|---|---|
| `fl_session_report` | 只读 | 通道路由、混音器电平/声像、插件链、发送、通道电平与命名问题的结构诊断；附总线/返回/环路/死端 |
| `fl_mixer_routing` | 只读 | 完整 send/receive 矩阵、总线、返回轨、环路、最深路由层级 |
| `fl_route` | 写入 | 把通道路由到混音器轨道，返回 verified 结果 |
| `fl_send` | 写入 | 建立/修改/关闭混音器发送，`set_mixer_routing` 后按矩阵验证 level；默认拒绝会形成反馈环路的发送 |
| `fl_bus` | 写入 | 安全建立总线：命名混音器轨道、路由通道、确保回主发送；默认拒绝覆盖非空轨道 |
| `fl_set_levels` | 写入 | 设置混音器轨道绝对 dB/声像/静音/独奏，返回 verified 结果 |
| `fl_write_notes` | 写入 | 任意 MIDI 音符写入当前/指定钢琴卷帘，写后读回音符数 |
| `fl_compose` | 写入 | 多通道/多段作曲：每段可用 TONIC 谱例或显式音符，指定 channel/mode/startBeat/transpose |
| `fl_arrange` | 预览/写入 | 把 TONIC 谱例展开成 bass/comp/pad/melody/arp 多声部；默认只预览，`write:true` 才写入，不自动创建通道 |
| `analyze_audio` | 只读 | 分析导出的 WAV：true peak（4× 过采样）、LUFS/LRA、倍频程频谱与多段热力图、削波/立体声；可对目标或参考 WAV 做响度/频段对比；FL 不能渲染，需先导出 WAV |
| `live_audio_start` | 写入/采集 | 开始 WASAPI loopback 实时分析默认系统输出；只在内存分析、不落盘；需用户明确同意 |
| `live_audio_stop` | 采集 | 停止实时分析并释放音频设备 |
| `live_audio_status` | 只读 | 读取实时 LUFS/true peak/相关/矢量示波器点/倍频程频谱 |

面板中的 **FL** 标签页显示结构诊断，并可直接选择 FL 导出的 WAV 做真实电平分析；LIVE 区域可对默认系统输出做实时矢量示波器与 LUFS/true peak 分析；路由、发送、总线、多轨编配可交给面板 Agent 或外部 MCP Agent。

**混音/编配示例**

```text
fl_bus({ buses: [{ name: "Drums", mixerTrack: "16", channels: "808 Kick,808 Clap" }] })
fl_send({ sends: [{ source: "16", dest: "15", active: true, level: 0.35 }] })
fl_arrange({ conceptSlug: "ii-v-i", write: true, parts: [
  { role: "bass", channel: "Bass" },
  { role: "comp", channel: "Keys", pattern: "half" },
  { role: "melody", channel: "Lead" }
] })
live_audio_start()
live_audio_status()
live_audio_stop()
analyze_audio({ path: "F:\\Exports\\mix.wav" })
analyze_audio({
  path: "F:\\Exports\\mix.wav",
  referencePath: "F:\\Exports\\reference.wav",
  target: { preset: "streaming" }
})
```

`fl_arrange` 是确定性的声部展开：低音按原谱最低音、和弦按音域做八度折叠与就近连接、旋律取和弦音就近进行、arp 按八分音符循环。它是编配起点，不是自动作曲。

### 4. Agent 必须遵守的规则

MCP 已内置 instructions，外部 Agent 也建议使用以下规则（可直接放进项目 `AGENTS.md` 或系统提示）：

1. 任何理论问题先 `search_theory`；需要解释/引用时 `get_concept` / `get_concept_sources`。
2. 每条理论断言必须带工具返回的章节级 locator，不编造引用、页码或原文。
3. 写钢琴卷帘前先 `get_fl_payload` 核对音符，再 `apply_example`；多通道/多段用 `fl_compose`，多声部用 `fl_arrange`（默认只预览，`write:true` 才写入）；不要凭空生成 MIDI。
4. 混音/路由改动前先 `fl_session_report` 或 `fl_mixer_routing`；用 `fl_route`、`fl_bus`、`fl_send`、`fl_set_levels`，执行前说明，执行后报告 verified。
5. 其他 FL 操作先 `fl_list_tools`，再 `fl_call_tool`；执行前说明意图，写入后报告实际 payload / 读回音符数。
6. FL 2026 的 `open_piano_roll_for_channel` 参数是 `target_channel`（1-based 索引或通道名），不是 `channel`。
7. `run_piano_roll_script` 只作用于当前钢琴卷帘；没有打开钢琴卷帘时先打开通道。
8. `fl_session_report` 是结构诊断；真实峰值/LUFS/LRA/频谱用 `analyze_audio` 分析导出的 WAV，不能声称 FL 已测量响度。
9. 实时分析只在用户明确要求时 `live_audio_start`；捕获默认系统输出、只在内存分析、不落盘，用完 `live_audio_stop`。

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
- 操作封装层实测：`fl_session_report` 读取 5 通道/18 混音轨并给结构发现；临时三个 FL Keys 通道分别命名为 TONIC Test Bass/Comp/Melody，`fl_bus` 将插入 16 命名为 TONIC Test Bus 并把三通道路由到它，`fl_send` 建立 Bus→Insert 15 的 0.5 发送，`fl_arrange` 写入 3/30/12 个音符并逐轨读回；清理后移除三通道，插入 16 重置为默认空轨（插入 16）、0 dB/pan 0、主发送 0.8。
- 环路保护实测：建立 16→15 后再发 15→16 被拒绝（“会形成反馈环路”）；关闭 16→15 后矩阵恢复为各自只送主轨 0.8。
- 中文总线名实测：`fl_bus` 用 `\uXXXX` 转义写入“测试总线”并读回一致，再恢复为“插入 16”；直接通过 `fl_call_tool` 传字面中文给 `rename_mixer_tracks` 仍可能乱码。
- MCP 工具总数 31（另含 5 个 prompts 与 8 个 resources：`tonic://meta`、`tonic://concepts`、`tonic://bibliography`、`tonic://citation-policy`、`tonic://books/<id>`、`tonic://video-research`）；面板 FL 标签页显示 BPM/通道/混音器/RISK/WARN/INFO、总线/返回/环路与发现列表，并带实时矢量示波器。
- 外部 MCP 用真实 stdio 客户端复验：31 个工具、`fl_status` 显示桥已附加 48 个 FL 工具、`get_concept_sources` 返回 Levine 章节级来源。
- `start-tonic-fl.bat` 在桥已运行时正确识别、退出码 0，并调用 `/api/panel` 把 Gopher 切回 TONIC；桥未运行时走 `npm run fl:start` 启动桥和 FL。
- WAV 分析实测：16-bit/48k 立体声正弦 peak -6.02 dBFS、RMS -9.03 dBFS、integrated LUFS -6.7、相关 1.00；24-bit 反相立体声相关 -1.00 并给出 phase 警告；削波文件检测到 35920 个削波样本/17960 帧；面板上传 WAV 后显示同样指标与发现。
- true peak/频谱/LRA 实测：12 kHz、相位 45°、幅度 0.9 的正弦 sample peak -3.93 dBFS、true peak -0.80 dBTP（高出 3.12 dB，触发 intersample peak）；频谱质心 12000 Hz、16k 倍频程占 100%；5 秒 -10 dBFS + 5 秒 -20 dBFS 的信号 LRA 10.0 LU、short-term -17.0 到 -7.0 LUFS。
- 目标/参考/多段频谱实测：10 秒双电平信号对 `streaming` 目标得到 ΔLUFS +4.4、true peak 余量 +5.99 dB、LRA in range；与 440 Hz 参考 WAV 对比时 1k/500 Hz 频段被正确识别为只在混音/参考中有能量；多段频谱为 1s × 10 列 × 10 倍频程，面板显示 100 个热力格。
- 自定义目标实测：`--lufs -14 --lra-min 3 --lra-max 12 --tp -1` 与预设走同一对比路径；目标预设明确标注为通用检查，不是平台强制标准。
- 实时分析实测：本机默认输出 `耳机 (Mishuai Awaken Max) [Loopback]`、44100 Hz/2ch；实时得到 momentary/short-term LUFS、true peak、相关、257 点 vectorscope 与 10 个倍频程；面板 canvas 正常绘制；停止后设备释放。强制结束桥后 Python 捕获进程也退出（stdin watchdog）。

## 故障排查

| 现象 | 处理 |
|---|---|
| `fl_status` 报桥未运行 | 运行 `npm run fl:bridge -- --panel` |
| 找不到 Gopher WebView | 打开 FL 的 Gopher 面板（Gopher / Alt+F1）；确认 FL 由桥启动或带 `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222` |
| 9222 端口不出现 | 如果 FL 已在运行，先保存并关闭；重新用 `--launch-fl` 启动 |
| 写入报 `target_channel` 错误 | 使用 `open_piano_roll_for_channel({"target_channel":"6"})` 或省略通道直接用当前钢琴卷帘 |
| Agent 没反应 | 在面板「设置」填 Base URL / 模型，并选择与端点匹配的 **API 协议**（Chat Completions / Responses / Anthropic / Gemini / Ollama） |
| 实时分析启动失败 | 运行 `setup-live-audio.bat`；确认 `.venv-audio\Scripts\python.exe` 存在；检查默认输出设备；详见 stderr 错误 |
| 实时分析没有声音 | 捕获的是 Windows 默认输出；若 FL 用其他音频设备，先在 Windows 里切换默认输出 |
| 想恢复官方 Gopher | 关闭并正常重启 FL，或在 Gopher 面板重新打开官方页面 |

## 边界与安全

- 桥服务只绑定 `127.0.0.1:5127`；CDP 只连本机 WebView2；不向外部上传知识或工程数据。
- 面板 Agent 只访问你配置的 LLM 端点；API Key 存本机 localStorage。
- FL 2026 内置 MCP 是官方控制面，但 `run_piano_roll_script` 可执行任意 `flpianoroll` Python；只对可信 Agent 开放。
- 不能通过 FL API 加载插件、加载音频或渲染音频；这些仍需在 FL 界面完成。
- `fl_session_report` 是**结构诊断**（推子/声像/路由拓扑/插件链/通道电平），不是音频测量；峰值、LUFS/LRA、频谱必须用 `analyze_audio` 分析导出的 WAV。`analyze_audio` 的 true peak 是 4× windowed-sinc 近似，不是实验室级 true-peak 表；频谱是声道平均倍频程能量，多段热力图是倍频程随时间的聚合，不是逐帧 FFT 瀑布图。
- 目标预设（-14 LUFS / -1 dBTP / LRA 3–12）是通用检查值，不是平台强制标准；参考 WAV 只用于相对比较，频段差异按占比归一化，比较前先看响度差。
- FL API 不能自动渲染/导出音频；`analyze_audio` 需要你先在 FL 里导出 WAV。
- `fl_compose` 是“按给定音符/谱例写入多个钢琴卷帘”，不是自动生成完整编曲；`fl_arrange` 也是确定性的声部展开起点，曲式与配器仍由 Agent/用户决定。
- `fl_bus` 会对总线名做 `\uXXXX` 转义后再调用 FL；直接通过 `fl_call_tool` 给 `rename_mixer_tracks` 传字面非 ASCII 名称可能被写成 U+FFFD。
- 实时分析捕获 **Windows 默认输出**，会包含 FL 以外的系统声音；只在内存保留约 5 秒缓冲，不录音、不落盘、不上传。必须由用户手动开始；桥退出会结束捕获进程。
- 测试脚本曾临时添加 FL Keys 通道并写入示例，已清理；原始 5 个 808 通道保留，插入 16 已恢复默认空轨。
