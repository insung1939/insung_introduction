import { motion } from "motion/react";

// 스크롤해서 화면에 들어올 때 한 번 떠오르는 공통 래퍼
const viewport = { once: true, margin: "-80px" };
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function Section({ id, title, heading, children }) {
  return (
    <motion.section
      className="section container"
      id={id}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <motion.p className="section-title" variants={rise}>
        {title}
      </motion.p>
      {heading && (
        <motion.h2 className="section-heading" variants={rise}>
          {heading}
        </motion.h2>
      )}
      {children}
    </motion.section>
  );
}

/* 1. What I Do — 카드 3개 */
const jobs = [
  {
    emoji: "📊",
    title: "Financial Data",
    desc: "금융 데이터를 수집하고 분석해서 콘텐츠와 서비스에 활용합니다.",
  },
  {
    emoji: "🤖",
    title: "AI & LLM",
    desc: "AI와 LLM을 실제 금융 업무에 어떻게 쓸 수 있을지 실험합니다.",
  },
  {
    emoji: "🛠️",
    title: "Build Things",
    desc: "필요하면 프론트엔드, 백엔드, API, 데이터 파이프라인까지 직접 만듭니다.",
  },
];

export function WhatIDo() {
  return (
    <Section id="work" title="What I do" heading="신영증권에서는 이런 일을 합니다">
      <div className="cards">
        {jobs.map((j) => (
          <motion.article
            key={j.title}
            className="card"
            variants={rise}
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 18 } }}
          >
            <motion.span className="emoji" aria-hidden="true" whileHover={{ rotate: [0, -12, 12, 0] }}>
              {j.emoji}
            </motion.span>
            <h3>{j.title}</h3>
            <p>{j.desc}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* 2. About Me — 세 줄 */
export function About() {
  return (
    <Section id="about" title="About me">
      <div className="about">
        <motion.p variants={rise}>
          새로운 기술을 보면 문서만 읽기보다 <strong>일단 작게 만들어 보는</strong> 편입니다.
        </motion.p>
        <motion.p variants={rise}>
          데이터를 분석하는 것도 좋아하지만, 분석 결과가 <strong>실제 서비스로 이어질 때</strong> 가장 재미를
          느낍니다.
        </motion.p>
        <motion.p variants={rise}>
          요즘은 금융, 데이터, AI가 <strong>만나는 지점</strong>을 계속 공부하고 있습니다.
        </motion.p>
      </div>
    </Section>
  );
}

/* 3. Currently */
const now = [
  "Building AI-powered financial services",
  "Learning finance at KAIST DFMBA",
  "Exploring LLM & data engineering",
  "Vibe coding side projects",
];

export function Currently() {
  return (
    <Section id="now" title="Currently" heading="요즘은">
      <ul className="now-list">
        {now.map((item, i) => (
          <motion.li key={item} className="now-item" variants={rise} whileHover={{ x: 4 }}>
            <motion.span
              className="now-dot"
              aria-hidden="true"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            />
            {item}
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}

/* 4. 일 말고는 — 스티커 */
const stickers = [
  { emoji: "🏀", text: "NBA 보기 (선수 데이터로 ML 예측도 해봤어요)" },
  { emoji: "✈️", text: "여행과 새로운 경험" },
  { emoji: "💡", text: "“이거 직접 만들 수 있지 않을까?”" },
  { emoji: "🔍", text: "배우고 싶은 게 생기면 깊게 파기" },
  { emoji: "📝", text: "공부한 걸 기록하기" },
];

export function OffWork() {
  return (
    <Section id="offwork" title="Off work" heading="일 말고는">
      <div className="stickers">
        {stickers.map((s, i) => (
          <motion.span
            key={s.text}
            className="sticker"
            variants={rise}
            whileHover={{ rotate: i % 2 ? 3 : -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <span className="emoji" aria-hidden="true">
              {s.emoji}
            </span>
            {s.text}
          </motion.span>
        ))}
      </div>
      <motion.p className="offwork-note" variants={rise}>
        호기심이 많고, 직접 만들어 보는 걸 좋아하는 사람이라고 생각해 주시면 됩니다.
      </motion.p>
    </Section>
  );
}
