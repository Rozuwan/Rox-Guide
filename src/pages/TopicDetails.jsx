import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

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
      // Reset file input if elements exist
      const fileInput = document.getElementById("md-file-input");
      if (fileInput) fileInput.value = "";
      await fetchGuides(topic.id);
    }

    setSubmitting(false);
  }

  if (loading) return <p>Loading...</p>;
  if (error && !topic) return <p style={{ color: "red" }}>{error}</p>;
  if (!topic) return <p>Topic not found.</p>;

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.description}</p>

      <h2>Create Guide</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Guide Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="md-file-input" style={{ display: "block" }}>
            Upload Markdown (.md) File:
          </label>
          <input
            id="md-file-input"
            type="file"
            accept=".md"
            onChange={handleFileChange}
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <textarea
            placeholder="Or type Guide Content manually"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit" disabled={submitting} style={{ marginTop: "0.5rem" }}>
          {submitting ? "Creating..." : "Create Guide"}
        </button>
      </form>

      <h2>Guides</h2>
      {guides.length === 0 ? (
        <p>No guides found.</p>
      ) : (
        <ul>
          {guides.map((guide) => (
            <li key={guide.id} style={{ marginBottom: "0.5rem" }}>
              <span>{guide.title}</span>{" "}
              <button onClick={() => navigate(`/guide/${guide.slug}`)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
