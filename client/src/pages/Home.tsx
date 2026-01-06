import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MilkRevealWrapper, MilkWaveDivider } from "@/components/MilkReveal";
import { Section } from "@/components/Section";
import { ArrowRight, Droplets, TrendingUp, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import trophyImage from "@assets/IMG_20251219_144012_1766147245755.jpg";

import asdspLogo from "@assets/asdsp_logo_1767426427547.png";
import chaiSaccoLogo from "@assets/chaisacco_logo_1767426427549.jpg";
import coopersLogo from "@assets/coopers_logo_1767426427551.png";
import imarishaSaccoLogo from "@assets/imarishasacco_logo_1767426427611.png";
import kdbLogo from "@assets/kdb_logo_1767426427631.png";
import kenyaHighlandsLogo from "@assets/kenyahighlandssacco_logo_1767426427721.png";
import marvelFeedsLogo from "@assets/marvel_feeds_1767426427724.png";
import navcdpLogo from "@assets/navcdp_logo_1767426427726.jpg";
import ndegeChaiLogo from "@assets/ndegechai_logo_1767426427727.jpg";
import newKccLogo from "@assets/newkcc_logo_1767426427729.jpg";
import patnasSaccoLogo from "@assets/patnas_sacco_1767426427730.jpg";
import promacoLogo from "@assets/promaco_logo_1767426427732.png";

const partners = [
  { name: "ASDSP", logo: asdspLogo },
  { name: "Chai Sacco", logo: chaiSaccoLogo },
  { name: "Cooper K-Brands", logo: coopersLogo },
  { name: "Imarisha Sacco", logo: imarishaSaccoLogo },
  { name: "Kenya Dairy Board", logo: kdbLogo },
  { name: "Kenya Highlands Sacco", logo: kenyaHighlandsLogo },
  { name: "Marvel Feeds", logo: marvelFeedsLogo },
  { name: "NAVCDP", logo: navcdpLogo },
  { name: "Ndege Chai Sacco", logo: ndegeChaiLogo },
  { name: "New KCC", logo: newKccLogo },
  { name: "Patnas Sacco", logo: patnasSaccoLogo },
  { name: "Promaco", logo: promacoLogo },
];

import wideAngleFarm from "@assets/wide_angle_shot_of_kfcs_1767709504687.jpg";
import commisionPlate from "@assets/kfcs_commision_plate_1767709504683.jpg";
import farmMachinery from "@assets/kfcs_farm_machinerary_1767709504683.jpg";
import awardImage1 from "@assets/WhatsApp_Image_2025-12-19_at_20.42.35_1766218730971.jpeg";
import awardImage2 from "@assets/WhatsApp_Image_2025-12-19_at_20.42.36_1766218742963.jpeg";
import allProductsHero from "@assets/All_products_Showcase_1767703540586.jpg";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    { image: wideAngleFarm, alt: "Wide angle view of KFCS Farm" },
    { image: allProductsHero, alt: "Kabianga Products Showcase" },
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
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="max-w-4xl"
                    >
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-block py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold tracking-widest mb-8 uppercase"
                        >
                          Empowering Farmers Since 1964
                        </motion.span>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight">
                          Modern Dairy <br />
                          <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">Excellence.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl leading-relaxed font-light">
                          Join over 5,000 farmers in Kabianga's premier dairy cooperative. We're reshaping the future of agriculture with technology and tradition.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                        <Link href="/membership" asChild>
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-xl h-16 px-10 rounded-full shadow-2xl shadow-primary/20 transition-all hover:scale-105">
                                Join the Movement
                            </Button>
                        </Link>
                        <Link href="/about" asChild>
                            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-primary text-xl h-16 px-10 rounded-full transition-all">
                                Discover Our Story
                            </Button>
                        </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MilkRevealWrapper>
        
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
          <img src={farmMachinery} className="w-full h-full object-cover" alt="Video thumbnail" />
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
              Founded in 1964 and registered with the Ministry of Cooperatives and Social Services, we are a cooperative of over 5,000 farmers dedicated to transforming dairy farming in Kericho. We believe in sustainable practices, fair pricing, and uncompromising quality that empowers our farmers and nourishes our communities.
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
            <img src={wideAngleFarm} alt="KFCS Farm" className="w-full h-96 object-cover" />
          </motion.div>
        </div>
      </Section>

      {/* Partners Carousel Section */}
      <Section background="white" className="py-12 border-y border-border/50">
        <div className="text-center mb-12">
          <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">Collaborating for Excellence</span>
          <h2 className="text-3xl font-serif font-bold text-primary">Our Trusted Partners</h2>
        </div>
        
        <div className="relative overflow-hidden w-full group">
          <motion.div 
            className="flex gap-12 items-center whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-40 h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
            ))}
          </motion.div>
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
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
