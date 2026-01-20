import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MilkRevealWrapper, MilkWaveDivider } from "@/components/MilkReveal";
import { Section } from "@/components/Section";
import { SuccessStory } from "@/components/SuccessStory";
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
import adcLogo from "@assets/1000234948-removebg-preview_1768829249516.png";
import digitLogo from "@assets/1000234949-removebg-preview_1768829249589.png";

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
  { name: "ADC", logo: adcLogo },
  { name: "Digit", logo: digitLogo },
];

import wideAngleFarm from "@assets/wmremove-transformed_1768821427059.jpeg";
import commisionPlate from "@assets/kfcs_commision_plate_1767709504683.jpg";
import farmMachinery from "@assets/kfcs_farm_machinerary_1767709504683.jpg";
import awardImage1 from "@assets/WhatsApp_Image_2025-12-19_at_20.42.35_1766218730971.jpeg";
import awardImage2 from "@assets/WhatsApp_Image_2025-12-19_at_20.42.36_1766218742963.jpeg";
import allProductsHero from "@assets/All_products_Showcase_1767703540586.jpg";
import communityImpact1 from "@assets/wmremove-transformed_(2)_1768828782906.jpeg";
import communityImpact2 from "@assets/wmremove-transformed_(1)_1768828783003.jpeg";

import paulSoiPortrait from "@assets/Paul_Soi,_Director,_Supervisory_1767771550713.png";
import kabiangaMourns from "@assets/kabianga_fcs_mourns_the_death_of_Mr._Paul_Soi_1767771678452.jpg";
import bestCoopAward from "@assets/Kabianga_fcs_wins_best_cooperative_1767771788350.jpeg";
import launchVideo from "@assets/Kabianga_farmers_dairy_cooperative_society_launches_value_addi_1768303223059.mp4";

import yogurtPoster from "@assets/1765823139583_1768829902307.jpg";

import { newsItems } from "@/lib/news-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import freshMilk500ml from "@assets/fresh_milk_500ml_1768464623059.png";
import mursik5l from "@assets/Kabianga_Mursik_5liters_1768464623061.png";
import strawberry250ml from "@assets/kabianga_strawberry_250ml_1768464623062.png";

const previewProducts = [
  {
    id: 1,
    name: "Kabianga Fresh Whole Milk (500ML)",
    image: freshMilk500ml,
  },
  {
    id: 2,
    name: "Kabianga Mursik / Lala (5 Liters)",
    image: mursik5l,
  },
  {
    id: 3,
    name: "Kabianga Strawberry Yoghurt (250ML)",
    image: strawberry250ml,
  },
];

