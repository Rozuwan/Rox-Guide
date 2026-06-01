import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTopics() {
      if (!currentUser) return;
      
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("topics")
        .select("*, guides(id)")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setTopics(data || []);
      }

      setLoading(false);
    }

    fetchTopics();
  }, [currentUser]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => navigate("/topics")}>Create Topic</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {topics.length === 0 ? (
        <p>No topics yet.</p>
      ) : (
        <ul>
          {topics.map((topic) => (
            <li key={topic.id} style={{ marginBottom: "1rem" }}>
              <strong>{topic.title}</strong>
              <p>{topic.description}</p>
              <p>Guides: {topic.guides ? topic.guides.length : 0}</p>
              <button onClick={() => navigate(`/topic/${topic.slug}`)}>
                Open Topic
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
