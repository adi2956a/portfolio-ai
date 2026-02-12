import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const MotionLink = motion(Link);

export default function CenterFocusSlider({ posts = [] }) {
  const viewportRef = useRef(null);
  const firstSlideRef = useRef(null);

  const controls = useAnimationControls();
  const x = useMotionValue(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [layout, setLayout] = useState({ viewport: 0, slide: 0, gap: 16 });

  const maxIndex = Math.max(posts.length - 1, 0);

  const measure = useCallback(() => {
    if (!viewportRef.current || !firstSlideRef.current) return;

    const viewportWidth = viewportRef.current.clientWidth;
    const slideWidth = firstSlideRef.current.clientWidth;
    const computed = window.getComputedStyle(firstSlideRef.current.parentElement);
    const gap = Number.parseFloat(computed.columnGap || computed.gap || "16") || 16;

    setLayout({ viewport: viewportWidth, slide: slideWidth, gap });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const getTargetX = useCallback((index) => {
    const { viewport, slide, gap } = layout;
    if (!viewport || !slide) return 0;
    return viewport / 2 - (slide / 2 + index * (slide + gap));
  }, [layout]);

  const dragBounds = useMemo(() => {
    if (!posts.length) return { left: 0, right: 0 };
    return {
      left: getTargetX(maxIndex),
      right: getTargetX(0),
    };
  }, [getTargetX, maxIndex, posts.length]);

  useEffect(() => {
    const next = clamp(activeIndex, 0, maxIndex);
    controls.start({
      x: getTargetX(next),
      transition: { type: "spring", stiffness: 360, damping: 34 },
    });
  }, [activeIndex, controls, getTargetX, maxIndex]);

  const snapToNearest = useCallback(() => {
    const { viewport, slide, gap } = layout;
    if (!viewport || !slide || !posts.length) return;

    const currentX = x.get();
    const rawIndex = (viewport / 2 - slide / 2 - currentX) / (slide + gap);
    const nearest = clamp(Math.round(rawIndex), 0, maxIndex);
    setActiveIndex(nearest);
  }, [layout, maxIndex, posts.length, x]);

  if (!posts.length) {
    return <p>No posts available.</p>;
  }

  return (
    <div className="center-focus-slider">
      <div className="slider-shell">
        <button
          type="button"
          className="slider-arrow left"
          onClick={() => setActiveIndex((prev) => clamp(prev - 1, 0, maxIndex))}
          aria-label="Previous post"
          disabled={activeIndex === 0}
        >
          {"<"}
        </button>
        <div className="slider-viewport" ref={viewportRef}>
          <motion.div
            className="slider-track"
            style={{ x }}
            animate={controls}
            drag="x"
            dragConstraints={dragBounds}
            dragElastic={0.08}
            onDragEnd={snapToNearest}
          >
            {posts.map((post, index) => {
              const distance = Math.abs(index - activeIndex);
              const opacity = distance === 0 ? 1 : distance === 1 ? 0.4 : 0.2;

              return (
                <MotionLink
                  key={post._id || post.id || post.slug}
                  ref={index === 0 ? firstSlideRef : null}
                  className="slider-card"
                  to={`/blog/${post.slug}`}
                  animate={{ opacity }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="slider-card-meta">Blog</div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <small className="slider-card-rating">
                    Average rating: {post.averageRating ?? 0} ({post.ratingCount ?? 0})
                  </small>
                </MotionLink>
              );
            })}
          </motion.div>
        </div>
        <button
          type="button"
          className="slider-arrow right"
          onClick={() => setActiveIndex((prev) => clamp(prev + 1, 0, maxIndex))}
          aria-label="Next post"
          disabled={activeIndex === maxIndex}
        >
          {">"}
        </button>
      </div>

      <div className="slider-dots" role="tablist" aria-label="Post slider pagination">
        {posts.map((post, index) => (
          <button
            key={post._id || post.id || `${post.slug}-dot`}
            type="button"
            onClick={() => setActiveIndex(index === activeIndex ? (index + 1) % posts.length : index)}
            className={index === activeIndex ? "slider-dot active" : "slider-dot"}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}
