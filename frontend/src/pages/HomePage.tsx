import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      {/* -------------------- HERO -------------------- */}
      <header className="relative h-[28rem] overflow-hidden">
        <img
          src="/hero.jpg" /* put a nice store-wide banner in public/hero.jpg */
          alt="Big release"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 flex flex-col h-full justify-center items-center text-center backdrop-blur-sm">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Your Next Adventure Awaits
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0}}
            className="mb-8 text-neutral-300 max-w-xl"
          >
            {"Discover the hottest PC titles—fresh releases, timeless classics, and hidden indie gems."}
          </motion.p>
          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
            onClick={() => navigate("/store")}
          >
            Browse Store
          </Button>
        </div>
      </header>
    </div>
  );
}
