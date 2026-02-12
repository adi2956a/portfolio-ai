import { useCallback, useEffect, useState } from "react";
import api, { withAuth } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.jsx";

const initialPost = { title: "", excerpt: "", content: "", tags: "", isTopPick: false };

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState(initialPost);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const [postsResponse, commentsResponse] = await Promise.all([
      api.get("/posts"),
      api.get("/comments", withAuth(token)),
    ]);

    setPosts(postsResponse.data);
    setComments(commentsResponse.data);
  }, [token]);

  useEffect(() => {
    load().catch(() => setMessage("Failed to load dashboard data."));
  }, [load]);

  const createPost = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await api.post(
        "/posts",
        {
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        },
        withAuth(token)
      );
      setForm(initialPost);
      await load();
      setMessage("Post created.");
    } catch {
      setMessage("Failed to create post.");
    }
  };

  const removePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`, withAuth(token));
      await load();
    } catch {
      setMessage("Failed to delete post.");
    }
  };

  const toggleTopPick = async (post) => {
    try {
      await api.put(
        `/posts/${post._id}`,
        { isTopPick: !post.isTopPick },
        withAuth(token)
      );
      await load();
    } catch {
      setMessage("Failed to update top pick.");
    }
  };

  const removeComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`, withAuth(token));
      await load();
    } catch {
      setMessage("Failed to delete comment.");
    }
  };

  return (
    <section>
      <h1>Admin Dashboard</h1>
      <h2>Create Post</h2>
      <form className="form" onSubmit={createPost}>
        <input value={form.title} placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input value={form.excerpt} placeholder="Excerpt" onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
        <textarea value={form.content} placeholder="Content" onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        <input value={form.tags} placeholder="tag1, tag2" onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <label>
          <input
            type="checkbox"
            checked={form.isTopPick}
            onChange={(e) => setForm({ ...form, isTopPick: e.target.checked })}
          />
          Mark as Top Pick
        </label>
        <button type="submit">Create</button>
      </form>

      <h2>Posts</h2>
      <ul className="simple-list">
        {posts.map((post) => (
          <li key={post._id}>
            <span>{post.title} (avg: {post.averageRating}) {post.isTopPick ? "[Top Pick]" : ""}</span>
            <button type="button" onClick={() => toggleTopPick(post)}>
              {post.isTopPick ? "Remove Top Pick" : "Set Top Pick"}
            </button>
            <button type="button" onClick={() => removePost(post._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Comments</h2>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment._id}>
                <td>{comment.name}</td>
                <td>{comment.email}</td>
                <td>{comment.text || "No comment text provided."}</td>
                <td>{new Date(comment.createdAt).toLocaleString()}</td>
                <td>
                  <button type="button" onClick={() => removeComment(comment._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message ? <p>{message}</p> : null}
    </section>
  );
}