export default function Home() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Record<number, string>>({});

  const handleOrder = (productName: string, id: number) => {
    toast({
      title: "Opening Shop",
      description: `Redirecting to place your order for ${productName}.`,
    });
    // In a real app, this might add to cart, but here we'll just link to shop
    window.location.href = "/shop";
  };
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
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ 
                        opacity: currentSlide === index ? 1 : 0,
                        scale: currentSlide === index ? 1 : 1.1
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-full h-full object-cover brightness-[0.75] contrast-[1.1]"
                      />
                    </motion.div>
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
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
                <div className="absolute bottom-16 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
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
                
                <div className="container mx-auto px-6 relative z-10 py-20 md:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="max-w-4xl mx-auto text-center md:text-left"
                    >
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-block py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-bold tracking-widest mb-6 md:mb-8 uppercase"
                        >
                          Empowering Farmers Since 1964
                        </motion.span>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold text-white mb-6 md:mb-8 leading-tight tracking-tight">
                          Modern Dairy <br className="hidden md:block" />
                          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">Excellence.</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-white/90 mb-8 md:mb-12 max-w-2xl mx-auto md:mx-0 leading-relaxed font-light drop-shadow-md">
                          Join over 6,000 farmers in Kabianga's premier dairy cooperative. We're reshaping the future of agriculture with technology and tradition.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center md:justify-start">
                        <Link href="/membership" asChild>
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg md:text-xl h-14 md:h-16 px-8 md:px-10 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:scale-105 active:scale-95">
                                Join Now
                            </Button>
                        </Link>
                        <Link href="/about" asChild>
                            <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-primary text-lg md:text-xl h-14 md:h-16 px-8 md:px-10 rounded-full transition-all">
                                Our Story
                            </Button>
                        </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MilkRevealWrapper>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-16 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
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

      {/* Success Story Section */}
      <SuccessStory />

      {/* Video Section */}
      <Section background="muted">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-serif font-bold text-primary mb-6">Farm to Table Transparency</h2>
          <p className="text-muted-foreground text-lg">
            Witness our commitment to hygiene, quality, and modern processing standards. From the lush pastures of Kericho to your breakfast table.
          </p>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group">
          <video 
            src={launchVideo} 
            className="w-full h-full object-cover" 
            controls 
            poster={yogurtPoster}
            data-testid="video-farm-transparency"
          >
            Your browser does not support the video tag.
          </video>
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
              Founded in 1964 and registered with the Ministry of Cooperatives and Social Services, we are a cooperative of over 6,000 farmers dedicated to transforming dairy farming in Kericho. We believe in sustainable practices, fair pricing, and uncompromising quality that empowers our farmers and nourishes our communities.
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

      {/* Community Impact Section */}
      <Section className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="rounded-2xl overflow-hidden shadow-xl mt-8"
              >
                <img src={communityImpact1} alt="Boda Boda Milk Transport" className="w-full h-80 object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl overflow-hidden shadow-xl"
              >
                <img src={communityImpact2} alt="Milk Collection" className="w-full h-80 object-cover" />
              </motion.div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary text-white p-8 rounded-2xl shadow-2xl z-10 hidden md:block max-w-xs">
              <p className="font-bold text-2xl mb-2">Creating Jobs</p>
              <p className="text-white/80 text-sm">Empowering local youth through our milk transportation network.</p>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-4 block">Community Impact</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 leading-tight">
              Beyond Dairy: <br />
              <span className="text-secondary">Empowering Local Youth</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Kabianga Farmers Cooperative Society Limited has extended its impact beyond the farm gate by creating sustainable employment for local boda boda riders.
              </p>
              <p>
                These dedicated transporters navigate the remotest parts of our region, ensuring that every drop of milk from our 6,000+ members reaches our processing facility in its freshest state.
              </p>
              <p>
                By integrating local youth into our supply chain, we are not just collecting milk; we are building livelihoods and strengthening the economic fabric of Kericho County.
              </p>
            </div>
            <Link href="/membership" asChild>
              <Button className="mt-10 bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-14 text-lg">
                Join Our Success Story
              </Button>
            </Link>
          </div>
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

      {/* News Section */}
      <Section className="py-20 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">Latest News & Updates</h2>
            <p className="text-muted-foreground text-lg">Stay updated with the latest happenings at Kabianga Farmers Cooperative Society.</p>
          </div>
          <Link href="/news">
            <Button variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5 px-8 h-12" data-testid="link-all-news">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {newsItems.slice(0, 4).map((item) => (
            <motion.div
              key={item.id}
              initial={ { opacity: 0, y: 20 } }
              whileInView={ { opacity: 1, y: 0 } }
              viewport={ { once: true } }
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-100 hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-semibold text-primary">
                  {item.date}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {item.excerpt}
                </p>
                <div className="mt-auto">
                  <Link href={`/news/${item.id}`}>
                    <Button variant="link" className="p-0 text-pink-600 hover:text-pink-700 font-semibold group/link" data-testid={`link-news-${item.id}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Shop Preview Section */}
      <Section background="muted" className="py-20 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
          <div className="max-w-2xl">
            <span className="text-secondary font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">Our Shop</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">Fresh from the Farm</h2>
            <p className="text-muted-foreground text-lg">Order our premium dairy products directly to your doorstep. Pure, fresh, and nutritious.</p>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5 px-8 h-12">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden bg-white border-border/50 hover:shadow-lg transition-all">
              <div className="aspect-square overflow-hidden relative group">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-primary line-clamp-1">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>Order Notes</span>
                  </div>
                  <Textarea 
                    placeholder="Any special instructions?" 
                    className="resize-none h-20 bg-muted/30 border-muted focus-visible:ring-secondary"
                    value={notes[product.id] || ""}
                    onChange={(e) => setNotes(prev => ({ ...prev, [product.id]: e.target.value }))}
                  />
                </div>

                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12 rounded-xl group"
                  onClick={() => handleOrder(product.name, product.id)}
                >
                  Order Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
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
