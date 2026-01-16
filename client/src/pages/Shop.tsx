import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import freshMilk500ml from "@assets/fresh_milk_500ml_1768464623059.png";
import mursik5l from "@assets/Kabianga_Mursik_5liters_1768464623061.png";
import strawberry250ml from "@assets/kabianga_strawberry_250ml_1768464623062.png";
import strawberry500ml from "@assets/Kabianga_Strawberry_yoghurt_500ml_1768464623063.png";
import vanilla500ml from "@assets/kabianga_vanilla_500ml_1768464623074.png";

const products = [
  {
    id: 1,
    name: "Kabianga Fresh Whole Milk (500ML)",
    description: "Naturally nutritious, farm-fresh pasteurized whole milk.",
    image: freshMilk500ml,
  },
  {
    id: 2,
    name: "Kabianga Mursik / Lala (5 Liters)",
    description: "Traditional cultured milk, rich in flavor and energy. A sip of energy.",
    image: mursik5l,
  },
  {
    id: 3,
    name: "Kabianga Strawberry Yoghurt (250ML)",
    description: "Creamy strawberry flavored yoghurt in a convenient 250ml cup.",
    image: strawberry250ml,
  },
  {
    id: 4,
    name: "Kabianga Strawberry Yoghurt (500ML)",
    description: "Delicious strawberry flavored yoghurt in a 500ml family size.",
    image: strawberry500ml,
  },
  {
    id: 5,
    name: "Kabianga Vanilla Yoghurt (500ML)",
    description: "Smooth and creamy vanilla flavored yoghurt in a 500ml cup.",
    image: vanilla500ml,
  },
];

export default function Shop() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formspree.io/f/mwvvkvze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Product Inquiry: ${selectedProduct}`,
          product: selectedProduct,
          ...data
        }),
      });

      if (response.ok) {
        toast({
          title: "Inquiry Sent!",
          description: "We have received your request and will contact you shortly.",
        });
        setSelectedProduct(null);
      } else {
        throw new Error("Failed to send inquiry");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pt-20">
      <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Our Products</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto px-6">
          Premium dairy products directly from Kabianga's lush pastures. Select a product to place an inquiry.
        </p>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group hover:shadow-xl transition-all">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-primary">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">{product.description}</p>
                <Dialog open={selectedProduct === product.name} onOpenChange={(open) => !open && setSelectedProduct(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold"
                      onClick={() => setSelectedProduct(product.name)}
                    >
                      Inquire Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Order Inquiry: {product.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleOrder} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required placeholder="Enter your name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" required placeholder="0743719091" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Delivery Location</Label>
                        <Input id="location" name="location" required placeholder="Town or Estate" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="landmark">Nearest Landmark</Label>
                        <Input id="landmark" name="landmark" required placeholder="e.g. Near Kabianga School" />
                      </div>
                      <Button type="submit" className="w-full bg-primary text-white">
                        Submit Inquiry
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
