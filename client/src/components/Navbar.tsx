import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import kfcsLogo from "@assets/image_20251218_135629_0000_1766055489904.png";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about", submenu: [{ name: "Board of Directors", path: "/about/board" }] },
  { name: "Production", path: "/production" },
  { name: "Future Projects", path: "/future-projects" },
  { name: "Gallery", path: "/gallery" },
  { name: "Investors", path: "/investors" },
  { name: "Shop", path: "/shop" },
  { name: "Membership", path: "/membership" },
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
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-white/80 backdrop-blur-sm py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={kfcsLogo} alt="KFCS Logo" className="h-12 w-12" data-testid="logo-kfcs" />
          <span className="text-lg font-bold text-primary hidden sm:inline">KFCS</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <div key={item.path} className="relative group">
              <Link 
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-secondary flex items-center gap-1",
                  location === item.path ? "text-secondary font-bold" : "text-foreground/80"
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
          <Link href="https://play.google.com/store/apps/details?id=com.getfarmer.app" target="_blank" asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-secondary/80">
              <img src="https://img.icons8.com/color/48/google-play.png" className="w-4 h-4" alt="Play Store" />
              Get Farmer App
            </Button>
          </Link>
          <Link href="/membership" asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
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
