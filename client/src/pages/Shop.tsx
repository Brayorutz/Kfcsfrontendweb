import { Section } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import strawberryYoghurt from "@assets/generated_images/strawberry_yoghurt_bottle_professional_product_shot..png";
import vanillaYoghurt from "@assets/generated_images/vanilla_yoghurt_bottle_professional_product_shot..png";
import mangoYoghurt from "@assets/generated_images/mango_yoghurt_bottle_professional_product_shot..png";
import freshMilk from "@assets/generated_images/fresh_milk_carton_professional_product_shot..png";

const products = [
  { id: 1, name: "Fresh Milk (500ml)", price: "KES 60", category: "Milk", image: freshMilk },
  { id: 2, name: "Strawberry Yoghurt (250ml)", price: "KES 80", category: "Yoghurt", image: strawberryYoghurt },
  { id: 3, name: "Vanilla Yoghurt (250ml)", price: "KES 80", category: "Yoghurt", image: vanillaYoghurt },
  { id: 4, name: "Mango Yoghurt (250ml)", price: "KES 80", category: "Yoghurt", image: mangoYoghurt },
  { id: 5, name: "Strawberry Yoghurt (500ml)", price: "KES 150", category: "Yoghurt", image: strawberryYoghurt },
  { id: 6, name: "Vanilla Yoghurt (500ml)", price: "KES 150", category: "Yoghurt", image: vanillaYoghurt },
  { id: 7, name: "Mango Yoghurt (500ml)", price: "KES 150", category: "Yoghurt", image: mangoYoghurt },
  { id: 8, name: "Dairy Meal (70kg)", price: "KES 2,500", category: "Feeds", image: freshMilk }, // Placeholder image for feed
];

export default function Shop() {
  return (
    <div className="pt-20">
       <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">KFCS Shop</h1>
        <p className="text-lg opacity-90">Order online, pick up at your nearest branch.</p>
      </div>

      <Section>
        <Alert className="mb-10 bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4" />
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>
            M-Pesa integration coming soon! Currently, you can place an order and pay on collection.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
                <ProductCard 
                    key={product.id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    category={product.category}
                />
            ))}
        </div>
      </Section>
    </div>
  );
}
