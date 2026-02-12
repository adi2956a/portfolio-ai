export default function CommentList({ comments = [] }) {
  if (!comments.length) {
    return <p>No comments yet.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li key={comment._id} className="card">
          <strong>{comment.name}</strong>
          <p>{comment.text || "No comment text provided."}</p>
          <small>{new Date(comment.createdAt).toLocaleString()}</small>
        </li>
      ))}
    </ul>
  );
}
