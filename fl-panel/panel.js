(() => {
  const $ = (selector) => document.querySelector(selector);
  const CONFIG_KEY = "tonic.fl.llm.v1";
  const SITE_BASE = "https://gorilla-kevv.github.io/music-theory";
  const state = {
    concept: null,
    messages: [],
    busy: false,
    config: loadConfig(),
  };

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);

  async function api(path, options = {}) {
    const response = await fetch(path, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: text };
    }
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    return data;
  }

  function loadConfig() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveConfig(config) {
    state.config = config;
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  const PROTOCOL_HINTS = {
    "openai-chat": {
      base: "https://api.openai.com/v1",
      note: "标准 /chat/completions；多数国产兼容端点（如 Qwen compatible-mode）选这个。",
    },
    "openai-responses": {
      base: "https://api.openai.com/v1",
      note: "OpenAI Responses API：请求 /responses，支持 function_call 工具循环。",
    },
    anthropic: {
      base: "https://api.anthropic.com",
      note: "Anthropic Messages：服务端自动补 /v1/messages，使用 x-api-key 与 anthropic-version。",
    },
    gemini: {
      base: "https://generativelanguage.googleapis.com",
      note: "Google Gemini：服务端自动补 /v1beta/models/{model}:generateContent。",
    },
    ollama: {
      base: "http://127.0.0.1:11434",
      note: "Ollama 原生 /api/chat；本地模型可留空 API Key。",
    },
  };

  function updateProtocolHint() {
    const protocol = $("#cfg-protocol").value;
    const hint = PROTOCOL_HINTS[protocol] ?? PROTOCOL_HINTS["openai-chat"];
    $("#cfg-base").placeholder = hint.base;
    $("#protocol-note").textContent = hint.note;
  }

  function fillSettings() {
    $("#cfg-protocol").value = state.config.protocol || "openai-chat";
    $("#cfg-base").value = state.config.baseUrl || "";
    $("#cfg-model").value = state.config.model || "";
    $("#cfg-key").value = state.config.apiKey || "";
    updateProtocolHint();
  }

  function setTab(name) {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === name);
    });
    document.querySelectorAll(".panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `tab-${name}`);
    });
    if (name === "settings") fillSettings();
  }

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setTab(tab.dataset.tab));
  });
  $("#open-settings").addEventListener("click", () => setTab("settings"));

  async function refreshStatus() {
    const dot = $("#status-dot");
    const text = $("#status-text");
    try {
      const data = await api("/api/status");
      const attached = Boolean(data.fl && data.fl.attached);
      dot.classList.toggle("ok", attached);
      text.textContent = attached
        ? `FL 已连接${data.fl.tools ? ` · ${data.fl.tools} tools` : ""}`
        : "FL 未连接";
      $("#tool-count").textContent = data.fl?.tools ?? "—";
    } catch {
      dot.classList.remove("ok");
      text.textContent = "桥服务未连接";
      $("#tool-count").textContent = "—";
    }
  }
  refreshStatus();
  setInterval(refreshStatus, 5000);

  function showSearchError(error) {
    $("#search-results").innerHTML = `<p class="muted">检索失败：${escapeHtml(error.message)}</p>`;
  }

  function renderResults(results) {
    if (!results.length) {
      $("#search-results").innerHTML = `<p class="muted">没有匹配结果。</p>`;
      return;
    }
    $("#search-results").innerHTML = results
      .map(
        (item) => `
        <button type="button" class="result" data-slug="${escapeHtml(item.slug)}">
          <span class="num">${escapeHtml(item.number)} · ${escapeHtml(item.category)}</span>
          <span class="title">${escapeHtml(item.title)}</span>
          <span class="summary">${escapeHtml(item.summary)}</span>
        </button>`,
      )
      .join("");
  }

  async function search(query) {
    const value = String(query ?? $("#search-input").value).trim();
    if (!value) return;
    $("#search-input").value = value;
    $("#search-results").innerHTML = `<p class="muted">检索中…</p>`;
    try {
      const data = await api(`/api/search?q=${encodeURIComponent(value)}`);
      renderResults(data.results || []);
    } catch (error) {
      showSearchError(error);
    }
  }

  $("#search-btn").addEventListener("click", () => search());
  $("#search-input").addEventListener("input", () => {
    window.clearTimeout(window.__tonicSearchTimer);
    window.__tonicSearchTimer = window.setTimeout(() => {
      if ($("#search-input").value.trim().length >= 1) search();
    }, 260);
  });
  $("#search-results").addEventListener("click", (event) => {
    const target = event.target.closest("[data-query]");
    if (target) {
      search(target.dataset.query);
      return;
    }
    const result = event.target.closest("[data-slug]");
    if (result) loadConcept(result.dataset.slug);
  });

  function citationHtml(citations) {
    if (!citations || !citations.length) return `<p class="muted">暂无章节引用。</p>`;
    return `<ul class="citations">${citations
      .map(
        (item) =>
          `<li><strong>${escapeHtml(item.source)}</strong> · ${escapeHtml(item.locator)}${
            item.note ? `<span class="muted">（${escapeHtml(item.note)}）</span>` : ""
          }</li>`,
      )
      .join("")}</ul>`;
  }

  function sourceGroups(sources) {
    const groups = new Map();
    for (const source of sources || []) {
      const list = groups.get(source.book) || [];
      list.push(source);
      groups.set(source.book, list);
    }
    return [...groups.entries()]
      .map(
        ([book, list]) => `
        <div class="source-group">
          <div class="book">${escapeHtml(book)} · ${list.length} 章</div>
          ${list
            .map(
              (chapter) => `
              <a class="source-link" href="${SITE_BASE}/books?book=${encodeURIComponent(
                chapter.book,
              )}&chapter=${encodeURIComponent(chapter.id)}" target="_blank" rel="noreferrer">
                CH.${escapeHtml(chapter.number)} ${escapeHtml(chapter.titleZh || chapter.title)}
                ${chapter.summary ? `<span class="summary">${escapeHtml(chapter.summary)}</span>` : ""}
              </a>`,
            )
            .join("")}
        </div>`,
      )
      .join("");
  }

  function examplesHtml(examples) {
    if (!examples || !examples.length) return `<p class="muted">该概念暂时没有可写入的谱例。</p>`;
    return examples
      .map(
        (example) => `
        <div class="example">
          <div class="meta">
            <span class="name">${escapeHtml(example.title)}</span>
            <span class="sub">${example.noteCount} 音符 · ${example.tempo} BPM · ${escapeHtml(example.kind)}</span>
          </div>
          <div class="actions">
            <button type="button" data-example-id="${escapeHtml(example.id)}" data-mode="append">写入</button>
            <button type="button" data-example-id="${escapeHtml(example.id)}" data-mode="replace">清空写入</button>
          </div>
        </div>`,
      )
      .join("");
  }

  function renderConcept(concept) {
    state.concept = concept;
    const detail = $("#concept-detail");
    detail.classList.remove("hidden");
    detail.innerHTML = `
      <p class="mono muted">${escapeHtml(concept.number)} · ${escapeHtml(concept.category)} · ${escapeHtml(
        concept.level,
      )}</p>
      <h2>${escapeHtml(concept.title)}</h2>
      <p class="muted">${escapeHtml(concept.titleEn)}</p>
      <p>${escapeHtml(concept.summary)}</p>
      <div class="chips">
        ${(concept.dimensions || [])
          .map((dimension) => `<span class="chip">${escapeHtml(dimension)}</span>`)
          .join("")}
        ${(concept.aliases || [])
          .slice(0, 6)
          .map((alias) => `<span class="chip">${escapeHtml(alias)}</span>`)
          .join("")}
        <a class="chip source" href="${SITE_BASE}/theory/${encodeURIComponent(
          concept.slug,
        )}" target="_blank" rel="noreferrer">在 TONIC 打开 ↗</a>
      </div>

      <h3>章节依据</h3>
      ${citationHtml(concept.citations)}

      <h3>跨书章节</h3>
      ${sourceGroups(concept.sources)}

      <h3>写入 Piano Roll</h3>
      <div class="channel-row">
        <label style="margin:0">通道（可选，1-based）</label>
        <input id="channel-input" type="number" min="1" placeholder="当前钢琴卷帘" />
      </div>
      ${examplesHtml(concept.examples)}
      <div id="apply-status" class="apply-status" hidden></div>
    `;
    detail.scrollIntoView({ block: "start" });
  }

  async function loadConcept(slug) {
    $("#search-results").innerHTML = `<p class="muted">读取概念…</p>`;
    try {
      const concept = await api(`/api/concept/${encodeURIComponent(slug)}`);
      renderConcept(concept);
    } catch (error) {
      $("#search-results").innerHTML = `<p class="muted">读取失败：${escapeHtml(error.message)}</p>`;
    }
  }

  $("#concept-detail").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-example-id]");
    if (!button) return;
    const channelValue = Number($("#channel-input")?.value);
    const channel = Number.isFinite(channelValue) && channelValue > 0 ? channelValue : undefined;
    const status = $("#apply-status");
    status.hidden = false;
    status.classList.remove("error");
    status.textContent = "正在写入 FL 钢琴卷帘…";
    try {
      const result = await api("/api/apply", {
        method: "POST",
        body: JSON.stringify({
          exampleId: button.dataset.exampleId,
          mode: button.dataset.mode,
          ...(channel ? { channel } : {}),
        }),
      });
      status.innerHTML = `<strong>已提交到 FL${
        result.verifiedNotes != null ? ` · 读回 ${result.verifiedNotes} 个音符` : ""
      }。</strong><br />${escapeHtml(result.summary || "谱例已写入。")}<br /><details><summary>查看音符 / FL 返回</summary><pre>${escapeHtml(
        JSON.stringify(
          {
            notes: result.payload?.notes,
            verifiedNotes: result.verifiedNotes,
            result: result.result,
          },
          null,
          2,
        ),
      )}</pre></details>`;
      refreshStatus();
    } catch (error) {
      status.classList.add("error");
      status.textContent = `写入失败：${error.message}`;
    }
  });

  const chatLog = $("#chat-log");
  function appendBubble(role, text) {
    const bubble = document.createElement("div");
    bubble.className = `bubble ${role}`;
    bubble.textContent = text;
    chatLog.appendChild(bubble);
    chatLog.scrollTop = chatLog.scrollHeight;
    return bubble;
  }

  function renderTrace(trace) {
    if (!trace || !trace.length) {
      $("#chat-trace").innerHTML = "";
      return;
    }
    $("#chat-trace").innerHTML = `<div class="mono">TOOL TRACE</div>${trace
      .map(
        (item) =>
          `<div class="item">${item.ok ? "✓" : "✕"} ${escapeHtml(item.name)} ${escapeHtml(
            JSON.stringify(item.args || {}),
          ).slice(0, 180)}</div>`,
      )
      .join("")}`;
  }

  async function sendChat() {
    if (state.busy) return;
    const input = $("#chat-input");
    const text = input.value.trim();
    if (!text) return;
    if (!state.config.baseUrl || !state.config.model) {
      setTab("settings");
      $("#settings-note").textContent = "先填写 LLM Base URL 与模型名，再回来对话。";
      return;
    }
    input.value = "";
    appendBubble("user", text);
    state.messages.push({ role: "user", content: text });
    state.busy = true;
    $("#chat-send").disabled = true;
    const pending = appendBubble("assistant", "正在检索 TONIC 并思考…");
    try {
      const data = await api("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: state.messages.slice(-12), config: state.config }),
      });
      pending.remove();
      appendBubble("assistant", data.content || "（空回答）");
      state.messages.push({ role: "assistant", content: data.content || "" });
      renderTrace(data.trace);
      refreshStatus();
    } catch (error) {
      pending.remove();
      appendBubble("assistant", `请求失败：${error.message}`);
    } finally {
      state.busy = false;
      $("#chat-send").disabled = false;
    }
  }

  $("#chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    sendChat();
  });
  $("#chat-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendChat();
    }
  });

  $("#cfg-protocol").addEventListener("change", updateProtocolHint);

  $("#save-settings").addEventListener("click", () => {
    saveConfig({
      protocol: $("#cfg-protocol").value,
      baseUrl: $("#cfg-base").value.trim(),
      model: $("#cfg-model").value.trim(),
      apiKey: $("#cfg-key").value.trim(),
    });
    $("#settings-note").textContent = "已保存在本机浏览器。";
    setTab("agent");
  });

  fillSettings();

  const initialSlug = new URLSearchParams(location.search).get("slug");
  if (initialSlug) loadConcept(initialSlug);
})();
