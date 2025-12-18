import { Section } from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Droplets, Zap, Recycle } from "lucide-react";

export default function Sustainability() {
  return (
    <div className="pt-20">
      <div className="bg-primary py-20 md:py-32 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Sustainability</h1>
        <p className="text-xl max-w-2xl mx-auto text-primary-foreground/90">
          Protecting our planet while nourishing communities. Our commitment to environmental sustainability.
        </p>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="bg-green-50 rounded-2xl p-8 aspect-square flex items-center justify-center">
            <div className="text-center">
              <Leaf className="w-24 h-24 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary">Carbon Neutral</h3>
              <p className="text-muted-foreground">By 2030 target</p>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-serif font-bold text-primary mb-6">Environmental Stewardship</h2>
            <p className="text-muted-foreground text-lg mb-6">
              We are committed to sustainable dairy farming practices that protect our environment for future generations.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-foreground">Transitioning to renewable energy at all facilities</span>
              </li>
              <li className="flex items-start gap-3">
                <Droplets className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-foreground">Water conservation and waste management systems</span>
              </li>
              <li className="flex items-start gap-3">
                <Recycle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-foreground">100% recyclable packaging by 2026</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-foreground">Supporting regenerative agriculture practices</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section background="muted">
        <h2 className="text-4xl font-serif font-bold text-center text-primary mb-16">Our Sustainability Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Green Farming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground"><strong>2025:</strong> 30% of member farms on sustainable practices</p>
              <p className="text-muted-foreground"><strong>2027:</strong> 60% adoption of agroforestry methods</p>
              <p className="text-muted-foreground"><strong>2030:</strong> 100% carbon-neutral operations</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                Water Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground"><strong>2025:</strong> 40% reduction in water usage</p>
              <p className="text-muted-foreground"><strong>2026:</strong> Rainwater harvesting on all facilities</p>
              <p className="text-muted-foreground"><strong>2028:</strong> Zero discharge operations</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="w-5 h-5 text-primary" />
                Circular Economy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground"><strong>2025:</strong> 70% waste recycling rate</p>
              <p className="text-muted-foreground"><strong>2026:</strong> 100% recyclable packaging</p>
              <p className="text-muted-foreground"><strong>2028:</strong> Zero landfill operations</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Clean Energy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground"><strong>2025:</strong> 25% renewable energy usage</p>
              <p className="text-muted-foreground"><strong>2027:</strong> 60% solar power at facilities</p>
              <p className="text-muted-foreground"><strong>2030:</strong> 100% renewable energy</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-primary mb-8">Sustainability in Action</h2>
          <div className="bg-primary/5 rounded-xl p-8 border border-primary/10">
            <h3 className="text-xl font-bold text-primary mb-4">Our Achievements So Far</h3>
            <ul className="space-y-3 text-foreground">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                <span>Installed solar panels on all cooling plants, reducing energy costs by 35%</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                <span>Trained 1,500+ farmers on climate-smart agriculture techniques</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                <span>Reduced plastic waste by 50% through sustainable packaging initiatives</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                <span>Established community tree-planting programs with 100,000+ trees planted</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                <span>Implemented water conservation systems saving 2M+ liters annually</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}
