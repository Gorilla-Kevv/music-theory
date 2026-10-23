import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Network } from "lucide-react";
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
  getNextConcepts,
  getPrerequisites,
  type AtlasNode,
} from "../content/graph";
import type { CategoryId, HarmonyDimension } from "../content/types";

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

function edgePath(source: AtlasNode, target: AtlasNode): string {
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

  const visibleNodes = useMemo(
    () =>
      ATLAS_GRAPH.nodes.filter((node) => {
        if (node.kind !== "concept") return true;
        if (category !== "all" && node.category !== category) return false;
        if (dimension !== "all" && !node.dimensions?.includes(dimension)) return false;
        return true;
      }),
    [category, dimension],
  );

  const visibleIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleEdges = useMemo(
    () => ATLAS_GRAPH.edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target)),
    [visibleIds],
  );

  const selected = selectedId ? getAtlasNode(selectedId) : undefined;
  const activeId = hoveredId ?? selectedId;
  const activeNeighbors = useMemo(() => {
    if (!activeId) return new Set<string>();
    const ids = new Set<string>([activeId]);
    for (const edge of visibleEdges) {
      if (edge.source === activeId) ids.add(edge.target);
      if (edge.target === activeId) ids.add(edge.source);
    }
    return ids;
  }, [activeId, visibleEdges]);

  const selectNode = (node: AtlasNode) => {
    setSelectedId(node.id);
    const next = new URLSearchParams(params);
    if (node.kind === "concept" && node.slug) next.set("focus", node.slug);
    else next.delete("focus");
    setParams(next, { replace: true });
  };

  const selectedConcept = selected?.slug ? CONCEPT_BY_SLUG[selected.slug] : undefined;
  const selectedHubs = selected?.slug ? getConceptHubs(selected.slug) : [];
  const prerequisites = selected?.slug ? getPrerequisites(selected.slug) : [];
  const nextConcepts = selected?.slug ? getNextConcepts(selected.slug) : [];
  const selectedBookChapters = selected?.slug ? getChaptersForConcept(selected.slug) : [];
  const hubConcepts = selected?.kind === "hub"
    ? visibleNodes.filter(
        (node) =>
          node.kind === "concept" &&
          visibleEdges.some(
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

      <div className="mt-5 space-y-5">
        <div className="min-w-0 border border-line bg-paper">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
            <span className="mono-label text-muted">MLP GRAPH / 分层关系网</span>
            <span className="mono-label text-muted">悬停/点击追踪 · 移动端左右滑动</span>
          </div>
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${ATLAS_WIDTH} ${ATLAS_HEIGHT}`}
              className="w-full min-w-[1120px]"
              role="img"
              aria-label="TONIC 乐理体系关系图"
            >
              <text x="80" y="24" textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.2">
                SOURCES / 书
              </text>
              <text x="350" y="24" textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.2">
                SYSTEM / 体系
              </text>
              <text x="830" y="24" textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.2">
                CONCEPTS / 知识节点
              </text>

              {visibleEdges.map((edge) => {
                const source = getAtlasNode(edge.source);
                const target = getAtlasNode(edge.target);
                if (!source || !target) return null;
                const connected = activeId
                  ? edge.source === activeId || edge.target === activeId
                  : false;
                const style =
                  edge.type === "source"
                    ? { stroke: "var(--color-ink)", opacity: 0.18, width: 1, dash: "0" }
                    : edge.type === "system"
                      ? { stroke: "var(--color-cobalt)", opacity: 0.22, width: 1.2, dash: "0" }
                      : edge.type === "prerequisite"
                        ? { stroke: "var(--color-cadmium-ink)", opacity: 0.4, width: 1.5, dash: "6 3" }
                        : { stroke: "var(--color-ink)", opacity: 0.12, width: 1, dash: "3 3" };
                return (
                  <path
                    key={edge.id}
                    d={edgePath(source, target)}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={style.width}
                    strokeDasharray={style.dash}
                    opacity={activeId ? (connected ? 0.95 : 0.04) : style.opacity}
                    className="transition-opacity duration-150"
                  />
                );
              })}

              {visibleNodes.map((node) => {
                const isSelected = node.id === selectedId;
                const isHovered = node.id === hoveredId;
                const isActive = isSelected || isHovered;
                const inNeighborhood = activeNeighbors.has(node.id);
                const radius = node.kind === "concept" ? 18 : 27;
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
                    onClick={() => selectNode(node)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectNode(node);
                      }
                    }}
                    className="cursor-pointer"
                    opacity={activeId ? (inNeighborhood ? 1 : 0.16) : 1}
                  >
                    <title>
                      {node.label}
                      {node.subtitle ? ` / ${node.subtitle}` : ""}
                    </title>
                    {isActive ? (
                      <circle cx={node.x} cy={node.y} r={radius + 6} fill="none" stroke="var(--color-acid)" strokeWidth={2} />
                    ) : null}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius}
                      fill={nodeFill(node)}
                      stroke={isSelected ? "var(--color-ink)" : "var(--color-ink)"}
                      strokeWidth={isSelected ? 2.5 : 1}
                    />
                    {node.kind === "concept" ? (
                      <text
                        x={node.x}
                        y={node.y + 2}
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
                      x={node.x}
                      y={node.y + radius + 13}
                      textAnchor="middle"
                      fill="var(--color-ink)"
                      fontSize={node.kind === "concept" ? "10.5" : "12.5"}
                      fontWeight={node.kind === "concept" ? "500" : "700"}
                    >
                      {node.kind === "concept" ? truncate(node.label) : node.label}
                    </text>
                    {node.kind !== "concept" && node.subtitle ? (
                      <text
                        x={node.x}
                        y={node.y + radius + 27}
                        textAnchor="middle"
                        fill="var(--color-muted)"
                        fontSize="8.5"
                      >
                        {node.subtitle}
                      </text>
                    ) : null}
                  </g>
                );
              })}

              <g transform="translate(80 1088)">
                <line x1="0" y1="0" x2="28" y2="0" stroke="var(--color-ink)" strokeOpacity="0.25" strokeDasharray="3 3" />
                <text x="36" y="4" fill="var(--color-muted)" fontSize="9">关联</text>
                <line x1="100" y1="0" x2="128" y2="0" stroke="var(--color-cadmium-ink)" strokeOpacity="0.6" strokeDasharray="6 3" />
                <text x="136" y="4" fill="var(--color-muted)" fontSize="9">前置</text>
                <line x1="190" y1="0" x2="218" y2="0" stroke="var(--color-cobalt)" strokeOpacity="0.5" />
                <text x="226" y="4" fill="var(--color-muted)" fontSize="9">体系</text>
                <line x1="280" y1="0" x2="308" y2="0" stroke="var(--color-ink)" strokeOpacity="0.2" />
                <text x="316" y="4" fill="var(--color-muted)" fontSize="9">来源</text>
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
                        <span key={item} className="mono-label border border-ink/25 px-2 py-1">
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
                    {selectedBookChapters.length ? (
                      <Link
                        to={`/books?book=${selectedBookChapters[0].book}&chapter=${selectedBookChapters[0].id}`}
                        className="mono-label inline-flex items-center gap-1.5 border border-ink/40 px-3 py-2 text-muted hover:border-ink hover:text-ink"
                      >
                        书库笔记 <BookOpen size={12} aria-hidden />
                      </Link>
                    ) : null}
                  </div>
                  <div className="mt-5 border-t border-line pt-3">
                    <p className="mono-label text-muted">PREREQUISITES / 前置</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {prerequisites.length ? prerequisites.map((concept) => (
                        <Link key={concept.slug} to={`/theory/${concept.slug}`} className="border border-ink/20 px-2 py-1 text-xs hover:border-cobalt hover:text-cobalt-ink">
                          {concept.number} {concept.title}
                        </Link>
                      )) : <span className="text-xs text-muted">无</span>}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="mono-label text-muted">NEXT / 后续</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {nextConcepts.length ? nextConcepts.map((concept) => (
                        <Link key={concept.slug} to={`/theory/${concept.slug}`} className="border border-ink/20 px-2 py-1 text-xs hover:border-cobalt hover:text-cobalt-ink">
                          {concept.number} {concept.title}
                        </Link>
                      )) : <span className="text-xs text-muted">无</span>}
                    </div>
                  </div>
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
                        className="border border-ink/20 px-2 py-1 text-xs hover:border-cobalt hover:text-cobalt-ink"
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
              <p className="text-sm text-muted">点击图中的书、体系或概念节点查看关系。</p>
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
