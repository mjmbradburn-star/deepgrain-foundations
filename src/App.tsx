import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteShell } from "@/components/layout/SiteShell";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Home from "./pages/Home";
import MethodPage from "./pages/MethodPage";
import Work from "./pages/Work";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Intelligence from "./pages/Intelligence";
import IntelligenceArticle from "./pages/IntelligenceArticle";
import IntelligenceCategory from "./pages/IntelligenceCategory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SiteShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/method" element={<MethodPage />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/intelligence" element={<Intelligence />} />
            <Route path="/intelligence/category/:name" element={<IntelligenceCategory />} />
            <Route path="/intelligence/:slug" element={<IntelligenceArticle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SiteShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
