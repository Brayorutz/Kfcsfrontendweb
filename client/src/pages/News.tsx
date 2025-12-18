import { Section } from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import heroImage from "@assets/generated_images/cinematic_wide_shot_of_a_lush_green_dairy_farm_with_cows_grazing_under_a_bright_sky..png";

export default function News() {
  return (
    <div className="pt-20">
      <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">News & Updates</h1>
        <p className="text-lg opacity-90">Stay informed about your cooperative.</p>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden border-border">
                    <div className="aspect-video bg-muted overflow-hidden relative">
                         <img src={heroImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News" />
                         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                             <Calendar className="w-3 h-3" /> Dec {20-i}, 2024
                         </div>
                    </div>
                    <CardHeader>
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                            {i === 1 ? "Annual General Meeting Announced for January 2025" : 
                             i === 2 ? "New Milk Cooling Plant Commissioned in Taplotin" :
                             "KFCS Records Record High Milk Intake This Quarter"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground line-clamp-3 text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                        </p>
                        <span className="text-secondary font-bold text-sm mt-4 inline-block">Read More &rarr;</span>
                    </CardContent>
                </Card>
            ))}
        </div>
      </Section>
    </div>
  );
}
