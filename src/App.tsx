import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteShell } from "@/components/layout/SiteShell";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Analytics } from "@/components/analytics/Analytics";
import Home from "./pages/Home";

/**
 * Hash-anchor answers (legacy: /intelligence/answers#slug, briefly served as
 * /intelligence/answers/:slug during transition) redirect to the canonical
 * per-question route at /answers/:slug. `replace` to avoid polluting history.
 */
const LegacyAnswerRedirect = () => {
  const { slug = "" } = useParams();
  return <Navigate to={`/answers/${slug}`} replace />;
};

// Route-level code splitting - only Home is in the initial bundle.
const MethodPage = lazyWithRetry(() => import("./pages/MethodPage"));
const Work = lazyWithRetry(() => import("./pages/Work"));
const About = lazyWithRetry(() => import("./pages/About"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const Intelligence = lazyWithRetry(() => import("./pages/Intelligence"));
const IntelligenceArticle = lazyWithRetry(() => import("./pages/IntelligenceArticle"));
const IntelligenceCategory = lazyWithRetry(() => import("./pages/IntelligenceCategory"));
const IntelligenceGlossary = lazyWithRetry(() => import("./pages/IntelligenceGlossary"));
const IntelligenceCompare = lazyWithRetry(() => import("./pages/IntelligenceCompare"));
const IntelligencePillars = lazyWithRetry(() => import("./pages/IntelligencePillars"));
const IntelligencePillar = lazyWithRetry(() => import("./pages/IntelligencePillar"));
const IntelligenceCluster = lazyWithRetry(() => import("./pages/IntelligenceCluster"));
const AnswerDetail = lazyWithRetry(() => import("./pages/AnswerDetail"));

const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const Unsubscribe = lazyWithRetry(() => import("./pages/Unsubscribe"));
const Enablement = lazyWithRetry(() => import("./pages/Enablement"));
const Privacy = lazyWithRetry(() => import("./pages/Privacy"));
const CookiesPage = lazyWithRetry(() => import("./pages/Cookies"));
const Terms = lazyWithRetry(() => import("./pages/Terms"));
const SeoChecklist = lazyWithRetry(() => import("./pages/SeoChecklist"));
const Brain = lazyWithRetry(() => import("./pages/Brain"));
const BrainResend = lazyWithRetry(() => import("./pages/BrainResend"));
const Login = lazyWithRetry(() => import("./pages/Login"));
const OAuthConsent = lazyWithRetry(() => import("./pages/OAuthConsent"));
const Readiness = lazyWithRetry(() => import("./pages/Readiness"));
const ExposureMap = lazyWithRetry(() => import("./pages/ExposureMap"));
const GrainAudit = lazyWithRetry(() => import("./pages/GrainAudit"));
const Waitlist = lazyWithRetry(() => import("./pages/Waitlist"));
const BusinessTeamAITraining = lazyWithRetry(() => import("./pages/BusinessTeamAITraining"));

const queryClient = new QueryClient();

const RouteFallback = () => <div aria-hidden className="min-h-screen" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
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
              <Route path="/intelligence/answers" element={<Navigate to="/intelligence" replace />} />
              <Route path="/intelligence/pillars" element={<IntelligencePillars />} />
              <Route path="/intelligence/pillar/:slug" element={<IntelligencePillar />} />
              <Route path="/intelligence/cluster/:slug" element={<IntelligenceCluster />} />
              <Route path="/answers/:slug" element={<AnswerDetail />} />
              {/* Legacy hash-anchor URLs redirected to canonical detail pages. */}
              <Route
                path="/intelligence/answers/:slug"
                element={<LegacyAnswerRedirect />}
              />
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
              <Route path="/login" element={<Login />} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
              <Route path="/readiness" element={<Readiness />} />
              <Route path="/exposure-map" element={<ExposureMap />} />
              <Route path="/grain-audit" element={<GrainAudit />} />
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="/ai-training-for-business-teams" element={<BusinessTeamAITraining />} />
              {/* Course aliases: canonical is /waitlist, but /course and /cohort are common entry points */}
              <Route path="/course" element={<Navigate to="/waitlist" replace />} />
              <Route path="/cohort" element={<Navigate to="/waitlist" replace />} />
              <Route path="/people-ops-course" element={<Navigate to="/waitlist" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </SiteShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
