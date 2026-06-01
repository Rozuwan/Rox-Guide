import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ error, className = "mb-4" }) {
  if (!error) return null;

  return (
    <div className={`flex items-start gap-3 p-4 bg-red-950/40 border border-red-900/50 text-[#ee0000] rounded-lg ${className}`}>
      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-[10px] font-bold font-mono tracking-wider uppercase mb-1 opacity-80">System Error</p>
        <p className="text-sm font-sans leading-relaxed">{error}</p>
      </div>
    </div>
  );
}
