import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function GuideDetails() {
  const { slug } = useParams();
  const { currentUser } = useAuth();
  const [guide, setGuide] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nickname, setNickname] = useState("");
  const [type, setType] = useState("question");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      user_id: currentUser.id,
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

  if (loading) return <p>Loading...</p>;
  if (error && !guide) return <p style={{ color: "red" }}>{error}</p>;
  if (!guide) return <p>Guide not found.</p>;

  return (
    <div>
      <h1>{guide.title}</h1>
      <div>
        <ReactMarkdown>{guide.content}</ReactMarkdown>
      </div>

      <h2>Add Interaction</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="question">Question</option>
            <option value="comment">Comment</option>
          </select>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={submitting} style={{ marginTop: "0.5rem" }}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <h2>Interactions</h2>
      {interactions.length === 0 ? (
        <p>No interactions found.</p>
      ) : (
        <ul>
          {interactions.map((interaction) => (
            <li key={interaction.id} style={{ marginBottom: "1rem" }}>
              <strong>{interaction.nickname}</strong> ({interaction.type}){" "}
              <span>
                [{interaction.answered ? "Answered" : "Unanswered"}]
              </span>
              <p>{interaction.content}</p>
              {interaction.type === "question" && !interaction.answered && (
                <button onClick={() => markAnswered(interaction.id)}>
                  Mark Answered
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
