import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import {
  FolderPlus,
  LogOut,
  Terminal,
  Layers,
  Compass,
  ChevronRight,
  ArrowRight,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import SearchInput from "../components/SearchInput";

const COMMUNITY_TOPICS_LIMIT = 8;

function deriveDisplayName(email) {
  if (!email) return "there";
  const localPart = email.split("@")[0];
  if (!localPart) return "there";
  return (
    localPart
      .split(/[._-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "there"
  );
}

const cardTints = [
  { border: "group-hover:border-[#007cf0]", gradient: "bg-gradient-to-r from-[#007cf0] to-[#00dfd8]" },
  { border: "group-hover:border-[#7928ca]", gradient: "bg-gradient-to-r from-[#7928ca] to-[#ff0080]" },
  { border: "group-hover:border-[#ff4d4d]", gradient: "bg-gradient-to-r from-[#ff4d4d] to-[#f9cb28]" },
];

const statTints = [
  { gradient: "bg-gradient-to-r from-[#007cf0] to-[#00dfd8]", accent: "text-[#00dfd8]" },
  { gradient: "bg-gradient-to-r from-[#7928ca] to-[#ff0080]", accent: "text-[#ff0080]" },
  { gradient: "bg-gradient-to-r from-[#ff4d4d] to-[#f9cb28]", accent: "text-[#f9cb28]" },
];

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [myTopics, setMyTopics] = useState([]);
  const [communityTopics, setCommunityTopics] = useState([]);
  const [stats, setStats] = useState({ topics: 0, guides: 0, answered: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      if (!currentUser) return;

      setLoading(true);
      setError("");

      try {
        const [myTopicsRes, communityTopicsRes, guidesCountRes, userGuidesRes] = await Promise.all([
          supabase
            .from("topics")
            .select("*, guides(id)")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("topics")
            .select("*, guides(id)")
            .neq("user_id", currentUser.id)
            .order("created_at", { ascending: false })
            .limit(COMMUNITY_TOPICS_LIMIT),
          supabase
            .from("guides")
            .select("id", { count: "exact", head: true })
            .eq("user_id", currentUser.id),
          supabase
            .from("guides")
            .select("id")
            .eq("user_id", currentUser.id),
        ]);

        if (myTopicsRes.error) throw myTopicsRes.error;
        if (communityTopicsRes.error) throw communityTopicsRes.error;
        if (guidesCountRes.error) throw guidesCountRes.error;
        if (userGuidesRes.error) throw userGuidesRes.error;

        const myTopicsData = myTopicsRes.data || [];
        setMyTopics(myTopicsData);
        setCommunityTopics(communityTopicsRes.data || []);

        const nextStats = {
          topics: myTopicsData.length,
          guides: guidesCountRes.count ?? 0,
          answered: 0,
        };

        const userGuideIds = (userGuidesRes.data || []).map((g) => g.id);
        if (userGuideIds.length > 0) {
          const answeredRes = await supabase
            .from("interactions")
            .select("id", { count: "exact", head: true })
            .eq("answered", true)
            .in("guide_id", userGuideIds);

          if (!answeredRes.error) {
            nextStats.answered = answeredRes.count ?? 0;
          }
        }

        setStats(nextStats);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [currentUser]);

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate("/login");
    }
  };

  const displayName = deriveDisplayName(currentUser?.email);

  const filteredMyTopics = myTopics.filter((topic) => {
    const q = searchQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(q) ||
      (topic.description && topic.description.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#fafafa] font-sans antialiased relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none opacity-10 blur-[120px] bg-gradient-to-tr from-[#007cf0] via-[#7928ca] to-[#ff4d4d]" />

        <nav className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-neutral-900 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-5 h-5 bg-neutral-800 rounded-full" />
            <div className="h-4 w-20 bg-neutral-800 rounded" />
          </div>
          <div className="flex items-center gap-4 animate-pulse">
            <div className="hidden sm:block w-32 h-6 bg-[#111] rounded-full border border-neutral-800" />
            <div className="w-16 h-7 bg-[#111] rounded-full border border-neutral-800" />
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          {/* Welcome Skeleton */}
          <div className="pb-12 border-b border-neutral-900 animate-pulse">
            <div className="h-5 w-40 bg-[#111] border border-neutral-800 rounded-full mb-4" />
            <div className="h-10 w-96 bg-neutral-800 rounded-lg mb-3" />
            <div className="h-4 w-[28rem] max-w-full bg-neutral-900 rounded-lg" />
          </div>

          {/* Stats Skeleton */}
          <div className="mt-12">
            <div className="h-5 w-48 bg-neutral-900 rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#111] border border-neutral-900 rounded-[12px] p-6 h-[150px] animate-pulse">
                  <div className="h-[2px] w-full bg-neutral-900 mb-6" />
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-9 h-9 bg-neutral-900 rounded-full" />
                    <div className="h-3 w-28 bg-neutral-900 rounded" />
                  </div>
                  <div className="h-10 w-20 bg-neutral-800 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* My Topics Skeleton */}
          <div className="mt-16">
            <div className="h-5 w-32 bg-neutral-900 rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#111] border border-neutral-900 rounded-[12px] p-6 h-[220px] flex flex-col justify-between animate-pulse">
                  <div>
                    <div className="h-[2px] w-full bg-neutral-900 mb-6" />
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-3 w-16 bg-neutral-900 rounded" />
                      <div className="h-4 w-12 bg-neutral-900 rounded" />
                    </div>
                    <div className="h-5 w-3/4 bg-neutral-800 rounded mb-2" />
                    <div className="h-3 w-full bg-neutral-900 rounded mb-1.5" />
                    <div className="h-3 w-5/6 bg-neutral-900 rounded" />
                  </div>
                  <div className="h-9 w-full bg-black border border-neutral-800 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Community Topics Skeleton */}
          <div className="mt-16">
            <div className="h-5 w-64 bg-neutral-900 rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#111] border border-neutral-900 rounded-[12px] p-6 h-[220px] flex flex-col justify-between animate-pulse">
                  <div>
                    <div className="h-[2px] w-full bg-neutral-900 mb-6" />
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-3 w-16 bg-neutral-900 rounded" />
                      <div className="h-4 w-12 bg-neutral-900 rounded" />
                    </div>
                    <div className="h-5 w-3/4 bg-neutral-800 rounded mb-2" />
                    <div className="h-3 w-full bg-neutral-900 rounded mb-1.5" />
                    <div className="h-3 w-5/6 bg-neutral-900 rounded" />
                  </div>
                  <div className="h-9 w-full bg-black border border-neutral-800 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="mt-16">
            <div className="h-5 w-40 bg-neutral-900 rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#111] border border-neutral-900 rounded-[12px] p-6 h-[130px] animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#fafafa] font-sans antialiased relative overflow-hidden">
      {/* Vercel Ambient Mesh Gradient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none opacity-25 blur-[120px] bg-gradient-to-tr from-[#007cf0] via-[#7928ca] to-[#ff4d4d]" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-neutral-900 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 75 65" fill="none" className="w-6 h-6 text-white">
            <path d="M37.5 0L75 65H0L37.5 0Z" fill="currentColor" />
          </svg>
          <span className="font-bold text-white text-base tracking-tight">RoxGuide</span>
          <span className="text-neutral-800 font-mono">/</span>
          <span className="text-neutral-400 font-mono text-xs">dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#111] border border-neutral-800 text-neutral-400 text-xs font-mono">
            <Terminal size={12} className="text-neutral-500" />
            <span className="max-w-[150px] truncate">{currentUser?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-800 text-neutral-400 text-xs font-medium hover:bg-neutral-950 active:bg-neutral-900 hover:text-white hover:border-neutral-700 transition-all"
          >
            <LogOut size={12} />
            <span>Log out</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">

        {/* SECTION 1: Welcome Header */}
        <section className="pb-12 border-b border-neutral-900">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#111] border border-neutral-800 text-[#50e3c2] text-xs font-mono tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#50e3c2] animate-ping" />
            <span>WORKSPACE: ONLINE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white mb-3 font-sans">
            Welcome back, {displayName}.
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
            Your personal hub for creating topics, deploying guides, and exploring the RoxGuide community. Signed in as <span className="text-white font-mono break-all">{currentUser?.email}</span>.
          </p>
        </section>

        {error && (
          <div className="mt-8 p-4 bg-red-950/40 border border-red-900/50 text-[#ee0000] rounded-lg text-xs font-mono">
            [ERROR] {error}
          </div>
        )}

        {/* SECTION 2: Stats Cards */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
            <Terminal size={16} className="text-neutral-400" />
            <span>Activity Overview</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Layers, label: "Topics Created", value: stats.topics, tint: statTints[0] },
              { icon: FileText, label: "Guides Created", value: stats.guides, tint: statTints[1] },
              { icon: CheckCircle2, label: "Questions Answered", value: stats.answered, tint: statTints[2] },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group bg-[#111] border border-neutral-900 rounded-[12px] p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.8)]"
              >
                <div className="h-[2px] w-full rounded-full bg-neutral-900 mb-6 overflow-hidden">
                  <div className={`h-full w-0 group-hover:w-full ${stat.tint.gradient} transition-all duration-500`} />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-9 h-9 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                    <stat.icon size={15} className={stat.tint.accent} />
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
                    {stat.label}
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white tracking-tighter font-sans">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: My Topics */}
        <section className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
              <FolderPlus size={16} className="text-neutral-400" />
              <span>My Topics</span>
            </h2>

            {myTopics.length > 0 && (
              <div className="flex items-center gap-4">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search my topics..."
                />
                <div className="text-neutral-500 text-xs font-mono whitespace-nowrap">
                  {filteredMyTopics.length} / {myTopics.length}
                </div>
              </div>
            )}
          </div>

          {myTopics.length === 0 ? (
            <div className="bg-[#111] border border-neutral-900 rounded-[12px] p-16 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto mb-4">
                <Layers size={20} />
              </div>
              <h3 className="font-semibold text-base text-white mb-2 font-mono uppercase tracking-wider">
                No topics yet.
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed mb-6 font-mono">
                Start by creating your first topic to containerize your markdown knowledge bases.
              </p>
              <button
                onClick={() => navigate("/topics")}
                className="bg-white text-black hover:bg-neutral-200 px-5 py-2 rounded-full font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <FolderPlus size={14} />
                <span>Create your first topic</span>
              </button>
            </div>
          ) : filteredMyTopics.length === 0 ? (
            <div className="bg-[#111] border border-neutral-900 rounded-[12px] p-16 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto mb-4">
                <Layers size={20} />
              </div>
              <h3 className="font-semibold text-base text-white mb-2 font-mono uppercase tracking-wider">
                No matching records
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed mb-6 font-mono">
                NO TOPICS MATCH "<span className="text-white">{searchQuery}</span>". TRY A DIFFERENT QUERY.
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
              {filteredMyTopics.map((topic, index) => {
                const tint = cardTints[index % cardTints.length];
                const guidesCount = topic.guides ? topic.guides.length : 0;

                return (
                  <div
                    key={topic.id}
                    className={`group bg-[#111] border border-neutral-900 ${tint.border} rounded-[12px] p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.8)] transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div>
                      <div className="h-[2px] w-full rounded-full bg-neutral-900 mb-6 overflow-hidden">
                        <div className={`h-full w-0 group-hover:w-full ${tint.gradient} transition-all duration-500`} />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                          //ID-{topic.id.toString().substring(0, 5)}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-[4px]">
                          {guidesCount} {guidesCount === 1 ? "GUIDE" : "GUIDES"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight tracking-tight font-sans">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 mb-6 font-sans">
                        {topic.description}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/topic/${topic.slug}`)}
                      className="w-full h-9 bg-black hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1 transition-all"
                    >
                      <span>View project</span>
                      <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 4: Recent Community Topics */}
        <section className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
              <Compass size={16} className="text-neutral-400" />
              <span>Recent Community Topics</span>
            </h2>
            <div className="text-neutral-500 text-xs font-mono whitespace-nowrap">
              {communityTopics.length} {communityTopics.length === 1 ? "TOPIC" : "TOPICS"} FROM THE COMMUNITY
            </div>
          </div>

          {communityTopics.length === 0 ? (
            <div className="bg-[#111] border border-neutral-900 rounded-[12px] p-16 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto mb-4">
                <Compass size={20} />
              </div>
              <h3 className="font-semibold text-base text-white mb-2 font-mono uppercase tracking-wider">
                No community topics yet.
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed font-mono">
                Be the first to share with the community.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityTopics.map((topic, index) => {
                const tint = cardTints[index % cardTints.length];
                const guidesCount = topic.guides ? topic.guides.length : 0;

                return (
                  <div
                    key={topic.id}
                    className={`group bg-[#111] border border-neutral-900 ${tint.border} rounded-[12px] p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.8)] transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div>
                      <div className="h-[2px] w-full rounded-full bg-neutral-900 mb-6 overflow-hidden">
                        <div className={`h-full w-0 group-hover:w-full ${tint.gradient} transition-all duration-500`} />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                          //ID-{topic.id.toString().substring(0, 5)}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-[4px]">
                          {guidesCount} {guidesCount === 1 ? "GUIDE" : "GUIDES"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight tracking-tight font-sans">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 mb-6 font-sans">
                        {topic.description}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/topic/${topic.slug}`)}
                      className="w-full h-9 bg-black hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Open</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 5: Quick Actions */}
        <section className="mt-16">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
            <Sparkles size={16} className="text-neutral-400" />
            <span>Quick Actions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate("/topics")}
              className="group bg-white text-black hover:bg-neutral-200 rounded-[12px] p-6 text-left transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)]"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                  <FolderPlus size={18} />
                </div>
                <ArrowRight size={18} className="text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-1">Create Topic</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Initialize a new learning module to containerize your markdown knowledge base.
              </p>
            </button>

            <button
              onClick={() => navigate("/topics")}
              className="group bg-[#111] border border-neutral-900 hover:border-neutral-700 rounded-[12px] p-6 text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.8)]"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-300">
                  <Compass size={18} />
                </div>
                <ArrowRight size={18} className="text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-white mb-1">Browse Topics</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Discover community topics and explore the RoxGuide knowledge network.
              </p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
