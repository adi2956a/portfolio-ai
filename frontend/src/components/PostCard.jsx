import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="card post-card-link">
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <div className="meta-row">
        <small>{new Date(post.publishedAt).toLocaleDateString()}</small>
        <small>Rating: {post.averageRating || 0} ({post.ratingCount || 0})</small>
      </div>
      <div className="tag-row">
        {(post.tags || []).map((tag) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>
    </Link>
  );
}
