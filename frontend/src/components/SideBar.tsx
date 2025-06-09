import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  Library as LibraryIcon,
  ShoppingBag,
  ShoppingCart,  
  Menu,
  LogOut,
  LogIn,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";     
      

type NavItem = {
  to?: string;
  onClick?: () => void;
  label: string;
  icon: LucideIcon;
  guard?: "auth" | "guest";
};

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname") ?? undefined;

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("nickname");
    setIsAuthenticated(false);
    navigate("/logout");                          
  };

  const navItems: NavItem[] = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/store", label: "Store", icon: ShoppingBag },
    { to: "/cart", label: "Cart", icon: ShoppingCart, guard: "auth" }, 
    { to: "/library", label: "Library", icon: LibraryIcon, guard: "auth" },
    { onClick: logout, label: "Logout", icon: LogOut, guard: "auth" },
    { to: "/login", label: "Login", icon: LogIn, guard: "guest" },
  ];

  const filtered = navItems.filter((item) =>
    item.guard === "auth"
      ? isAuthenticated
      : item.guard === "guest"
      ? !isAuthenticated
      : true
  );

  return (
    <aside
      className={`hidden md:flex ${
        open ? "w-60" : "w-16"
      } bg-neutral-800 text-neutral-200 p-4 flex-col gap-4 transition-all`}
    >
      {/* przycisk zwijania */}
      <button
        onClick={() => setOpen(!open)}
        className="self-end mb-2 p-1 hover:bg-neutral-700 rounded"
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        <Menu size={20} />
      </button>

      {/* NICK nad przyciskiem Home */}
      {isAuthenticated && nickname && (
        <div
          title={nickname}
          className="text-yellow-400 font-bold text-lg mb-1 px-1 truncate"
        >
          {open ? nickname : nickname[0].toUpperCase()}
        </div>
      )}

      {/* nawigacja */}
      {filtered.map(({ to, onClick, label, icon: Icon }) =>
        to ? (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors"
          >
            <Icon size={20} />
            {open && <span>{label}</span>}
          </Link>
        ) : (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors"
          >
            <Icon size={20} />
            {open && <span>{label}</span>}
          </button>
        )
      )}
    </aside>
  );
}
