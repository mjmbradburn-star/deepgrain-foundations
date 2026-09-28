import { describe, expect, it } from "vitest";
import { retryImport } from "@/lib/lazyWithRetry";

type Mod = { default: () => string };

describe("retryImport", () => {
  it("recovers when a transient chunk failure is followed by success", async () => {
    let calls = 0;
    const factory = async (): Promise<Mod> => {
      calls += 1;
      if (calls === 1) {
        throw new TypeError("Failed to fetch dynamically imported module");
      }
      return { default: () => "rendered" };
    };

    const mod = await retryImport(factory, { baseDelayMs: 0 });

    expect(mod.default()).toBe("rendered");
    expect(calls).toBe(2);
  });

  it("does not retry an import that succeeds first time", async () => {
    let calls = 0;
    const factory = async (): Promise<Mod> => {
      calls += 1;
      return { default: () => "rendered" };
    };

    await retryImport(factory, { baseDelayMs: 0 });

    expect(calls).toBe(1);
  });

  it("gives up after the configured attempts and rethrows the last failure", async () => {
    let calls = 0;
    const factory = async (): Promise<Mod> => {
      calls += 1;
      throw new Error(`chunk unavailable (${calls})`);
    };

    await expect(
      retryImport(factory, { attempts: 2, baseDelayMs: 0 })
    ).rejects.toThrow("chunk unavailable (2)");
    expect(calls).toBe(2);
  });
});
