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
      {/* When the sub-nav is mounted, push main down by its 40px height so
          hero copy and section eyebrows clear the fixed sub-nav on every
          viewport. The primary nav is forced opaque on these routes (see
          Navigation.tsx) which prevents the linen body from showing through. */}
      <main className={cn("flex-1", hasSubnav && "pt-10")}>{children}</main>
      <Footer />
    </div>
  );
};
