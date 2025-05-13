import React, { FC, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Library as LibraryIcon,
  ShoppingBag,
  LucideIcon,
} from "lucide-react";

/**
 * Domain types
 * -------------------------------------------------------------------------- */
interface Game {
  id: string;
  title: string;
  genre: Genre;
  price: number;
  cover: string;
}

type Genre =
  | "All"
  | "Action"
  | "Adventure"
  | "RPG"
  | "Indie"
  | "Strategy"
  | "Racing";

/**
 * Hard‑coded placeholder data. Replace with API data once backend is ready.
 */
const gamesData: Game[] = [
  {
    id: "1",
    title: "CyberStrike 2077",
    genre: "Action",
    price: 59.99,
    cover: "https://via.placeholder.com/300x400?text=CyberStrike+2077",
  },
  {
    id: "2",
    title: "Mystic Quest",
    genre: "RPG",
    price: 49.99,
    cover: "https://via.placeholder.com/300x400?text=Mystic+Quest",
  },
  {
    id: "3",
    title: "Shadow Runner",
    genre: "Adventure",
    price: 39.99,
    cover: "https://via.placeholder.com/300x400?text=Shadow+Runner",
  },
  {
    id: "4",
    title: "Indie Valley",
    genre: "Indie",
    price: 19.99,
    cover: "https://via.placeholder.com/300x400?text=Indie+Valley",
  },
  {
    id: "5",
    title: "Galactic Wars",
    genre: "Strategy",
    price: 29.99,
    cover: "https://via.placeholder.com/300x400?text=Galactic+Wars",
  },
  {
    id: "6",
    title: "Kart Legends",
    genre: "Racing",
    price: 24.99,
    cover: "https://via.placeholder.com/300x400?text=Kart+Legends",
  },
];

/**
 * Sidebar navigation stub — icons only for now. Hook up routing later.
 */
const Sidebar: FC = () => (
  <aside className="hidden md:flex md:w-60 bg-neutral-800 text-neutral-200 p-4 flex-col gap-4">
    <NavItem icon={HomeIcon} label="Home" />
    <NavItem icon={LibraryIcon} label="Library" />
    <NavItem icon={ShoppingBag} label="Store" />
  </aside>
);

interface NavItemProps {
  icon: LucideIcon;
  label: string;
}

const NavItem: FC<NavItemProps> = ({ icon: Icon, label }) => (
  <button
    className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors"
    aria-label={label}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

interface GameCardProps {
  game: Game;
}

const GameCard: FC<GameCardProps> = ({ game }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="bg-neutral-800 border-0 hover:bg-neutral-700 transition-colors">
      <CardHeader className="p-0 relative">
        <img
          src={game.cover}
          alt={game.title}
          className="w-full h-48 object-cover rounded-t-2xl"
          loading="lazy"
        />
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-base truncate" title={game.title}>
          {game.title}
        </CardTitle>
        <p className="text-sm text-neutral-400">{game.genre}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold">${game.price.toFixed(2)}</span>
          <Button size="sm" variant="secondary" className="rounded-full">
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

/**
 * Main catalog page — replace hard‑coded data and handlers once backend is live.
 */
const GamesCatalog: FC = () => {
  const [search, setSearch] = useState<string>("");
  const [genreFilter, setGenreFilter] = useState<Genre>("All");

  // Apply search + filter locally for now
  const filteredGames = useMemo(() => {
    return gamesData.filter((g) => {
      const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genreFilter === "All" || g.genre === genreFilter;
      return matchesSearch && matchesGenre;
    });
  }, [search, genreFilter]);

  return (
    <div className="flex h-screen bg-neutral-900 text-white font-sans">
      <Sidebar />
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-neutral-900/80 backdrop-blur p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={18} />
            <Input
              type="search"
              placeholder="Search games…"
              className="pl-10 bg-neutral-800 border-neutral-700 focus:border-emerald-500 focus:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-44 bg-neutral-800 border-neutral-700 focus:border-emerald-500 focus:ring-emerald-500">
              <span>{genreFilter}</span>
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 text-white border-neutral-700">
              {[
                "All",
                "Action",
                "Adventure",
                "RPG",
                "Indie",
                "Strategy",
                "Racing",
              ].map((g) => (
                <SelectItem key={g} value={g as Genre} className="capitalize">
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        {/* Scrollable catalog grid */}
        <section className="flex-1 overflow-y-auto p-4">
          {filteredGames.length === 0 ? (
            <p className="text-center text-neutral-400">No games found.</p>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default GamesCatalog;