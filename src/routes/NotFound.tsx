import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[900px] flex-col justify-center px-4 py-12 sm:px-8">
      <p className="mono-label text-muted">404 / NOT FOUND</p>
      <p className="display mt-3 text-[clamp(5rem,18vw,12rem)] leading-none text-ink">404</p>
      <h1 className="zh-display mt-2 text-3xl">这一页没有对应的音</h1>
      <p className="reading-column mt-3 text-sm leading-relaxed text-muted">
        路由不存在，或概念 slug 拼写有误。可以回到工作台，或用全局检索重新定位。
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          to="/"
          className="mono-label border border-ink px-3 py-2 hover:bg-ink hover:text-paper"
        >
          返回工作台
        </Link>
        <Link
          to="/library"
          className="mono-label border border-ink/40 px-3 py-2 text-muted transition-colors hover:bg-ink hover:text-paper"
        >
          打开知识库
        </Link>
      </div>
    </div>
  );
}
