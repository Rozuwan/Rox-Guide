import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Topics() {
  const { currentUser } = useAuth();
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
      setTopics(data);
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

  return (
    <div>
      <h1>Topics</h1>

      <h2>Create Topic</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Topic"}
        </button>
      </form>

      <h2>All Topics</h2>
      {loading ? (
        <p>Loading...</p>
      ) : topics.length === 0 ? (
        <p>No topics found.</p>
      ) : (
        <ul>
          {topics.map((topic) => (
            <li key={topic.id}>
              <strong>{topic.title}</strong> — {topic.description} (/{topic.slug})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
