import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Genre = {
  id: number;
  name: string;
};

type Publisher = {
  id: number;
  name: string;
  website?: string | null;
};

interface Game {
  id: number;
  title: string;
  price: number;
  release_date: string;
  genres: Genre[];
  publisher: Publisher;
  cover_image?: string | null;
}

interface CartItem {
  id: number;
  game: Game;
  quantity: number;
}

interface CartResponse {
  id: number;
  items: CartItem[];
  total_price: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pobierz zawartość koszyka
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<CartResponse>("/cart/");
      setCart(data);
    } catch (err) {
      console.error("Fetch cart failed:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Zaktualizuj ilość pozycji
  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await api.patch(`/cart/update/${itemId}/`, { quantity });
      fetchCart();
    } catch (err) {
      console.error("Update cart item failed:", err);
    }
  };

  // Usuń pozycję z koszyka
  const removeItem = async (itemId: number) => {
    try {
      await api.delete(`/cart/remove/${itemId}/`);
      fetchCart();
    } catch (err) {
      console.error("Remove cart item failed:", err);
    }
  };

  // Finalizacja zamówienia (tworzy Order i przenosi do biblioteki)
  const checkout = async () => {
    if (!cart) return;
    try {
      // Tworzymy Order na backendzie (nie było endpointu w zadaniu, więc
      // na razie tylko przenosimy wszystkie gry do biblioteki i czyścimy koszyk).
      for (const item of cart.items) {
        await api.post("/library/", { game: item.game.id });
      }
      // Po dodaniu do biblioteki czyścimy koszyk po kolei
      for (const item of cart.items) {
        await api.delete(`/cart/remove/${item.id}/`);
      }
      alert("Order completed! Check your library.");
      fetchCart();
      navigate("/library");
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong during checkout.");
    }
  };

  if (loading) {
    return <div className="p-8">Ładowanie koszyka…</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Twój Koszyk</h1>
        <div className="text-neutral-500">Twój koszyk jest pusty.</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Twój Koszyk</h1>
      <ul className="space-y-4">
        {cart.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between bg-neutral-800 p-4 rounded-xl shadow"
          >
            <div className="flex gap-4">
              {item.game.cover_image && (
                <img
                  src={item.game.cover_image}
                  alt={item.game.title}
                  className="w-24 h-32 object-cover rounded"
                />
              )}
              <div>
                <h2 className="text-lg font-semibold">{item.game.title}</h2>
                <div className="text-neutral-400 text-sm">
                  {item.game.publisher?.name}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 bg-neutral-700 rounded disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="text-white">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-neutral-700 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-white font-bold">
                PLN {(Number(item.game.price) * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-400"
              >
                <Trash2 />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-xl font-semibold">
          Suma: PLN {Number(cart.total_price).toFixed(2)}
        </span>
        <Button
          onClick={checkout}
          className="bg-green-500 hover:bg-green-400 text-white"
        >
          Wrzuć do Biblioteki (Checkout)
        </Button>
      </div>
    </div>
  );
}
