import type { FC } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export interface Genre {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  title: string;
  release_date: string;
  genres: Genre[];
  publisher: { name: string };
  cover_image?: string | null;
}

const chip =
  "w-24 text-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide bg-yellow-500/10 text-yellow-400 border border-yellow-400/40";

const LibraryGameCard: FC<{ game: Game }> = ({ game }) => {
  const formattedDate = new Intl.DateTimeFormat("pl", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(game.release_date));

  const topGenres = game.genres.slice(0, 3);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-xs"
    >
      <Card className="bg-neutral-800 border-0 h-full flex flex-col overflow-hidden p-0">
        {/* Cover */}
        <div className="aspect-[2/3] w-full overflow-hidden">
          {game.cover_image ? (
            <img
              loading="lazy"
              className="w-full h-full object-cover rounded-t-lg"
              src={game.cover_image}
              alt={game.title}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-neutral-700 text-neutral-500 text-sm">
              Image coming soon
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="py-2 space-y-3 flex-grow flex flex-col justify-between">
          {/* Title */}
          <CardTitle
            className="text-lg font-semibold leading-snug text-white truncate"
            title={game.title}
          >
            {game.title}
          </CardTitle>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-2">
            {topGenres.map((g) => (
              <span key={g.id} className={chip}>
                {g.name}
              </span>
            ))}
          </div>

          {/* Publisher + Date */}
          <div className="flex items-center justify-between text-sm font-medium mt-auto">
            <span className="text-neutral-400 truncate">{game.publisher?.name}</span>
            <span className="text-neutral-400">{formattedDate}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LibraryGameCard;
