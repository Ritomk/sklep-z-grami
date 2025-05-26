import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Genre, Game as BaseGame } from "@/components/GameCard";




type Publisher = {
  id: number;
  name: string;
  website?: string | null;
};

export type GameDetail = BaseGame & {
  description: string;
  cover_image?: string | null;
  promo_images?: string[]; // TODO: optional gallery screenshots
  publisher: Publisher;
};




const chip =
  "w-24 text-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide bg-yellow-500/10 text-yellow-400 border border-yellow-400/40";

const label =
  "text-sm font-semibold tracking-wide uppercase text-neutral-400 mb-2";

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  /* --------------------------- load single game --------------------------- */
  useEffect(() => {
    if (!id) return;

    api
      .get(`games/${id}/`)
      .then(({ data }) => {
        setGame(data as GameDetail);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Game fetch failed:", err);
        navigate("/store");
      });
  }, [id, navigate]);

  /* ------------------------------ actions ------------------------------ */
  const handleBuy = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/games/${id}` } });
      return;
    }

    try {
      await api.post("library/", { game: id });
      alert("Game added to your library!");
    } catch (err) {
      console.error("Add‑to‑library failed", err);
      alert("Something went wrong while purchasing. Please try again.");
    }
  };

  /* ------------------------------ render ------------------------------ */
  if (loading || !game) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400">
        Loading…
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("pl", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(game.release_date));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-y-auto p-6 bg-neutral-900 text-white"
    >
      {/* Back button */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        size="sm"
        className="mb-6 px-0 text-neutral-400 hover:text-white gap-2"
      >
        <ArrowLeft size={18} /> Back
      </Button>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Main content (left) */}
        <div className="flex-1 space-y-10">
          {/* Promo */}
          <Card className="rounded-xl overflow-hidden bg-neutral-800 border-0 h-64 md:h-80 lg:h-96">
            {game.promo_images && game.promo_images.length > 0 ? (
              <img
                src={game.promo_images[0]}
                alt={`${game.title} screenshot`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-neutral-700 text-neutral-500 text-sm">
                Promo images coming soon
              </div>
            )}
          </Card>

          {/* Genres */}
          <div>
            <h2 className={label}>Genres</h2>
            <div className="flex flex-wrap gap-2">
              {game.genres.map((g: Genre) => (
                <span key={g.id} className={chip}>
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          {/* description */}
          <div>
            <h2 className={label}>Description</h2>
            <div className="prose prose-invert max-w-none whitespace-pre-line">
              {game.description}
            </div>
          </div>
        </div>

        {/* Purchase (right)*/}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Cover image */}
          <Card className="rounded-xl overflow-hidden bg-neutral-800 border-0">
            <div className="aspect-[2/3] w-full">
              {game.cover_image ? (
                <img
                  src={game.cover_image}
                  alt={`${game.title} cover`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-neutral-700 text-neutral-500 text-sm">
                  Cover image coming soon
                </div>
              )}
            </div>
          </Card>

          {/* Title */}
          <h1 className="text-2xl font-bold leading-tight break-words">
            {game.title}
          </h1>

          {/* Price & actions */}
          <div className="space-y-4">
            <div className="text-3xl font-extrabold text-green-400">
              PLN {Number(game.price).toFixed(0)}
            </div>

            <Button
              onClick={handleBuy}
              size="lg"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
            >
              Add to Cart
            </Button>
          </div>

          {/* Meta / extra data */}
          <Card className="bg-neutral-800 border border-neutral-700 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Release date</span>
              <span className="font-semibold text-white">{formattedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Publisher</span>
              <span className="font-semibold text-white">{game.publisher?.name}</span>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default GameDetails;
