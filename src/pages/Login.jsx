import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await login(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <AuthLayout gradientClass="from-[#007cf0] via-[#7928ca] to-[#ff4d4d]">
      <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
      <p className="text-sm text-neutral-400 mb-8">Enter your credentials to access your workspace.</p>

      <ErrorMessage error={error} className="mb-6" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-neutral-400 text-xs font-mono uppercase mb-2">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 sm:h-10 px-4 bg-black border border-neutral-800 rounded-lg sm:rounded-full text-white text-base sm:text-xs font-mono focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-neutral-700 transition-all placeholder-neutral-700"
            required
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-xs font-mono uppercase mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 sm:h-10 px-4 bg-black border border-neutral-800 rounded-lg sm:rounded-full text-white text-base sm:text-xs font-mono focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-neutral-700 transition-all placeholder-neutral-700"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 sm:h-10 bg-white text-black hover:bg-neutral-200 rounded-full font-semibold text-sm sm:text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-4 shadow-[0_4px_14px_rgba(255,255,255,0.15)]"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-neutral-900 text-center">
        <p className="text-sm text-neutral-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white font-medium hover:underline transition-all">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
