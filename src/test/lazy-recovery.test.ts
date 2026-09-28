import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const reload = vi.fn();

/** The reload guard keeps per-document state in module scope, so each test
 *  needs a fresh instance of the module rather than a shared one. */
const loadModule = async () => {
  vi.resetModules();
  return await import("@/lib/lazyRecovery");
};

const RELOAD_STAMP = "deepgrain:chunk-reload-at";

const staysPending = async (promise: Promise<never>) => {
  const outcome = await Promise.race([
    promise.then(() => "resolved", () => "rejected"),
    new Promise<string>((resolve) => setTimeout(() => resolve("pending"), 30)),
  ]);
  return outcome === "pending";
};

beforeEach(() => {
  reload.mockClear();
  sessionStorage.clear();
  vi.stubGlobal("location", { reload } as unknown as Location);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("isChunkLoadError", () => {
  it("recognises the wording each engine and bundler uses", async () => {
    const { isChunkLoadError } = await loadModule();
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

  it("does not swallow ordinary bugs", async () => {
    const { isChunkLoadError } = await loadModule();
    expect(
      isChunkLoadError(new TypeError("Cannot read properties of undefined"))
    ).toBe(false);
  });
});

describe("recoverFromChunkFailure", () => {
  it("reloads the document once and stays pending while the reload runs", async () => {
    const { recoverFromChunkFailure } = await loadModule();

    const pending = recoverFromChunkFailure(
      new TypeError("Failed to fetch dynamically imported module")
    );

    expect(reload).toHaveBeenCalledTimes(1);
    expect(await staysPending(pending)).toBe(true);
  });

  it("holds sibling failures open instead of unmounting the tree", async () => {
    const { recoverFromChunkFailure } = await loadModule();

    const first = recoverFromChunkFailure(
      new TypeError("Importing a module script failed.")
    );
    let second: Promise<never> | undefined;
    expect(() => {
      second = recoverFromChunkFailure(
        new TypeError("Importing a module script failed.")
      );
    }).not.toThrow();

    expect(reload).toHaveBeenCalledTimes(1);
    expect(await staysPending(first)).toBe(true);
    expect(await staysPending(second!)).toBe(true);
  });

  it("gives up when a freshly reloaded document fails again", async () => {
    sessionStorage.setItem(RELOAD_STAMP, String(Date.now()));
    const { recoverFromChunkFailure } = await loadModule();

    expect(() =>
      recoverFromChunkFailure(new TypeError("Importing a module script failed."))
    ).toThrow("Importing a module script failed.");
    expect(reload).not.toHaveBeenCalled();
  });

  it("rethrows anything that is not a chunk failure without reloading", async () => {
    const { recoverFromChunkFailure } = await loadModule();

    expect(() =>
      recoverFromChunkFailure(new TypeError("count is not a function"))
    ).toThrow("count is not a function");
    expect(reload).not.toHaveBeenCalled();
  });
});
