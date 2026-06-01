import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import ErrorMessage from "../components/ErrorMessage";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await signup(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <AuthLayout gradientClass="from-[#00dfd8] via-[#7928ca] to-[#ff0080]">
      <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Create an account</h2>
      <p className="text-sm text-neutral-400 mb-8">Start organizing your markdown knowledge base today.</p>

      <ErrorMessage error={error} className="mb-6" />

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 sm:h-10 px-4 bg-black border border-neutral-800 rounded-lg sm:rounded-full text-white text-base sm:text-xs font-mono focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-neutral-700 transition-all placeholder-neutral-700"
            required
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-xs font-mono uppercase mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-12 sm:h-10 px-4 bg-black border border-neutral-800 rounded-lg sm:rounded-full text-white text-base sm:text-xs font-mono focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-neutral-700 transition-all placeholder-neutral-700"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 sm:h-10 bg-white text-black hover:bg-neutral-200 rounded-full font-semibold text-sm sm:text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-6 shadow-[0_4px_14px_rgba(255,255,255,0.15)]"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-neutral-900 text-center">
        <p className="text-sm text-neutral-400">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-medium hover:underline transition-all">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
