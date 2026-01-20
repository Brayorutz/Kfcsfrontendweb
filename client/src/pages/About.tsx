import { Section } from "@/components/Section";
import { Users, Target, Heart, Award, ArrowRight, Truck, Microscope, FlaskConical, Store, Tractor, Headphones, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import aboutImage from "@assets/wmremove-transformed_1768821427059.jpeg";
import firstCheque from "@assets/First_Ever_Cheque_from_KCC_to_renove_the_KFCS_STRUCTURES_1768907511522.jpg";
import oldBoardroom from "@assets/tHIS_IS_WHAT_USED_TO_BE_THE_BOARDROOM_IT_WAS_DONE_OUTSIDE_1768907511523.jpg";
import beforeRenovation from "@assets/VIEW_OF_KFCS_BEFORE_RENOVATION_1768907511523.jpg";
import trophyImage from "@assets/IMG_20251219_144012_1766147245755.jpg";
import wideAngleFarm from "@assets/wide_angle_shot_of_kfcs_1767709504687.jpg";
import farmMachinery from "@assets/kfcs_farm_machinerary_1767709504683.jpg";

export default function About() {
  return (
    <div className="pt-20">
      <div className="bg-primary py-20 md:py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
             <img src={aboutImage} className="w-full h-full object-cover grayscale" alt="Background" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Our Story</h1>
            <p className="text-xl max-w-2xl mx-auto text-primary-foreground/90">
            Rooted in Kabianga, growing for Kenya. We are more than just a cooperative; we are a community movement.
            </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">About Us</span>
            <h2 className="text-4xl font-serif font-bold text-primary mb-6">A Legacy of Excellence</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Kabianga Farmers Cooperative Society Limited (KFCS) was registered in 1964 with the Ministry of Cooperatives and Social Services. We started with dedicated farmers united by a single vision: to transform the dairy landscape in Kericho.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Today, we serve over 5,000 active members, process thousands of liters of milk daily, and produce award-winning dairy products that grace tables across the region. We believe in sustainable farming, fair prices for our farmers, and uncompromising quality for our consumers.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img src={aboutImage} alt="KFCS Facility" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-xl shadow-xl max-w-xs hidden md:block border border-border">
              <p className="font-serif italic text-xl text-primary mb-4">"Our strength lies in our unity and our shared commitment to quality."</p>
              <p className="font-bold text-sm text-foreground">- Chairman</p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <Store className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">Farm Inputs & Rationed Meal</h3>
            <p className="text-muted-foreground">The society stocks and supplies farmers with farm inputs on credit, as well as producing its own high-quality rationed dairy meal.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <Microscope className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">Artificial Insemination</h3>
            <p className="text-muted-foreground">We provide professional artificial insemination services to help farmers improve their livestock breeds and enhance productivity.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <Truck className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">Milk Collection & Marketing</h3>
            <p className="text-muted-foreground">Collecting and marketing milk on behalf of our farmers, handling both raw and processed milk to ensure the best market reach.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <Users className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">Training & Capacity Building</h3>
            <p className="text-muted-foreground">We organize regular farmer and management training sessions to keep our community updated on modern agricultural best practices.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <BarChart3 className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">Financial Support (Loans)</h3>
            <p className="text-muted-foreground">Providing essential financial services including loans to farmers to support their operational needs and expansion projects.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <Tractor className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">Silage & Ploughing Services</h3>
            <p className="text-muted-foreground">We provide professional silage making and ploughing services to our members to ensure high-quality feed and land preparation.</p>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center">Our Departments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <Truck className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">1. Milk Collection & Transport</h3>
            <p className="text-muted-foreground">Efficiently coordinating the collection of high-quality milk from our member farmers and ensuring safe, timely transport to our processing facilities.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <Microscope className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">2. Reception, Grading, Bulking & Chilling</h3>
            <p className="text-muted-foreground">Rigorous quality testing and grading upon reception, followed by professional bulking and immediate chilling to maintain maximum freshness.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <FlaskConical className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">3. Milk Value Addition</h3>
            <p className="text-muted-foreground">Transforming raw milk into premium products including Fresh Milk, traditional Mursik, and specialized Chilling services for diverse market needs.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <Store className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">4. Agrovet & Stores</h3>
            <p className="text-muted-foreground">Providing essential farming inputs, high-quality animal feeds, and veterinary supplies through our well-stocked stores at competitive prices.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <Tractor className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">5. Extension Services</h3>
            <p className="text-muted-foreground">Comprehensive support including Artificial Insemination (AI) and Tractor services for professional ploughing and high-quality silage making.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
            <Headphones className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">6. Office & Customer Service</h3>
            <p className="text-muted-foreground">Dedicated administrative support and responsive customer service to address member inquiries and ensure smooth cooperative operations.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-all lg:col-span-3 lg:max-w-md lg:mx-auto lg:w-full">
            <BarChart3 className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">7. Marketing & Distribution</h3>
            <p className="text-muted-foreground">Strategically connecting our dairy products to markets across the region through a robust distribution network and active brand promotion.</p>
          </div>
        </div>
      </Section>

      <Section background="muted">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Target className="w-12 h-12 text-secondary mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground">To empower dairy farmers through reliable market access, value addition, and sustainable practices.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Heart className="w-12 h-12 text-secondary mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">Our Vision</h3>
            <p className="text-muted-foreground">To be the premier dairy cooperative in the region, known for quality products and farmer prosperity.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Award className="w-12 h-12 text-secondary mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-4">Our Values</h3>
            <p className="text-muted-foreground">Integrity, Transparency, Quality, Innovation, and Community Focus.</p>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-primary mb-8">National Recognition</h2>
          <div className="flex justify-center">
            <img src={trophyImage} alt="Best Cooperative National Award" className="rounded-xl shadow-2xl max-w-md w-full" data-testid="img-trophy-award" />
          </div>
          <p className="text-muted-foreground mt-6 font-medium">Recognized as Best Cooperative at the National Level</p>
        </div>

        <div>
          <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Our History</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                <img src={beforeRenovation} alt="KFCS Before Renovation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">Humble Beginnings</h3>
                <p className="text-muted-foreground">Original structures of KFCS before the modern renovations that transformed our capacity.</p>
              </div>
            </div>
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                <img src={oldBoardroom} alt="Old Outdoor Boardroom" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">Outdoor Meetings</h3>
                <p className="text-muted-foreground">Our former "boardroom" where critical decisions were made outdoors, showing our resilience.</p>
              </div>
            </div>
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                <img src={firstCheque} alt="First KCC Cheque" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">Historic Support</h3>
                <p className="text-muted-foreground">The first-ever cheque from KCC used to renovate the KFCS structures and pave way for growth.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section background="muted" className="text-center">
        <h2 className="text-4xl font-serif font-bold text-primary mb-6">Board of Directors</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          Our experienced Board of Directors provides strategic leadership and ensures transparent governance aligned with our mission to serve farmers and communities.
        </p>
        <Link href="/about/awards" asChild>
          <Button size="lg" variant="outline" className="rounded-full px-8 ml-4">
            View Our Awards <Award className="ml-2 w-4 h-4" />
          </Button>
        </Link>
        <Link href="/about/board" asChild>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
            View Full Board <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </Section>
    </div>
  );
}
