import { motion } from "motion/react";

export default function App() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 48 }}>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        Prototype
      </motion.h1>
      <p>Replace this file. Dependencies resolve from the lab root, so do not run npm install.</p>
    </main>
  );
}
