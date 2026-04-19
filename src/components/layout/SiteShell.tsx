import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export const SiteShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-linen">
    <Navigation />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
