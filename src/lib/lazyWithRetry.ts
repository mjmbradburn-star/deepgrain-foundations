import { lazy, type ComponentType } from "react";

type ModuleWithDefault = { default: ComponentType<never> };

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * A rejected dynamic import is memoised by React for the lifetime of the page,
 * and the app tree has no error boundary, so one dropped chunk request (dev
 * server restart, Vite dependency re-optimisation, transient network blip)
 * blanks the whole screen and never recovers without a manual reload.
 * Re-invoking the loader resolves once the module graph settles instead.
 */
export async function retryImport<T extends ModuleWithDefault>(
  factory: () => Promise<T>,
  { attempts = 3, baseDelayMs = 150 }: { attempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await factory();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await wait(baseDelayMs * attempt);
    }
  }
  throw lastError;
}

export function lazyWithRetry<T extends ComponentType<never>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(() => retryImport(factory));
}
