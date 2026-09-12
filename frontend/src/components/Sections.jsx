import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

const viewport = { once: true, margin: "-60px" };

/* 제목: 단어가 하나씩 아래에서 솟아오른다 */
function Words({ text, className }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span className="reveal-line" key={i}>
          <motion.span
            className="reveal-inner"
            variants={{ hidden: { y: "110%" }, show: { y: 0 } }}
            transition={{ type: "spring", stiffness: 160, damping: 20, delay: i * 0.06 }}
          >
            {w}
          </motion.span>
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

function Section({ id, title, heading, children, className = "" }) {
  return (
    <motion.section
      className={`section container ${className}`}
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.p className="section-title" variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}>
        {title}
      </motion.p>
      {heading && (
        <h2 className="section-heading">
          <Words text={heading} />
        </h2>
      )}
      {children}
    </motion.section>
  );
}

/* 마우스를 따라 기울어지는 카드 */
function TiltCard({ children, className = "", variants }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 220, damping: 18 });
  const onMove = (e) => {
    if (reduce) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };
  return (
    <motion.article
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      variants={variants}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {children}
    </motion.article>
  );
}

const rise = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 180, damping: 22 } },
};

/* 1. What I Do */
const jobs = [
  { emoji: "📊", title: "Financial Data", desc: "금융 데이터를 수집하고 분석해서 콘텐츠와 서비스에 활용합니다." },
  { emoji: "🤖", title: "AI & LLM", desc: "AI와 LLM을 실제 금융 업무에 어떻게 쓸 수 있을지 실험합니다." },
  { emoji: "🛠️", title: "Build Things", desc: "필요하면 프론트엔드, 백엔드, API, 데이터 파이프라인까지 직접 만듭니다." },
];

export function WhatIDo() {
  return (
    <Section id="work" title="What I do" heading="신영증권 미래금융팀에서는 이런 일을 합니다">
      <motion.div className="logo-row" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <img className="logo-light" src="/shinyoung-logo.png" alt="신영증권" height="28" />
        <img className="logo-dark" src="/shinyoung-logo-dark.png" alt="신영증권" height="28" />
        <span>Future Finance Team · 2025 –</span>
      </motion.div>
      <div className="cards">
        {jobs.map((j) => (
          <TiltCard key={j.title} className="card" variants={rise}>
            <motion.span
              className="emoji"
              aria-hidden="true"
              whileHover={{ rotate: [0, -15, 15, -8, 0], scale: 1.15 }}
              transition={{ duration: 0.5 }}
            >
              {j.emoji}
            </motion.span>
            <h3>{j.title}</h3>
            <p>{j.desc}</p>
          </TiltCard>
        ))}
      </div>
    </Section>
  );
}

/* 2. About Me */
const aboutLines = [
  <>
    새로운 기술을 보면 문서만 읽기보다 <strong>일단 작게 만들어 보는</strong> 편입니다.
  </>,
  <>
    데이터를 분석하는 것도 좋아하지만, 분석 결과가 <strong>실제 서비스로 이어질 때</strong> 가장 재미를 느낍니다.
  </>,
  <>
    요즘은 금융, 데이터, AI가 <strong>만나는 지점</strong>을 계속 공부하고 있습니다.
  </>,
];

export function About() {
  return (
    <Section id="about" title="About me">
      <div className="about">
        {aboutLines.map((line, i) => (
          <motion.p
            key={i}
            variants={{
              hidden: { opacity: 0, x: -30, filter: "blur(6px)" },
              show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.6, delay: i * 0.15 } },
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </Section>
  );
}

/* 3. Currently */
const now = [
  { emoji: "🏦", text: "Building AI-powered financial services" },
  { emoji: "🎓", text: "Learning finance at KAIST DFMBA" },
  { emoji: "🧪", text: "Exploring LLM & data engineering" },
  { emoji: "⚡", text: "Vibe coding side projects" },
];

export function Currently() {
  return (
    <Section id="now" title="Currently" heading="요즘은">
      <ul className="now-list">
        {now.map((item, i) => (
          <motion.li
            key={item.text}
            className="now-item"
            variants={{
              hidden: { opacity: 0, x: i % 2 ? 80 : -80 },
              show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 140, damping: 18 } },
            }}
            whileHover={{ x: 6 }}
          >
            <span className="now-emoji" aria-hidden="true">
              {item.emoji}
            </span>
            {item.text}
            <motion.span
              className="now-dot"
              aria-hidden="true"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            />
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}

/* 4. 일 말고는 — 위에서 툭 떨어지는 스티커 */
const stickers = [
  { emoji: "🏀", text: "NBA 보기" },
  { emoji: "✈️", text: "힐링하는 여행" },
  { emoji: "📈", text: "재테크" },
  { emoji: "📺", text: "유튜브 (무한도전)" },
];

export function OffWork() {
  return (
    <Section id="offwork" title="Off work" heading="일 말고는">
      <div className="stickers">
        {stickers.map((s, i) => (
          <motion.span
            key={s.text}
            className="sticker"
            variants={{
              hidden: { opacity: 0, y: -90, rotate: i % 2 ? 14 : -14, scale: 0.8 },
              show: {
                opacity: 1,
                y: 0,
                rotate: i % 2 ? 2 : -2,
                scale: 1,
                transition: { type: "spring", stiffness: 300, damping: 12, delay: i * 0.1 },
              },
            }}
            whileHover={{ rotate: i % 2 ? -6 : 6, scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9, rotate: 0 }}
          >
            <motion.span
              className="emoji"
              aria-hidden="true"
              whileHover={{ rotate: [0, 20, -20, 0], transition: { duration: 0.5 } }}
            >
              {s.emoji}
            </motion.span>
            {s.text}
          </motion.span>
        ))}
      </div>
    </Section>
  );
}
