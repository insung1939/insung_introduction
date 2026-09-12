import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { API_URL } from "./api.js";
import Hero from "./components/Hero.jsx";
import { About, Currently, OffWork, WhatIDo } from "./components/Sections.jsx";
import Guestbook from "./components/Guestbook.jsx";

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

export default function App() {
  const [dark, toggleTheme] = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />

      <header className="topbar">
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
              whileTap={{ rotate: 180, scale: 0.9 }}
            >
              {dark ? "☾" : "☀︎"}
            </motion.button>
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <WhatIDo />
        <About />
        <Currently />
        <OffWork />
        <Guestbook />
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 Insung Cho · React + FastAPI, Vercel + Render</p>
          <ul className="footer-links">
            <li>
              <a href="https://github.com/insung1939/insung-intro-fullstack" target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </li>
            <li>
              <a href={`${API_URL}/docs`} target="_blank" rel="noopener noreferrer">
                Swagger UI
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
