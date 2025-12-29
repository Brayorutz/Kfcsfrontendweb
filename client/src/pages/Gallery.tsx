import { Section } from "@/components/Section";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/generated_images/cinematic_wide_shot_of_a_lush_green_dairy_farm_with_cows_grazing_under_a_bright_sky..png";
import strawberryYoghurt from "@assets/generated_images/strawberry_yoghurt_bottle_professional_product_shot..png";
import vanillaYoghurt from "@assets/generated_images/vanilla_yoghurt_bottle_professional_product_shot..png";
import mangoYoghurt from "@assets/generated_images/mango_yoghurt_bottle_professional_product_shot..png";
import processingPlant from "@assets/generated_images/modern_dairy_processing_plant_interior..png";
import awardImage1 from "@assets/WhatsApp_Image_2025-12-19_at_20.42.35_1766218730971.jpeg";
import awardImage2 from "@assets/WhatsApp_Image_2025-12-19_at_20.42.36_1766218742963.jpeg";

const galleryImages = [
  { src: heroImage, alt: "Kabianga Farm", category: "Farm" },
  { src: strawberryYoghurt, alt: "Strawberry Yoghurt", category: "Products" },
  { src: vanillaYoghurt, alt: "Vanilla Yoghurt", category: "Products" },
  { src: mangoYoghurt, alt: "Mango Yoghurt", category: "Products" },
  { src: processingPlant, alt: "Processing Plant", category: "Facility" },
  { src: awardImage1, alt: "Award Ceremony", category: "Awards" },
  { src: awardImage2, alt: "Cabinet Secretary Visit", category: "Awards" },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="pt-20">
      <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Gallery</h1>
        <p className="text-lg opacity-90">Glimpses of our journey, achievements, and operations</p>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              onClick={() => setSelectedImage(image.src)}
              data-testid={`gallery-image-${index}`}
            >
              <div className="aspect-square bg-muted overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <div className="p-6 w-full">
                  <p className="text-white font-medium mb-2">{image.category}</p>
                  <p className="text-white/80 text-sm">{image.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          data-testid="gallery-lightbox"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Gallery full view"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
