import { motion } from "framer-motion";
import kfcsLogo from "@assets/image_20251218_135629_0000_1766055489904.png";

const letters = "KABIANGA".split("");

export function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a3d1f 0%, #145a32 60%, #1a7a42 100%)" }}
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }}
        />
      </div>

      {/* Logo + brand */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo with glow ring */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          {/* Outer glow ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-3 rounded-2xl"
            style={{
              background: "conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.5) 85%, transparent 100%)",
            }}
          />
          {/* Inner glow */}
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-1 rounded-2xl blur-md"
            style={{ background: "rgba(255,255,255,0.15)" }}
          />
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <img src={kfcsLogo} alt="KFCS" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Letter-by-letter brand name */}
        <div className="flex items-baseline gap-0.5">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.07, duration: 0.4, ease: "easeOut" }}
              className="text-white font-black tracking-widest text-2xl"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="text-white/60 text-xs uppercase tracking-[0.25em] font-medium"
        >
          Farmers Dairy Cooperative
        </motion.p>
      </div>

      {/* Bottom progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 w-48 flex flex-col items-center gap-2"
      >
        <div className="w-full h-[2px] rounded-full overflow-hidden bg-white/10">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.6, delay: 0.5, ease: "easeInOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.9), rgba(255,255,255,0.2))" }}
          />
        </div>
        {/* Shimmer dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-white/60"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
