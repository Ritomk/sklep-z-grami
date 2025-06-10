import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import api from "../lib/api";
import CartItemRow from "@/components/CartItemRow";
import type { CartItem } from "@/components/CartItemRow";
import { Button } from "@/components/ui/button";

interface CartResponse {
  id: number;
  items: CartItem[];
  total_price: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<CartResponse>("/cart/");
      setCart(data);
    } catch (err) {
      console.error("Fetch cart failed:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await api.patch(`/cart/update/${itemId}/`, { quantity });
      fetchCart();
    } catch (err) {
      console.error("Update cart item failed:", err);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await api.delete(`/cart/remove/${itemId}/`);
      fetchCart();
    } catch (err) {
      console.error("Remove cart item failed:", err);
    }
  };

  const checkout = async () => {
    if (!cart) return;
    try {
      await Promise.all(
        cart.items.map((i) =>
          api.post("/library/", { game: i.game.id })
        )
      );
      await Promise.all(
        cart.items.map((i) =>
          api.delete(`/cart/remove/${i.id}/`)
        )
      );
      alert("Order completed! Check your library.");
      fetchCart();
      navigate("/library");
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong during checkout.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = useMemo(() => {
    return cart?.items
      .reduce((sum, i) => sum + Number(i.game.price) * i.quantity, 0)
      .toFixed(2);
  }, [cart]);

  if (loading) {
    return (
     <div className="flex items-center justify-center h-screen bg-neutral-900 text-neutral-400">
       Loading cart…
     </div>
   );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 text-neutral-400">
        <ShoppingCart size={56} className="mb-4 opacity-40" />
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-900 text-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-neutral-900/80 backdrop-blur p-4 border-b border-neutral-800">
          <h1 className="text-2xl font-bold">Your Cart</h1>
        </header>

        {/* Cart list */}
        <section className="flex-1 overflow-y-auto p-4">
          <AnimatePresence initial={false}>
            <motion.ul
              layout
              className="space-y-4 max-w-4xl mx-auto"
            >
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdate={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </motion.ul>
          </AnimatePresence>
        </section>

        {/* Footer */}
        <footer className="p-4 border-t border-neutral-800 bg-neutral-900/80 backdrop-blur">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="text-xl font-semibold">
              Total: PLN&nbsp;{totalPrice}
            </span>
            <Button
              onClick={checkout}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
            >
              Checkout
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
