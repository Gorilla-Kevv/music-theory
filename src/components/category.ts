import type { CategoryId } from "../content/types";

export interface CategoryStyle {
  solid: string;
  soft: string;
  text: string;
  border: string;
  dot: string;
  field: string;
}

export const CATEGORY_STYLES: Record<CategoryId, CategoryStyle> = {
  foundations: {
    solid: "bg-cobalt text-paper",
    soft: "bg-cobalt/10 text-cobalt-ink",
    text: "text-cobalt-ink",
    border: "border-cobalt",
    dot: "bg-cobalt",
    field: "bg-cobalt text-paper",
  },
  harmony: {
    solid: "bg-cadmium text-ink",
    soft: "bg-cadmium/15 text-cadmium-ink",
    text: "text-cadmium-ink",
    border: "border-cadmium",
    dot: "bg-cadmium",
    field: "bg-cadmium text-ink",
  },
  jazz: {
    solid: "bg-acid text-ink",
    soft: "bg-acid/35 text-ink",
    text: "text-ink",
    border: "border-acid",
    dot: "bg-acid",
    field: "bg-acid text-ink",
  },
};

export const LEVEL_STYLES: Record<string, string> = {
  基础: "border-ink/25 text-ink/70",
  进阶: "border-ink/25 text-ink/70",
  高级: "border-ink/45 text-ink",
};
