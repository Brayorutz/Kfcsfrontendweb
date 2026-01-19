import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import kfcsLogo from "@assets/image_20251218_135629_0000_1766055489904.png";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about", submenu: [
    { name: "Our Awards", path: "/about/awards" },
    { name: "Board of Directors", path: "/about/board" }
  ] },
  { name: "Production", path: "/production" },
  { name: "Future Projects", path: "/future-projects" },
  { name: "Gallery", path: "/gallery" },
  { name: "Shop", path: "/shop" },
  { name: "Membership", path: "/membership" },
  { name: "Downloads", path: "/downloads" },
  { name: "Careers", path: "/careers" },
  { name: "News", path: "/news" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={kfcsLogo} alt="KFCS Logo" className="h-10 w-10 md:h-12 md:w-12" data-testid="logo-kfcs" />
          <span className={cn(
            "text-lg font-bold transition-colors",
            scrolled ? "text-primary" : "text-white"
          )}>KFCS</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navItems.map((item) => (
            <div key={item.path} className="relative group">
              <Link 
                href={item.path}
                className={cn(
                  "text-sm font-semibold transition-colors flex items-center gap-1 px-2 py-1 rounded-md",
                  location === item.path 
                    ? "text-secondary" 
                    : scrolled ? "text-foreground/80 hover:text-secondary hover:bg-secondary/5" : "text-white/90 hover:text-white hover:bg-white/10"
                )}
              >
                {item.name}
                {item.submenu && <ChevronDown className="w-4 h-4" />}
              </Link>
              {item.submenu && (
                <div className="absolute left-0 mt-0 w-48 bg-white border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.path}
                      href={subitem.path}
                      className="block px-4 py-2 text-sm hover:bg-secondary/10 hover:text-secondary first:rounded-t-lg last:rounded-b-lg"
                    >
                      {subitem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <a href="https://play.google.com/store/apps/details?id=com.getfarmer.app" target="_blank" rel="noopener noreferrer" className={cn(
            "gap-2 hover:text-secondary flex items-center text-sm font-semibold transition-colors",
            scrolled ? "text-secondary" : "text-white"
          )}>
            <img src="https://img.icons8.com/color/48/google-play.png" className="w-4 h-4" alt="Play Store" />
            Get App
          </a>
          <Link href="/membership" asChild>
            <Button className={cn(
              "rounded-full px-6 font-bold transition-all shadow-md hover:shadow-lg",
              scrolled 
                ? "bg-primary hover:bg-primary/90 text-white" 
                : "bg-white text-primary hover:bg-white/90"
            )}>
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "lg:hidden p-2 rounded-lg transition-colors",
            scrolled ? "text-foreground hover:bg-gray-100" : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col space-y-4">
              {navItems.map((item) => (
                <div key={item.path}>
                  <Link 
                    href={item.path}
                    className="text-lg font-serif font-medium text-foreground hover:text-secondary block"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          href={subitem.path}
                          className="text-sm text-muted-foreground hover:text-secondary block"
                          onClick={() => setIsOpen(false)}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                <Link href="/membership" asChild>
                  <Button className="w-full bg-primary text-white">
                    Become a Member
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
