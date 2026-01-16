import { motion } from "framer-motion";
import { Droplets } from "lucide-react";

export function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
    >
      <div className="relative">
        {/* Outer spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full"
        />
        
        {/* Inner spinning milk drop */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-primary"
        >
          <Droplets className="w-10 h-10 fill-current" />
        </motion.div>
        
        {/* Pulsing milk "splashes" */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 2],
              opacity: [0.3, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.6,
              ease: "easeOut" 
            }}
            className="absolute inset-0 border-2 border-primary rounded-full"
          />
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute mt-32 text-primary font-serif font-bold text-xl tracking-widest"
      >
        KFCS<span className="text-secondary">.</span>
      </motion.div>
    </motion.div>
  );
}
