import { Section } from "@/components/Section";
import { motion } from "framer-motion";
import plantImage from "@assets/generated_images/modern_dairy_processing_plant_interior..png";
import strawberryYoghurt from "@assets/generated_images/strawberry_yoghurt_bottle_professional_product_shot..png";
import vanillaYoghurt from "@assets/generated_images/vanilla_yoghurt_bottle_professional_product_shot..png";
import mangoYoghurt from "@assets/generated_images/mango_yoghurt_bottle_professional_product_shot..png";
import freshMilk from "@assets/generated_images/fresh_milk_carton_professional_product_shot..png";

export default function Production() {
  return (
    <div className="pt-20">
       <div className="bg-primary py-20 md:py-32 text-center text-white relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Production & Products</h1>
            <p className="text-xl max-w-2xl mx-auto text-primary-foreground/90">
                State-of-the-art processing meets traditional care.
            </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
                 <img src={plantImage} alt="Processing Plant" className="rounded-2xl shadow-2xl w-full" />
            </div>
            <div className="order-1 md:order-2">
                <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Our Facility</span>
                <h2 className="text-4xl font-serif font-bold text-primary mb-6">Feed Processing Plant</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    We don't just process milk; we support the entire ecosystem. Our feed processing plant ensures our farmers have access to high-quality, nutritious feed for their cattle, resulting in better milk yields and healthier herds.
                </p>
                 <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-foreground font-medium">Automated mixing and pelleting</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-foreground font-medium">Nutritionally balanced formulas</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-foreground font-medium">Quality control lab on-site</span>
                    </li>
                </ul>
            </div>
        </div>
      </Section>

      <Section background="muted">
        <h2 className="text-4xl font-serif font-bold text-center text-primary mb-16">The Yoghurt Journey</h2>
        <div className="relative max-w-5xl mx-auto">
             {/* Timeline Line */}
             <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 hidden md:block" />

             {[
                 { title: "Collection", desc: "Fresh milk collected daily from local farmers.", step: 1 },
                 { title: "Testing", desc: "Rigorous quality checks for purity and safety.", step: 2 },
                 { title: "Pasteurization", desc: "Heating to eliminate bacteria while preserving nutrients.", step: 3 },
                 { title: "Flavoring", desc: "Blending with real fruit pulps (Mango, Strawberry, Vanilla).", step: 4 },
                 { title: "Packaging", desc: "Hygienic bottling and sealing.", step: 5 },
                 { title: "Distribution", desc: "Delivered fresh to shops and supermarkets.", step: 6 },
             ].map((item, index) => (
                 <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row items-center mb-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                 >
                    <div className="md:w-1/2 p-6 text-center md:text-left">
                        <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-secondary ${index % 2 === 0 ? 'md:text-left' : 'md:text-right md:border-l-0 md:border-r-4'}`}>
                            <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.desc}</p>
                        </div>
                    </div>
                    <div className="relative z-10 w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold border-4 border-white shadow-lg my-4 md:my-0">
                        {item.step}
                    </div>
                    <div className="md:w-1/2" />
                 </motion.div>
             ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-4xl font-serif font-bold text-center text-primary mb-16">Product Showcase</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
                 <div className="bg-secondary/5 rounded-full aspect-square flex items-center justify-center p-8 mb-6 group-hover:bg-secondary/10 transition-colors">
                    <img src={freshMilk} alt="Fresh Milk" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-xl font-bold">Fresh Milk</h3>
                 <p className="text-muted-foreground">Pure, wholesome goodness.</p>
            </div>
             <div className="text-center group">
                 <div className="bg-pink-50 rounded-full aspect-square flex items-center justify-center p-8 mb-6 group-hover:bg-pink-100 transition-colors">
                    <img src={strawberryYoghurt} alt="Strawberry" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-xl font-bold">Strawberry Yoghurt</h3>
                 <p className="text-muted-foreground">Sweet and creamy delight.</p>
            </div>
             <div className="text-center group">
                 <div className="bg-amber-50 rounded-full aspect-square flex items-center justify-center p-8 mb-6 group-hover:bg-amber-100 transition-colors">
                    <img src={vanillaYoghurt} alt="Vanilla" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-xl font-bold">Vanilla Yoghurt</h3>
                 <p className="text-muted-foreground">Classic smooth taste.</p>
            </div>
             <div className="text-center group">
                 <div className="bg-orange-50 rounded-full aspect-square flex items-center justify-center p-8 mb-6 group-hover:bg-orange-100 transition-colors">
                    <img src={mangoYoghurt} alt="Mango" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-xl font-bold">Mango Yoghurt</h3>
                 <p className="text-muted-foreground">Tropical perfection.</p>
            </div>
         </div>
      </Section>
    </div>
  );
}
