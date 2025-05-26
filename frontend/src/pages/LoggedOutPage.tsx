import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function LoggedOut() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("nickname");
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <div className="flex w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-neutral-800 flex-col md:flex-row">
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-yellow-600 to-yellow-400">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            See you soon!
          </h2>
          <p className="text-lg text-neutral-900">
            You’ve been logged out successfully.
          </p>
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center gap-6">
          <h2 className="text-2xl font-bold text-yellow-400 text-center">
            Logged out
          </h2>

          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-yellow-500 text-neutral-900 font-bold hover:bg-yellow-400 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
