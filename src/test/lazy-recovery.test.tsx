import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  claimChunkReload,
  clearChunkReloadMarker,
  recoverable,
} from "@/lib/lazyRecovery";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const MARKER = "deepgrain:chunk-reload-at";

const boom = () => Promise.reject(new Error("chunk failed"));

describe("chunk recovery", () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearChunkReloadMarker();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("claims the first failure and refuses the next one inside the cooldown", () => {
    expect(claimChunkReload()).toBe(true);
    expect(claimChunkReload()).toBe(false);
  });

  it("lets a later failure recover once the marker is cleared", () => {
    claimChunkReload();
    clearChunkReloadMarker();
    expect(sessionStorage.getItem(MARKER)).toBeNull();
    expect(claimChunkReload()).toBe(true);
  });

  it("reloads the document instead of rejecting when a chunk fails", async () => {
    const reload = vi.spyOn(window.location, "reload").mockImplementation(() => {});
    const load = recoverable(boom);

    const result = load();
    await expect(Promise.race([result, "pending"] as const)).resolves.toBe("pending");
    expect(reload).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(MARKER)).not.toBeNull();
  });

  it("rethrows once the recovery reload has already been spent", async () => {
    vi.spyOn(window.location, "reload").mockImplementation(() => {});
    claimChunkReload();

    await expect(recoverable(boom)()).rejects.toThrow("chunk failed");
  });
});

describe("ErrorBoundary", () => {
  const Broken = () => {
    throw new Error("render blew up");
  };

  it("shows a way out instead of rendering nothing", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("heading", { name: /didn.t load/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reload the page/i })).toBeInTheDocument();
    spy.mockRestore();
  });
});
