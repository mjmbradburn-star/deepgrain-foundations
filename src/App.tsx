import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SiteShell } from "@/components/layout/SiteShell";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Analytics } from "@/components/analytics/Analytics";
import { recoverable } from "@/lib/lazyRecovery";
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

// Route-level code splitting - only Home is in the initial bundle. Each import
// is wrapped so a dropped chunk request reloads the document once instead of
// leaving the visitor on a blank page.
const MethodPage = lazy(recoverable(() => import("./pages/MethodPage")));
const Work = lazy(recoverable(() => import("./pages/Work")));
const About = lazy(recoverable(() => import("./pages/About")));
const Contact = lazy(recoverable(() => import("./pages/Contact")));
const Intelligence = lazy(recoverable(() => import("./pages/Intelligence")));
const IntelligenceArticle = lazy(
  recoverable(() => import("./pages/IntelligenceArticle")),
);
const IntelligenceCategory = lazy(
  recoverable(() => import("./pages/IntelligenceCategory")),
);
const IntelligenceGlossary = lazy(
  recoverable(() => import("./pages/IntelligenceGlossary")),
);
const IntelligenceCompare = lazy(
  recoverable(() => import("./pages/IntelligenceCompare")),
);
const IntelligencePillars = lazy(
  recoverable(() => import("./pages/IntelligencePillars")),
);
const IntelligencePillar = lazy(
  recoverable(() => import("./pages/IntelligencePillar")),
);
const IntelligenceCluster = lazy(
  recoverable(() => import("./pages/IntelligenceCluster")),
);
const AnswerDetail = lazy(recoverable(() => import("./pages/AnswerDetail")));

const NotFound = lazy(recoverable(() => import("./pages/NotFound")));
const Unsubscribe = lazy(recoverable(() => import("./pages/Unsubscribe")));
const Enablement = lazy(recoverable(() => import("./pages/Enablement")));
const Privacy = lazy(recoverable(() => import("./pages/Privacy")));
const CookiesPage = lazy(recoverable(() => import("./pages/Cookies")));
const Terms = lazy(recoverable(() => import("./pages/Terms")));
const SeoChecklist = lazy(recoverable(() => import("./pages/SeoChecklist")));
const Brain = lazy(recoverable(() => import("./pages/Brain")));
const BrainResend = lazy(recoverable(() => import("./pages/BrainResend")));
const Login = lazy(recoverable(() => import("./pages/Login")));
const OAuthConsent = lazy(recoverable(() => import("./pages/OAuthConsent")));
const Readiness = lazy(recoverable(() => import("./pages/Readiness")));
const ExposureMap = lazy(recoverable(() => import("./pages/ExposureMap")));
const GrainAudit = lazy(recoverable(() => import("./pages/GrainAudit")));
const Waitlist = lazy(recoverable(() => import("./pages/Waitlist")));
const BusinessTeamAITraining = lazy(
  recoverable(() => import("./pages/BusinessTeamAITraining")),
);

const queryClient = new QueryClient();

const RouteFallback = () => <div aria-hidden className="min-h-screen" />;

/**
 * The boundary is keyed by pathname so a failure on one route cannot pin the
 * fallback over the next one the visitor navigates to.
 */
const RoutedApp = () => {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary key={pathname}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/method" element={<MethodPage />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route
            path="/intelligence/people-ops"
            element={<Navigate to="/intelligence" replace />}
          />
          <Route
            path="/intelligence/category/:name"
            element={<IntelligenceCategory />}
          />
          <Route path="/intelligence/glossary" element={<IntelligenceGlossary />} />
          <Route
            path="/intelligence/answers"
            element={<Navigate to="/intelligence" replace />}
          />
          <Route path="/intelligence/pillars" element={<IntelligencePillars />} />
          <Route
            path="/intelligence/pillar/:slug"
            element={<IntelligencePillar />}
          />
          <Route
            path="/intelligence/cluster/:slug"
            element={<IntelligenceCluster />}
          />
          <Route path="/answers/:slug" element={<AnswerDetail />} />
          {/* Legacy hash-anchor URLs redirected to canonical detail pages. */}
          <Route
            path="/intelligence/answers/:slug"
            element={<LegacyAnswerRedirect />}
          />
          <Route
            path="/intelligence/ai-operating-system-vs-operating-model"
            element={
              <IntelligenceCompare slug="ai-operating-system-vs-operating-model" />
            }
          />
          <Route
            path="/intelligence/ai-os-vs-ai-platform"
            element={<IntelligenceCompare slug="ai-os-vs-ai-platform" />}
          />
          <Route
            path="/intelligence/ai-os-vs-automation"
            element={<IntelligenceCompare slug="ai-os-vs-automation" />}
          />
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
          <Route
            path="/ai-training-for-business-teams"
            element={<BusinessTeamAITraining />}
          />
          {/* Course aliases: canonical is /waitlist, but /course and /cohort are common entry points */}
          <Route path="/course" element={<Navigate to="/waitlist" replace />} />
          <Route path="/cohort" element={<Navigate to="/waitlist" replace />} />
          <Route
            path="/people-ops-course"
            element={<Navigate to="/waitlist" replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Analytics />
        <SiteShell>
          <RoutedApp />
        </SiteShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
