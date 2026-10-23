import { BookOpen, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BIBLIOGRAPHY,
  CITATION_STYLE_NOTE,
  CONCEPTS,
  collectCitations,
} from "../content";
import type { BibliographyEntry, Concept, SourceId } from "../content/types";

const SOURCE_FIELD: Record<SourceId, string> = {
  levine: "bg-cadmium text-ink",
  laitz: "bg-cobalt text-paper",
  sposobin: "bg-acid text-ink",
};

const SOURCE_NOTE: Record<SourceId, string> = {
  levine: "爵士语言",
  laitz: "调性理论",
  sposobin: "功能和声",
};

interface LocatorUsage {
  locator: string;
  concepts: Concept[];
}

function usageFor(entry: BibliographyEntry): LocatorUsage[] {
  const map = new Map<string, LocatorUsage>();
  for (const concept of CONCEPTS) {
    for (const { ref } of collectCitations(concept)) {
      if (ref.source !== entry.id) continue;
      const existing = map.get(ref.locator);
      if (existing) {
        if (!existing.concepts.some((item) => item.slug === concept.slug)) {
          existing.concepts.push(concept);
        }
      } else {
        map.set(ref.locator, { locator: ref.locator, concepts: [concept] });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.locator.localeCompare(b.locator));
}

export function References() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 sm:px-8 sm:pt-8 xl:px-12">
      <div className="border-b border-line pb-5">
        <p className="mono-label text-muted">SOURCES / 参考文献</p>
        <h1 className="zh-display mt-2 text-4xl sm:text-5xl">三本书，三条理论线</h1>
        <p className="reading-column mt-3 max-w-[64ch] text-sm leading-relaxed text-muted">
          本知识库不是教材的摘要，而是以三本著作为依据的原创改写。每条正文断言至少对应一处章节级来源；页码因版次与译本而异，因此不写入。
        </p>
      </div>

      <aside className="mt-5 border border-ink bg-paper-2 p-4">
        <p className="mono-label text-cobalt-ink">CITATION POLICY / 引用体例</p>
        <p className="reading-column mt-2 text-sm leading-relaxed">{CITATION_STYLE_NOTE}</p>
      </aside>

      <div className="mt-6 space-y-5">
        {BIBLIOGRAPHY.map((entry) => {
          const usage = usageFor(entry);
          return (
            <section key={entry.id} id={entry.id} className="scroll-mt-24 border border-line">
              <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className={`flex flex-col justify-between p-5 ${SOURCE_FIELD[entry.id]}`}>
                  <div>
                    <p className="mono-label">SOURCE / {entry.id.toUpperCase()}</p>
                    <p className="display mt-3 text-5xl leading-none">
                      {entry.id === "levine" ? "Jazz" : entry.id === "laitz" ? "CM" : "Harmony"}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed">{SOURCE_NOTE[entry.id]}</p>
                  </div>
                  <p className="mono-label mt-8">{entry.edition}</p>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold leading-snug">{entry.title}</h2>
                      {entry.originalTitle ? (
                        <p className="mt-1 text-sm text-muted">{entry.originalTitle}</p>
                      ) : null}
                      <p className="mt-2 text-sm">{entry.authors}</p>
                    </div>
                    <span className="mono-label border border-ink/20 px-2 py-1 text-muted">
                      {usage.length} LOCATORS USED
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-line pt-3 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="mono-label text-muted">PUBLISHER / YEAR</dt>
                      <dd className="mt-0.5">
                        {entry.publisher}，{entry.year}
                      </dd>
                    </div>
                    <div>
                      <dt className="mono-label text-muted">EDITION</dt>
                      <dd className="mt-0.5">{entry.edition}</dd>
                    </div>
                    <div>
                      <dt className="mono-label text-muted">ISBN</dt>
                      <dd className="mt-0.5">{entry.isbn ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="mono-label text-muted">LANGUAGE</dt>
                      <dd className="mt-0.5">{entry.language}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 border-t border-line pt-3">
                    <p className="mono-label text-muted">ROLE IN THIS LIBRARY</p>
                    <p className="mt-1 text-sm leading-relaxed">{entry.role}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{entry.locatorNote}</p>
                    <p className="mono-label mt-2 text-muted">VERIFIED VIA / {entry.verifiedVia}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-line">
                <div className="flex items-center gap-2 px-5 py-3">
                  <BookOpen size={14} className="text-cobalt-ink" aria-hidden />
                  <p className="mono-label text-muted">LOCATOR MAP / 本库使用的章节定位</p>
                </div>
                <ul className="border-t border-line">
                  {usage.map((item) => (
                    <li
                      key={item.locator}
                      className="grid grid-cols-1 gap-2 border-b border-line px-5 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
                    >
                      <p className="text-xs leading-relaxed sm:text-sm">{item.locator}</p>
                      <div className="flex flex-wrap gap-1.5 sm:justify-end">
                        {item.concepts.map((concept) => (
                          <Link
                            key={concept.slug}
                            to={`/theory/${concept.slug}`}
                            className="mono-label border border-ink/15 px-1.5 py-0.5 text-muted hover:border-cobalt hover:text-cobalt-ink"
                          >
                            {concept.number} {concept.title}
                          </Link>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-8 border-t border-line pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="reading-column text-xs leading-relaxed text-muted">
            外部核对来源：Oxford University Press 官方目录、图书馆书目记录所载中译本与第 3 版目录。书目页仅用于核对版次与章名，不替代原著阅读。
          </p>
          <a
            href="https://global.oup.com/ushe/product/the-complete-musician-9780190924508"
            target="_blank"
            rel="noreferrer"
            className="mono-label inline-flex items-center gap-1.5 text-cobalt-ink hover:text-ink"
          >
            OUP 书目
            <ExternalLink size={12} aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
