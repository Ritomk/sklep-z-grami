import type { FC } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export interface Genre {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  title: string;
  price: number;
  release_date: string;
  genres: Genre[];
  cover_image?: string | null;
}

const chip =
  "w-24 text-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide bg-yellow-500/10 text-yellow-400 border border-yellow-400/40";

interface Props {
  game: Game;
}

const GameCard: FC<Props> = ({ game }) => {
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
      <Link to={`/games/${game.id}`} className="block h-full">
        <Card className="bg-neutral-800 border-0 hover:bg-neutral-700 transition-colors cursor-pointer h-full flex flex-col overflow-hidden p-0">
          {/* Cover */}
          <div className="aspect-[2/3] w-full overflow-hidden">
            {game.cover_image ? (
              <img
                src={game.cover_image}
                alt={game.title}
                loading="lazy"
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-neutral-700 text-neutral-500 text-sm">
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

            {/* Date + Price */}
            <div className="flex items-center justify-between text-sm font-medium mt-auto">
              <span className="text-neutral-400">{formattedDate}</span>
              <span className="text-green-400 text-base font-bold">
                PLN {Number(game.price).toFixed(0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default GameCard;
