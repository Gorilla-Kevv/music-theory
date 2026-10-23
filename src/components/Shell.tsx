import { useEffect, useRef, useState } from "react";
import {
  BookMarked,
  House,
  LibraryBig,
  Menu,
  Repeat2,
  Search,
  TerminalSquare,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { CATEGORIES, CONCEPTS } from "../content";
import { useReview } from "../context/ReviewContext";
import { useSearch } from "./SearchDialog";
import { TransportDock } from "./TransportDock";
import { CATEGORY_STYLES } from "./category";

const NAV_ITEMS = [
  { to: "/", label: "工作台", en: "DESK", icon: House, end: true },
  { to: "/library", label: "知识库", en: "LIBRARY", icon: LibraryBig },
  { to: "/drill", label: "复习与听辨", en: "DRILL", icon: Repeat2 },
  { to: "/references", label: "参考文献", en: "SOURCES", icon: BookMarked },
  { to: "/agent", label: "Agent 接口", en: "AGENT", icon: TerminalSquare },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Rail() {
  const { openSearch } = useSearch();
  const { stats } = useReview();

  return (
    <aside className="fixed bottom-[72px] left-0 top-0 z-30 hidden w-[248px] flex-col border-r border-line-dark bg-ink text-paper lg:flex">
      <div className="border-b border-line-dark px-5 py-6">
        <Link to="/" className="block">
          <span className="mono-label text-paper/65">PERSONAL THEORY DESK</span>
          <span className="display mt-2 block text-[2.75rem] text-paper">Tonic</span>
          <span className="mt-0.5 block text-sm font-semibold text-acid">主音</span>
        </Link>
      </div>

      <div className="px-4 py-5">
        <button
          type="button"
          onClick={openSearch}
          className="group flex w-full items-center gap-2 border border-paper/40 px-3 py-2.5 text-left transition-colors hover:border-acid"
        >
          <Search size={15} className="text-paper/65 group-hover:text-acid" aria-hidden />
          <span className="flex-1 text-sm text-paper/65 group-hover:text-paper">检索概念…</span>
          <span className="mono-label border border-paper/35 px-1.5 py-0.5 text-paper/65">
            ⌘K
          </span>
        </button>
      </div>

      <nav aria-label="主导航" className="px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, en, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 transition-colors ${
                    isActive
                      ? "bg-cobalt text-paper"
                      : "text-paper/65 hover:bg-paper/5 hover:text-paper"
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.9} aria-hidden />
                <span className="flex-1 text-sm font-medium">{label}</span>
                <span className="mono-label text-[0.58rem]">{en}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-7 px-4">
        <p className="mono-label text-paper/65">CATALOG / 分类</p>
        <ul className="mt-2 space-y-0.5">
          {CATEGORIES.map((category) => {
            const count = CONCEPTS.filter((concept) => concept.category === category.id).length;
            return (
              <li key={category.id}>
                <Link
                  to={`/library?category=${category.id}`}
                  className="flex items-center gap-2.5 px-1 py-1.5 text-paper/60 transition-colors hover:text-paper"
                >
                  <span className={`h-2 w-2 ${CATEGORY_STYLES[category.id].dot}`} aria-hidden />
                  <span className="flex-1 text-xs">{category.name}</span>
                  <span className="mono-label text-[0.6rem] text-paper/65">{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto border-t border-line-dark px-4 py-5">
        <Link
          to="/drill"
          className="flex items-center justify-between border border-paper/40 px-3 py-2.5 transition-colors hover:border-acid"
        >
          <span>
            <span className="mono-label block text-paper/65">REVIEW QUEUE</span>
            <span className="mt-1 block text-sm">待复习 {stats.due}</span>
          </span>
          <span className="display text-3xl text-acid">{stats.due}</span>
        </Link>
        <p className="mono-label mt-3 text-paper/65">LOCAL-FIRST · NO CLOUD</p>
      </div>
    </aside>
  );
}

function MobileHeader({ onMenu }: { onMenu: () => void }) {
  const { openSearch } = useSearch();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line-dark bg-ink px-4 text-paper lg:hidden">
      <Link to="/" className="flex items-baseline gap-2">
        <span className="display text-2xl">Tonic</span>
        <span className="text-xs font-semibold text-acid">主音</span>
      </Link>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={openSearch}
          aria-label="打开检索"
          className="inline-flex h-10 w-10 items-center justify-center text-paper/75 hover:text-acid"
        >
          <Search size={19} />
        </button>
        <button
          type="button"
          onClick={onMenu}
          aria-label="打开导航"
          className="inline-flex h-10 w-10 items-center justify-center text-paper/75 hover:text-acid"
        >
          <Menu size={21} />
        </button>
      </div>
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { stats } = useReview();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => closeRef.current?.focus(), 20);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "Tab" && panelRef.current) {
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="移动端导航"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 bg-ink text-paper lg:hidden"
    >
      <div className="flex h-14 items-center justify-between border-b border-line-dark px-4">
        <span className="display text-2xl">Tonic</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="关闭导航"
          className="inline-flex h-10 w-10 items-center justify-center text-paper/75 hover:text-acid"
        >
          <X size={22} />
        </button>
      </div>
      <nav aria-label="移动端主导航" className="p-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, en, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 ${
                    isActive ? "bg-cobalt text-paper" : "text-paper/70 hover:bg-paper/5"
                  }`
                }
              >
                <Icon size={17} aria-hidden />
                <span className="flex-1 text-sm">{label}</span>
                <span className="mono-label text-[0.6rem]">{en}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <p className="mono-label mt-6 px-3 text-paper/65">CATALOG / 分类</p>
        <ul className="mt-2 space-y-0.5">
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                to={`/library?category=${category.id}`}
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 text-paper/60"
              >
                <span className={`h-2 w-2 ${CATEGORY_STYLES[category.id].dot}`} aria-hidden />
                <span className="text-xs">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 border border-paper/40 px-3 py-3">
          <p className="mono-label text-paper/65">REVIEW QUEUE</p>
          <p className="mt-1 text-sm">待复习 {stats.due}</p>
        </div>
      </nav>
    </div>
  );
}

export function Shell() {
  const { openSearch } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
        return;
      }
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <ScrollToTop />
      <Rail />
      <MobileHeader onMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="min-h-screen min-w-0 pb-28 lg:pl-[248px]">
        <Outlet />
      </main>
      <TransportDock />
    </div>
  );
}
