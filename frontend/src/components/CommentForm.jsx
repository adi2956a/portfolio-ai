import { useState } from "react";

const initial = { name: "", email: "", text: "" };

export default function CommentForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initial);

  const submit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initial);
  };

  return (
    <form className="form" onSubmit={submit}>
      <input
        value={form.name}
        placeholder="Your name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        value={form.email}
        placeholder="Email"
        type="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <textarea
        value={form.text}
        placeholder="Write a comment"
        onChange={(e) => setForm({ ...form, text: e.target.value })}
      />
      <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send comment"}</button>
    </form>
  );
}
