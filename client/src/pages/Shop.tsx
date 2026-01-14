import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import freshMilk from "@assets/All_products_Showcase_1767703540586.jpg";
import yogurt from "@assets/yogurt_processing_1767871165321.jpg";

const products = [
  {
    id: 1,
    name: "Kabianga Fresh Milk",
    description: "Farm-fresh, pasteurized whole milk from our cooperative members.",
    image: freshMilk,
  },
  {
    id: 2,
    name: "Kabianga Premium Yogurt",
    description: "Creamy, delicious yogurt available in various natural flavors.",
    image: yogurt,
  },
  {
    id: 3,
    name: "Kabianga Lala",
    description: "Traditional cultured milk, rich in probiotics and flavor.",
    image: freshMilk,
  },
  {
    id: 4,
    name: "Kabianga Ghee",
    description: "Pure, aromatic cow ghee made using traditional methods.",
    image: yogurt,
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
                        <Input id="phone" name="phone" type="tel" required placeholder="0700 000 000" />
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
