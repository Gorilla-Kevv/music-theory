import type { theoryApi } from "./lib/theory-api";

declare global {
  interface Window {
    TONIC: typeof theoryApi;
  }
}

export {};
