// src/pages/LibraryPage.tsx
import { useEffect, useState } from "react";
import api from "../lib/api"; // <- Twój helper do axios/fetch

type Publisher = {
  id: number;
  name: string;
  website: string;
};

type Genre = {
  id: number;
  name: string;
};

type Game = {
  id: number;
  title: string;
  description: string;
  price: string;
  release_date: string;
  publisher: Publisher;
  genres: Genre[];
  cover_image: string | null;
};

export default function LibraryPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/library/")
      .then(res => setGames(res.data))
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Ładowanie biblioteki...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Twoja Biblioteka</h1>
      {games.length === 0 ? (
        <div className="text-neutral-500">Nie masz jeszcze żadnej gry w bibliotece.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <li key={game.id} className="bg-neutral-800 p-4 rounded-xl shadow flex flex-col">
              {game.cover_image && (
                <img
                  src={game.cover_image}
                  alt={game.title}
                  className="mb-2 h-48 object-cover rounded"
                />
              )}
              <div className="font-bold">{game.title}</div>
              <div className="text-neutral-400 text-sm">{game.publisher?.name}</div>
              <div className="my-2 text-xs text-neutral-300">
                Gatunki: {game.genres.map(g => g.name).join(", ")}
              </div>
              <div className="text-neutral-200 text-sm mt-auto">Cena: {game.price} zł</div>
              <div className="text-neutral-400 text-xs">Premiera: {game.release_date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
