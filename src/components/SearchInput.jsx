import { Search, X } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 sm:h-10 pl-10 pr-10 bg-[#111] border border-neutral-800 rounded-full text-white text-base sm:text-xs font-mono placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-neutral-700 hover:border-neutral-700 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
