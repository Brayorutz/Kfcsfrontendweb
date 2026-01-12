import { motion } from "framer-motion";
import { Section } from "@/components/Section";

// Facility Images
import kfcsFarm1 from "@assets/Kfcs_farm_1_Project_1768206694858.png";
import kfcsFarm2 from "@assets/Kfcs_Farm_2_Project_1768206694859.png";

const projects = [
  {
    title: "KFCS Farm 1 Project",
    image: kfcsFarm1,
    description: "Future development plan for Farm 1, which will house a modern Supermarket and a Petrol Station to serve the local community and our members.",
    features: ["Modern Supermarket", "Petrol Station", "Community Hub"]
  },
  {
    title: "KFCS Farm 2 Project",
    image: kfcsFarm2,
    description: "Future development plan for Farm 2, dedicated to an Agricultural School to train the next generation of modern dairy farmers.",
    features: ["Agricultural School", "Training Center", "Dairy Research"]
  }
];

export default function FutureProjects() {
  return (
    <div className="pt-20">
      <div className="bg-primary py-16 md:py-24 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Future Projects</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto px-6">
          Investing in the future of our cooperative and community.
        </p>
      </div>

      <Section>
        <div className="space-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
            >
              <div className="lg:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6">
                <h2 className="text-4xl font-serif font-bold text-primary">{project.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  {project.features.map((feature, i) => (
                    <span key={i} className="bg-secondary/10 text-secondary px-4 py-2 rounded-full font-bold text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}
