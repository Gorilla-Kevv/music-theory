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
    if (name === "fl") void refreshFlReport();
  }

  async function refreshFlReport() {
    const target = $("#fl-report");
    target.innerHTML = `<p class="muted">读取 FL session…</p>`;
    try {
      const data = await api("/api/fl/report");
      const findings = data.findings || [];
      const summary = data.summary || {};
      target.innerHTML = `
        <div class="fl-summary">
          <span>${escapeHtml(data.tempoBpm ?? "—")} BPM</span>
          <span>${escapeHtml(data.channelCount)} CH</span>
          <span>${escapeHtml(data.mixerTrackCount)} MIXER</span>
          <span>RISK ${escapeHtml(summary.risk ?? 0)}</span>
          <span>WARN ${escapeHtml(summary.warn ?? 0)}</span>
          <span>INFO ${escapeHtml(summary.info ?? 0)}</span>
        </div>
        <p class="muted">${escapeHtml(data.measurementNote || "")}</p>
        ${
          findings.length
            ? findings
                .map(
                  (item) => `
            <div class="finding ${escapeHtml(item.severity)}">
              <span class="code">${escapeHtml(item.code)} · ${escapeHtml(item.severity)}</span>
              ${escapeHtml(item.message)}
              ${item.suggestion ? `<span class="suggestion">→ ${escapeHtml(item.suggestion)}</span>` : ""}
            </div>`,
                )
                .join("")
            : `<p class="muted">没有发现结构性问题。</p>`
        }
        <div class="fl-routing">
          ${(data.routing || [])
            .map(
              (item) =>
                `${escapeHtml(item.channel || `#${item.channelIndex}`)} → mixer ${escapeHtml(
                  item.mixerTrack ?? "?",
                )}`,
            )
            .join("<br />")}
        </div>
        <div class="fl-routing">
          ${(data.routingGraph?.buses || [])
            .map((bus) => `BUS ${escapeHtml(bus.name)} · ${bus.channels.length} ch`)
            .join("<br />")}
          ${(data.routingGraph?.returns || [])
            .map((ret) => `<br />RETURN ${escapeHtml(ret.name)} · ${ret.incomingSends} sends`)
            .join("")}
          ${
            data.routingGraph?.cycles?.length
              ? `<br />CYCLES ${data.routingGraph.cycles.length}`
              : ""
          }
        </div>
      `;
    } catch (error) {
      target.innerHTML = `<p class="muted">读取失败：${escapeHtml(error.message)}</p>`;
    }
  }

  $("#refresh-fl").addEventListener("click", () => refreshFlReport());

  let liveTimer = null;
  const liveCanvas = $("#live-vectorscope");
  const liveContext = liveCanvas ? liveCanvas.getContext("2d") : null;

  function clearVectorscope() {
    if (!liveContext) return;
    liveContext.fillStyle = "#0b0d10";
    liveContext.fillRect(0, 0, liveCanvas.width, liveCanvas.height);
  }

  function drawVectorscope(points, correlation) {
    if (!liveContext) return;
    const width = liveCanvas.width;
    const height = liveCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 100;
    liveContext.fillStyle = "#0b0d10";
    liveContext.fillRect(0, 0, width, height);
    liveContext.strokeStyle = "rgba(246,242,232,0.16)";
    liveContext.lineWidth = 1;
    liveContext.beginPath();
    liveContext.arc(centerX, centerY, scale, 0, Math.PI * 2);
    liveContext.stroke();
    liveContext.beginPath();
    liveContext.moveTo(centerX, centerY - scale);
    liveContext.lineTo(centerX, centerY + scale);
    liveContext.moveTo(centerX - scale, centerY);
    liveContext.lineTo(centerX + scale, centerY);
    liveContext.moveTo(centerX - scale * 0.707, centerY - scale * 0.707);
    liveContext.lineTo(centerX + scale * 0.707, centerY + scale * 0.707);
    liveContext.moveTo(centerX + scale * 0.707, centerY - scale * 0.707);
    liveContext.lineTo(centerX - scale * 0.707, centerY + scale * 0.707);
    liveContext.stroke();
    liveContext.fillStyle = "rgba(216,255,62,0.55)";
    for (const point of points || []) {
      const left = Math.max(-1, Math.min(1, point.left));
      const right = Math.max(-1, Math.min(1, point.right));
      const x = centerX + ((right - left) * scale) / 2;
      const y = centerY - ((left + right) * scale) / 2;
      liveContext.fillRect(x, y, 1.6, 1.6);
    }
    liveContext.fillStyle = "rgba(246,242,232,0.65)";
    liveContext.font = "10px 'Cascadia Mono', Consolas, monospace";
    liveContext.fillText("L", centerX - scale - 16, centerY + 4);
    liveContext.fillText("R", centerX + scale + 8, centerY + 4);
    liveContext.fillText("M", centerX - 4, centerY - scale - 8);
    liveContext.fillText(
      `CORR ${typeof correlation === "number" ? correlation.toFixed(2) : "—"}`,
      centerX + scale + 14,
      centerY - scale,
    );
  }

  function renderLiveSpectrum(spectrum) {
    const target = $("#live-spectrum");
    if (!target) return;
    if (!spectrum || !spectrum.bands || !spectrum.bands.length) {
      target.innerHTML = "";
      return;
    }
    const maxShare = spectrum.bands.reduce(
      (max, band) => Math.max(max, band.sharePercent),
      1,
    );
    target.innerHTML = `
      <p class="muted">质心 ${Math.round(spectrum.centroidHz || 0)} Hz · rolloff85 ${Math.round(
        spectrum.rolloff85Hz || 0,
      )} Hz</p>
      ${spectrum.bands
        .map(
          (band) => `
        <div class="spectrum-row">
          <span class="spectrum-band">${escapeHtml(band.name)}</span>
          <span class="spectrum-bar"><i style="width:${Math.max(
            0,
            Math.min(100, (band.sharePercent / maxShare) * 100),
          ).toFixed(1)}%"></i></span>
          <span class="spectrum-share">${band.sharePercent.toFixed(1)}%</span>
        </div>`,
        )
        .join("")}
    `;
  }

  function renderLiveStatus(data) {
    const state = $("#live-state");
    const start = $("#live-start");
    const stop = $("#live-stop");
    if (start) start.disabled = data.running || data.starting;
    if (stop) stop.disabled = !data.running && !data.starting;
    if (data.starting) {
      state.textContent = "启动中…";
    } else if (data.running) {
      const device = data.meta?.device || "默认输出";
      state.textContent = `运行中 · ${device} · ${data.meta?.rate ?? "?"} Hz`;
    } else {
      state.textContent = data.error ? "错误" : "未启动";
    }

    const snapshot = data.snapshot;
    if (!snapshot) {
      $("#live-metrics").innerHTML = data.error
        ? `<p class="muted">${escapeHtml(data.error)}</p>`
        : `<p class="muted">${data.starting ? "等待音频设备…" : "点击开始实时分析。"}</p>`;
      $("#live-spectrum").innerHTML = "";
      clearVectorscope();
      return;
    }
    const number = (value, digits = 1) =>
      typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "—";
    $("#live-metrics").innerHTML = `
      <div class="fl-summary">
        <span>${escapeHtml(snapshot.status.toUpperCase())}</span>
        <span>${number(snapshot.momentaryLufs)} LUFS M</span>
        <span>${number(snapshot.shortTermLufs)} LUFS S</span>
        <span>${number(snapshot.truePeakDbtp, 2)} dBTP</span>
        <span>${number(snapshot.correlation, 2)} CORR</span>
      </div>
      <div class="audio-metrics">
        <div class="audio-metric"><span>SAMPLE PEAK</span>${number(snapshot.samplePeakDbfs, 2)} dBFS</div>
        <div class="audio-metric"><span>RMS</span>${number(snapshot.rmsDbfs, 2)} dBFS</div>
        <div class="audio-metric"><span>CREST</span>${number(snapshot.crestFactorDb, 1)} dB</div>
        <div class="audio-metric"><span>STEREO WIDTH</span>${number(snapshot.stereoWidth, 2)}</div>
        <div class="audio-metric"><span>CLIPPED (1S)</span>${escapeHtml(snapshot.clippedSamples)}</div>
        <div class="audio-metric"><span>ELAPSED</span>${number(snapshot.elapsedSeconds, 1)} s</div>
      </div>
      ${data.error ? `<p class="muted">${escapeHtml(data.error)}</p>` : ""}
    `;
    renderLiveSpectrum(snapshot.spectrum);
    drawVectorscope(snapshot.vectorscope, snapshot.correlation);
  }

  async function pollLive() {
    try {
      const data = await api("/api/live/status");
      renderLiveStatus(data);
      if (data.running || data.starting) {
        ensureLivePolling();
      } else if (liveTimer) {
        window.clearInterval(liveTimer);
        liveTimer = null;
      }
    } catch (error) {
      $("#live-state").textContent = "桥未连接";
      $("#live-metrics").innerHTML = `<p class="muted">${escapeHtml(error.message)}</p>`;
      if (liveTimer) {
        window.clearInterval(liveTimer);
        liveTimer = null;
      }
    }
  }

  function ensureLivePolling() {
    if (!liveTimer) liveTimer = window.setInterval(pollLive, 500);
  }

  $("#live-start").addEventListener("click", async () => {
    $("#live-start").disabled = true;
    $("#live-state").textContent = "启动中…";
    try {
      const data = await api("/api/live/start", { method: "POST", body: "{}" });
      renderLiveStatus(data);
      ensureLivePolling();
    } catch (error) {
      $("#live-state").textContent = "错误";
      $("#live-metrics").innerHTML = `<p class="muted">${escapeHtml(error.message)}</p>`;
    }
  });

  $("#live-stop").addEventListener("click", async () => {
    try {
      const data = await api("/api/live/stop", { method: "POST", body: "{}" });
      renderLiveStatus(data);
    } catch (error) {
      $("#live-metrics").innerHTML = `<p class="muted">${escapeHtml(error.message)}</p>`;
    }
  });

  function toBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunk = 0x8000;
    for (let index = 0; index < bytes.length; index += chunk) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
    }
    return btoa(binary);
  }

  function renderSpectrogram(spectrogram) {
    if (!spectrogram || !spectrogram.columns.length) return "";
    const columns = spectrogram.columns;
    const names = spectrogram.bandNames;
    let maxShare = 0;
    for (const column of columns) {
      for (const share of column.bands) maxShare = Math.max(maxShare, share || 0);
    }
    if (maxShare <= 0) return "";
    const labelEvery = Math.max(1, Math.ceil(columns.length / 8));
    const timeRow = columns
      .map(
        (column, index) =>
          `<span class="spectrogram-time">${
            index % labelEvery === 0 ? `${column.timeSeconds.toFixed(1)}s` : ""
          }</span>`,
      )
      .join("");
    const rows = names
      .map(
        (name, bandIndex) =>
          `<span class="spectrogram-band">${escapeHtml(name)}</span>` +
          columns
            .map((column) => {
              const share = column.bands[bandIndex] || 0;
              const opacity = Math.min(1, share / maxShare);
              return `<span class="spectrogram-cell" style="background:rgba(36,71,255,${opacity.toFixed(
                3,
              )})" title="${escapeHtml(name)} · ${column.timeSeconds.toFixed(
                1,
              )}s · ${share.toFixed(1)}%"></span>`;
            })
            .join(""),
      )
      .join("");
    return `<div class="spectrogram-wrap"><p class="mono muted">MULTI-SEGMENT / ${spectrogram.segmentSeconds.toFixed(
      1,
    )}s 段 · ${columns.length} 列</p><div class="spectrogram" style="grid-template-columns: 34px repeat(${
      columns.length
    }, minmax(2px, 1fr));"><span></span>${timeRow}${rows}</div><p class="muted">行 = 倍频程，列 = 时间；颜色为段内能量占比。</p></div>`;
  }

  function renderComparison(comparison) {
    if (!comparison) return "";
    const number = (value, digits = 1) =>
      typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "—";
    const signed = (value, digits = 1) =>
      typeof value === "number" && Number.isFinite(value)
        ? `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`
        : "—";
    const deltaLabel = (value) =>
      typeof value === "number" && Number.isFinite(value)
        ? Math.abs(value) > 24
          ? value > 0
            ? "> +24"
            : "< −24"
          : signed(value, 1)
        : "—";
    const target = comparison.target;
    const targetDeltas = comparison.targetDeltas;
    let targetHtml = "";
    if (target) {
      targetHtml = `<div class="compare-block">
        <p class="mono muted">TARGET / ${escapeHtml(target.label)}</p>
        <div class="fl-summary">
          <span>目标 ${target.targetLufs === null ? "—" : target.targetLufs} LUFS</span>
          <span>Δ ${signed(targetDeltas?.lufs)} LU</span>
          <span>TP 余量 ${signed(targetDeltas?.truePeakMarginDb, 2)} dB</span>
          <span>LRA ${
            targetDeltas?.lraInRange === null || targetDeltas?.lraInRange === undefined
              ? "—"
              : targetDeltas.lraInRange
                ? "IN RANGE"
                : "OUT"
          }</span>
        </div>
        <p class="muted">${escapeHtml(target.note)}</p>
      </div>`;
    }
    const reference = comparison.reference;
    let referenceHtml = "";
    if (reference) {
      const deltas = comparison.referenceDeltas;
      const bands = (comparison.bands || [])
        .filter(
          (band) =>
            band.deltaDb !== null &&
            Math.max(band.mixSharePercent, band.referenceSharePercent) >= 0.5,
        )
        .sort((a, b) => Math.abs(b.deltaDb) - Math.abs(a.deltaDb))
        .slice(0, 6);
      referenceHtml = `<div class="compare-block">
        <p class="mono muted">REFERENCE / ${escapeHtml(reference.file || "参考 WAV")}</p>
        <div class="fl-summary">
          <span>REF ${number(reference.integratedLufs)} LUFS</span>
          <span>Δ ${signed(deltas?.lufs)} LU</span>
          <span>REF TP ${number(reference.truePeakDbtp, 2)} dBTP</span>
          <span>Δ TP ${signed(deltas?.truePeak, 2)} dB</span>
          <span>REF LRA ${number(reference.loudnessRangeLu)} LU</span>
        </div>
        ${
          bands.length
            ? `<div class="band-deltas">${bands
                .map(
                  (band) => `<div class="band-delta" title="${escapeHtml(
                    band.name,
                  )}：mix ${band.mixSharePercent.toFixed(1)}% / ref ${band.referenceSharePercent.toFixed(
                    1,
                  )}%"><span>${escapeHtml(band.name)}</span><span>${deltaLabel(
                    band.deltaDb,
                  )} dB</span><span class="delta-bar"><i style="width:${Math.min(
                    100,
                    (Math.abs(band.deltaDb) / 12) * 100,
                  ).toFixed(1)}%;background:${
                    band.deltaDb >= 0 ? "var(--cobalt)" : "var(--cadmium)"
                  }"></i></span><span>${band.mixSharePercent.toFixed(
                    1,
                  )}% / ${band.referenceSharePercent.toFixed(1)}%</span></div>`,
                )
                .join("")}</div>`
            : ""
        }
        <p class="muted">频段差值按能量占比归一化；参考不是投放目标。</p>
      </div>`;
    }
    return targetHtml || referenceHtml
      ? `<div class="comparison">${targetHtml}${referenceHtml}</div>`
      : "";
  }

  function renderAudioReport(data) {
    const findings = [...(data.findings || []), ...(data.comparison?.findings || [])];
    const severityRank = { risk: 0, warn: 1, info: 2 };
    findings.sort(
      (left, right) =>
        (severityRank[left.severity] ?? 3) - (severityRank[right.severity] ?? 3),
    );
    const target = $("#wav-report");
    const number = (value, digits = 1) =>
      typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "—";
    const bands = data.spectrum?.bands || [];
    const maxShare = bands.reduce((max, band) => Math.max(max, band.sharePercent), 1);
    const spectrumHtml = data.spectrum
      ? `<div class="spectrum">
          ${bands
            .map(
              (band) => `
            <div class="spectrum-row" title="${number(band.energyDb, 1)} dB">
              <span class="spectrum-band">${escapeHtml(band.name)}</span>
              <span class="spectrum-bar"><i style="width:${Math.max(
                0,
                Math.min(100, (band.sharePercent / maxShare) * 100),
              ).toFixed(1)}%"></i></span>
              <span class="spectrum-share">${number(band.sharePercent, 1)}%</span>
            </div>`,
            )
            .join("")}
          <p class="muted">${escapeHtml(data.spectrum.method)} · 质心 ${number(
            data.spectrum.centroidHz,
            0,
          )} Hz · rolloff85 ${number(data.spectrum.rolloff85Hz, 0)} Hz · tilt ${number(
            data.spectrum.tiltDbPerOctave,
            1,
          )} dB/oct</p>
        </div>`
      : data.peakDbfs <= -119
        ? `<p class="muted">全静音，没有可分析的频谱。</p>`
        : `<p class="muted">文件太短，无法计算频谱（至少 256 帧）。</p>`;
    const spectrogramHtml = renderSpectrogram(data.spectrum?.spectrogram);
    const comparisonHtml = renderComparison(data.comparison);
    target.innerHTML = `
      <div class="fl-summary">
        <span>${escapeHtml(data.format)}</span>
        <span>${escapeHtml(data.sampleRate)} Hz / ${escapeHtml(data.channels)} CH</span>
        <span>${number(data.durationSeconds, 1)} S</span>
        <span>${number(data.peakDbfs, 2)} dBFS PEAK</span>
        <span>${number(data.truePeakDbtp, 2)} dBTP TRUE</span>
        <span>${number(data.integratedLufs, 1)} LUFS</span>
      </div>
      <div class="audio-metrics">
        <div class="audio-metric"><span>TRUE PEAK (${escapeHtml(data.truePeakOversampling)}×)</span>${number(data.truePeakDbtp, 2)} dBTP</div>
        <div class="audio-metric"><span>TRUE − SAMPLE</span>${number(data.truePeakAboveSampleDb, 2)} dB</div>
        <div class="audio-metric"><span>RMS</span>${number(data.rmsDbfs, 2)} dBFS</div>
        <div class="audio-metric"><span>CREST / TRUE</span>${number(data.crestFactorDb, 1)} / ${number(data.truePeakCrestDb, 1)} dB</div>
        <div class="audio-metric"><span>LRA</span>${number(data.loudnessRangeLu, 1)} LU</div>
        <div class="audio-metric"><span>SHORT-TERM MIN / MAX</span>${number(data.shortTermLufsMin, 1)} / ${number(data.shortTermLufsMax, 1)} LUFS</div>
        <div class="audio-metric"><span>PEAK TO LOUDNESS</span>${number(data.peakToLoudnessDb, 1)} dB</div>
        <div class="audio-metric"><span>TRUE PEAK TO LOUDNESS</span>${number(data.truePeakToLoudnessDb, 1)} dB</div>
        <div class="audio-metric"><span>SPECTRAL CENTROID</span>${number(data.spectrum?.centroidHz, 0)} Hz</div>
        <div class="audio-metric"><span>ROLLOFF 85%</span>${number(data.spectrum?.rolloff85Hz, 0)} Hz</div>
        <div class="audio-metric"><span>STEREO CORR</span>${number(data.stereoCorrelation, 2)}</div>
        <div class="audio-metric"><span>STEREO WIDTH</span>${number(data.stereoWidth, 2)}</div>
        <div class="audio-metric"><span>DC OFFSET</span>${number(data.dcOffset, 4)}</div>
        <div class="audio-metric"><span>CLIPPED</span>${escapeHtml(data.clippedSamples)} samples / ${escapeHtml(data.clippedFrames)} frames</div>
      </div>
      ${spectrumHtml}
      ${spectrogramHtml}
      ${comparisonHtml}
      <p class="muted">${escapeHtml(data.measurementNote || "")}</p>
      ${
        findings.length
          ? findings
              .map(
                (item) => `
            <div class="finding ${escapeHtml(item.severity)}">
              <span class="code">${escapeHtml(item.code)} · ${escapeHtml(item.severity)}</span>
              ${escapeHtml(item.message)}
              ${item.suggestion ? `<span class="suggestion">→ ${escapeHtml(item.suggestion)}</span>` : ""}
            </div>`,
              )
              .join("")
          : `<p class="muted">没有发现明显的电平问题。</p>`
      }
    `;
  }

  $("#wav-target").addEventListener("change", () => {
    $("#custom-target").classList.toggle("hidden", $("#wav-target").value !== "custom");
  });

  $("#analyze-wav").addEventListener("click", async () => {
    const input = $("#wav-file");
    const file = input.files && input.files[0];
    const target = $("#wav-report");
    if (!file) {
      target.innerHTML = `<p class="muted">先在 FL 导出 WAV，再选择文件。</p>`;
      return;
    }
    target.innerHTML = `<p class="muted">分析中…（大文件/参考轨需要几秒）</p>`;
    try {
      const buffer = await file.arrayBuffer();
      const referenceFile = $("#wav-reference").files && $("#wav-reference").files[0];
      const referencePayload = referenceFile
        ? {
            referenceBase64: toBase64(await referenceFile.arrayBuffer()),
            referenceFilename: referenceFile.name,
          }
        : {};
      const targetMode = $("#wav-target").value;
      const targetNumber = (selector) => {
        const value = $(selector).value.trim();
        if (!value) return undefined;
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : undefined;
      };
      const customTarget = {
        preset: "custom",
        targetLufs: targetNumber("#target-lufs"),
        lraMinLu: targetNumber("#target-lra-min"),
        lraMaxLu: targetNumber("#target-lra-max"),
        truePeakMaxDbtp: targetNumber("#target-tp"),
      };
      const hasCustomTarget = Object.values(customTarget).some(
        (value) => typeof value === "number",
      );
      const targetPayload =
        targetMode === "streaming"
          ? { target: { preset: "streaming" } }
          : targetMode === "custom" && hasCustomTarget
            ? { target: customTarget }
            : {};
      const data = await api("/api/audio/analyze", {
        method: "POST",
        body: JSON.stringify({
          base64: toBase64(buffer),
          filename: file.name,
          ...referencePayload,
          ...targetPayload,
        }),
      });
      renderAudioReport(data);
    } catch (error) {
      target.innerHTML = `<p class="muted">分析失败：${escapeHtml(error.message)}</p>`;
    }
  });

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
  pollLive();

  const initialSlug = new URLSearchParams(location.search).get("slug");
  if (initialSlug) loadConcept(initialSlug);
})();
