import { Section } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function Shop() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.map((product: any) => (
              <ProductCard
                key={product.id}
                image={product.image}
                name={product.name}
                price={`KES ${product.price}`}
                category={product.category}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
