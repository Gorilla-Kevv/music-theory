/**
 * FL Studio 2026 · Gopher WebView2 CDP bridge.
 *
 * FL launches its Gopher panel as a WebView2 page. FL injects a set-only
 * `script_handler` host object into that page; assigning JSON to
 * `script_handler.runJson` runs FL's own MCP tools. This module attaches to
 * the WebView2 target over the DevTools protocol and exposes a single-flight
 * promise bridge inside the page.
 */

export interface FlTarget {
  id: string;
  type: string;
  title: string;
  url: string;
  webSocketDebuggerUrl: string;
}

interface CdpResponse {
  id?: number;
  result?: {
    result?: { type?: string; value?: unknown; description?: string };
    exceptionDetails?: { text?: string; exception?: { description?: string } };
  };
  error?: { code: number; message: string };
}

const BRIDGE_JS = String.raw`
(() => {
  if (window.__tonicFl && window.__tonicFl.version === 1) return true;
  const getHandler = () => {
    if (typeof script_handler === "object" && script_handler) return script_handler;
    const webview = window.chrome && window.chrome.webview;
    if (webview && webview.hostObjects && webview.hostObjects.script_handler) {
      return webview.hostObjects.script_handler;
    }
    return null;
  };
  const handler = getHandler();
  if (!handler) return false;
  const previous = window.flHelper || {};
  const parse = (payload) => {
    if (typeof payload !== "string") return payload;
    try { return JSON.parse(payload); } catch { return payload; }
  };
  const state = { version: 1, pending: null, tools: null, seq: 1 };
  const settle = (payload) => {
    if (!state.pending) return;
    const pending = state.pending;
    state.pending = null;
    clearTimeout(pending.timer);
    const parsed = parse(payload);
    if (parsed && parsed.error) {
      pending.reject(new Error(typeof parsed.error === "string" ? parsed.error : JSON.stringify(parsed.error)));
    } else {
      pending.resolve(parsed && Object.prototype.hasOwnProperty.call(parsed, "result") ? parsed.result : parsed);
    }
  };
  window.flHelper = window.flHelper || {};
  window.flHelper.onRunJson = (payload) => {
    settle(payload);
    try { previous.onRunJson && previous.onRunJson(payload); } catch (error) {}
  };
  window.flHelper.onMCPTools = (payload) => {
    state.tools = parse(payload);
    try { previous.onMCPTools && previous.onMCPTools(payload); } catch (error) {}
  };
  state.call = (name, args) => new Promise((resolve, reject) => {
    if (state.pending) {
      reject(new Error("FL bridge busy: one tool call at a time"));
      return;
    }
    const id = state.seq++;
    const timer = setTimeout(() => {
      state.pending = null;
      reject(new Error("FL bridge timeout (35s)"));
    }, 35000);
    state.pending = { resolve, reject, timer };
    handler.runJson = JSON.stringify({
      jsonrpc: "2.0",
      id,
      method: "tools/call",
      params: { name, arguments: args || {} },
    });
  });
  state.listTools = () => new Promise((resolve, reject) => {
    if (state.tools) { resolve(state.tools); return; }
    const timer = setTimeout(() => reject(new Error("FL tool catalog timeout (10s)")), 10000);
    const previousOnTools = window.flHelper.onMCPTools;
    window.flHelper.onMCPTools = (payload) => {
      clearTimeout(timer);
      state.tools = parse(payload);
      try { previousOnTools && previousOnTools(payload); } catch (error) {}
      resolve(state.tools);
    };
    handler.MCPTools = "1";
  });
  state.status = () => ({ handler: true, hasTools: Boolean(state.tools), busy: Boolean(state.pending) });
  window.__tonicFl = state;
  return true;
})()
`;

export class FlCdp {
  private socket: WebSocket | null = null;
  private nextId = 0;
  private pending = new Map<
    number,
    { resolve: (value: CdpResponse) => void; reject: (error: Error) => void }
  >();
  private target: FlTarget | null = null;

  constructor(private readonly debugPort = 9222) {}

  get debugUrl(): string {
    return `http://127.0.0.1:${this.debugPort}`;
  }

  get connected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  get targetInfo(): FlTarget | null {
    return this.target;
  }

