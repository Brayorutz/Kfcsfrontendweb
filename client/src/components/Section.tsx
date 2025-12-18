import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "white" | "muted" | "primary" | "pattern";
}

export function Section({ children, className, id, background = "white" }: SectionProps) {
  const bgStyles = {
    white: "bg-background",
    muted: "bg-muted",
    primary: "bg-primary text-primary-foreground",
    pattern: "bg-muted relative overflow-hidden", // Add pattern later if needed
  };

  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-32 relative",
        bgStyles[background],
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6"
      >
        {children}
      </motion.div>
    </section>
  );
}
