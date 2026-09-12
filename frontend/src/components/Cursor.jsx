import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/* 커스텀 커서: 작은 점이 마우스를 바로 따라오고, 링은 살짝 늦게 따라온다.
   링크·버튼 위에서는 링이 커지고, 입력창에서는 숨긴다.
   터치 기기나 '동작 줄이기' 설정에서는 아예 렌더링하지 않는다. */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("default"); // default | link | text
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 24, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 250, damping: 24, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target;
      if (t.closest("input, textarea")) setMode("text");
      else if (t.closest("a, button, .sticker, .card, .photo")) setMode("link");
      else setMode("default");
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} aria-hidden="true" />
      <motion.div
        className={`cursor-ring is-${mode}`}
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: mode === "link" ? 2.2 : mode === "text" ? 0 : 1,
          opacity: mode === "text" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-hidden="true"
      />
    </>
  );
}
