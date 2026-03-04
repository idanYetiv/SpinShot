import { motion } from "framer-motion";

export function Logo() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.8 }}
    >
      <motion.h1
        className="text-6xl font-black tracking-tight text-glow-pink"
        animate={{ textShadow: [
          "0 0 10px rgba(255,16,240,0.6), 0 0 30px rgba(255,16,240,0.3)",
          "0 0 20px rgba(255,16,240,0.8), 0 0 50px rgba(255,16,240,0.4)",
          "0 0 10px rgba(255,16,240,0.6), 0 0 30px rgba(255,16,240,0.3)",
        ]}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-neon-pink">SPIN</span>
        <span className="text-neon-blue">SHOT</span>
      </motion.h1>
      <p className="text-text-secondary text-sm tracking-widest uppercase">
        Spin it. Do it. Or drink it.
      </p>
    </motion.div>
  );
}
