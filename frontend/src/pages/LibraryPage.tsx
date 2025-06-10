import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search as SearchIcon } from "lucide-react";

import api from "../lib/api";
import LibraryGameCard from "@/components/LibraryGameCard";
import type { Game as LibraryGame } from "@/components/LibraryGameCard";

type GenreFilter =
  | "All"
  | "Action"
  | "Adventure"
  | "RPG"
  | "Indie"
  | "Strategy"
  | "Racing";

export default function LibraryPage() {
  const [games, setGames] = useState<LibraryGame[]>([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<GenreFilter>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/library/", { signal: controller.signal })
      .then((res) => setGames(res.data))
      .catch(() => setGames([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      const s = search.toLowerCase();
      const matchesSearch = g.title.toLowerCase().includes(s);
      const matchesGenre =
        genreFilter === "All" || g.genres.some((gen) => gen.name === genreFilter);
      return matchesSearch && matchesGenre;
    });
  }, [games, search, genreFilter]);

  if (loading)
    return <div className="p-8 text-neutral-400">Library is loading…</div>;

  return (
    <div className="flex h-screen bg-neutral-900 text-white font-sans">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-neutral-900/80 backdrop-blur p-4 flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
              size={18}
            />
            <Input
              type="search"
              placeholder="Search games..."
              className="pl-10 bg-neutral-800 border-neutral-700 focus:border-yellow-500 focus:ring-yellow-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Genre filter */}
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

        {/* Grid */}
        <section className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <p className="text-center text-neutral-400">
              You don't have any games.
            </p>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
            >
              {filtered.map((g) => (
                <LibraryGameCard key={g.id} game={g} />
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
