import { Terminal, BookOpen, MessageSquare } from "lucide-react";

export default function AuthLayout({ children, gradientClass = "from-[#007cf0] via-[#7928ca] to-[#ff4d4d]" }) {
  return (
    <div className="min-h-screen bg-black text-[#fafafa] font-sans antialiased flex relative overflow-hidden">
      {/* Vercel Ambient Mesh Gradient Background */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-20 blur-[120px] bg-gradient-to-tr ${gradientClass}`} />

      {/* Left Marketing Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative z-10 border-r border-neutral-900 bg-black/50 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <svg viewBox="0 0 75 65" fill="none" className="w-8 h-8 text-white">
              <path d="M37.5 0L75 65H0L37.5 0Z" fill="currentColor" />
            </svg>
            <span className="font-bold text-white text-xl tracking-tight">RoxGuide</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold tracking-tighter text-white mb-6 leading-tight">
            Build guides.<br/>
            Share knowledge.<br/>
            Answer questions.
          </h1>
          
          <div className="space-y-6 mt-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#00dfd8]">
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Markdown Guides</h3>
                <p className="text-neutral-400 text-xs mt-1">Deploy rich, formatted knowledge bases instantly.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#7928ca]">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Community Q&A</h3>
                <p className="text-neutral-400 text-xs mt-1">Inline discussions and question resolution.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#f9cb28]">
                <Terminal size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Knowledge Sharing</h3>
                <p className="text-neutral-400 text-xs mt-1">Organize and distribute technical documentation.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-neutral-500 font-mono">
          © {new Date().getFullYear()} RoxGuide Inc. All rights reserved.
        </div>
      </div>

      {/* Right Authentication Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo (Visible only on mobile) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <svg viewBox="0 0 75 65" fill="none" className="w-6 h-6 text-white">
              <path d="M37.5 0L75 65H0L37.5 0Z" fill="currentColor" />
            </svg>
            <span className="font-bold text-white text-xl tracking-tight">RoxGuide</span>
          </div>

          <div className="bg-[#111]/80 backdrop-blur-xl border border-neutral-800 rounded-[20px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.8)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
