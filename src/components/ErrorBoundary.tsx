import { Component, type ErrorInfo, type ReactNode } from "react";
import { clearChunkReloadMarker } from "@/lib/lazyRecovery";

type Props = { children: ReactNode };
type State = { failed: boolean };

/**
 * Catches a route chunk that still won't load after the one recovery reload.
 * Without this the failed import unmounts the tree and the visitor is left on a
 * blank page with no way out. Lives inside the shell so the nav and footer stay
 * usable.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route failed to render:", error, info.componentStack);
  }

  /** A fresh document is the only fix for a cached failed module, so reload. */
  private reload = () => {
    clearChunkReloadMarker();
    window.location.reload();
  };

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <section className="bg-green text-cream min-h-[70vh] flex items-center py-28">
        <div className="container-grain max-w-2xl text-center">
          <span
            className="font-sans uppercase text-brass text-[11px]"
            style={{ letterSpacing: "0.16em" }}
          >
            Page trouble
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl leading-tight text-cream text-balance">
            This page didn&apos;t load.
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-cream/75 leading-relaxed">
            Something dropped on the way in. A fresh load usually clears it.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.reload}
              className="rounded-full bg-brass text-walnut font-sans uppercase text-[11px] px-6 py-3 transition-colors hover:bg-brass/90"
              style={{ letterSpacing: "0.14em" }}
            >
              Reload the page
            </button>
            <a
              href="/"
              className="rounded-full border border-cream/25 text-cream font-sans uppercase text-[11px] px-6 py-3 transition-colors hover:border-brass/60"
              style={{ letterSpacing: "0.14em" }}
            >
              Back to start
            </a>
          </div>
        </div>
      </section>
    );
  }
}
