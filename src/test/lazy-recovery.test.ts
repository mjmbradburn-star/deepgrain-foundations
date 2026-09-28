import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isChunkLoadError,
  recoverFromChunkFailure,
} from "@/lib/lazyRecovery";

const reload = vi.fn();

beforeEach(() => {
  reload.mockClear();
  sessionStorage.clear();
  vi.stubGlobal("location", { reload } as unknown as Location);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("isChunkLoadError", () => {
  it("recognises the wording each engine and bundler uses", () => {
    const messages = [
      "Failed to fetch dynamically imported module: http://localhost/src/App.tsx",
      "Importing a module script failed.",
      "error loading dynamically imported module",
      "Loading chunk 42 failed.",
      "Request failed with status code 502",
    ];
    for (const message of messages) {
      expect(isChunkLoadError(new Error(message))).toBe(true);
    }
  });

  it("does not swallow ordinary bugs", () => {
    expect(
      isChunkLoadError(new TypeError("Cannot read properties of undefined"))
    ).toBe(false);
  });
});

describe("recoverFromChunkFailure", () => {
  it("reloads the document once, and stays pending while the reload runs", async () => {
    const pending = recoverFromChunkFailure(
      new TypeError("Importing a module script failed."),
    );

    expect(reload).toHaveBeenCalledTimes(1);

    const settled = await Promise.race([
      pending.then(() => "resolved").catch(() => "rejected"),
      new Promise((resolve) => setTimeout(() => resolve("pending"), 40)),
    ]);
    expect(settled).toBe("pending");
  });

  it("does not reload twice inside the cooldown window", () => {
    recoverFromChunkFailure(new Error("Importing a module script failed."));
    expect(reload).toHaveBeenCalledTimes(1);

    expect(() =>
      recoverFromChunkFailure(new Error("Importing a module script failed."))
    ).toThrow("Importing a module script failed.");
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("rethrows anything that is not a chunk failure without reloading", () => {
    expect(() =>
      recoverFromChunkFailure(new TypeError("count is not a function"))
    ).toThrow("count is not a function");
    expect(reload).not.toHaveBeenCalled();
  });
});
