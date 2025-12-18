import { motion } from "framer-motion";

export function MilkRevealWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ clipPath: "circle(0% at 50% 0%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-full"
    >
      {children}
    </motion.div>
  );
}

export function MilkWaveDivider() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px] fill-background">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
    </div>
  )
}
