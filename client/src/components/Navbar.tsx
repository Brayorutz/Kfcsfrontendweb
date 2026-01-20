import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, Info, Users, FlaskConical, Tractor, Image as ImageIcon, ShoppingCart, Download, Briefcase, Newspaper, Mail, LayoutGrid, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import kfcsLogo from "@assets/image_20251218_135629_0000_1766055489904.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const categories = [
  {
    name: "About Us",
    icon: Info,
    items: [
      { name: "Who We Are", path: "/about", description: "Our history, mission and vision since 1964." },
      { name: "Board of Directors", path: "/about/board", description: "The leadership driving our cooperative forward." },
      { name: "Our Awards", path: "/about/awards", description: "National recognition for excellence in dairy." },
    ]
  },
  {
    name: "Farmers",
    icon: Users,
    items: [
      { name: "Membership", path: "/membership", description: "Join our community of over 6,000 farmers." },
      { name: "Production", path: "/production", description: "Explore our modern dairy processing standards." },
      { name: "Downloads", path: "/downloads", description: "Access forms, reports and essential documents." },
      { name: "Future Projects", path: "/future-projects", description: "Upcoming innovations in our supply chain." },
    ]
  },
  {
    name: "Explore",
    icon: LayoutGrid,
    items: [
      { name: "News & Updates", path: "/news", description: "Stay updated with the latest happenings." },
      { name: "Gallery", path: "/gallery", description: "Visual journey through our farms and facilities." },
      { name: "Careers", path: "/careers", description: "Join our team and grow with us." },
      { name: "Contact", path: "/contact", description: "Get in touch with our support team." },
    ]
  }
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-lg">
            <img src={kfcsLogo} alt="KFCS Logo" className="h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110" data-testid="logo-kfcs" />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "text-lg md:text-xl font-serif font-bold leading-none tracking-tight transition-colors",
              scrolled ? "text-primary" : "text-white"
            )}>KFCS</span>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
              scrolled ? "text-secondary" : "text-white/80"
            )}>Kabianga</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-white/10 focus:bg-white/10",
                    location === "/" ? "text-secondary font-bold" : scrolled ? "text-primary" : "text-white"
                  )}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {categories.map((category) => (
                <NavigationMenuItem key={category.name}>
                  <NavigationMenuTrigger className={cn(
                    "bg-transparent hover:bg-white/10 focus:bg-white/10 transition-colors",
                    scrolled ? "text-primary" : "text-white"
                  )}>
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white">
                      {category.items.map((item) => (
                        <li key={item.path}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.path}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary/5 hover:text-secondary focus:bg-secondary/5 focus:text-secondary group",
                                location === item.path && "bg-secondary/10 text-secondary"
                              )}
                            >
                              <div className="text-sm font-bold leading-none flex items-center gap-2">
                                {item.name}
                                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                              </div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-secondary/80">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <Link href="/shop">
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-white/10 focus:bg-white/10",
                    location === "/shop" ? "text-secondary font-bold" : scrolled ? "text-primary" : "text-white"
                  )}>
                    Shop
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a 
            href="https://play.google.com/store/apps/details?id=com.getfarmer.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
              scrolled 
                ? "text-primary border-primary/20 hover:bg-primary/5" 
                : "text-white border-white/20 hover:bg-white/10"
            )}
          >
            <img src="https://img.icons8.com/color/48/google-play.png" className="w-4 h-4" alt="Play Store" />
            Get App
          </a>
          <Link href="/membership" asChild>
            <Button className={cn(
              "rounded-full px-6 font-bold transition-all shadow-md hover:shadow-lg active:scale-95 hover-elevate",
              scrolled 
                ? "bg-primary text-white" 
                : "bg-white text-primary"
            )}>
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "lg:hidden p-2 rounded-xl transition-all active:scale-90",
            scrolled ? "text-primary hover:bg-primary/5" : "text-white hover:bg-white/10"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[60px] lg:hidden bg-white/98 backdrop-blur-xl z-[49] border-t border-border/50"
          >
            <div className="container mx-auto px-6 py-8 h-full overflow-y-auto flex flex-col">
              <div className="space-y-8 flex-grow">
                {categories.map((category) => (
                  <div key={category.name} className="space-y-4">
                    <div className="flex items-center gap-2 text-secondary font-bold tracking-widest uppercase text-xs">
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </div>
                    <div className="grid grid-cols-1 gap-2 pl-6">
                      {category.items.map((item) => (
                        <Link 
                          key={item.path}
                          href={item.path}
                          className={cn(
                            "py-2 text-lg font-serif transition-colors",
                            location === item.path ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 space-y-4 border-t border-border/50">
                   <Link href="/shop" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-xl font-serif text-primary">
                    <ShoppingCart className="w-5 h-5 text-secondary" />
                    Shop Our Products
                   </Link>
                   <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-xl font-serif text-primary">
                    Home
                   </Link>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <Link href="/membership" asChild>
                  <Button className="w-full bg-primary text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
                    Become a Member
                  </Button>
                </Link>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.getfarmer.app" 
                  className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl border-2 border-border font-bold text-muted-foreground hover:bg-muted transition-colors"
                >
                  <img src="https://img.icons8.com/color/48/google-play.png" className="w-6 h-6" alt="Play Store" />
                  Download Farmer App
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
