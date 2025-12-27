import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import About from "@/pages/About";
import BoardOfDirectors from "@/pages/BoardOfDirectors";
import Production from "@/pages/Production";
import Shop from "@/pages/Shop";
import Investors from "@/pages/Investors";
import Membership from "@/pages/Membership";
import Portal from "@/pages/Portal";
import Admin from "@/pages/Admin";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import CSR from "@/pages/CSR";
import Sustainability from "@/pages/Sustainability";
import { useEffect } from "react";
import { useLocation } from "wouter";

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
          <Route path="/shop" component={Shop} />
          <Route path="/investors" component={Investors} />
          <Route path="/membership" component={Membership} />
          <Route path="/portal" component={Portal} />
          <Route path="/admin" component={Admin} />
          <Route path="/news/:id" component={NewsDetail} />
          <Route path="/news" component={News} />
          <Route path="/contact" component={Contact} />
          <Route path="/careers" component={Careers} />
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
