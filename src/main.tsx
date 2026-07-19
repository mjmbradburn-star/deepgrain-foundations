import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Marks JS as live before anything else renders. index.css scopes the
// [data-reveal] hidden state to `.js-reveal`, so a stalled bundle or disabled
// JS leaves every section fully visible instead of stuck at opacity:0.
document.documentElement.classList.add("js-reveal");

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
