import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { 
  FolderPlus, 
  ArrowLeft, 
  Terminal, 
  FileText, 
  Upload, 
  FileUp,
  ChevronRight,
  Sparkles,
  BookOpen,
  Edit2,
  Trash2
} from "lucide-react";
import SearchInput from "../components/SearchInput";
import ErrorMessage from "../components/ErrorMessage";
export default function TopicDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [topic, setTopic] = useState(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function fetchGuides(topicId) {
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("topic_id", topicId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setGuides(data || []);
    }
  }

  useEffect(() => {
    async function fetchTopicAndGuides() {
      setLoading(true);
      setError("");

      const { data: topicData, error: topicError } = await supabase
        .from("topics")
        .select("*")
        .eq("slug", slug)
        .single();

      if (topicError) {
        setError(topicError.message);
        setLoading(false);
        return;
      }

      setTopic(topicData);
      await fetchGuides(topicData.id);
      setLoading(false);
    }

    fetchTopicAndGuides();
  }, [slug]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".md")) {
      setError("Please upload a .md file only.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setContent(event.target.result);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsText(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const guideSlug = generateSlug(title);

    const { error } = await supabase.from("guides").insert({
      title,
      content,
      slug: guideSlug,
      topic_id: topic.id,
      user_id: currentUser.id,
    });

    if (error) {
      setError(error.message);
    } else {
      setTitle("");
      setContent("");
      setShowCreateForm(false);
      // Reset file input if elements exist
      const fileInput = document.getElementById("md-file-input");
      if (fileInput) fileInput.value = "";
      await fetchGuides(topic.id);
    }

    setSubmitting(false);
  }

  async function handleDeleteTopic() {
    if (!window.confirm("Are you sure you want to delete this topic? All guides within it will also be deleted.")) return;
    const { error } = await supabase.from("topics").delete().eq("id", topic.id);
    if (error) setError(error.message);
    else navigate("/dashboard");
  }

  async function handleSaveTopicEdit() {
    setError("");
    const { error } = await supabase
      .from("topics")
      .update({ title: editTitle, description: editDescription })
      .eq("id", topic.id);
      
    if (error) {
      setError(error.message);
    } else {
      setTopic({ ...topic, title: editTitle, description: editDescription });
      setIsEditingTopic(false);
    }
  }

  // Atmospheric border style cycling for guide cards
  const accentBorders = [
    "group-hover:border-[#007cf0]", // Cyan
    "group-hover:border-[#7928ca]", // Violet
    "group-hover:border-[#ff4d4d]"  // Orange
  ];

  // Filter guides based on search query
  const filteredGuides = guides.filter((guide) => {
    const q = searchQuery.toLowerCase();
    return (
      guide.title.toLowerCase().includes(q) ||
      (guide.content && guide.content.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#fafafa] font-sans antialiased relative overflow-hidden">
        {/* Vercel Ambient Mesh Gradient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none opacity-10 blur-[120px] bg-gradient-to-tr from-[#00dfd8] via-[#7928ca] to-[#ff0080]" />

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

        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="h-4 w-28 bg-neutral-900 rounded font-mono mb-6 animate-pulse" />

          {/* Header Skeleton */}
          <div className="pb-12 border-b border-neutral-900 animate-pulse">
            <div className="h-5 w-32 bg-[#111] border border-neutral-800 rounded-full mb-4" />
            <div className="h-10 w-64 bg-neutral-800 rounded-lg mb-3" />
            <div className="h-4 w-96 bg-neutral-900 rounded-lg" />
          </div>

          {/* Guide list heading */}
          <div className="mt-12 mb-6 h-5 w-40 bg-neutral-900 rounded animate-pulse" />

          {/* Skeletons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#111] border border-neutral-900 rounded-[12px] p-6 h-[180px] flex flex-col justify-between animate-pulse">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-3 w-20 bg-neutral-900 rounded" />
                    <div className="h-4 w-16 bg-neutral-900 rounded" />
                  </div>
                  <div className="h-5 w-5/6 bg-neutral-800 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-neutral-900 rounded" />
                </div>
                <div className="h-9 w-full bg-black border border-neutral-800 rounded-full" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error && !topic) {
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

  if (!topic) return null;

  return (
    <div className="min-h-screen bg-black text-[#fafafa] font-sans antialiased relative overflow-hidden">
      {/* Vercel Ambient Mesh Gradient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none opacity-25 blur-[120px] bg-gradient-to-tr from-[#00dfd8] via-[#7928ca] to-[#ff0080]" />

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
          <span className="text-neutral-400 font-mono text-xs max-w-[120px] sm:max-w-[200px] truncate">{topic.title}</span>
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

        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-neutral-900">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#111] border border-neutral-800 text-neutral-500 text-xs sm:text-[10px] font-mono mb-4 break-words">
              <span>TOPIC // {topic.slug}</span>
            </div>
            
            {isEditingTopic ? (
              <div className="space-y-4 max-w-xl">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-10 px-4 bg-black border border-neutral-800 rounded-full text-white text-base font-bold focus:outline-none focus:ring-1 focus:ring-white/40"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full min-h-[80px] p-4 bg-black border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveTopicEdit} className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-neutral-200">Save</button>
                  <button onClick={() => setIsEditingTopic(false)} className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-bold rounded-full hover:bg-neutral-800">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white mb-3 font-sans break-words">
                  {topic.title}.
                </h1>
                <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
                  {topic.description}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.id === topic.user_id && (
              <>
                <button
                  onClick={() => {
                    setEditTitle(topic.title);
                    setEditDescription(topic.description || "");
                    setIsEditingTopic(true);
                  }}
                  className="h-11 w-11 rounded-full font-semibold text-sm flex items-center justify-center transition-all bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white"
                  title="Edit Topic"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={handleDeleteTopic}
                  className="h-11 w-11 rounded-full font-semibold text-sm flex items-center justify-center transition-all bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/60 hover:text-red-300"
                  title="Delete Topic"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`h-11 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                showCreateForm 
                  ? "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white" 
                  : "bg-white text-black hover:bg-neutral-200 shadow-[0_4px_14px_rgba(255,255,255,0.15)]"
              }`}
            >
              <FolderPlus size={16} />
              <span className="hidden sm:inline">{showCreateForm ? "Cancel" : "Create Guide"}</span>
            </button>
          </div>
        </div>

        {/* Toggleable Create Guide Form */}
        {showCreateForm && (
          <div className="mt-8 bg-[#111] border border-neutral-800 rounded-[12px] p-6 max-w-3xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-[#007cf0]" />
              <span>Initialize a New Guide</span>
            </h3>
            
            <ErrorMessage error={error} className="mb-4" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-neutral-400 text-xs font-mono uppercase mb-2">Guide Title</label>
                <input
                  type="text"
                  placeholder="Enter guide name..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-12 sm:h-10 px-4 bg-black border border-neutral-800 rounded-full text-white text-base sm:text-xs font-mono focus:outline-none focus:ring-1 focus:ring-white/40"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs font-mono uppercase mb-2">
                  Upload Markdown File (.md)
                </label>
                <div className="flex items-center gap-3">
                  <label className="h-12 sm:h-10 px-4 rounded-full border border-neutral-800 hover:border-neutral-700 bg-black text-neutral-400 hover:text-white text-sm sm:text-xs font-semibold cursor-pointer inline-flex items-center gap-2 transition-all">
                    <FileUp size={14} />
                    <span>Choose file</span>
                    <input
                      id="md-file-input"
                      type="file"
                      accept=".md"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-neutral-500 text-xs font-mono">
                    Only accepts plain markdown text file
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 text-xs font-mono uppercase mb-2">Guide Content (Markdown)</label>
                <textarea
                  placeholder="# Introduction..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[250px] p-4 bg-black border border-neutral-800 rounded-xl text-white text-base sm:text-xs font-mono focus:outline-none focus:ring-1 focus:ring-white/40 leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="h-12 sm:h-10 px-5 rounded-full border border-neutral-800 hover:bg-neutral-950 text-neutral-400 hover:text-white text-sm sm:text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-12 sm:h-10 bg-white text-black hover:bg-neutral-200 px-6 rounded-full font-semibold text-sm sm:text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Deploying..." : "Deploy Guide"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Guides Content Section */}
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
              <BookOpen size={16} className="text-neutral-400" />
              <span>Deployed Guides</span>
            </h2>

            {guides.length > 0 && (
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search guides..."
              />
            )}
          </div>

          {guides.length === 0 ? (
            <div className="bg-[#111] border border-neutral-900 rounded-[12px] p-16 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-600 mx-auto mb-4">
                <FileText size={20} />
              </div>
              <h3 className="font-semibold text-base text-white mb-2 font-mono uppercase tracking-wider">
                No guides yet.
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed mb-6 font-mono">
                Create your first guide.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 px-4 py-2 rounded-full font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <FolderPlus size={14} />
                <span>Add first guide</span>
              </button>
            </div>
          ) : filteredGuides.length === 0 ? (
            <div className="bg-[#111] border border-neutral-900 rounded-[12px] p-16 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto mb-4">
                <FileText size={20} />
              </div>
              <h3 className="font-semibold text-base text-white mb-2 font-mono uppercase tracking-wider">
                No matching guides
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed mb-6 font-mono">
                NO GUIDES MATCH "<span className="text-white">{searchQuery}</span>". TRY A DIFFERENT QUERY.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 px-4 py-2 rounded-full font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <span>Clear search</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide, index) => {
                const borderAccent = accentBorders[index % accentBorders.length];
                const createdDate = guide.created_at 
                  ? new Date(guide.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A";

                return (
                  <div
                    key={guide.id}
                    className={`group bg-[#111] border border-neutral-900 ${borderAccent} rounded-[12px] p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.8)] transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div>
                      {/* Technical Monospace Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs sm:text-[10px] text-neutral-500 uppercase tracking-wider break-words">
                          GUIDE // {guide.slug.substring(0, 15)}
                        </span>
                        <span className="font-mono text-[10px] sm:text-[9px] text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-[4px]">
                          {createdDate}
                        </span>
                      </div>

                      {/* Guide Details */}
                      <h3 className="text-base font-bold text-white mb-4 group-hover:text-white transition-colors tracking-tight font-sans">
                        {guide.title}
                      </h3>
                    </div>

                    {/* Vercel Action Button */}
                    <button
                      onClick={() => navigate(`/guide/${guide.slug}`)}
                      className="w-full h-10 sm:h-9 bg-black hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white rounded-full text-sm sm:text-xs font-semibold inline-flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Read guide</span>
                      <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
