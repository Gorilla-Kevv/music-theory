import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowDown, ArrowUp, BookMarked, BookOpen, CornerDownLeft, Network, Repeat2, Search, TerminalSquare, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { searchConcepts } from "../lib/search";
import { CategoryTag } from "./ui";

interface SearchContextValue {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

const QUICK_LINKS = [
  { to: "/library", label: "知识库", body: "按分类、级别与标签浏览知识库。", icon: BookMarked },
  { to: "/books", label: "书库", body: "三本书的完整章目与原创和声笔记。", icon: BookOpen },
  { to: "/atlas", label: "体系图谱", body: "按来源、系统枢纽与概念层浏览关系。", icon: Network },
  { to: "/drill", label: "复习与听辨", body: "到期复习卡、间隔重复与听辨训练。", icon: Repeat2 },
  { to: "/references", label: "参考文献", body: "三本著作的书目、版次与章节定位。", icon: BookMarked },
  { to: "/agent", label: "Agent 接口", body: "本地知识包、CLI、TS API 与 MCP 工具形状。", icon: TerminalSquare },
];

const SUGGESTIONS = ["五度圈", "ii-V-I", "三全音替代", "声部进行", "终止式", "调式"];

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);
  return (
    <SearchContext.Provider value={{ open, openSearch, closeSearch }}>
      {children}
      <SearchDialog />
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within SearchProvider");
  return context;
}

function SearchDialog() {
  const { open, closeSearch } = useSearch();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const hits = useMemo(() => searchConcepts(query, { limit: 9 }), [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const go = useCallback(
    (slug: string) => {
      navigate(`/theory/${slug}`);
      closeSearch();
    },
    [navigate, closeSearch],
  );

  if (!open) return null;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(hits.length - 1, current + 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(0, current - 1));
      return;
    }
    if (event.key === "Enter" && hits[active]) {
      event.preventDefault();
      go(hits[active].concept.slug);
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/85 px-3 pt-[8vh] sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeSearch();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="全局检索"
        onKeyDown={handleKeyDown}
        className="rise-in flex max-h-[80vh] w-full max-w-2xl flex-col border border-ink bg-paper shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search size={18} className="shrink-0 text-cobalt-ink" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="检索概念、和弦、进行或英文术语…"
            aria-label="检索词"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted sm:text-lg"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="清除检索"
              className="text-muted hover:text-ink"
            >
              <X size={16} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={closeSearch}
            className="mono-label border border-ink/20 px-1.5 py-1 text-muted hover:border-ink hover:text-ink"
          >
            ESC
          </button>
        </div>

        <div className="dark-scroll min-h-0 flex-1 overflow-y-auto">
          {query.trim() === "" ? (
            <div className="p-4">
              <p className="mono-label text-muted">QUICK ROUTES / 快速前往</p>
              <div className="mt-2 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
                {QUICK_LINKS.map(({ to, label, body, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={closeSearch}
                    className="group bg-paper p-3 transition-colors hover:bg-paper-2"
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={14} className="text-cobalt-ink" aria-hidden />
                      <span className="text-sm font-semibold">{label}</span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">{body}</span>
                  </Link>
                ))}
              </div>
              <p className="mono-label mt-5 text-muted">TRY / 试试这些</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="border border-ink/45 px-2 py-1 text-xs hover:border-cobalt hover:text-cobalt-ink"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : hits.length > 0 ? (
            <ul className="p-2" role="listbox" aria-label="检索结果">
              {hits.map((hit, index) => {
                const isActive = index === active;
                return (
                  <li key={hit.concept.slug} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => go(hit.concept.slug)}
                      onMouseEnter={() => setActive(index)}
                      className={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors ${
                        isActive ? "bg-ink text-paper" : "hover:bg-paper-2"
                      }`}
                    >
                      <span
                        className={`mono-label mt-0.5 shrink-0 ${
                          isActive ? "text-acid" : "text-muted"
                        }`}
                      >
                        {hit.concept.number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span className="text-sm font-semibold">{hit.concept.title}</span>
                          <span
                            className={`mono-label text-[0.6rem] ${
                              isActive ? "text-paper/60" : "text-muted"
                            }`}
                          >
                            {hit.concept.titleEn}
                          </span>
                        </span>
                        <span
                          className={`mt-1 block truncate text-xs ${
                            isActive ? "text-paper/70" : "text-muted"
                          }`}
                        >
                          {hit.concept.summary}
                        </span>
                      </span>
                      {isActive ? (
                        <CornerDownLeft size={14} className="mt-1 shrink-0 text-acid" aria-hidden />
                      ) : (
                        <CategoryTag category={hit.concept.category} className="mt-0.5 shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="mono-label text-muted">NO MATCH / 0</p>
              <p className="mt-2 text-sm font-semibold">没有找到“{query}”</p>
              <p className="mx-auto mt-1 max-w-[42ch] text-xs leading-relaxed text-muted">
                试试更短的中文词、英文术语或和弦记号。检索会同时匹配标题、别名、标签与正文。
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="border border-ink/45 px-2 py-1 text-xs hover:border-cobalt hover:text-cobalt-ink"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2">
          <span className="mono-label flex items-center gap-3 text-muted">
            <span className="inline-flex items-center gap-1">
              <ArrowUp size={11} aria-hidden />
              <ArrowDown size={11} aria-hidden />
              选择
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft size={11} aria-hidden />
              打开
            </span>
          </span>
          <span className="mono-label text-muted">
            {query.trim() ? `${hits.length} RESULTS` : `${SUGGESTIONS.length} SUGGESTIONS`}
          </span>
        </div>
      </div>
    </div>
  );
}
