import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

if (!globalThis.fetch) {
  globalThis.fetch = vi.fn() as unknown as typeof fetch;
}
