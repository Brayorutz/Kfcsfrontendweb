import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { Link } from "wouter";
import { ArrowRight, Users, Droplets, TrendingUp, Store, HeartPulse } from "lucide-react";

export function SuccessStory() {
  const milestones = [
    {
      icon: Users,
      label: "Active Farmers",
      value: "6,000+",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Droplets,
      label: "Daily Production",
      value: "50,000L",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: Store,
      label: "New Outlets",
      value: "15+",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: HeartPulse,
      label: "Community Impact",
      value: "High",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: TrendingUp,
      label: "Annual Growth",
      value: "20%",
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <Section className="py-20 bg-white" id="success-story">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-pink-600 font-bold tracking-wider uppercase text-sm mb-4 block"
          >
            Growth & Impact
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6"
          >
            Our Journey & Success Story
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            Our journey is a testament to the power of cooperation and resilience. 
            The video below captures our milestones from two years ago, but since then, 
            Kabianga Farmers Cooperative has grown exponentially—improving our facilities, 
            expanding our reach, and increasing the prosperity of our members.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Embed */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-50 group"
          >
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/C9fyvOQIBlU" 
              title="Our Journey & Success Story" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </motion.div>

          {/* Stats/Milestones Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 md:gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`${milestone.bgColor} p-6 rounded-2xl border border-border/50 hover:shadow-md transition-all flex flex-col items-center text-center`}
              >
                <milestone.icon className={`w-8 h-8 ${milestone.color} mb-3`} />
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-1">{milestone.value}</h3>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{milestone.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link href="/membership" asChild>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-10 h-14 text-lg shadow-lg shadow-green-200 transition-all hover:scale-105 active:scale-95">
              Join the Cooperative
            </Button>
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}
