import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ArrowUpRight,
  BookOpen,
  Maximize2,
  Minimize2,
  Network,
  Route,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BIBLIOGRAPHY_BY_ID,
  CATEGORIES,
  CONCEPT_BY_SLUG,
  HARMONY_DIMENSIONS,
  getChaptersForConcept,
} from "../content";
import {
  ATLAS_GRAPH,
  ATLAS_HEIGHT,
  ATLAS_HUBS,
  ATLAS_STATS,
  ATLAS_WIDTH,
  getAtlasNode,
  getConceptHubs,
  getNextChain,
  getNextConcepts,
  getPathDepths,
  getPrerequisiteChain,
  getPrerequisites,
  type AtlasNode,
} from "../content/graph";
import type { CategoryId, HarmonyDimension, SourceId } from "../content/types";

const SOURCE_LABEL: Record<SourceId, string> = {
  levine: "Levine",
  laitz: "Laitz",
  sposobin: "Sposobin",
  soundquest: "SoundQuest",
};

const BOOK_DOT: Record<SourceId, string> = {
  levine: "bg-cadmium",
  laitz: "bg-cobalt",
  sposobin: "bg-acid",
  soundquest: "bg-ink",
};

interface ViewState {
  scale: number;
  x: number;
  y: number;
}

interface LayoutBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function viewportInViewBox(rect: { width: number; height: number }) {
  const factor = Math.max(rect.width / ATLAS_WIDTH, rect.height / ATLAS_HEIGHT);
  const renderedWidth = ATLAS_WIDTH * factor;
  const offsetX = (rect.width - renderedWidth) / 2;
  return {
    factor,
    x0: -offsetX / factor,
    y0: 0,
    x1: (-offsetX + rect.width) / factor,
    y1: rect.height / factor,
  };
}

function clientToViewBox(clientX: number, clientY: number, rect: DOMRect) {
  const { factor } = viewportInViewBox(rect);
  const renderedWidth = ATLAS_WIDTH * factor;
  const offsetX = (rect.width - renderedWidth) / 2;
  return {
    x: (clientX - rect.left - offsetX) / factor,
    y: (clientY - rect.top) / factor,
  };
}

const CATEGORY_FILL: Record<CategoryId, string> = {
  foundations: "var(--color-cobalt)",
  harmony: "var(--color-cadmium)",
  jazz: "var(--color-acid)",
};

const CATEGORY_TEXT: Record<CategoryId, string> = {
  foundations: "var(--color-paper)",
  harmony: "var(--color-ink)",
  jazz: "var(--color-ink)",
};

function nodeFill(node: AtlasNode): string {
  if (node.kind === "source" || node.kind === "hub") return "var(--color-ink)";
  return node.category ? CATEGORY_FILL[node.category] : "var(--color-paper-2)";
}

function nodeText(node: AtlasNode): string {
  if (node.kind === "source" || node.kind === "hub") return "var(--color-paper)";
  return node.category ? CATEGORY_TEXT[node.category] : "var(--color-ink)";
}

function edgePath(source: { x: number; y: number }, target: { x: number; y: number }): string {
  const dx = target.x - source.x;
  const bend = Math.max(42, Math.abs(dx) * 0.42);
  return `M ${source.x} ${source.y} C ${source.x + bend} ${source.y}, ${target.x - bend} ${target.y}, ${target.x} ${target.y}`;
}

function truncate(label: string, max = 8): string {
  return label.length > max ? `${label.slice(0, max)}…` : label;
}

