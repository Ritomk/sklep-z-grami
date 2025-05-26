import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Loader } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  /* formularz */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* UI / walidacja */
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (mail: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  const formValid =
    validateEmail(email) && password.length >= 1 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;

    try {
      setLoading(true);
      const { data } = await api.post("token/", { email, password });
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("nickname", data.nickname);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err: any) {
      const msg =
        err.response?.status === 401
          ? "Nieprawidłowy e-mail lub hasło."
          : "Błąd logowania.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <div className="flex w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-neutral-800 flex-col md:flex-row">
        {/* lewy panel */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-yellow-600 to-yellow-400">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Welcome to RabbitGames
          </h2>
          <p className="text-lg text-neutral-900">
            Buy, discover, play – all in one place.
          </p>
        </div>

        {/* prawy panel */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-2 rounded text-neutral-400 hover:bg-neutral-700 hover:text-yellow-400 transition w-fit mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Go back</span>
          </button>

          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            Sign in
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full"
            noValidate
          >
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="px-4 py-3 rounded-lg bg-neutral-700 text-yellow-300 placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {!validateEmail(email) && email && (
              <p className="text-red-500 text-sm">Nieprawidłowy adres e-mail.</p>
            )}

            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="px-4 py-3 rounded-lg bg-neutral-700 text-yellow-300 placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={!formValid}
              className="bg-yellow-500 disabled:bg-yellow-800 transition text-neutral-900 font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              Sign in
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-neutral-400">Don't have an account?</span>{" "}
            <a
              href="/register"
              className="text-yellow-400 font-bold hover:underline"
            >
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
