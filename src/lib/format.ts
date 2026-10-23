export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `${Math.round(value * 100)}%`;
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
}

export function formatRelativeDays(timestamp: number): string {
  const delta = timestamp - Date.now();
  const days = Math.round(delta / 86_400_000);
  if (days <= 0) return "今天到期";
  if (days === 1) return "明天到期";
  return `${days} 天后到期`;
}

export function cycleTempo(tempo: number, delta: number): number {
  return Math.min(220, Math.max(40, tempo + delta));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
