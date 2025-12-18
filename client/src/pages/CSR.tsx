import { Section } from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Lightbulb, Sprout } from "lucide-react";

export default function CSR() {
  return (
    <div className="pt-20">
      <div className="bg-primary py-20 md:py-32 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">CSR & Community</h1>
        <p className="text-xl max-w-2xl mx-auto text-primary-foreground/90">
          Creating positive impact beyond dairy. Our commitment to communities and social responsibility.
        </p>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl font-serif font-bold text-primary mb-6">Community First</h2>
            <p className="text-muted-foreground text-lg mb-6">
              At KFCS, we believe that sustainable business success is built on strong community partnerships. We invest in the wellbeing of our farmers and their families.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Users className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <span className="text-foreground">Free training programs for farmers on modern dairy practices</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <span className="text-foreground">Healthcare support for cooperative members and their families</span>
              </li>
              <li className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <span className="text-foreground">Educational scholarships for farmers' children</span>
              </li>
            </ul>
          </div>
          <div className="bg-secondary/10 rounded-2xl p-8 aspect-square flex items-center justify-center">
            <div className="text-center">
              <Users className="w-24 h-24 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary">5,000+ Lives</h3>
              <p className="text-muted-foreground">directly impacted through our programs</p>
            </div>
          </div>
        </div>
      </Section>

      <Section background="muted">
        <h2 className="text-4xl font-serif font-bold text-center text-primary mb-16">Our Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-t-4 border-t-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                Healthcare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Regular health camps and subsidized medical services for all members and their families.</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-secondary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Scholarship programs and vocational training for youth in our communities.</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-secondary" />
                Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Building water points, roads, and community centers in rural areas.</p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Women Empowerment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Focused programs to empower women farmers and entrepreneurs.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Impact Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">KES 50M+</div>
              <p className="text-muted-foreground">invested in community development annually</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">1,200+</div>
              <p className="text-muted-foreground">scholarships awarded to students</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">15,000+</div>
              <p className="text-muted-foreground">people benefited from our programs</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
