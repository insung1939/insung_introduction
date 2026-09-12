import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { API_URL } from "./api.js";
import Hero from "./components/Hero.jsx";
import { About, Currently, OffWork, WhatIDo } from "./components/Sections.jsx";
import Guestbook from "./components/Guestbook.jsx";
import Cursor from "./components/Cursor.jsx";

// 다크 모드: 1주차 실습의 classList.toggle 을 확장 — 시스템 설정을 따르고 선택을 저장한다.
function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* 저장이 막힌 환경은 무시 */
    }
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
}

/* 첫 방문 인트로 커튼: 이름이 잠깐 보였다가 위로 걷힌다 */
function Curtain() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(!reduce);
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(t);
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="curtain"
          aria-hidden="true"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            Insung Cho
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* 끝없이 흐르는 키워드 띠 */
const words = ["Finance", "Data", "AI", "LLM", "신영증권 미래금융팀", "KAIST DFMBA", "Python", "FastAPI", "React", "Vibe coding"];
function Marquee() {
  const row = [...words, ...words];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((w, i) => (
          <span key={i}>
            {w}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [dark, toggleTheme] = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <>
      <Cursor />
      <Curtain />
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />

      <motion.header
        className="topbar"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <div className="container">
          <a className="brand" href="#top">
            insung.cho
          </a>
          <nav className="topbar-right" aria-label="주요 메뉴">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#guestbook">Guestbook</a>
            <motion.button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-pressed={dark}
              aria-label="다크 모드 전환"
              title="다크 모드 전환"
              whileHover={{ rotate: 20 }}
              whileTap={{ rotate: 180, scale: 0.9 }}
            >
              {dark ? "☾" : "☀︎"}
            </motion.button>
          </nav>
        </div>
      </motion.header>

      <main>
        <Hero />
        <Marquee />
        <WhatIDo />
        <About />
        <Currently />
        <OffWork />
        <Guestbook />
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 Insung Cho</p>
          <ul className="footer-links">
            <li>
              <a href="https://github.com/insung1939/insung_introduction" target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </li>
            <li>
              <a href={`${API_URL}/docs`} target="_blank" rel="noopener noreferrer">
                API Docs
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
