/**
 * Opt-in debug helpers for BarkGrain motion troubleshooting.
 * Enable by appending `?debugGrain=1` to any URL.
 *
 * When off, every export is a no-op and there is zero runtime cost.
 */
import { createRoot, type Root } from "react-dom/client";
import { createElement } from "react";
import { GrainDebugHUD } from "@/components/ui/GrainDebugHUD";

let cachedFlag: boolean | null = null;
export function isGrainDebug(): boolean {
  if (cachedFlag !== null) return cachedFlag;
  if (typeof window === "undefined") {
    cachedFlag = false;
    return false;
  }
  cachedFlag = new URLSearchParams(window.location.search).has("debugGrain");
  return cachedFlag;
}

export interface GrainEntry {
  seed: number;
  el: SVGSVGElement;
}

const registry: GrainEntry[] = [];
const listeners = new Set<() => void>();
let hudRoot: Root | null = null;

function mountHUD() {
  if (hudRoot || typeof document === "undefined") return;
  const host = document.createElement("div");
  host.id = "grain-debug-hud-root";
  document.body.appendChild(host);
  hudRoot = createRoot(host);
  hudRoot.render(createElement(GrainDebugHUD));
}

export function registerGrain(seed: number, el: SVGSVGElement | null) {
  if (!isGrainDebug() || !el) return () => {};
  registry.push({ seed, el });
  listeners.forEach((l) => l());
  mountHUD();
  return () => {
    const i = registry.findIndex((r) => r.el === el);
    if (i >= 0) registry.splice(i, 1);
    listeners.forEach((l) => l());
  };
}

export function getGrainRegistry(): readonly GrainEntry[] {
  return registry;
}

export function subscribeGrainRegistry(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