  async findTarget(): Promise<FlTarget | null> {
    try {
      const response = await fetch(`${this.debugUrl}/json`);
      if (!response.ok) return null;
      const targets = (await response.json()) as FlTarget[];
      const pages = targets.filter((target) => target.type === "page");
      return (
        pages.find((target) => /gopher/i.test(`${target.title} ${target.url}`)) ??
        pages.find((target) => target.url.includes("127.0.0.1:5127")) ??
        null
      );
    } catch {
      return null;
    }
  }

  async waitForTarget(timeoutMs = 120_000): Promise<FlTarget | null> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const target = await this.findTarget();
      if (target) return target;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    return null;
  }

  async connect(): Promise<boolean> {
    const target = await this.findTarget();
    if (!target) return false;
    if (this.socket && this.target?.id === target.id) {
      await this.ensureBridge();
      return this.connected;
    }
    this.close();
    this.target = target;
    await new Promise<void>((resolve, reject) => {
      const socket = new WebSocket(target.webSocketDebuggerUrl);
      this.socket = socket;
      socket.addEventListener("open", () => resolve(), { once: true });
      socket.addEventListener("error", () => reject(new Error("CDP WebSocket failed")), {
        once: true,
      });
      socket.addEventListener("message", (event) => this.handleMessage(event.data));
      socket.addEventListener("close", () => {
        this.socket = null;
        for (const pending of this.pending.values()) {
          pending.reject(new Error("CDP connection closed"));
        }
        this.pending.clear();
      });
    });
    await this.send("Runtime.enable");
    await this.send("Page.enable");
    const ok = await this.ensureBridge();
    if (!ok) throw new Error("Gopher panel found, but script_handler is not available. Open FL's Gopher panel (Alt+F1) first.");
    return true;
  }

  private handleMessage(data: unknown): void {
    let message: CdpResponse;
    try {
      message = JSON.parse(String(data)) as CdpResponse;
    } catch {
      return;
    }
    if (!message.id) return;
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    if (message.error) pending.reject(new Error(message.error.message));
    else pending.resolve(message);
  }

  private send(method: string, params: Record<string, unknown> = {}): Promise<CdpResponse> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("CDP is not connected"));
    }
    return new Promise((resolve, reject) => {
      const id = ++this.nextId;
      this.pending.set(id, { resolve, reject });
      this.socket!.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate<T>(expression: string): Promise<T> {
    const response = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
      userGesture: false,
    });
    const details = response.result?.exceptionDetails;
    if (details) {
      throw new Error(details.exception?.description ?? details.text ?? "Runtime.evaluate failed");
    }
    return response.result?.result?.value as T;
  }

  async ensureBridge(): Promise<boolean> {
    if (!this.connected) return false;
    try {
      return Boolean(await this.evaluate<boolean>(BRIDGE_JS));
    } catch {
      return false;
    }
  }

  private async resetBridge(): Promise<void> {
    try {
      await this.evaluate("delete window.__tonicFl; true");
    } catch {
      // Reloading the page can invalidate the execution context; reconnect on next call.
    }
  }

  private isContextLost(error: unknown): boolean {
    return /__tonicFl|not a function|Cannot read|Execution context|undefined/i.test(String(error));
  }

  async listTools(): Promise<unknown> {
    if (!this.connected && !(await this.connect())) throw new Error("FL Studio is not connected");
    await this.ensureBridge();
    try {
      return await this.evaluate("window.__tonicFl.listTools()");
    } catch (error) {
      if (!this.isContextLost(error)) throw error;
      await this.resetBridge();
      await this.ensureBridge();
      return this.evaluate("window.__tonicFl.listTools()");
    }
  }

  async callTool(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    if (!this.connected && !(await this.connect())) throw new Error("FL Studio is not connected");
    await this.ensureBridge();
    const expression = `window.__tonicFl.call(${JSON.stringify(name)}, ${JSON.stringify(args)})`;
    try {
      return await this.evaluate(expression);
    } catch (error) {
      // 只在页面上下文丢失时重试；超时/FL 工具报错不重试，避免重复写音符。
      if (!this.isContextLost(error)) throw error;
      await this.resetBridge();
      await this.ensureBridge();
      return this.evaluate(expression);
    }
  }

  async navigate(url: string): Promise<void> {
    if (!this.connected && !(await this.connect())) throw new Error("FL Studio is not connected");
    await this.send("Page.navigate", { url });
    await new Promise((resolve) => setTimeout(resolve, 1800));
    await this.ensureBridge();
  }

  close(): void {
    this.socket?.close();
    this.socket = null;
    this.target = null;
  }
}
