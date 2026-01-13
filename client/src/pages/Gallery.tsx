import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { X } from "lucide-react";

// Importing user-uploaded images from attached_assets
import feedLab from "@assets/feed_laboratory_1767871165290.jpg";
import mournsSoi1 from "@assets/kabianga_fcs_mourns_the_death_of_Mr._Paul_Soi_1767871165290.jpg";
import mournsSoi2 from "@assets/kabianga_fcs_mourns_the_death_of_Mr._Paul_Soi2_1767871165291.jpg";
import bestCoop from "@assets/Kabianga_fcs_wins_best_cooperative_1767871165291.jpeg";
import commPlate from "@assets/kfcs_commision_plate_1767871165292.jpg";
import farmMach from "@assets/kfcs_farm_machinerary_1767871165315.jpg";
import flagImg from "@assets/kfcs_flag_1767871165316.jpg";
import restaurantImg from "@assets/kfcs_restaurant_1767871165317.jpg";
import security2 from "@assets/kfcs_security_2_1767871165318.jpg";
import security1 from "@assets/kfcs_security_1767871165319.jpg";
import milkCoolers from "@assets/Milk_Coolers_1767871165320.jpg";
import milkTransp from "@assets/Milk_Transportation_1767871165320.jpg";
import wideAngle from "@assets/wide_angle_shot_of_kfcs_1767871165321.jpg";
import yogurtProc from "@assets/yogurt_processing_1767871165321.jpg";

// New images from KJET Training
import kjet1 from "@assets/IMG_20260113_105729_299_1768302297137.jpg";
import kjet2 from "@assets/IMG_20260113_105807_651_1768302297138.jpg";
import kjet3 from "@assets/IMG_20260113_105903_836_1768302297139.jpg";
import kjet4 from "@assets/IMG_20260113_112710_112_1768302297139.jpg";
import kjet5 from "@assets/IMG_20260113_122903_308_1768302297140.jpg";
import kjet6 from "@assets/IMG_20260113_122905_986_1768302297142.jpg";
import kjet7 from "@assets/IMG_20260113_122935_437_1768302297142.jpg";

const galleryImages = [
  { url: kjet1, title: "KJET Farmers Mentorship Training", category: "Events" },
  { url: kjet2, title: "Farmer Capacity Building Session", category: "Events" },
  { url: kjet3, title: "Modern Agribusiness Training", category: "Events" },
  { url: kjet4, title: "Cooperative Stakeholder Meeting", category: "Events" },
  { url: kjet5, title: "Dairy Value Chain Workshop", category: "Events" },
  { url: kjet6, title: "KJET Programme Mentorship", category: "Events" },
  { url: kjet7, title: "Sustainable Agribusiness Growth", category: "Events" },
  { url: feedLab, title: "Feed Laboratory", category: "Facilities" },
  { url: wideAngle, title: "KFCS Facility Wide Angle", category: "Facilities" },
  { url: yogurtProc, title: "Yogurt Processing Plant", category: "Production" },
  { url: milkCoolers, title: "Milk Cooling Tanks", category: "Facilities" },
  { url: milkTransp, title: "Milk Transportation", category: "Logistics" },
  { url: farmMach, title: "Farm Machinery", category: "Equipment" },
  { url: restaurantImg, title: "KFCS Restaurant", category: "Facilities" },
  { url: bestCoop, title: "Best Cooperative Award", category: "Awards" },
  { url: commPlate, title: "Commissioning Plate", category: "Events" },
  { url: mournsSoi1, title: "Tribute to Paul Soi", category: "Events" },
  { url: mournsSoi2, title: "Mourning Paul Soi", category: "Events" },
  { url: security1, title: "Security Services", category: "Services" },
  { url: security2, title: "Facility Security", category: "Services" },
  { url: flagImg, title: "KFCS Flag", category: "Corporate" },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="pt-20">
      <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Our Gallery</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto px-6">
          A visual journey through our facilities, events, and community impact.
        </p>
      </div>

      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              data-testid={`gallery-item-${index}`}
            >
              <Card 
                className="overflow-hidden cursor-pointer group border-none shadow-md hover:shadow-xl transition-shadow"
                onClick={() => setSelectedImage(image.url)}
              >
                <CardContent className="p-0 relative aspect-[4/3]">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-testid={`img-gallery-${index}`}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">{image.category}</span>
                    <h3 className="text-white font-bold text-lg">{image.title}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-secondary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={selectedImage}
            alt="Enlarged view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
