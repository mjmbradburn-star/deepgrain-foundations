import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { MethodSubnav } from "./MethodSubnav";
import { CookieBanner } from "@/components/compliance/CookieBanner";
import { SiteEntityLd } from "@/components/seo/SiteEntityLd";
import { cn } from "@/lib/utils";

export const SiteShell = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const hasSubnav =
    pathname.startsWith("/method") || pathname.startsWith("/enablement");

  // Prerender ready marker. The puppeteer-based prerender waits for the
  // [data-prerender-ready] attribute before snapshotting, which guarantees
  // React + the route component + Helmet have all flushed. Resets on every
  // route change so the snapshot reflects the new page, not the prior one.
  const [renderReady, setRenderReady] = useState(false);
  useEffect(() => {
    setRenderReady(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRenderReady(true));
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div
      className="min-h-screen flex flex-col bg-linen"
      data-prerender-ready={renderReady ? "true" : undefined}
    >
      <SiteEntityLd />
      <Navigation />
      <MethodSubnav />
      {/* When the sub-nav is mounted, push main down by its 40px height so
          hero copy and section eyebrows clear the fixed sub-nav on every
          viewport. The primary nav is forced opaque on these routes (see
          Navigation.tsx) which prevents the linen body from showing through. */}
      <main
        className={cn(
          "flex-1",
          "[&_section+section]:brass-rule",
          "[&_section:first-of-type:not([data-no-rule])]:brass-rule",
          hasSubnav &&
            "pt-10 [&_section]:scroll-mt-36 md:[&_section]:scroll-mt-[152px]"
        )}
      >
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
};
