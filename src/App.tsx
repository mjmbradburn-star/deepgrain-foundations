import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteShell } from "@/components/layout/SiteShell";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Analytics } from "@/components/analytics/Analytics";
import Home from "./pages/Home";

// Route-level code splitting — only Home is in the initial bundle.
const MethodPage = lazy(() => import("./pages/MethodPage"));
const Work = lazy(() => import("./pages/Work"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Intelligence = lazy(() => import("./pages/Intelligence"));
const IntelligenceArticle = lazy(() => import("./pages/IntelligenceArticle"));
const IntelligenceCategory = lazy(() => import("./pages/IntelligenceCategory"));
const IntelligenceGlossary = lazy(() => import("./pages/IntelligenceGlossary"));
const IntelligenceAnswers = lazy(() => import("./pages/IntelligenceAnswers"));
const IntelligenceCompare = lazy(() => import("./pages/IntelligenceCompare"));

const NotFound = lazy(() => import("./pages/NotFound"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const Enablement = lazy(() => import("./pages/Enablement"));
const Privacy = lazy(() => import("./pages/Privacy"));
const CookiesPage = lazy(() => import("./pages/Cookies"));
const Terms = lazy(() => import("./pages/Terms"));
const SeoChecklist = lazy(() => import("./pages/SeoChecklist"));
const Brain = lazy(() => import("./pages/Brain"));
const BrainResend = lazy(() => import("./pages/BrainResend"));

const queryClient = new QueryClient();

const RouteFallback = () => <div aria-hidden className="min-h-screen" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <ScrollToTop />
        <Analytics />
        <SiteShell>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/method" element={<MethodPage />} />
              <Route path="/work" element={<Work />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/intelligence" element={<Intelligence />} />
              <Route path="/intelligence/people-ops" element={<Navigate to="/intelligence" replace />} />
              <Route path="/intelligence/category/:name" element={<IntelligenceCategory />} />
              <Route path="/intelligence/glossary" element={<IntelligenceGlossary />} />
              <Route path="/intelligence/answers" element={<IntelligenceAnswers />} />
              <Route path="/intelligence/ai-operating-system-vs-operating-model" element={<IntelligenceCompare slug="ai-operating-system-vs-operating-model" />} />
              <Route path="/intelligence/ai-os-vs-ai-platform" element={<IntelligenceCompare slug="ai-os-vs-ai-platform" />} />
              <Route path="/intelligence/ai-os-vs-automation" element={<IntelligenceCompare slug="ai-os-vs-automation" />} />
              <Route path="/intelligence/:slug" element={<IntelligenceArticle />} />
              <Route path="/enablement" element={<Enablement />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/seo-checklist" element={<SeoChecklist />} />
              <Route path="/brain" element={<Brain />} />
              <Route path="/brain/resend" element={<BrainResend />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </SiteShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
