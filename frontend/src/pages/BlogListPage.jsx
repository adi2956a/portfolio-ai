import { useEffect, useState } from "react";
import api from "../services/api.js";
import PostCard from "../components/PostCard.jsx";

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const { data } = await api.get("/posts");
        if (!ignore) {
          setPosts(data);
        }
      } catch {
        if (!ignore) {
          setError("Failed to load posts.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h1>Blog</h1>
      <div className="grid">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
