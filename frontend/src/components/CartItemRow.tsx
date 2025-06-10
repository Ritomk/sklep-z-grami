import type { FC } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export interface Genre {
  id: number;
  name: string;
}

export interface Publisher {
  id: number;
  name: string;
  website?: string | null;
}

export interface Game {
  id: number;
  title: string;
  price: number;
  release_date: string;
  genres: Genre[];
  publisher: Publisher;
  cover_image?: string | null;
}

export interface CartItem {
  id: number;
  game: Game;
  quantity: number;
}

interface Props {
  item: CartItem;
  onUpdate: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}

const CartItemRow: FC<Props> = ({ item, onUpdate, onRemove }) => {
  const price = (Number(item.game.price) * item.quantity).toFixed(2);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-between bg-neutral-800 rounded-xl shadow p-4 gap-4"
    >
      {/* LEFT – cover + basic info */}
      <div className="flex gap-4 items-center flex-1 min-w-0">
        {item.game.cover_image ? (
          <img
            src={item.game.cover_image}
            alt={item.game.title}
            className="w-20 h-28 object-cover rounded"
          />
        ) : (
          <div className="w-20 h-28 bg-neutral-700 rounded flex items-center justify-center text-xs text-neutral-500">
            No image
          </div>
        )}

        <div className="flex flex-col min-w-0">
          <h3
            className="font-semibold text-white truncate"
            title={item.game.title}
          >
            {item.game.title}
          </h3>
          <span className="text-sm text-neutral-400">
            {item.game.publisher?.name}
          </span>

          {/* Quantity controls */}
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => onUpdate(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="rounded bg-neutral-700 p-1 disabled:opacity-40"
            >
              <Minus size={14} />
            </button>
            <span className="px-2">{item.quantity}</span>
            <button
              onClick={() => onUpdate(item.id, item.quantity + 1)}
              className="rounded bg-neutral-700 p-1"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT – price + remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="font-bold text-white">PLN {price}</span>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-400"
          title="Usuń z koszyka"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.li>
  );
};

export default CartItemRow;
