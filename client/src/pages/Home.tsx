import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MilkRevealWrapper, MilkWaveDivider } from "@/components/MilkReveal";
import { Section } from "@/components/Section";
import { ArrowRight, Droplets, TrendingUp, Users } from "lucide-react";
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
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[700px] bg-white">
        <MilkRevealWrapper>
            <div className="relative w-full h-full flex items-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="Kabianga Farm"
                        className="w-full h-full object-cover brightness-[0.85]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
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

      {/* Featured Product */}
      <Section background="muted">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="flex items-center justify-center">
            <img src={featuredYoghurt} alt="Woman enjoying Kabianga Strawberry Yoghurt" className="rounded-2xl shadow-2xl max-w-md w-full" data-testid="img-featured-yoghurt" />
          </div>
          <div>
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Featured</span>
            <h2 className="text-4xl font-serif font-bold text-primary mb-6">Kabianga Strawberry Delight</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Experience the joy of pure, creamy yoghurt infused with real strawberry chunks. Every spoonful is a celebration of taste, quality, and the passion we bring to dairy excellence.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-foreground">100% natural strawberry flavor</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-foreground">Rich, creamy texture with real fruit chunks</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-foreground">No artificial additives or preservatives</span>
              </li>
            </ul>
            <Link href="/shop" asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* Product Highlights */}
      <Section>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Our Products</span>
            <h2 className="text-4xl font-serif font-bold text-primary">Taste the Freshness</h2>
          </div>
          <Link href="/shop" asChild>
            <Button variant="link" className="text-primary text-lg group">
              View All Products <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-secondary/5 rounded-3xl p-8 hover:bg-secondary/10 transition-colors">
            <img src={strawberryYoghurt} alt="Strawberry" className="w-full h-64 object-contain mix-blend-multiply mb-6 group-hover:scale-105 transition-transform duration-500" />
            <h3 className="text-2xl font-serif font-bold mb-2">Strawberry Delight</h3>
            <p className="text-muted-foreground mb-6">Rich, creamy yoghurt infused with real strawberry chunks.</p>
            <span className="text-lg font-bold text-secondary">KES 150</span>
          </div>
          <div className="group relative bg-amber-50 rounded-3xl p-8 hover:bg-amber-100 transition-colors">
            <img src={vanillaYoghurt} alt="Vanilla" className="w-full h-64 object-contain mix-blend-multiply mb-6 group-hover:scale-105 transition-transform duration-500" />
            <h3 className="text-2xl font-serif font-bold mb-2">Classic Vanilla</h3>
            <p className="text-muted-foreground mb-6">Smooth, timeless vanilla flavor made with premium beans.</p>
            <span className="text-lg font-bold text-secondary">KES 150</span>
          </div>
          <div className="group relative bg-orange-50 rounded-3xl p-8 hover:bg-orange-100 transition-colors">
            <img src={mangoYoghurt} alt="Mango" className="w-full h-64 object-contain mix-blend-multiply mb-6 group-hover:scale-105 transition-transform duration-500" />
            <h3 className="text-2xl font-serif font-bold mb-2">Tropical Mango</h3>
            <p className="text-muted-foreground mb-6">A burst of tropical sunshine in every spoonful.</p>
            <span className="text-lg font-bold text-secondary">KES 150</span>
          </div>
        </div>
      </Section>

      {/* Partners & Recognition Section */}
      <Section background="white" className="py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Trusted Partners</span>
          <h2 className="text-4xl font-serif font-bold text-primary mb-6">Collaborating for Excellence</h2>
          <p className="text-muted-foreground text-lg">
            We work alongside industry leaders and organizations committed to dairy excellence and sustainable farming.
          </p>
        </div>

        {/* Horizontal Scrolling Partners and Trophy */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4 min-w-min px-4 md:px-0">
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

              {/* Trophy - Award Recognition */}
              <Link href="/news" asChild>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex-shrink-0 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 shadow-lg border border-border/50 hover:shadow-2xl transition-all hover:scale-105 w-40 h-40 flex flex-col items-center justify-center gap-2 cursor-pointer group"
                  data-testid="link-awards-news"
                >
                  <img 
                    src={trophyImage} 
                    alt="Best Cooperative National Award" 
                    className="w-32 h-32 object-cover rounded-lg group-hover:scale-110 transition-transform" 
                  />
                  <span className="text-xs font-bold text-primary text-center leading-tight">Award Winning Excellence</span>
                </motion.button>
              </Link>
            </div>
          </div>
          {/* Gradient fade for scroll indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
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
