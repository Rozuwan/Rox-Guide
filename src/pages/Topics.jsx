import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ErrorMessage from "../components/ErrorMessage";
import { 
  FolderPlus, 
  Terminal, 
  Layers, 
  ChevronRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";

export default function Topics() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  

  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function fetchTopics() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .order("created_at", { ascending: false });
      

    if (error) {
      setError(error.message);
    } else {
      setTopics(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchTopics();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const slug = generateSlug(title);

    const { error } = await supabase.from("topics").insert({
      title,
      description,
      slug,
      user_id: currentUser.id,
    });

    if (error) {
      setError(error.message);
    } else {
      setTitle("");
      setDescription("");
      await fetchTopics();
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#fafafa] font-sans antialiased relative overflow-hidden">
        {/* Vercel Ambient Mesh Gradient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none opacity-10 blur-[130px] bg-gradient-to-tr from-[#00dfd8] via-[#7928ca] to-[#ff0080]" />

        <Navbar />

        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="h-4 w-32 bg-neutral-900 rounded font-mono mb-6 animate-pulse" />

          {/* 2-Column Responsive Layout Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
            {/* Left Column: Form Skeleton */}
            <div className="lg:col-span-4">
              <div className="bg-[#111] border border-neutral-800 rounded-[12px] p-6 animate-pulse">
                <div className="h-5 w-40 bg-neutral-800 rounded mb-8" />
                <div className="space-y-6">
                  <div>
                    <div className="h-3 w-24 bg-neutral-800 rounded mb-2" />
                    <div className="h-10 w-full bg-black border border-neutral-800 rounded-full" />
                  </div>
                  <div>
                    <div className="h-3 w-32 bg-neutral-800 rounded mb-2" />
                    <div className="h-32 w-full bg-black border border-neutral-800 rounded-xl" />
                  </div>
                  <div className="h-10 w-full bg-neutral-800 rounded-full mt-4" />
                </div>
              </div>
            </div>

            {/* Right Column: Topics List Skeleton */}
            <div className="lg:col-span-6 space-y-6 animate-pulse">
              <div className="h-5 w-48 bg-neutral-900 rounded mb-2" />
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#111] border border-neutral-900 rounded-[12px] p-6 flex flex-col justify-between">
                    <div>
                      <div className="h-3 w-24 bg-neutral-900 rounded mb-4" />
                      <div className="h-5 w-1/2 bg-neutral-800 rounded mb-3" />
                      <div className="h-3 w-full bg-neutral-900 rounded mb-2" />
                      <div className="h-3 w-3/4 bg-neutral-900 rounded" />
                    </div>
                    <div className="flex justify-end mt-4 pt-4 border-t border-neutral-900/60">
                      <div className="w-24 h-8 bg-black border border-neutral-800 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#fafafa] font-sans antialiased relative overflow-hidden">
      {/* Vercel Ambient Mesh Gradient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none opacity-20 blur-[130px] bg-gradient-to-tr from-[#00dfd8] via-[#7928ca] to-[#ff0080]" />

      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Breadcrumb Back Link */}
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors mb-6"
        >
          <ArrowLeft size={12} />
          <span>BACK_TO_WORKSPACE</span>
        </Link>

        {/* 2-Column Responsive Layout for Create Form + List */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
          
          {/* Left Column: Create Topic Form */}
          <div className="lg:col-span-4">
            <div className="bg-[#111] border border-neutral-800 rounded-[12px] p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-[#007cf0]" />
                <span>Initialize Topic</span>
              </h2>
              
              <ErrorMessage error={error} className="mb-4" />

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-neutral-400 text-xs font-mono uppercase mb-2">Topic Title</label>
                  <input
                    type="text"
                    placeholder="Enter topic name..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-4 bg-black border border-neutral-800 rounded-full text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-white/40 placeholder-neutral-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 text-xs font-mono uppercase mb-2">Topic Description</label>
                  <textarea
                    placeholder="Describe this learning module..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[120px] p-4 bg-black border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-white/40 leading-relaxed placeholder-neutral-700"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-10 bg-white text-black hover:bg-neutral-200 rounded-full font-semibold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
                >
                  <FolderPlus size={14} />
                  <span>{submitting ? "Initializing..." : "Create Topic"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Topics List & Empty States */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <span>ALL_TOPICS_DATABASE</span>
            </h2>

            {topics.length === 0 ? (
              /* Vercel-inspired Improved Empty State */
              <div className="bg-[#111] border border-neutral-900 rounded-[12px] p-16 text-center shadow-md animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-600 mx-auto mb-4">
                  <Layers size={20} />
                </div>
                <h3 className="font-semibold text-base text-white mb-2 font-mono uppercase tracking-wider">
                  No topics yet.
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed font-mono">
                  Create your first topic.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="group bg-[#111] border border-neutral-900 hover:border-neutral-800 rounded-[12px] p-6 flex flex-col justify-between hover:shadow-[0_4px_20px_rgb(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                          INDEX // /{topic.slug}
                        </span>
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded-[4px] border ${
                          currentUser?.id === topic.user_id
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                            : "bg-neutral-900 text-neutral-500 border-neutral-800"
                        }`}>
                          {currentUser?.id === topic.user_id ? "YOU" : `USER_${topic.user_id?.substring(0, 6)}`}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-white mb-2 leading-tight tracking-tight">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans line-clamp-2">
                        {topic.description}
                      </p>
                    </div>

                    <div className="flex justify-end mt-4 pt-4 border-t border-neutral-900/60">
                      <button
                        onClick={() => navigate(`/topic/${topic.slug}`)}
                        className="px-4 h-8 bg-black hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white rounded-full text-[10px] font-mono tracking-wider inline-flex items-center gap-1 transition-all"
                      >
                        <span>OPEN_TOPIC</span>
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
