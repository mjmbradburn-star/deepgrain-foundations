import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { MethodSubnav } from "./MethodSubnav";

export const SiteShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-linen">
    <Navigation />
    <MethodSubnav />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