export function Atlas() {
  const [params, setParams] = useSearchParams();
  const focus = params.get("focus");
  const [selectedId, setSelectedId] = useState<string | null>(focus ? `concept-${focus}` : null);
  useEffect(() => {
    if (focus) setSelectedId(`concept-${focus}`);
  }, [focus]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [dimension, setDimension] = useState<HarmonyDimension | "all">("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewState>({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const pathMode = params.get("mode") === "path";
  const setPathMode = (enabled: boolean) => {
    const next = new URLSearchParams(params);
    if (enabled) next.set("mode", "path");
    else next.delete("mode");
    setParams(next, { replace: true });
  };

  const selected = selectedId ? getAtlasNode(selectedId) : undefined;
  const activeId = hoveredId ?? selectedId;
  const selectedConcept = selected?.slug ? CONCEPT_BY_SLUG[selected.slug] : undefined;
  const selectedHubs = selected?.slug ? getConceptHubs(selected.slug) : [];
  const prerequisites = selected?.slug ? getPrerequisites(selected.slug) : [];
  const nextConcepts = selected?.slug ? getNextConcepts(selected.slug) : [];
  const prerequisiteChain = useMemo(
    () => (selected?.slug ? getPrerequisiteChain(selected.slug) : []),
    [selected?.slug],
  );
  const nextChain = useMemo(
    () => (selected?.slug ? getNextChain(selected.slug) : []),
    [selected?.slug],
  );
  const selectedBookChapters = useMemo(
    () => (selected?.slug ? getChaptersForConcept(selected.slug) : []),
    [selected?.slug],
  );
  const chapterCountByBook = useMemo(() => {
    const counts = new Map<SourceId, number>();
    for (const chapter of selectedBookChapters) {
      counts.set(chapter.book, (counts.get(chapter.book) ?? 0) + 1);
    }
    return counts;
  }, [selectedBookChapters]);
  const supportSourceIds = useMemo(
    () => new Set(chapterCountByBook.keys()),
    [chapterCountByBook],
  );
  const chapterGroups = useMemo(() => {
    const groups = new Map<SourceId, typeof selectedBookChapters>();
    for (const chapter of selectedBookChapters) {
      const list = groups.get(chapter.book) ?? [];
      list.push(chapter);
      groups.set(chapter.book, list);
    }
    return [...groups.entries()];
  }, [selectedBookChapters]);

  const pathNodeIds = useMemo(() => {
    if (!selected?.slug) return new Set<string>();
    return new Set<string>([
      selected.id,
      ...prerequisiteChain.map((concept) => `concept-${concept.slug}`),
      ...nextChain.map((concept) => `concept-${concept.slug}`),
    ]);
  }, [selected?.id, selected?.slug, prerequisiteChain, nextChain]);

  const pathDepths = useMemo(
    () => (selected?.slug ? getPathDepths(selected.slug) : new Map<string, number>()),
    [selected?.slug],
  );
  const pathLayoutActive = pathMode && Boolean(selectedConcept);
  const pathLayout = useMemo(() => {
    if (!pathLayoutActive || !selectedConcept) return null;
    const byDepth = new Map<number, string[]>();
    const addDepth = (depth: number, slug: string) => {
      const list = byDepth.get(depth) ?? [];
      if (!list.includes(slug)) list.push(slug);
      byDepth.set(depth, list);
    };
    for (const [slug, depth] of pathDepths) addDepth(depth, slug);
    addDepth(0, selectedConcept.slug);
    const depthValues = [...byDepth.keys()];
    const maxDepth = Math.max(0, ...depthValues);
    const minDepth = Math.min(0, ...depthValues);
    const levelCount = maxDepth - minDepth + 1;
    const columnGap = Math.min(160, (ATLAS_WIDTH - 280) / Math.max(1, levelCount - 1));
    const positions = new Map<string, { x: number; y: number }>();
    for (let depth = maxDepth; depth >= minDepth; depth -= 1) {
      const levelIndex = maxDepth - depth;
      const concepts = (byDepth.get(depth) ?? [])
        .map((slug) => CONCEPT_BY_SLUG[slug])
        .filter((concept): concept is NonNullable<typeof concept> => Boolean(concept))
        .sort((a, b) => a.number.localeCompare(b.number));
      if (depth === 0 && !concepts.some((concept) => concept.slug === selectedConcept.slug)) {
        concepts.unshift(selectedConcept);
      }
      concepts.forEach((concept, row) => {
        positions.set(`concept-${concept.slug}`, {
          x: 150 + levelIndex * columnGap,
          y: 90 + row * 88,
        });
      });
    }
    [...supportSourceIds].forEach((sourceId, index) => {
      positions.set(`source-${sourceId}`, { x: 62, y: 130 + index * 112 });
    });
    const points = [...positions.values()];
    if (points.length === 0) return null;
    const bounds: LayoutBounds = {
      minX: Math.min(...points.map((point) => point.x)) - 70,
      maxX: Math.max(...points.map((point) => point.x)) + 70,
      minY: Math.min(...points.map((point) => point.y)) - 50,
      maxY: Math.max(...points.map((point) => point.y)) + 60,
    };
    return { positions, bounds };
  }, [pathLayoutActive, selectedConcept, pathDepths, supportSourceIds]);

  const positionOf = (node: AtlasNode) =>
    pathLayout?.positions.get(node.id) ?? { x: node.x, y: node.y };

  const visibleNodes = useMemo(() => {
    if (pathMode) {
      if (!selectedConcept) {
        return ATLAS_GRAPH.nodes.filter((node) => node.kind !== "hub");
      }
      return ATLAS_GRAPH.nodes.filter((node) => {
        if (node.kind === "concept") return pathNodeIds.has(node.id);
        if (node.kind === "source" && node.sourceId) return supportSourceIds.has(node.sourceId);
        return false;
      });
    }
    return ATLAS_GRAPH.nodes.filter((node) => {
      if (node.kind !== "concept") return true;
      if (category !== "all" && node.category !== category) return false;
      if (dimension !== "all" && !node.dimensions?.includes(dimension)) return false;
      return true;
    });
  }, [category, dimension, pathMode, selectedConcept, pathNodeIds, supportSourceIds]);

  const hasVisibleSources = useMemo(
    () => visibleNodes.some((node) => node.kind === "source"),
    [visibleNodes],
  );
  const visibleIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleEdges = useMemo(
    () =>
      ATLAS_GRAPH.edges.filter((edge) => {
        if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) return false;
        if (pathMode && edge.type !== "prerequisite") return false;
        return true;
      }),
    [pathMode, visibleIds],
  );

  const pathActive = pathMode && Boolean(selectedConcept) && !hoveredId;
  const activeNeighbors = useMemo(() => {
    if (!activeId) return new Set<string>();
    const ids = new Set<string>([activeId]);
    for (const edge of visibleEdges) {
      if (edge.source === activeId) ids.add(edge.target);
      if (edge.target === activeId) ids.add(edge.source);
    }
    for (const sourceId of supportSourceIds) ids.add(`source-${sourceId}`);
    return ids;
  }, [activeId, visibleEdges, supportSourceIds]);

  const selectNode = (node: AtlasNode) => {
    setSelectedId(node.id);
    const next = new URLSearchParams(params);
    if (node.kind === "concept" && node.slug) next.set("focus", node.slug);
    else next.delete("focus");
    setParams(next, { replace: true });
  };
  const clearSelection = () => {
    setSelectedId(null);
    const next = new URLSearchParams(params);
    next.delete("focus");
    setParams(next, { replace: true });
  };

  const zoomAt = (clientX: number, clientY: number, factor: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const point = clientToViewBox(clientX, clientY, rect);
    setView((current) => {
      const scale = clamp(current.scale * factor, 0.4, 3.2);
      const actual = scale / current.scale;
      return {
        scale,
        x: point.x - actual * (point.x - current.x),
        y: point.y - actual * (point.y - current.y),
      };
    });
  };
  const zoomByCenter = (factor: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
  };
  const fitTo = (bounds?: LayoutBounds) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const viewport = viewportInViewBox(rect);
    const target = bounds ?? {
      minX: 0,
      maxX: ATLAS_WIDTH,
      minY: 0,
      maxY: ATLAS_HEIGHT,
    };
    const width = Math.max(1, target.maxX - target.minX);
    const height = Math.max(1, target.maxY - target.minY);
    const viewWidth = viewport.x1 - viewport.x0;
    const viewHeight = viewport.y1 - viewport.y0;
    const scale = clamp(Math.min(viewWidth / width, viewHeight / height) * 0.92, 0.4, 3.2);
    const centerX = (target.minX + target.maxX) / 2;
    const centerY = (target.minY + target.maxY) / 2;
    setView({
      scale,
      x: (viewport.x0 + viewport.x1) / 2 - centerX * scale,
      y: (viewport.y0 + viewport.y1) / 2 - centerY * scale,
    });
  };
  const fitView = () => fitTo(pathLayout?.bounds);
  const resetView = () => setView({ scale: 1, x: 0, y: 0 });
  const zoomIn = () => zoomByCenter(1.2);
  const zoomOut = () => zoomByCenter(1 / 1.2);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void containerRef.current?.requestFullscreen();
  };

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomAt(event.clientX, event.clientY, Math.exp(-event.deltaY * 0.0015));
    };
    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathLayoutActive && pathLayout) fitTo(pathLayout.bounds);
    else resetView();
    // 仅在目标概念或模式切换时重新取景，不覆盖手动缩放拖拽。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathLayoutActive, pathMode, selected?.slug]);

  useEffect(() => {
    if (!pathLayoutActive || !pathLayout) return;
    const handleResize = () => fitTo(pathLayout.bounds);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathLayoutActive, pathLayout]);

  useEffect(() => {
    const handle = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handle);
    return () => document.removeEventListener("fullscreenchange", handle);
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    if (!drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    setDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { factor } = viewportInViewBox(rect);
    setView((current) => ({
      ...current,
      x: current.x + dx / factor,
      y: current.y + dy / factor,
    }));
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  const hubConcepts = selected?.kind === "hub"
    ? ATLAS_GRAPH.nodes.filter(
        (node) =>
          node.kind === "concept" &&
          visibleIds.has(node.id) &&
          ATLAS_GRAPH.edges.some(
            (edge) => edge.source === selected.id && edge.target === node.id && edge.type === "system",
          ),
      )
    : [];

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 sm:px-8 sm:pt-8 xl:px-12">
      <div className="border-b border-line pb-5">
        <p className="mono-label text-muted">ATLAS / 体系图谱</p>
        <h1 className="zh-display mt-2 text-4xl sm:text-5xl">不是目录，是一张可走的地图</h1>
        <p className="reading-column mt-3 max-w-[68ch] text-sm leading-relaxed text-muted">
          书库给出章目，概念页给出条目；体系图给出它们之间的关系。节点按“教材来源 → 系统枢纽 → 概念层”分层排列，边表示包含、关联与前置。点击节点查看它在体系中的位置。
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <span className="mono-label text-muted">{ATLAS_STATS.concepts} CONCEPTS</span>
          <span className="mono-label text-muted">{ATLAS_STATS.hubs} SYSTEM HUBS</span>
          <span className="mono-label text-muted">{ATLAS_STATS.relations} RELATIONS</span>
          <span className="mono-label text-muted">{ATLAS_STATS.prerequisites} PREREQUISITES</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mono-label mr-1 text-muted">VIEW</span>
        <button
          type="button"
          onClick={() => setPathMode(false)}
          className={`mono-label border px-2.5 py-1.5 ${
            !pathMode ? "border-ink bg-ink text-paper" : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
          }`}
        >
          关系图
        </button>
        <button
          type="button"
          onClick={() => setPathMode(true)}
          className={`mono-label inline-flex items-center gap-1.5 border px-2.5 py-1.5 ${
            pathMode ? "border-ink bg-ink text-paper" : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
          }`}
        >
          <Route size={12} aria-hidden />
          学习路径
        </button>
        {pathMode ? <span className="mono-label text-cadmium-ink">仅前置边 · 完整先修/后续</span> : null}
      </div>

      {pathMode ? (
        <div className="mt-3 border border-cadmium/40 bg-cadmium/10 px-3 py-2">
          <p className="text-xs leading-relaxed text-cadmium-ink">
            学习路径模式：图中只显示前置边。选择任一概念，上方列出完整先修与后续路径，详情面板列出支撑章节。
          </p>
        </div>
      ) : (
        <>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="mono-label mr-1 text-muted">CATEGORY</span>
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`mono-label border px-2.5 py-1.5 ${
                category === "all" ? "border-ink bg-ink text-paper" : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
              }`}
            >
              全部
            </button>
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`mono-label border px-2.5 py-1.5 ${
                  category === item.id
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
                }`}
              >
                <span className={`mr-1.5 inline-block h-1.5 w-1.5 ${item.id === "foundations" ? "bg-cobalt" : item.id === "harmony" ? "bg-cadmium" : "bg-acid"}`} aria-hidden />
                {item.name}
              </button>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="mono-label mr-1 text-muted">DIMENSION</span>
            <button
              type="button"
              onClick={() => setDimension("all")}
              className={`mono-label border px-2.5 py-1.5 ${
                dimension === "all" ? "border-ink bg-ink text-paper" : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
              }`}
            >
              全部
            </button>
            {HARMONY_DIMENSIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDimension(item.id)}
                title={item.description}
                className={`mono-label border px-2.5 py-1.5 ${
                  dimension === item.id
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}

      {pathMode && selectedConcept ? (
        <section className="mt-4 border border-line bg-paper">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
            <span className="mono-label text-muted">PATH / 学习路径</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="mono-label border border-ink/40 px-2.5 py-1.5 text-muted hover:bg-ink hover:text-paper"
              >
                清除选择
              </button>
              <Link
                to={`/theory/${selectedConcept.slug}`}
                className="mono-label inline-flex items-center gap-1.5 border border-ink/40 px-2.5 py-1.5 hover:bg-ink hover:text-paper"
              >
                {selectedConcept.number} {selectedConcept.title}
                <ArrowUpRight size={12} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="grid gap-4 px-3 py-3 lg:grid-cols-2">
            <div>
              <p className="mono-label text-muted">先修 · {prerequisiteChain.length}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {prerequisiteChain.length ? (
                  prerequisiteChain.map((concept) => (
                    <Link
                      key={concept.slug}
                      to={`/theory/${concept.slug}`}
                      className="border border-ink/40 px-2 py-1 text-xs transition-colors hover:bg-ink hover:text-paper"
                    >
                      {concept.number} {concept.title}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-muted">无（可作为学习起点）</span>
                )}
              </div>
              {prerequisiteChain.length ? (
                <p className="mt-2 text-[11px] leading-relaxed text-muted">
                  按先修深度由远到近排列；同一层内按编号，多条路径已合并。
                </p>
              ) : null}
            </div>
            <div>
              <p className="mono-label text-muted">后续 · {nextChain.length}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {nextChain.length ? (
                  nextChain.map((concept) => (
                    <Link
                      key={concept.slug}
                      to={`/theory/${concept.slug}`}
                      className="border border-ink/40 px-2 py-1 text-xs transition-colors hover:bg-ink hover:text-paper"
                    >
                      {concept.number} {concept.title}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-muted">无（当前为路径末端）</span>
                )}
              </div>
              {nextChain.length ? (
                <p className="mt-2 text-[11px] leading-relaxed text-muted">
                  按后续深度由近到远排列；同一层内按编号。
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mono-label mr-1 text-muted">支撑章节 · {selectedBookChapters.length}</span>
              {[...chapterCountByBook.entries()].map(([book, count]) => (
                <span key={book} className="mono-label bg-ink/5 px-2 py-1 text-muted">
                  {SOURCE_LABEL[book] ?? book} {count} 章
                </span>
              ))}
              {!selectedBookChapters.length ? <span className="text-xs text-muted">暂无章节映射</span> : null}
            </div>
            {selectedBookChapters.length ? (
              <a
                href="#atlas-sources"
                className="mono-label inline-flex items-center gap-1.5 border border-ink/40 px-2.5 py-1.5 hover:bg-ink hover:text-paper"
              >
                查看章节 <ArrowUpRight size={12} aria-hidden />
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="mt-5 space-y-5">
        <div className="min-w-0 border border-line bg-paper">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
            <span className="mono-label text-muted">{pathMode ? "LEARNING PATH / 学习路径" : "MLP GRAPH / 分层关系网"}</span>
            <span className="mono-label hidden text-muted sm:inline">
              {pathMode ? "滚轮缩放 · 拖拽平移 · 点击节点" : "滚轮缩放 · 左键拖拽 · 点击节点"}
            </span>
          </div>
          <div
            id="atlas-graph"
            ref={containerRef}
            className={`relative overflow-hidden bg-paper ${isFullscreen ? "h-screen" : "h-[68vh] min-h-[420px]"}`}
            style={{ cursor: dragging ? "grabbing" : "grab" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1 border border-line bg-paper p-1">
              <button
                type="button"
                onClick={zoomOut}
                aria-label="缩小"
                className="inline-flex h-7 w-7 items-center justify-center text-muted hover:bg-ink hover:text-paper"
              >
                <ZoomOut size={13} aria-hidden />
              </button>
              <button
                type="button"
                onClick={zoomIn}
                aria-label="放大"
                className="inline-flex h-7 w-7 items-center justify-center text-muted hover:bg-ink hover:text-paper"
              >
                <ZoomIn size={13} aria-hidden />
              </button>
              <button
                type="button"
                onClick={fitView}
                className="mono-label h-7 px-2 text-muted hover:bg-ink hover:text-paper"
              >
                适应
              </button>
              <button
                type="button"
                onClick={resetView}
                className="mono-label h-7 px-2 text-muted hover:bg-ink hover:text-paper"
              >
                重置
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "退出全屏" : "全屏查看"}
                className="inline-flex h-7 w-7 items-center justify-center text-muted hover:bg-ink hover:text-paper"
              >
                {isFullscreen ? <Minimize2 size={13} aria-hidden /> : <Maximize2 size={13} aria-hidden />}
              </button>
            </div>
            <svg
              viewBox={`0 0 ${ATLAS_WIDTH} ${ATLAS_HEIGHT}`}
              preserveAspectRatio="xMidYMin slice"
              className="h-full w-full select-none"
              role="img"
              aria-label="TONIC 乐理体系关系图"
            >
              <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
              {!pathLayoutActive ? (
                <>
                  {hasVisibleSources ? (
                    <text x="80" y="24" textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.2">
                      SOURCES / 书
                    </text>
                  ) : null}
                  {!pathMode ? (
                    <text x="350" y="24" textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.2">
                      SYSTEM / 体系
                    </text>
                  ) : null}
                  <text x="830" y="24" textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.2">
                    CONCEPTS / 知识节点
                  </text>
                </>
              ) : null}

              {visibleEdges.map((edge) => {
                const source = getAtlasNode(edge.source);
                const target = getAtlasNode(edge.target);
                if (!source || !target) return null;
                const sourcePoint = positionOf(source);
                const targetPoint = positionOf(target);
                const connected = activeId
                  ? edge.source === activeId || edge.target === activeId
                  : false;
                const pathConnected =
                  pathNodeIds.has(edge.source) && pathNodeIds.has(edge.target);
                const highlighted = pathActive ? pathConnected : connected;
                const style =
                  edge.type === "source"
                    ? { stroke: "var(--color-ink)", opacity: 0.18, width: 1, dash: "0" }
                    : edge.type === "system"
                      ? { stroke: "var(--color-cobalt)", opacity: 0.22, width: 1.2, dash: "0" }
                      : edge.type === "prerequisite"
                        ? { stroke: "var(--color-cadmium-ink)", opacity: 0.4, width: 1.5, dash: "6 3" }
                        : { stroke: "var(--color-ink)", opacity: 0.12, width: 1, dash: "3 3" };
                const opacity = pathActive
                  ? highlighted
                    ? 0.95
                    : 0.04
                  : activeId
                    ? connected
                      ? 0.95
                      : 0.04
                    : style.opacity;
                return (
                  <path
                    key={edge.id}
                    d={edgePath(sourcePoint, targetPoint)}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={style.width}
                    strokeDasharray={style.dash}
                    opacity={opacity}
                    className="transition-opacity duration-150"
                  />
                );
              })}

              {visibleNodes.map((node) => {
                const isSelected = node.id === selectedId;
                const isHovered = node.id === hoveredId;
                const isActive = isSelected || isHovered;
                const inNeighborhood = activeNeighbors.has(node.id);
                const isSupportSource =
                  node.kind === "source" && node.sourceId
                    ? supportSourceIds.has(node.sourceId)
                    : false;
                const supportCount =
                  node.kind === "source" && node.sourceId
                    ? chapterCountByBook.get(node.sourceId) ?? 0
                    : 0;
                const highlighted = pathActive
                  ? pathNodeIds.has(node.id) || isSupportSource
                  : inNeighborhood;
                const dimmed = pathActive
                  ? !highlighted
                  : Boolean(activeId) && !inNeighborhood;
                const radius = node.kind === "concept" ? 18 : 27;
                const point = positionOf(node);
                return (
                  <g
                    key={node.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.label}${node.subtitle ? `，${node.subtitle}` : ""}`}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(node.id)}
                    onBlur={() => setHoveredId(null)}
                    onClick={() => {
                      if (suppressClickRef.current) return;
                      selectNode(node);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectNode(node);
                      }
                    }}
                    className="cursor-pointer"
                    opacity={dimmed ? (pathActive ? 0.12 : 0.16) : 1}
                  >
                    <title>
                      {node.label}
                      {node.subtitle ? ` / ${node.subtitle}` : ""}
                    </title>
                    {isSupportSource ? (
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={radius + 10}
                        fill="none"
                        stroke="var(--color-cadmium-ink)"
                        strokeWidth={1.5}
                        strokeDasharray="3 2"
                      />
                    ) : null}
                    {isActive ? (
                      <circle cx={point.x} cy={point.y} r={radius + 6} fill="none" stroke="var(--color-acid)" strokeWidth={2} />
                    ) : null}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={radius}
                      fill={nodeFill(node)}
                      stroke={isSelected ? "var(--color-ink)" : "var(--color-ink)"}
                      strokeWidth={isSelected ? 2.5 : 1}
                    />
                    {node.kind === "concept" ? (
                      <text
                        x={point.x}
                        y={point.y + 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={nodeText(node)}
                        fontSize="8"
                        fontWeight="700"
                      >
                        {node.subtitle}
                      </text>
                    ) : null}
                    <text
                      x={point.x}
                      y={point.y + radius + 13}
                      textAnchor="middle"
                      fill="var(--color-ink)"
                      fontSize={node.kind === "concept" ? "10.5" : "12.5"}
                      fontWeight={node.kind === "concept" ? "500" : "700"}
                    >
                      {node.kind === "concept" ? truncate(node.label) : node.label}
                    </text>
                    {node.kind !== "concept" && node.subtitle ? (
                      <text
                        x={point.x}
                        y={point.y + radius + 27}
                        textAnchor="middle"
                        fill="var(--color-muted)"
                        fontSize="8.5"
                      >
                        {node.subtitle}
                      </text>
                    ) : null}
                    {isSupportSource ? (
                      <text
                        x={point.x}
                        y={point.y + radius + 41}
                        textAnchor="middle"
                        fill="var(--color-cadmium-ink)"
                        fontSize="9"
                        fontWeight="700"
                      >
                        支撑 {supportCount} 章
                      </text>
                    ) : null}
                  </g>
                );
              })}

              {!pathLayoutActive ? (
                <g transform={`translate(80 ${ATLAS_HEIGHT - 36})`}>
                  {pathMode ? (
                    <>
                      <line x1="0" y1="0" x2="28" y2="0" stroke="var(--color-cadmium-ink)" strokeOpacity="0.6" strokeDasharray="6 3" />
                      <text x="36" y="4" fill="var(--color-muted)" fontSize="9">前置</text>
                      <text x="100" y="4" fill="var(--color-muted)" fontSize="9">书源环＝支撑章节</text>
                    </>
                  ) : (
                    <>
                      <line x1="0" y1="0" x2="28" y2="0" stroke="var(--color-ink)" strokeOpacity="0.25" strokeDasharray="3 3" />
                      <text x="36" y="4" fill="var(--color-muted)" fontSize="9">关联</text>
                      <line x1="100" y1="0" x2="128" y2="0" stroke="var(--color-cadmium-ink)" strokeOpacity="0.6" strokeDasharray="6 3" />
                      <text x="136" y="4" fill="var(--color-muted)" fontSize="9">前置</text>
                      <line x1="190" y1="0" x2="218" y2="0" stroke="var(--color-cobalt)" strokeOpacity="0.5" />
                      <text x="226" y="4" fill="var(--color-muted)" fontSize="9">体系</text>
                      <line x1="280" y1="0" x2="308" y2="0" stroke="var(--color-ink)" strokeOpacity="0.2" />
                      <text x="316" y="4" fill="var(--color-muted)" fontSize="9">来源</text>
                    </>
                  )}
                </g>
              ) : null}
              </g>
            </svg>
          </div>
        </div>

        <aside className="border border-line bg-paper-2 p-4">
          {selected ? (
            <>
              <p className="mono-label text-muted">
                {selected.kind === "concept" ? "CONCEPT NODE" : selected.kind === "hub" ? "SYSTEM HUB" : "SOURCE"}
              </p>
              <h2 className="zh-display mt-2 text-2xl">{selected.label}</h2>
              {selected.subtitle ? <p className="display mt-1 text-sm">{selected.subtitle}</p> : null}
              {selected.summary ? (
                <p className="reading-column mt-3 text-sm leading-relaxed text-muted">{selected.summary}</p>
              ) : null}

              {selectedConcept ? (
                <>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {selectedConcept.dimensions?.map((item) => {
                      const meta = HARMONY_DIMENSIONS.find((dimensionItem) => dimensionItem.id === item);
                      return (
                        <span key={item} className="mono-label bg-ink/5 px-2 py-1">
                          {meta?.label ?? item}
                        </span>
                      );
                    })}
                  </div>
                  {selectedHubs.length ? (
                    <p className="mono-label mt-3 text-muted">
                      系统：{selectedHubs.map((hub) => hub.label).join(" / ")}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to={`/theory/${selectedConcept.slug}`} className="mono-label inline-flex items-center gap-1.5 border border-ink px-3 py-2 hover:bg-ink hover:text-paper">
                      打开概念 <ArrowUpRight size={12} aria-hidden />
                    </Link>
                  </div>
                  <div id="atlas-sources" className="mt-5 scroll-mt-24 border-t border-line pt-3">
                    <p className="mono-label text-muted">
                      SOURCES / 跨书章节 · {selectedBookChapters.length}
                    </p>
                    {selectedBookChapters.length ? (
                      <div className="mt-2 max-h-64 space-y-3 overflow-y-auto pr-1">
                        {chapterGroups.map(([book, chapters]) => (
                          <div key={book}>
                            <p className="mono-label flex items-center gap-1.5 text-muted">
                              <span className={`inline-block h-1.5 w-1.5 ${BOOK_DOT[book]}`} aria-hidden />
                              {SOURCE_LABEL[book]} · {chapters.length} 章
                            </p>
                            <div className="mt-1.5 space-y-1.5">
                              {chapters.map((chapter) => (
                                <Link
                                  key={chapter.id}
                                  to={`/books?book=${chapter.book}&chapter=${chapter.id}`}
                                  className="group block border border-ink/30 px-2.5 py-2 text-xs transition-colors hover:bg-ink hover:text-paper"
                                >
                                  <span className="flex items-start justify-between gap-3">
                                    <span className="min-w-0">
                                      <span className="mono-label mr-1.5 text-cadmium-ink group-hover:text-paper">
                                        CH.{chapter.number}
                                      </span>
                                      <span className="font-medium">{chapter.titleZh ?? chapter.title}</span>
                                    </span>
                                    <ArrowUpRight size={12} className="mt-0.5 shrink-0" aria-hidden />
                                  </span>
                                  {chapter.summary ? (
                                    <span className="mt-1 block line-clamp-2 leading-relaxed text-muted group-hover:text-paper/80">
                                      {chapter.summary}
                                    </span>
                                  ) : null}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-xs leading-relaxed text-muted">
                        本书库暂无章节映射（站点框架或基础构件可能没有对应章节）。
                      </p>
                    )}
                  </div>
                  {!pathMode ? (
                    <>
                      <div className="mt-5 border-t border-line pt-3">
                        <p className="mono-label text-muted">PREREQUISITES / 前置</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {prerequisites.length ? prerequisites.map((concept) => (
                            <Link key={concept.slug} to={`/theory/${concept.slug}`} className="border border-ink/40 px-2 py-1 text-xs transition-colors hover:bg-ink hover:text-paper">
                              {concept.number} {concept.title}
                            </Link>
                          )) : <span className="text-xs text-muted">无</span>}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="mono-label text-muted">NEXT / 后续</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {nextConcepts.length ? nextConcepts.map((concept) => (
                            <Link key={concept.slug} to={`/theory/${concept.slug}`} className="border border-ink/40 px-2 py-1 text-xs transition-colors hover:bg-ink hover:text-paper">
                              {concept.number} {concept.title}
                            </Link>
                          )) : <span className="text-xs text-muted">无</span>}
                        </div>
                      </div>
                    </>
                  ) : null}
                </>
              ) : null}

              {selected.kind === "hub" ? (
                <div className="mt-4">
                  <p className="mono-label text-muted">NODES IN THIS SYSTEM</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {hubConcepts.map((node) => (
                      <Link
                        key={node.id}
                        to={node.slug ? `/theory/${node.slug}` : "/atlas"}
                        className="border border-ink/40 px-2 py-1 text-xs transition-colors hover:bg-ink hover:text-paper"
                      >
                        {node.subtitle} {node.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {selected.kind === "source" && selected.sourceId ? (
                <div className="mt-4">
                  <p className="text-xs leading-relaxed text-muted">
                    {BIBLIOGRAPHY_BY_ID[selected.sourceId].authors}. {BIBLIOGRAPHY_BY_ID[selected.sourceId].title}.
                  </p>
                  <Link
                    to={`/books?book=${selected.sourceId}`}
                    className="mono-label mt-3 inline-flex items-center gap-1.5 border border-ink px-3 py-2 hover:bg-ink hover:text-paper"
                  >
                    打开书库 <BookOpen size={12} aria-hidden />
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex min-h-[220px] flex-col justify-center gap-3">
              <Network size={24} className="text-cobalt-ink" aria-hidden />
              <p className="text-sm text-muted">
                {pathMode
                  ? "点击图中任一概念，查看完整先修链、后续路径与支撑章节。"
                  : "点击图中的书、体系或概念节点查看关系。"}
              </p>
            </div>
          )}
        </aside>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="reading-column text-xs leading-relaxed text-muted">
          分层图只反映本库的编辑关系，不声称是唯一理论体系；实线/虚线图例见图中。节点内的编号对应概念目录，点击可继续阅读。
        </p>
        <Link to="/books" className="mono-label inline-flex items-center gap-1 text-cobalt-ink hover:text-ink">
          <BookOpen size={13} aria-hidden />
          三本书库
        </Link>
      </div>
    </div>
  );
}
