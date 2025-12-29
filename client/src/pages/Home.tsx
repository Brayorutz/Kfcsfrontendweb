import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MilkRevealWrapper, MilkWaveDivider } from "@/components/MilkReveal";
import { Section } from "@/components/Section";
import { ArrowRight, Droplets, TrendingUp, Users, ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@assets/generated_images/cinematic_wide_shot_of_a_lush_green_dairy_farm_with_cows_grazing_under_a_bright_sky..png";
import strawberryYoghurt from "@assets/generated_images/strawberry_yoghurt_bottle_professional_product_shot..png";
import vanillaYoghurt from "@assets/generated_images/vanilla_yoghurt_bottle_professional_product_shot..png";
import mangoYoghurt from "@assets/generated_images/mango_yoghurt_bottle_professional_product_shot..png";
import featuredYoghurt from "@assets/1765823555302_1766055490016.jpg";
import dairyFederationLogo from "@assets/generated_images/dairy_federation_partner_logo.png";
import agriculturalCoopLogo from "@assets/generated_images/agricultural_cooperative_logo.png";
import sustainableFarmingLogo from "@assets/generated_images/sustainable_farming_partner_logo.png";
import livestockHealthLogo from "@assets/generated_images/livestock_health_partner_logo.png";
import ruralDevelopmentLogo from "@assets/generated_images/rural_development_partner_logo.png";
import trophyImage from "@assets/IMG_20251219_144012_1766147245755.jpg";
import awardImage1 from "@assets/WhatsApp_Image_2025-12-19_at_20.42.35_1766218730971.jpeg";
import awardImage2 from "@assets/WhatsApp_Image_2025-12-19_at_20.42.36_1766218742963.jpeg";
import kabiFeedsImage from "@assets/Gemini_Generated_Image_ie833sie833sie83_1766219640993.png";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    { image: heroImage, alt: "Kabianga Farm" },
    { image: awardImage1, alt: "Kabianga FCS Receiving Trophy as Best Cooperative in Kenya" },
    { image: awardImage2, alt: "CS Wycliffe Oparanya Visits KFCS Stand at National Awards" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section with Carousel */}
      <div className="relative h-screen min-h-[700px] bg-white overflow-hidden">
        <MilkRevealWrapper>
            <div className="relative w-full h-full flex items-center">
                {/* Carousel Container */}
                <div className="absolute inset-0 z-0">
                  {heroSlides.map((slide, index) => (
                    <motion.img
                      key={index}
                      src={slide.image}
                      alt={slide.alt}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: currentSlide === index ? 1 : 0 }}
                      transition={{ duration: 1 }}
                      className="absolute w-full h-full object-cover brightness-[0.85]"
                    />
                  ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                </div>

                {/* Carousel Navigation Buttons */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
                  data-testid="btn-carousel-prev"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
                  data-testid="btn-carousel-next"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
                      }`}
                      data-testid={`btn-carousel-dot-${index}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                
                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-secondary/90 text-white text-sm font-bold tracking-wide mb-6">
                        ESTABLISHED 1995
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                        Pure Dairy excellence,<br />
                        <span className="text-green-400">Straight from the source.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl leading-relaxed">
                        Empowering farmers and nourishing communities with premium quality dairy products. Join the Kabianga revolution today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/membership" asChild>
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg h-14 px-8 rounded-full">
                                Become a Member
                            </Button>
                        </Link>
                        <Link href="/shop" asChild>
                            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white hover:text-primary text-lg h-14 px-8 rounded-full">
                                Shop Products
                            </Button>
                        </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MilkRevealWrapper>
        
        {/* Wave Divider at bottom of Hero */}
        <div className="absolute bottom-0 w-full z-20">
             <MilkWaveDivider />
        </div>
      </div>

      {/* Stats Section */}
      <Section className="py-12 bg-white -mt-10 relative z-20 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-xl border border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="p-6 text-center">
            <Users className="w-10 h-10 text-secondary mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-primary mb-2">5,000+</h3>
            <p className="text-muted-foreground font-medium">Active Farmers</p>
          </div>
          <div className="p-6 text-center">
            <Droplets className="w-10 h-10 text-secondary mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-primary mb-2">50,000L</h3>
            <p className="text-muted-foreground font-medium">Daily Milk Production</p>
          </div>
          <div className="p-6 text-center">
            <TrendingUp className="w-10 h-10 text-secondary mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-primary mb-2">20%</h3>
            <p className="text-muted-foreground font-medium">Annual Growth</p>
          </div>
        </div>
      </Section>

      {/* Video Section */}
      <Section background="muted">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-serif font-bold text-primary mb-6">Farm to Table Transparency</h2>
          <p className="text-muted-foreground text-lg">
            Witness our commitment to hygiene, quality, and modern processing standards. From the lush pastures of Kericho to your breakfast table.
          </p>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
          {/* Mock Video Placeholder */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center z-10">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[24px] border-l-white border-b-[12px] border-b-transparent ml-2" />
            </div>
          </div>
          <img src={heroImage} className="w-full h-full object-cover" alt="Video thumbnail" />
        </div>
      </Section>

      {/* About Us Section */}
      <Section background="muted" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Who We Are</span>
            <h2 className="text-4xl font-serif font-bold text-primary mb-6">Kabianga Farmers Cooperative</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Founded in 1995, we are a cooperative of over 5,000 farmers dedicated to transforming dairy farming in Kericho. We believe in sustainable practices, fair pricing, and uncompromising quality that empowers our farmers and nourishes our communities.
            </p>
            <Link href="/about" asChild>
              <Button variant="link" className="text-primary text-lg group p-0">
                Learn More About Us <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <img src={heroImage} alt="KFCS Farm" className="w-full h-96 object-cover" />
          </motion.div>
        </div>
      </Section>

      {/* Partners & Recognition Section */}
      <Section background="white" className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          {/* Left: Trophy/Award - Prominent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 flex flex-col items-center justify-center"
          >
            <Link href="/news" asChild>
              <button 
                className="w-full group cursor-pointer"
                data-testid="link-awards-news"
              >
                <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 rounded-3xl p-8 shadow-2xl border border-amber-200 hover:shadow-3xl transition-all hover:scale-105 aspect-square flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <img 
                    src={trophyImage} 
                    alt="Best Cooperative National Award" 
                    className="w-40 h-40 object-contain drop-shadow-lg group-hover:scale-110 transition-transform relative z-10" 
                    data-testid="img-trophy-award"
                  />
                  <div className="relative z-10 text-center">
                    <h3 className="font-serif font-bold text-primary text-lg">Award Winning</h3>
                    <p className="text-sm text-secondary font-medium">Excellence</p>
                  </div>
                </div>
              </button>
            </Link>
          </motion.div>

          {/* Right: Title and Partners Scroll */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Trusted Partners</span>
              <h2 className="text-4xl font-serif font-bold text-primary mb-4">Collaborating for Excellence</h2>
              <p className="text-muted-foreground text-lg">
                We work alongside industry leaders and organizations committed to dairy excellence and sustainable farming.
              </p>
            </div>

            {/* Horizontal Scrolling Partner Logos */}
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 pb-4 min-w-min">
                  {/* Partner Logos */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0 }}
                    className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow w-32 h-32 flex items-center justify-center"
                    data-testid="partner-logo-federation"
                  >
                    <img src={dairyFederationLogo} alt="Dairy Federation Partner" className="w-24 h-24 object-contain" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow w-32 h-32 flex items-center justify-center"
                    data-testid="partner-logo-coop"
                  >
                    <img src={agriculturalCoopLogo} alt="Agricultural Cooperative Partner" className="w-24 h-24 object-contain" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow w-32 h-32 flex items-center justify-center"
                    data-testid="partner-logo-farming"
                  >
                    <img src={sustainableFarmingLogo} alt="Sustainable Farming Partner" className="w-24 h-24 object-contain" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow w-32 h-32 flex items-center justify-center"
                    data-testid="partner-logo-health"
                  >
                    <img src={livestockHealthLogo} alt="Livestock Health Partner" className="w-24 h-24 object-contain" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow w-32 h-32 flex items-center justify-center"
                    data-testid="partner-logo-development"
                  >
                    <img src={ruralDevelopmentLogo} alt="Rural Development Partner" className="w-24 h-24 object-contain" />
                  </motion.div>
                </div>
              </div>
              {/* Gradient fade for scroll indicator */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section background="primary" className="text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Ready to Join the Family?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10">
            Become a member today and enjoy the benefits of a cooperative that truly cares about your growth and prosperity.
          </p>
          <Link href="/membership" asChild>
            <Button size="lg" variant="secondary" className="h-16 px-10 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                Register Now
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}
