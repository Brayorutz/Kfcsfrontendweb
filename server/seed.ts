import { storage } from "./storage";
import strawberryYoghurt from "../attached_assets/generated_images/strawberry_yoghurt_bottle_professional_product_shot..png";
import vanillaYoghurt from "../attached_assets/generated_images/vanilla_yoghurt_bottle_professional_product_shot..png";
import mangoYoghurt from "../attached_assets/generated_images/mango_yoghurt_bottle_professional_product_shot..png";
import freshMilk from "../attached_assets/generated_images/fresh_milk_carton_professional_product_shot..png";
import heroImage from "../attached_assets/generated_images/cinematic_wide_shot_of_a_lush_green_dairy_farm_with_cows_grazing_under_a_bright_sky..png";

export async function seedDatabase() {
  try {
    console.log("Seeding database...");
    
    // Seed products
    const existingProducts = await storage.getAllProducts();
    if (existingProducts.length === 0) {
      await storage.createProduct({
        name: "Fresh Milk (500ml)",
        price: "60",
        category: "Milk",
        image: "/attached_assets/generated_images/fresh_milk_carton_professional_product_shot..png",
        description: "Pure, wholesome goodness from our local farmers",
        inStock: true,
      });
      
      await storage.createProduct({
        name: "Strawberry Yoghurt (250ml)",
        price: "80",
        category: "Yoghurt",
        image: "/attached_assets/generated_images/strawberry_yoghurt_bottle_professional_product_shot..png",
        description: "Rich, creamy yoghurt infused with real strawberry chunks",
        inStock: true,
      });
      
      await storage.createProduct({
        name: "Vanilla Yoghurt (250ml)",
        price: "80",
        category: "Yoghurt",
        image: "/attached_assets/generated_images/vanilla_yoghurt_bottle_professional_product_shot..png",
        description: "Smooth, timeless vanilla flavor made with premium beans",
        inStock: true,
      });
      
      await storage.createProduct({
        name: "Mango Yoghurt (250ml)",
        price: "80",
        category: "Yoghurt",
        image: "/attached_assets/generated_images/mango_yoghurt_bottle_professional_product_shot..png",
        description: "A burst of tropical sunshine in every spoonful",
        inStock: true,
      });
      
      await storage.createProduct({
        name: "Strawberry Yoghurt (500ml)",
        price: "150",
        category: "Yoghurt",
        image: "/attached_assets/generated_images/strawberry_yoghurt_bottle_professional_product_shot..png",
        description: "Rich, creamy yoghurt infused with real strawberry chunks - family size",
        inStock: true,
      });
      
      await storage.createProduct({
        name: "Vanilla Yoghurt (500ml)",
        price: "150",
        category: "Yoghurt",
        image: "/attached_assets/generated_images/vanilla_yoghurt_bottle_professional_product_shot..png",
        description: "Smooth, timeless vanilla flavor - family size",
        inStock: true,
      });
      
      await storage.createProduct({
        name: "Mango Yoghurt (500ml)",
        price: "150",
        category: "Yoghurt",
        image: "/attached_assets/generated_images/mango_yoghurt_bottle_professional_product_shot..png",
        description: "Tropical perfection - family size",
        inStock: true,
      });
      
      await storage.createProduct({
        name: "Dairy Meal (70kg)",
        price: "2500",
        category: "Feeds",
        image: "/attached_assets/generated_images/fresh_milk_carton_professional_product_shot..png",
        description: "High-quality feed for optimal milk production",
        inStock: true,
      });
      
      console.log("✅ Products seeded");
    }
    
    // Seed news
    const existingNews = await storage.getAllNews();
    if (existingNews.length === 0) {
      await storage.createNews({
        title: "Annual General Meeting Announced for January 2025",
        excerpt: "Join us for our AGM where we'll discuss cooperative achievements and future plans.",
        content: "The Kabianga Farmers Cooperative Society is pleased to announce our Annual General Meeting scheduled for January 15th, 2025. All members are encouraged to attend as we review the year's achievements, discuss financial performance, and set goals for the coming year. The meeting will be held at the Kabianga Community Centre starting at 9:00 AM.",
        image: "/attached_assets/generated_images/cinematic_wide_shot_of_a_lush_green_dairy_farm_with_cows_grazing_under_a_bright_sky..png",
      });
      
      await storage.createNews({
        title: "New Milk Cooling Plant Commissioned in Taplotin",
        excerpt: "State-of-the-art cooling facility now operational, increasing our processing capacity.",
        content: "We are excited to announce the commissioning of our new milk cooling plant in Taplotin. This modern facility will significantly enhance our ability to maintain milk quality and extend our reach to more farmers in the region. The plant features advanced refrigeration technology and can handle up to 10,000 liters per day.",
        image: "/attached_assets/generated_images/modern_dairy_processing_plant_interior..png",
      });
      
      await storage.createNews({
        title: "KFCS Records Record High Milk Intake This Quarter",
        excerpt: "Q4 2024 sees unprecedented growth in milk production across all member farms.",
        content: "This quarter has been exceptional for KFCS, with member farms delivering a record 4.5 million liters of milk. This 20% increase from last year demonstrates the effectiveness of our feed program and farmer training initiatives. Congratulations to all our dedicated farmers!",
        image: "/attached_assets/generated_images/cinematic_wide_shot_of_a_lush_green_dairy_farm_with_cows_grazing_under_a_bright_sky..png",
      });
      
      console.log("✅ News seeded");
    }
    
    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
