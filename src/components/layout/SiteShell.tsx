import { useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { MethodSubnav } from "./MethodSubnav";
import { cn } from "@/lib/utils";

export const SiteShell = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const hasSubnav =
    pathname.startsWith("/method") || pathname.startsWith("/enablement");

  return (
    <div className="min-h-screen flex flex-col bg-linen">
      <Navigation />
      <MethodSubnav />
      {/* Spacer to offset the fixed sub-nav (h-10 = 40px). Keeps hero copy
          and section eyebrows clear of the sub-nav on every viewport. */}
      <main className={cn("flex-1", hasSubnav && "pt-10")}>{children}</main>
      <Footer />
    </div>
  );
};
