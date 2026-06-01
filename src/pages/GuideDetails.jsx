import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { 
  ArrowLeft, 
  Terminal, 
  MessageSquare, 
  HelpCircle, 
  MessageCircle, 
  CheckCircle2, 
  Send,
  BookOpen,
  Calendar,
  Sparkles,
  Edit2,
  Trash2
} from "lucide-react";
import ErrorMessage from "../components/ErrorMessage";
export default function GuideDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [guide, setGuide] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nickname, setNickname] = useState("");
  const [type, setType] = useState("question");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const isGuideOwner = currentUser?.id === guide?.user_id;

  async function fetchInteractions(guideId) {
    const { data, error } = await supabase
      .from("interactions")
      .select("*")
      .eq("guide_id", guideId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setInteractions(data || []);
    }
  }

  useEffect(() => {
    async function fetchGuideAndInteractions() {
      setLoading(true);
      setError("");

      const { data: guideData, error: guideError } = await supabase
        .from("guides")
        .select("*")
        .eq("slug", slug)
        .single();

      if (guideError) {
        setError(guideError.message);
        setLoading(false);
        return;
      }

      setGuide(guideData);
      await fetchInteractions(guideData.id);
      setLoading(false);
    }

    fetchGuideAndInteractions();
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

      const { error } = await supabase.from("interactions").insert({
        nickname,
        type,
        content,
        guide_id: guide.id,
        answered: false,
      });

    if (error) {
      setError(error.message);
    } else {
      setNickname("");
      setType("question");
      setContent("");
      await fetchInteractions(guide.id);
    }

    setSubmitting(false);
  }

  async function markAnswered(interactionId) {
    const { error } = await supabase
      .from("interactions")
      .update({ answered: true })
      .eq("id", interactionId);

    if (error) {
      setError(error.message);
    } else {
      await fetchInteractions(guide.id);
    }
  }

  async function handleDeleteGuide() {
    if (!window.confirm("Are you sure you want to delete this guide and all its discussions?")) return;
    const { error } = await supabase.from("guides").delete().eq("id", guide.id);
    if (error) setError(error.message);
    else navigate(-1);
  }

  async function handleSaveGuideEdit() {
    setError("");
    const { error } = await supabase
      .from("guides")
      .update({ title: editTitle, content: editContent })
      .eq("id", guide.id);

    if (error) {
      setError(error.message);
    } else {
      setGuide({ ...guide, title: editTitle, content: editContent });
      setIsEditingGuide(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#fafafa] font-sans antialiased relative overflow-hidden">
        {/* Vercel Ambient Mesh Gradient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none opacity-10 blur-[130px] bg-gradient-to-tr from-[#7928ca] via-[#ff0080] to-[#f9cb28]" />

        {/* Top Navbar Skeleton */}
        <nav className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-neutral-900 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-5 h-5 bg-neutral-800 rounded-full" />
            <div className="h-4 w-20 bg-neutral-800 rounded" />
          </div>
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-20 h-7 bg-[#111] rounded-full border border-neutral-800" />
          </div>
        </nav>

        {/* Main Grid Container Skeleton */}
        <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="h-4 w-28 bg-neutral-900 rounded font-mono mb-6 animate-pulse" />

          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-10">
            {/* Left: Guide Content Skeleton (70%) */}
            <div className="lg:col-span-7 space-y-8 animate-pulse">
              <div className="pb-8 border-b border-neutral-900">
                <div className="h-5 w-48 bg-[#111] border border-[#222] rounded-full mb-4" />
                <div className="h-10 w-3/4 bg-neutral-800 rounded-lg mb-4" />
                <div className="h-4 w-40 bg-neutral-900 rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-5 w-full bg-neutral-800 rounded" />
                <div className="h-4 w-5/6 bg-neutral-900 rounded" />
                <div className="h-4 w-11/12 bg-neutral-900 rounded" />
                <div className="h-4 w-3/4 bg-neutral-900 rounded" />
                <div className="h-28 w-full bg-[#111] border border-neutral-900 rounded-[8px] mt-8" />
              </div>
            </div>

            {/* Right: Community Panel Skeleton (30%) */}
            <div className="lg:col-span-3 space-y-6 animate-pulse">
              <div className="bg-[#111] border border-neutral-900 rounded-[12px] p-6 h-[450px] flex flex-col justify-between">
                <div>
                  <div className="h-5 w-36 bg-neutral-800 rounded mb-6" />
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-black border border-neutral-900 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="h-3 w-16 bg-neutral-800 rounded" />
                          <div className="h-3 w-12 bg-neutral-800 rounded" />
                        </div>
                        <div className="h-3 w-full bg-neutral-900 rounded" />
                        <div className="h-3 w-5/6 bg-neutral-900 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-10 w-full bg-black border border-neutral-800 rounded-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-[#fafafa] font-sans px-6">
        <div className="text-center flex flex-col items-center bg-[#111] border border-neutral-900 rounded-[12px] p-12 max-w-md w-full">
          <ErrorMessage error={error} className="mb-6 w-full text-left" />
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition-all inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={13} />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  if (!guide) return null;

  return (
    <div className="min-h-screen bg-black text-[#fafafa] font-sans antialiased relative overflow-hidden">
      {/* Vercel Ambient Mesh Gradient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none opacity-20 blur-[130px] bg-gradient-to-tr from-[#7928ca] via-[#ff0080] to-[#f9cb28]" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-neutral-900 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg 
            viewBox="0 0 75 65" 
            fill="none" 
            className="w-6 h-6 text-white cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <path d="M37.5 0L75 65H0L37.5 0Z" fill="currentColor" />
          </svg>
          <span className="font-bold text-white text-base tracking-tight cursor-pointer" onClick={() => navigate("/dashboard")}>RoxGuide</span>
          <span className="text-neutral-800 font-mono">/</span>
          <span className="text-neutral-400 font-mono text-xs max-w-[120px] sm:max-w-[200px] truncate">{guide.title}</span>
        </div>

        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-800 text-neutral-400 text-xs font-medium hover:bg-neutral-950 hover:text-white transition-all"
          >
            <ArrowLeft size={12} />
            <span>Dashboard</span>
          </button>
        </div>
      </nav>

      {/* Main Grid Workspace */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Breadcrumb Back Link */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors mb-6"
        >
          <ArrowLeft size={12} />
          <span>BACK_TO_TOPIC</span>
        </button>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-10">
          
          {/* Left Column: Guide Content (70%) */}
          <div className="lg:col-span-7">
            {/* Guide Header Banner */}
            <div className="pb-8 border-b border-neutral-900 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#111] border border-[#222] text-[#50e3c2] text-xs font-mono tracking-wider">
                  <Terminal size={12} />
                  <span>DEPLOYED_DOCUMENT // {guide.slug}</span>
                </div>
                {isGuideOwner && !isEditingGuide && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditTitle(guide.title);
                        setEditContent(guide.content);
                        setIsEditingGuide(true);
                      }}
                      className="h-9 w-9 rounded-full flex items-center justify-center transition-all bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white"
                      title="Edit Guide"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={handleDeleteGuide}
                      className="h-9 w-9 rounded-full flex items-center justify-center transition-all bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/60 hover:text-red-300"
                      title="Delete Guide"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {isEditingGuide ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full h-12 px-4 bg-black border border-neutral-800 rounded-full text-white text-xl font-bold focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-h-[300px] p-4 bg-black border border-neutral-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-white/40 leading-relaxed"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveGuideEdit} className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-neutral-200 transition-all">Save changes</button>
                    <button onClick={() => setIsEditingGuide(false)} className="px-5 py-2 bg-neutral-900 text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4.5xl font-bold tracking-tighter text-white mb-4 font-sans leading-tight break-words">
                    {guide.title}.
                  </h1>
                  
                  {/* Metadata Bar */}
                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>
                        {guide.created_at 
                          ? new Date(guide.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </span>
                    <span className="text-neutral-800">|</span>
                    <span className="text-[#50e3c2]">MARKDOWN_VERIFIED</span>
                  </div>
                </>
              )}
            </div>

            {/* Custom Styled Markdown Content Container */}
            <article className="prose prose-invert max-w-none text-neutral-300 leading-relaxed text-sm sm:text-base space-y-6">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight pt-6 pb-2 border-b border-neutral-900">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-4 pb-1">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight pt-2">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 text-neutral-300 font-sans leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4 text-neutral-300">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-4 text-neutral-300">{children}</ol>,
                  li: ({ children }) => <li className="font-sans">{children}</li>,
                  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0070f3] hover:underline transition-all font-medium inline-flex items-center gap-0.5">{children}</a>,
                  code: ({ inline, className, children }) => {
                    return inline ? (
                      <code className="bg-[#111] border border-neutral-800 text-white px-1.5 py-0.5 rounded font-mono text-xs">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-[#111] border border-neutral-900 rounded-[8px] p-4 overflow-x-auto text-white font-mono text-xs leading-relaxed my-4">
                        <code>{children}</code>
                      </pre>
                    );
                  }
                }}
              >
                {guide.content}
              </ReactMarkdown>
            </article>
          </div>

          {/* Right Column: Community Panel / Interactions (30%) */}
          <div className="lg:col-span-3 space-y-8">
            
            <div className="bg-[#111] border border-neutral-900 rounded-[12px] p-6 relative">
              <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare size={16} className="text-neutral-400" />
                <span>Discussion Thread</span>
              </h2>

              {/* Interactions feed */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 mb-8">
                {interactions.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-neutral-800 rounded-lg bg-black/40">
                    <p className="text-xs text-neutral-400 font-mono font-bold uppercase tracking-wider">No questions yet.</p>
                    <p className="text-xs sm:text-[10px] text-neutral-500 font-mono mt-1">Be the first to ask.</p>
                  </div>
                ) : (
                  interactions.map((interaction) => {
                    const isQuestion = interaction.type === "question";
                    
                    return (
                      <div 
                        key={interaction.id} 
                        className="bg-black border border-neutral-900 hover:border-neutral-800 rounded-lg p-4 transition-all duration-200"
                      >
                        {/* Discussion Card Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-sm sm:text-xs text-white truncate max-w-[120px]">
                            {interaction.nickname}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            {/* Type tag */}
                            <span className={`text-[10px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded-[4px] border ${
                              isQuestion 
                                ? "bg-indigo-950/40 text-indigo-400 border-indigo-900/50" 
                                : "bg-neutral-900 text-neutral-400 border-neutral-800"
                            }`}>
                              {interaction.type.toUpperCase()}
                            </span>

                            {/* Answered badge */}
                            {isQuestion && (
                              <span className={`text-[10px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded-[4px] border ${
                                interaction.answered 
                                  ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50" 
                                  : "bg-amber-950/40 text-amber-400 border-amber-900/50"
                              }`}>
                                {interaction.answered ? "RESOLVED" : "OPEN"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content text */}
                        <p className="text-sm sm:text-xs text-neutral-400 leading-relaxed break-words font-sans">
                          {interaction.content}
                        </p>

                        {/* Mark answered button - owner only */}
                        {isQuestion && !interaction.answered && isGuideOwner && (
                          <button
                            onClick={() => markAnswered(interaction.id)}
                            className="mt-3 w-full py-2 sm:py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white rounded-full text-xs sm:text-[10px] font-mono tracking-wider flex items-center justify-center gap-1 transition-all"
                          >
                            <CheckCircle2 size={10} className="text-emerald-400" />
                            <span>MARK_ANSWERED</span>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Interaction creation form */}
              <div className="border-t border-neutral-900 pt-6">
                <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-1.5 font-mono">
                  <Sparkles size={12} className="text-[#007cf0]" />
                  <span>SUBMIT_FEEDBACK</span>
                </h3>

                <ErrorMessage error={error} className="mb-4" />

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="h-10 sm:h-8 px-3 bg-black border border-neutral-800 rounded-lg sm:rounded-full text-white text-base sm:text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-white/40 placeholder-neutral-700"
                      required
                    />
                    <select 
                      value={type} 
                      onChange={(e) => setType(e.target.value)}
                      className="h-10 sm:h-8 px-3 bg-black border border-neutral-800 rounded-lg sm:rounded-full text-white text-base sm:text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-white/40 cursor-pointer"
                    >
                      <option value="question">Question</option>
                      <option value="comment">Comment</option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Type discussion content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[100px] sm:min-h-[80px] p-3 bg-black border border-neutral-800 rounded-xl text-white text-base sm:text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-white/40 leading-relaxed placeholder-neutral-700"
                    required
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-10 sm:h-9 bg-white text-black hover:bg-neutral-200 rounded-full text-xs sm:text-[10px] font-mono tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Send size={11} />
                    <span>{submitting ? "SENDING..." : "SUBMIT"}</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
