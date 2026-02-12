import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CenterFocusSlider from "../components/CenterFocusSlider.jsx";
import api from "../services/api.js";

const experience = [
  {
    period: "2024 - Present",
    role: "Manager, Alturas India Fund",
    company: "Alturas Investment Management",
    detail: "CAT III AIF Management & Research.",
  },
  {
    period: "2023 - 2023",
    role: "Investor Relations Associate",
    company: "Churchgate Advisory",
    detail: "Financial communications & investor positioning.",
  },
  {
    period: "2019 - 2022",
    role: "Research Analyst (Forex)",
    company: "Sig Sigma Consultant",
    detail: "Technical analysis & trade ideas.",
  },
];

const highlights = [
  {
    title: "CFA Charterholder",
    subtitle: "Portfolio Management Specialization.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=900",
  },
  {
    title: "Young Global Leader",
    subtitle: "Selected for Startup India Project under GGI.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900",
  },
  {
    title: "Certified Analyst",
    subtitle: "Equity Derivatives & Research Analyst (NISM VIII & XV).",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900",
  },
  {
    title: "National Finalist",
    subtitle: "IIM Indore Atharv Ranbhoomi 2024.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900",
  },
];

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postError, setPostError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        if (!ignore) {
          setPosts(data);
        }
      } catch {
        if (!ignore) {
          setPostError("Failed to load posts.");
        }
      } finally {
        if (!ignore) {
          setLoadingPosts(false);
        }
      }
    };

    loadPosts();
    return () => {
      ignore = true;
    };
  }, []);

  const topPosts = useMemo(() => {
    return posts.filter((post) => post.isTopPick);
  }, [posts]);

  return (
    <div className="bento-grid">
      <motion.section
        className="bento-card bento-hero finance-hero"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="finance-hero-title">
          <span className="muted">Hey, I am</span> <span className="hero-inline-profile"><img src="/profile-shubham.jpeg" alt="Shubham" /><span>Shubham</span></span> <span className="muted">an</span> <strong>Investment Manager</strong>, <span className="muted">based in</span> <strong>Indore</strong>, <span className="muted">like</span> <strong>Hiking</strong> <span className="muted">and</span> <strong>Reading</strong>, <span className="muted">and also a</span> <strong>CFA Charterholder</strong>.
        </h1>
        <a className="finance-availability" href="mailto:shubhamtamrakar.2001@gmail.com">
          <span className="dot" />
          <span className="availability-default">Available for investment projects.</span>
          <span className="availability-hover">Connect me</span>
        </a>
      </motion.section>

      <motion.section
        className="bento-card finance-experience"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <h2>experience</h2>
        <div className="finance-timeline">
          {experience.map((item) => (
            <article key={item.period + item.role} className="timeline-row">
              <div className="timeline-period">{item.period}</div>
              <div>
                <h3>{item.role} at {item.company}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      {highlights.map((card, index) => (
        <motion.article
          key={card.title}
          className="bento-card finance-highlight"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 + index * 0.06 }}
        >
          <div className="finance-highlight-image" style={{ backgroundImage: `url(${card.image})` }} />
          <h3>{card.title}</h3>
          <p>{card.subtitle}</p>
        </motion.article>
      ))}

      <motion.section
        className="bento-card bento-slider-card"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="post-meta">Top Post Only</div>
        {loadingPosts ? <p>Loading posts...</p> : null}
        {postError ? <p>{postError}</p> : null}
        {!loadingPosts && !postError && topPosts.length ? <CenterFocusSlider posts={topPosts} /> : null}
        {!loadingPosts && !postError && !topPosts.length ? <p>No admin top posts selected yet.</p> : null}
        <div style={{ marginTop: "0.9rem" }}>
          <Link to="/blog/all" className="bento-archive-link">View All Blog Posts</Link>
        </div>
      </motion.section>
    </div>
  );
}
