import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * Last line of defence for the white-screen failure mode. A route or section
 * chunk that cannot load rethrows once the auto-reload guard has had its turn,
 * and without a boundary that rejection unmounts the whole tree, leaving a
 * blank page with no explanation. The fallback keeps the visit recoverable.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      "Deepgrain render failure:",
      error.message,
      info.componentStack ?? "",
    );
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <section
        aria-live="polite"
        className="mx-auto max-w-2xl px-6 py-24 text-center sm:py-32"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-brass">
          Something slipped
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-walnut sm:text-4xl">
          This part of the page didn't load.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-walnut/80">
          A section failed to fetch, usually a dropped connection or an update
          caught mid-flight. Reload and it should come straight back.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-walnut px-5 py-2.5 text-sm font-medium text-cream transition-opacity hover:opacity-90"
          >
            Reload the page
          </button>
          <a
            href="/"
            className="rounded-full border border-brass/40 px-5 py-2.5 text-sm font-medium text-walnut transition-colors hover:bg-linen"
          >
            Back to the start
          </a>
        </div>
      </section>
    );
  }
}
