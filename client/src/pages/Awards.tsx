import { Section } from "@/components/Section";
import { Award, Star, Trophy, Medal } from "lucide-react";
import award1 from "@assets/IMG-20260119-WA0000_1768817019865.jpg";
import award2 from "@assets/IMG-20260119-WA0001_1768817019688.jpg";
import award3 from "@assets/IMG-20260119-WA0002_1768817019785.jpg";
import award4 from "@assets/IMG-20260119-WA0003_1768817019590.jpg";
import award5 from "@assets/IMG-20260119-WA0006_1768817019503.jpg";
import award6 from "@assets/IMG-20260119-WA0007_1768817018732.jpg";
import award7 from "@assets/IMG-20260119-WA0008_1768817018652.jpg";
import award8 from "@assets/IMG-20260119-WA0009_1768817018574.jpg";
import award9 from "@assets/IMG-20260119-WA0010_1768817018433.jpg";
import award10 from "@assets/IMG-20260119-WA0011_1768817018022.jpg";

const awards = [
  {
    id: 1,
    title: "National Recognition",
    description: "Appreciation for Sponsoring Belgut Half Marathon 2025",
    image: award1,
    icon: Star
  },
  {
    id: 2,
    title: "Value Addition Excellence",
    description: "Most Improved in Value Addition - Position 1",
    image: award2,
    icon: Award
  },
  {
    id: 3,
    title: "Best Dairy Co-op",
    description: "Best Dairy Co-op in Value Addition - 2019",
    image: award3,
    icon: Trophy
  },
  {
    id: 4,
    title: "Infrastructure Growth",
    description: "Most Improved Dairy in Infrastructure - Position 1",
    image: award4,
    icon: Medal
  },
  {
    id: 5,
    title: "Innovation & Technology",
    description: "Most Improved Dairy Society in Innovation and Technology - Position 1",
    image: award5,
    icon: Award
  },
  {
    id: 6,
    title: "Excellence Award",
    description: "Consistently recognized for dairy processing excellence",
    image: award6,
    icon: Star
  },
  {
    id: 7,
    title: "Highest Milk Supply",
    description: "The Best Society with Highest Milk Supply",
    image: award7,
    icon: Trophy
  },
  {
    id: 8,
    title: "Quality Standards",
    description: "Recognized for maintaining superior milk quality standards",
    image: award8,
    icon: Award
  },
  {
    id: 9,
    title: "Community Impact",
    description: "Awarded for significant contribution to local dairy farmers",
    image: award9,
    icon: Heart
  },
  {
    id: 10,
    title: "Service Excellence",
    description: "Distinguished service in the dairy sector of Kericho County",
    image: award10,
    icon: Star
  }
];

import { Heart } from "lucide-react";

export default function Awards() {
  return (
    <div className="pt-20 bg-white min-h-screen">
      <div className="bg-primary py-20 md:py-32 text-center text-white relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Our Awards</h1>
          <p className="text-xl max-w-2xl mx-auto text-primary-foreground/90">
            A celebration of excellence, innovation, and our commitment to the dairy farming community.
          </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award) => (
            <div key={award.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all group">
              <div className="aspect-[3/4] overflow-hidden bg-muted flex items-center justify-center p-4">
                <img 
                  src={award.image} 
                  alt={award.title} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <award.icon className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-bold text-primary">{award.title}</h3>
                </div>
                <p className="text-muted-foreground">{award.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
