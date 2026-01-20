import { Section } from "@/components/Section";
import { motion } from "framer-motion";
import mursikImage from "@assets/Kabianga_Mursik_5liters_1768464623061_(1)_1768896973826.png";
import strawberry250ml from "@assets/kabianga_strawberry_250ml_1768464623062.png";
import strawberry500ml from "@assets/Kabianga_Strawberry_yoghurt_500ml_1768464623063.png";
import vanilla500ml from "@assets/kabianga_vanilla_500ml_1768464623074.png";
import freshMilkPouch from "@assets/fresh_milk_500ml_1768464623059.png";
import happyFamily from "@assets/happy_family_1768206369042.png";

// Facility Images
import feedLab from "@assets/feed_laboratory_1767709443300.jpg";
import milkCoolers from "@assets/Milk_Coolers_1767709504686.jpg";
import yoghurtProduction from "@assets/yogurt_processing_1767709504687.jpg";
import mursikProduction from "@assets/Kabianga_Mursik_5liters_1768464623061_(1)_1768896973826.png";
import feedProcessing from "@assets/feed_production_1768206601308.jpeg";
import milkTanker from "@assets/IMG_20251217_110942_1768897089647.jpg";
import bodaBoda1 from "@assets/IMG_20240803_122239_1768551934236.jpg";

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
          <div className="flex justify-center">
            <img 
              src={happyFamily} 
              alt="Happy Family drinking Kabianga Milk" 
              className="max-w-[80%] md:max-w-full h-auto rounded-2xl shadow-2xl" 
            />
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

      {/* Facilities Section */}
      <Section>
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Our Infrastructure</span>
          <h2 className="text-4xl font-serif font-bold text-primary">State-of-the-Art Facilities</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-64 overflow-hidden">
              <img src={feedLab} alt="Feed Laboratory" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-bold mb-3">Feed Laboratory</h3>
              <p className="text-muted-foreground">Advanced testing facility ensuring the highest nutritional quality for our livestock feed.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-64 overflow-hidden">
              <img src={milkCoolers} alt="Milk Coolers" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-bold mb-3">Milk Coolers</h3>
              <p className="text-muted-foreground">High-capacity cooling systems to maintain milk freshness immediately after collection.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-64 overflow-hidden">
              <img src={yoghurtProduction} alt="Yoghurt Production" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-bold mb-3">Yoghurt Production</h3>
              <p className="text-muted-foreground">Automated processing line for our premium creamy strawberry and vanilla yoghurts.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-64 overflow-hidden">
              <img src={mursikProduction} alt="Mursik Production" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-bold mb-3">Mursik Production</h3>
              <p className="text-muted-foreground">Preserving tradition with our specialized traditional fermented milk production facility.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-64 overflow-hidden">
              <img src={feedProcessing} alt="Feed Processing Plant" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-bold mb-3">Feed Processing Plant</h3>
              <p className="text-muted-foreground">Modern milling and processing plant providing balanced nutrition for cooperative farmers.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-64 overflow-hidden">
              <img src={milkTanker} alt="Milk Tanker" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-bold mb-3">Milk Tankers</h3>
              <p className="text-muted-foreground">Reliable logistics for bulk milk transportation across our collection network.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-64 overflow-hidden">
              <img src={bodaBoda1} alt="Boda Boda Transport" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-bold mb-3">Boda Boda Collection Network</h3>
              <p className="text-muted-foreground">Our network of dedicated riders ensures milk is collected from even the most remote farms.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section background="muted">
        <h2 className="text-4xl font-serif font-bold text-center text-primary mb-16">The Yoghurt Journey</h2>
        <div className="relative max-w-5xl mx-auto">
             {/* Timeline Line */}
             <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 hidden md:block" />

             {[
                 { title: "Testing and Collection", desc: "Fresh milk collected daily from local farmers with rigorous quality testing.", step: 1 },
                 { title: "Transport", desc: "Safely transported to our processing facility while maintaining optimal temperature.", step: 2 },
                 { title: "Further Testing", desc: "Additional comprehensive quality checks to ensure milk purity and safety standards.", step: 3 },
                 { title: "Pasteurization & Cooling", desc: "Heating to eliminate bacteria while preserving nutrients. Incubation begins at this stage.", step: 4 },
                 { title: "Flavouring", desc: "Blending with real fruit pulps to create Mango, Strawberry, and Vanilla varieties.", step: 5 },
                 { title: "Packaging", desc: "Hygienic bottling and sealing in sterile containers for your safety.", step: 6 },
                 { title: "Storage & Distribution", desc: "Refrigerated storage and prompt delivery to shops and supermarkets nationwide.", step: 7 },
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
