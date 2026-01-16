import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";

function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background selection:bg-secondary/30">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/about/board" component={BoardOfDirectors} />
          <Route path="/production" component={Production} />
          <Route path="/investors" component={Investors} />
          <Route path="/membership" component={Membership} />
          <Route path="/shop" component={Shop} />
          <Route path="/future-projects" component={FutureProjects} />
          <Route path="/admin" component={Admin} />
          <Route path="/news/:id" component={NewsDetail} />
          <Route path="/news" component={News} />
          <Route path="/contact" component={Contact} />
          <Route path="/careers" component={Careers} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/csr" component={CSR} />
          <Route path="/sustainability" component={Sustainability} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnimatePresence>
          {loading && <PageLoader />}
        </AnimatePresence>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
