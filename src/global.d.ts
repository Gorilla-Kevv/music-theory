import type { theoryApi } from "./lib/theory-api";

declare global {
  const __EMBEDDED_BOOKS__: boolean;

  interface Window {
    TONIC: typeof theoryApi;
  }
}

export {};
