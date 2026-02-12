import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import RatingStars from "../components/RatingStars.jsx";
import CommentList from "../components/CommentList.jsx";
import CommentForm from "../components/CommentForm.jsx";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [rating, setRating] = useState(0);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [message, setMessage] = useState("");

  const loadPost = useCallback(async () => {
    const { data } = await api.get(`/posts/${slug}`);
    setPost(data);
  }, [slug]);

  useEffect(() => {
    loadPost().catch(() => setMessage("Failed to load post."));
  }, [loadPost]);

  const submitRating = async (value) => {
    if (!post) return;

    try {
      await api.post("/ratings", { postId: post._id, value });
      setRating(value);
      await loadPost();
    } catch {
      setMessage("Failed to submit rating.");
    }
  };

  const submitComment = async (form) => {
    if (!post) return;

    setCommentLoading(true);
    setMessage("");

    try {
      await api.post("/comments", { postId: post._id, ...form });
      setMessage("Comment submitted.");
      await loadPost();
    } catch {
      setMessage("Failed to submit comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <section>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>
        Average rating: {post.averageRating} ({post.ratingCount} votes)
      </p>
      <RatingStars value={rating} onSelect={submitRating} />

      <h2>Comments</h2>
      <CommentList comments={post.comments} />

      <button
        type="button"
        className="comment-toggle"
        onClick={() => setCommentOpen((prev) => !prev)}
      >
        {commentOpen ? "Hide comment form" : "Leave a comment"}
      </button>

      {commentOpen ? <CommentForm onSubmit={submitComment} loading={commentLoading} /> : null}
      {message ? <p>{message}</p> : null}

      <button type="button" className="go-back-btn" onClick={() => navigate(-1)}>
        {"<- Go back"}
      </button>
    </section>
  );
}
