import { useEffect, useMemo, useState, type FC } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import GameCard from "@/components/GameCard";
import type { Game } from "@/components/GameCard";

/* -------------------------------------------------------------------------- */
/*                               Sidebar bits                                 */
/* -------------------------------------------------------------------------- */

const NavItem: FC<{ icon: LucideIcon; label: string }> = ({ icon: Icon, label }) => (
  <button
    className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors"
    aria-label={label}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const Sidebar: FC = () => (
  <aside className="hidden md:flex md:w-60 bg-neutral-800 text-neutral-200 p-4 flex-col gap-4">
    <NavItem icon={HomeIcon} label="Home" />
    <NavItem icon={LibraryIcon} label="Library" />
    <NavItem icon={ShoppingBag} label="Store" />
  </aside>
);

/* -------------------------------------------------------------------------- */
/*                             Main page component                             */
/* -------------------------------------------------------------------------- */

type GenreFilter =
  | "All"
  | "Action"
  | "Adventure"
  | "RPG"
  | "Indie"
  | "Strategy"
  | "Racing";

const GamesCatalog: FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<GenreFilter>("All");

  /* ------------------------ fetch from Django REST ------------------------ */
useEffect(() => {
  const controller = new AbortController();

  fetch("http://127.0.0.1:8000/api/games/", { signal: controller.signal })
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(setGames)
    .catch((err) => {
      if (err.name === "AbortError") return; // ignorujemy
      console.error("Games fetch failed:", err);
    });

  return () => controller.abort();
}, []);


  /* --------------------------- derived listing ---------------------------- */
  const filtered = useMemo(() => {
    return games.filter((g) => {
      const s = search.toLowerCase();
      const matchesSearch = g.title.toLowerCase().includes(s);
      const matchesGenre =
        genreFilter === "All" || g.genres.some((gen) => gen.name === genreFilter);
      return matchesSearch && matchesGenre;
    });
  }, [games, search, genreFilter]);

  /* ------------------------------- render --------------------------------- */
  return (
    <div className="flex h-screen bg-neutral-900 text-white font-sans">
      <Sidebar />

      {/* ---------------------------- content ---------------------------- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* header */}
        <header className="sticky top-0 z-20 bg-neutral-900/80 backdrop-blur p-4 flex flex-col md:flex-row md:items-center gap-4">
          {/* search */}
          <div className="relative flex-1 max-w-xl">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
              size={18}
            />
            <Input
              type="search"
              placeholder="Search games…"
              className="pl-10 bg-neutral-800 border-neutral-700 focus:border-yellow-500 focus:ring-yellow-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* genre filter */}
          <Select
            value={genreFilter}
            onValueChange={(v) => setGenreFilter(v as GenreFilter)}
          >
            <SelectTrigger className="w-44 bg-neutral-800 border-neutral-700 focus:border-yellow-500 focus:ring-yellow-500">
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
                <SelectItem key={g} value={g as GenreFilter} className="capitalize">
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        {/* grid */}
        <section className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <p className="text-center text-neutral-400">No games found.</p>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {filtered.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default GamesCatalog;
