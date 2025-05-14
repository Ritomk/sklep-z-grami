import type { FC } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                                 Data types                                 */
/* -------------------------------------------------------------------------- */

export interface Genre {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  title: string;
  price: number;
  release_date: string;   // ISO 8601 ‑we’ll format it locally
  genres: Genre[];
  cover_image?: string | null; // <‑‑not used yet
}

/* -------------------------------------------------------------------------- */
/*                               UI constants                                 */
/* -------------------------------------------------------------------------- */

const chip =
  "px-2 py-0.5 rounded text-xs font-semibold tracking-wide bg-yellow-500/10 text-yellow-400 border border-yellow-400/40";

/* -------------------------------------------------------------------------- */
/*                               Game card                                    */
/* -------------------------------------------------------------------------- */

interface Props {
  game: Game;
}

const GameCard: FC<Props> = ({ game }) => {
  const formattedDate = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(game.release_date));

  const topGenres = game.genres.slice(0, 3); // first three only

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Card is a link so it behaves like a button */}
      <Link to={`/games/${game.id}`} className="block">
        <Card className="bg-neutral-800 border-0 hover:bg-neutral-700 transition-colors cursor-pointer">
          {/* -------------- cover -------------- */}
          <CardHeader className="p-0 relative h-56 flex items-center justify-center bg-neutral-700 rounded-t-2xl">
            {/* leave the image out for now */}
            <span className="text-neutral-500 text-sm">Image coming soon</span>
          </CardHeader>

          {/* -------------- body -------------- */}
          <CardContent className="p-4 space-y-3">
            {/* genres */}
            <div className="flex flex-wrap gap-1">
              {topGenres.map((g) => (
                <span key={g.id} className={chip}>
                  {g.name}
                </span>
              ))}
            </div>

            {/* title */}
            <CardTitle
              className="text-base leading-tight line-clamp-2"
              title={game.title}
            >
              {game.title}
            </CardTitle>

            {/* date + price */}
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-neutral-400">{formattedDate}</span>
              <span>PLN {Number(game.price).toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default GameCard;
