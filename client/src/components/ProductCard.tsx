import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  category: string;
}

export function ProductCard({ image, name, price, category }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
    >
      <div className="aspect-square overflow-hidden bg-muted p-6 flex items-center justify-center relative">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" className="rounded-full bg-white text-primary hover:bg-primary hover:text-white shadow-md">
                <Plus className="w-4 h-4" />
            </Button>
        </div>
      </div>
      <div className="p-6">
        <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">{category}</p>
        <h3 className="text-lg font-serif font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{name}</h3>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-medium text-foreground">{price}</span>
          <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/5 hover:text-primary gap-2">
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
