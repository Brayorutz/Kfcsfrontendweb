import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, Info, Users, LayoutGrid,
  ShoppingCart, Shield, ArrowUpRight, Phone, Mail,
  Leaf, Trophy, BookOpen, Cpu, FolderDown, Rocket,
  Newspaper, Image as GalleryIcon, Briefcase, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import kfcsLogo from "@assets/image_20251218_135629_0000_1766055489904.png";

const navItems = [
  {
    label: "About Us",
    icon: Info,
    color: "from-emerald-500 to-green-600",
    links: [
      { name: "Who We Are", path: "/about", icon: Leaf, desc: "Our history, mission and vision since 1964." },
      { name: "Board of Directors", path: "/about/board", icon: Users, desc: "The leadership driving our cooperative." },
      { name: "Our Awards", path: "/about/awards", icon: Trophy, desc: "National recognition for dairy excellence." },
    ],
  },
  {
    label: "Farmers",
    icon: Users,
    color: "from-green-500 to-teal-600",
    links: [
      { name: "Membership", path: "/membership", icon: BookOpen, desc: "Join our 6,000+ farmer community." },
      { name: "Production", path: "/production", icon: Cpu, desc: "Modern dairy processing standards." },
{ name: "Downloads", path: "/downloads", icon: FolderDown, desc: "Forms, reports and key documents." },
      { name: "Future Projects", path: "/future-projects", icon: Rocket, desc: "Upcoming supply chain innovations." },
    ],
  },
  {
    label: "Explore",
    icon: LayoutGrid,
    color: "from-teal-500 to-cyan-600",
    links: [
      { name: "News & Updates", path: "/news", icon: Newspaper, desc: "Stay updated with what's happening." },
      { name: "Gallery", path: "/gallery", icon: GalleryIcon, desc: "A visual journey through our farms." },
      { name: "Careers", path: "/careers", icon: Briefcase, desc: "Join our growing team." },
      { name: "Contact", path: "/contact", icon: MessageSquare, desc: "Get in touch with our team." },
    ],
  },
];

function DropdownMenu({ item, isOpen }: { item: typeof navItems[0]; isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden z-50"
        >
          <div className={cn("h-1 w-full bg-gradient-to-r", item.color)} />
          <div className="p-2">
            {item.links.map((link) => (
              <Link key={link.path} href={link.path}>
                <div className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 mt-0.5", item.color)}>
                    <link.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors leading-none mb-1">{link.name}</p>
                    <p className="text-xs text-gray-400 leading-snug">{link.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-white/90 text-xs py-1.5 px-4 flex items-center justify-between">
        <span className="font-medium tracking-wide hidden sm:block">Kabianga Farmers Cooperative Society Limited</span>
        <span className="sm:hidden font-medium">KFCS</span>
        <div className="flex items-center gap-4">
          <a href="tel:+254000000000" className="flex items-center gap-1 hover:text-white transition-colors">
0743719091
          </a>
          <a href="mailto:info@kabiangafcs.co.ke" className="items-center gap-1 hover:text-white transition-colors hidden md:flex">
            <Mail className="w-3 h-3" /> info@kabiangafcs.co.ke
          </a>
        </div>
      </div>

      {/* Main navbar */}
      <motion.nav
        ref={navRef}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed left-0 right-0 z-40 transition-all duration-300",
          "top-[30px]",
          scrolled
            ? "bg-white shadow-lg shadow-black/5 border-b border-gray-100"
            : "bg-white/95 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all" />
              <img
                src={kfcsLogo}
                alt="KFCS"
                className="relative h-10 w-10 rounded-xl object-cover"
                data-testid="logo-kfcs"
              />
            </div>
            <div>
              <div className="text-base font-black text-primary leading-none tracking-tight">KFCS</div>
              <div className="text-[10px] text-secondary font-bold uppercase tracking-[0.15em] leading-none mt-0.5">Kabianga</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/">
              <div className={cn(
                "relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer",
                location === "/" ? "text-primary bg-primary/8" : "text-gray-600 hover:text-primary hover:bg-gray-50"
              )}>
                Home
                {location === "/" && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                )}
              </div>
            </Link>

            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                    activeDropdown === item.label
                      ? "text-primary bg-primary/8"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  )}
                >
                  {item.label}
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    activeDropdown === item.label && "rotate-180"
                  )} />
                </button>
                <DropdownMenu item={item} isOpen={activeDropdown === item.label} />
              </div>
            ))}

            <Link href="/shop">
              <div className={cn(
                "relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5",
                location === "/shop" ? "text-primary bg-primary/8" : "text-gray-600 hover:text-primary hover:bg-gray-50"
              )}>
                <ShoppingCart className="w-3.5 h-3.5" />
                Shop
              </div>
            </Link>

            <Link href="/directors-portal">
              <div className={cn(
                "relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5",
                location === "/directors-portal" ? "text-primary bg-primary/8" : "text-gray-600 hover:text-primary hover:bg-gray-50"
              )}>
                <Shield className="w-3.5 h-3.5" />
                Directors
              </div>
            </Link>
          </div>

          {/* Right side CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.getfarmer.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-primary hover:bg-gray-50 transition-all border border-gray-200 hover:border-primary/30"
            >
              <img src="https://img.icons8.com/color/48/google-play.png" className="w-4 h-4" alt="Play Store" />
              Get App
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <Link href="/membership">
              <div className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/25 cursor-pointer">
                Join Now
              </div>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all active:scale-90"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
              style={{ top: "30px" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 z-40 w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col overflow-y-auto"
              style={{ top: "30px", bottom: 0 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <img src={kfcsLogo} alt="KFCS" className="h-8 w-8 rounded-lg" />
                  <span className="font-black text-primary">KFCS</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 px-4 py-4 space-y-1">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer",
                    location === "/" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"
                  )}>
                    Home
                  </div>
                </Link>

                {navItems.map((item) => (
                  <div key={item.label}>
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest mt-4 mb-1",
                      "text-gray-400"
                    )}>
                      <item.icon className="w-3.5 h-3.5" />
                      {item.label}
                    </div>
                    {item.links.map((link) => (
                      <Link key={link.path} href={link.path} onClick={() => setMobileOpen(false)}>
                        <div className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                          location === link.path ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}>
                          <div className={cn("w-6 h-6 rounded-md bg-gradient-to-br flex items-center justify-center flex-shrink-0", item.color)}>
                            <link.icon className="w-3 h-3 text-white" />
                          </div>
                          {link.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}

                <div className="h-px bg-gray-100 my-3" />

                <Link href="/shop" onClick={() => setMobileOpen(false)}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer",
                    location === "/shop" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"
                  )}>
                    <ShoppingCart className="w-4 h-4" />
                    Shop Our Products
                  </div>
                </Link>

                <Link href="/directors-portal" onClick={() => setMobileOpen(false)}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer",
                    location === "/directors-portal" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"
                  )}>
                    <Shield className="w-4 h-4" />
                    Directors Portal
                  </div>
                </Link>
              </div>

              {/* Drawer footer */}
              <div className="px-4 py-5 border-t border-gray-100 space-y-3">
                <Link href="/membership" onClick={() => setMobileOpen(false)}>
                  <div className="w-full py-3 bg-primary text-white text-center text-sm font-bold rounded-xl shadow-md shadow-primary/25 cursor-pointer hover:bg-primary/90 transition-colors">
                    Become a Member
                  </div>
                </Link>
                <a
                  href="https://play.google.com/store/apps/details?id=com.getfarmer.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <img src="https://img.icons8.com/color/48/google-play.png" className="w-5 h-5" alt="Play Store" />
                  Download Farmer App
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
