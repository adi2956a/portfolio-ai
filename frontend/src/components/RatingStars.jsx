export default function RatingStars({ value = 0, onSelect, readOnly = false }) {
  return (
    <div className="stars" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? "star active" : "star"}
          onClick={() => !readOnly && onSelect?.(n)}
          disabled={readOnly}
          aria-label={`Rate ${n}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 17.3 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
