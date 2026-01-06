import { Section } from "@/components/Section";
import { motion } from "framer-motion";
import plantImage from "@assets/generated_images/modern_dairy_processing_plant_interior..png";
import strawberryYoghurt from "@assets/generated_images/strawberry_yoghurt_bottle_professional_product_shot..png";
import vanillaYoghurt from "@assets/generated_images/vanilla_yoghurt_bottle_professional_product_shot..png";
import mangoYoghurt from "@assets/generated_images/mango_yoghurt_bottle_professional_product_shot..png";
import freshMilk from "@assets/generated_images/fresh_milk_carton_professional_product_shot..png";
import mursikImage from "@assets/Kabianga_Mursik_5_liters_1767704465333.jpg";
import strawberry250ml from "@assets/kabianga_strawberry_250ml_1767704465334.png";
import strawberry500ml from "@assets/Kabianga_Strawberry_yoghurt_500ml_1767704465335.png";
import vanilla500ml from "@assets/kabianga_vanilla_500ml_1767704465336.png";
import freshMilkPouch from "@assets/fresh_milk_500ml_1767704465332.png";
import happyFamily from "@assets/happy_family_1767704465333.png";

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

      {/* Happy Family Section */}
      <Section background="muted" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl max-h-[400px]">
            <img src={happyFamily} alt="Happy Family drinking Kabianga Milk" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Nourishing Generations</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Quality You Can Trust</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Kabianga Fresh Milk is naturally nutritious, providing the essential nutrients your family needs to thrive. From our farms to your table, we ensure every drop is packed with goodness and the authentic taste of Kericho's finest pastures.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
                 <img src={plantImage} alt="Processing Plant" className="rounded-2xl shadow-2xl w-full" />
            </div>
            <div className="order-1 md:order-2">
                <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Our Facilities</span>
                <h2 className="text-4xl font-serif font-bold text-primary mb-6">World-Class Infrastructure</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    Our cooperative is equipped with modern facilities to ensure the highest standards of production and quality. From feed processing to specialized dairy production, we handle every step with precision.
                </p>
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-foreground font-medium">Feed Laboratory</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-foreground font-medium">Milk Coolers</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-foreground font-medium">Yoghurt Production</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-foreground font-medium">Mursik Production</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-foreground font-medium">Feed Processing Plant</span>
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
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="text-center group">
                 <div className="bg-secondary/5 rounded-2xl aspect-square flex items-center justify-center p-4 mb-6 group-hover:bg-secondary/10 transition-colors overflow-hidden">
                    <img src={mursikImage} alt="Mursik" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-2xl font-serif font-bold">Traditional Mursik</h3>
                 <p className="text-muted-foreground">Authentic, rich, and naturally fermented.</p>
            </div>
             <div className="text-center group">
                 <div className="bg-pink-50 rounded-2xl aspect-square flex items-center justify-center p-4 mb-6 group-hover:bg-pink-100 transition-colors overflow-hidden">
                    <img src={strawberry500ml} alt="Strawberry Yoghurt" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-2xl font-serif font-bold">Strawberry Yoghurt (500ml)</h3>
                 <p className="text-muted-foreground">Sweet and creamy delight in every sip.</p>
            </div>
             <div className="text-center group">
                 <div className="bg-amber-50 rounded-2xl aspect-square flex items-center justify-center p-4 mb-6 group-hover:bg-amber-100 transition-colors overflow-hidden">
                    <img src={vanilla500ml} alt="Vanilla Yoghurt" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-2xl font-serif font-bold">Vanilla Yoghurt (500ml)</h3>
                 <p className="text-muted-foreground">Classic smooth taste you'll love.</p>
            </div>
            <div className="text-center group">
                 <div className="bg-pink-50 rounded-2xl aspect-square flex items-center justify-center p-4 mb-6 group-hover:bg-pink-100 transition-colors overflow-hidden">
                    <img src={strawberry250ml} alt="Strawberry Yoghurt" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-2xl font-serif font-bold">Strawberry Yoghurt (250ml)</h3>
                 <p className="text-muted-foreground">Perfect grab-and-go size.</p>
            </div>
            <div className="text-center group">
                 <div className="bg-secondary/5 rounded-2xl aspect-square flex items-center justify-center p-4 mb-6 group-hover:bg-secondary/10 transition-colors overflow-hidden">
                    <img src={freshMilkPouch} alt="Fresh Milk" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-2xl font-serif font-bold">Fresh Milk</h3>
                 <p className="text-muted-foreground">Pure, wholesome goodness from our farms.</p>
            </div>
         </div>
      </Section>
    </div>
  );
}
