import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Linkedin, Mail, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Navbar() {
  const [adminMode, setAdminMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const expanded = isHovered || adminMode || isScrolled;

  const handleProfileClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const profileImage = (
    <img
      src="/profile-shubham.jpeg"
      alt="Profile"
      className="dock-profile-image"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );

  return (
    <div className="floating-nav-shell">
      <motion.div
        layout
        className="floating-nav"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setAdminMode(false);
        }}
        initial={{ width: 146, height: 60 }}
        animate={{ width: expanded ? 430 : 146, height: 60 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="floating-nav-head">
          <Link
            to="/"
            className={expanded ? "dock-profile expanded" : "dock-btn"}
            aria-label="Go to home"
            onClick={handleProfileClick}
          >
            {expanded ? (
              <>
                {profileImage}
                <span className="dock-profile-text">
                  <strong>subham tamrakar</strong>
                </span>
              </>
            ) : (
              profileImage
            )}
          </Link>

          {expanded ? (
            <div className="dock-mid-links">
              {adminMode ? (
                isAuthenticated ? (
                  <>
                    <Link className="dock-mid-action-link" to="/admin">Admin Page</Link>
                    <button type="button" className="dock-mid-action" onClick={logout}>Logout</button>
                  </>
                ) : (
                  <Link className="dock-mid-action-link" to="/admin/login">Admin Login</Link>
                )
              ) : (
                <>
                  <a className="dock-icon-link" href="https://www.linkedin.com/in/shubhamtamrakar/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <Linkedin size={16} />
                    <span>LinkedIn</span>
                  </a>
                  <a className="dock-icon-link" href="/SHUBHAM_TAMRAKAR_CFA.pdf" target="_blank" rel="noreferrer" aria-label="Resume">
                    <Globe size={16} />
                    <span>Resume</span>
                  </a>
                  <a className="dock-icon-link" href="mailto:shubhamtamrakar.2001@gmail.com" aria-label="Mail">
                    <Mail size={16} />
                    <span>Mail</span>
                  </a>
                </>
              )}
            </div>
          ) : null}

          <button
            type="button"
            className="dock-btn dock-btn-dark"
            onClick={() => setAdminMode((prev) => !prev)}
            aria-label="Toggle admin action"
          >
            {adminMode ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
