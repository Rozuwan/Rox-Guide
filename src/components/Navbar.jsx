import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, Terminal, Layers } from "lucide-react";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      setMobileMenuOpen(false);
      navigate("/login");
    }
  };

  // Only render navbar if user is logged in
  if (!currentUser) return null;

  const linkClass = ({ isActive }) =>
    `text-xs font-mono tracking-wider transition-all px-3 py-1.5 rounded-full ${
      isActive
        ? "text-white bg-neutral-900 border border-neutral-800"
        : "text-neutral-400 hover:text-white hover:bg-neutral-900/40"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `text-sm font-mono tracking-widest block w-full py-3 border-b border-neutral-900 ${
      isActive ? "text-white font-bold" : "text-neutral-400 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-900 px-6 h-16 flex items-center justify-between">
      {/* Left: Logo & Nav Links */}
      <div className="flex items-center gap-8">
        <div 
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          {/* Stark Vercel Triangle */}
          <svg viewBox="0 0 75 65" fill="none" className="w-5.5 h-5.5 text-white">
            <path d="M37.5 0L75 65H0L37.5 0Z" fill="currentColor" />
          </svg>
          <span className="font-bold text-white text-base tracking-tight">RoxGuide</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/dashboard" className={linkClass}>
            DASHBOARD
          </NavLink>
          <NavLink to="/topics" className={linkClass}>
            TOPICS
          </NavLink>
        </div>
      </div>

      {/* Right: User Email & Logout Action */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111] border border-neutral-800 text-neutral-400 text-xs font-mono">
          <Terminal size={12} className="text-neutral-500" />
          <span className="max-w-[180px] truncate">{currentUser?.email}</span>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-800 text-neutral-400 text-xs font-medium hover:bg-neutral-950 hover:text-white hover:border-neutral-700 transition-all cursor-pointer"
        >
          <LogOut size={12} />
          <span>Log out</span>
        </button>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-neutral-400 hover:text-white p-1"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black border-b border-neutral-900 px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200 md:hidden z-40">
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileLinkClass}
            >
              DASHBOARD
            </NavLink>
            <NavLink
              to="/topics"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileLinkClass}
            >
              TOPICS
            </NavLink>
          </div>

          {/* Mobile User Details */}
          <div className="pt-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111] border border-neutral-800 text-neutral-400 text-xs font-mono">
              <Terminal size={13} className="text-neutral-500" />
              <span className="truncate">{currentUser?.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <LogOut size={13} />
              <span>LOG OUT</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
