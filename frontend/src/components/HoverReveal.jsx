import { useState } from "react";
import { motion } from "framer-motion";

export default function HoverReveal({ text, image }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="hover-reveal"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
      {isHovered ? (
        <motion.img
          src={image}
          alt={text}
          initial={{ opacity: 0, scale: 0.85, y: 10, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, y: -48, rotate: 0 }}
          exit={{ opacity: 0 }}
          className="hover-reveal-image"
        />
      ) : null}
    </span>
  );
}
