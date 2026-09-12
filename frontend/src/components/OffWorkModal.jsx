import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { investing, sports, travelPhotos, travelYears, youtube } from "../offwork.js";

/* 공통 모달 껍데기: 배경 클릭·Esc로 닫힘, 열려 있는 동안 페이지 스크롤 잠금 */
export default function OffWorkModal({ kind, onClose }) {
  useEffect(() => {
    if (!kind) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [kind, onClose]);

  const meta = {
    sports: { emoji: "⚽", title: "스포츠 보기" },
    travel: { emoji: "✈️", title: "힐링하는 여행" },
    invest: { emoji: "📈", title: "재테크" },
    youtube: { emoji: "📺", title: "유튜브 (무한도전)" },
  }[kind];

  return (
    <AnimatePresence>
      {kind && (
        <motion.div
          className="modal-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`modal modal-${kind}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <header className="modal-head">
              <h3 id="modal-title">
                <span aria-hidden="true">{meta.emoji}</span> {meta.title}
              </h3>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="닫기">
                ✕
              </button>
            </header>
            <div className="modal-body">
              {kind === "sports" && <Sports />}
              {kind === "travel" && <Travel />}
              {kind === "invest" && <Invest />}
              {kind === "youtube" && <Youtube />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const pop = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
};

/* ── 스포츠 ─────────────────────────────── */
function Sports() {
  const [active, setActive] = useState(0);
  const s = sports[active];
  return (
    <>
      <div className="tabs" role="tablist">
        {sports.map((t, i) => (
          <button
            key={t.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`tab${i === active ? " is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            <span aria-hidden="true">{t.emoji}</span> {t.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={s.name}
          className="sport-panel"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          {s.photo ? (
            <img className="sport-photo" src={`/travel/${s.photo}.jpg`} alt={`${s.name} 관련 사진`} loading="lazy" />
          ) : (
            <div className="sport-emoji" aria-hidden="true">
              {s.emoji}
            </div>
          )}
          <p>{s.desc}</p>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

/* ── 여행: 연도별 발자취 + 사진 갤러리 + 라이트박스 ── */
function Travel() {
  const [open, setOpen] = useState(null); // 선택된 사진 index
  const go = (d) => setOpen((i) => (i + d + travelPhotos.length) % travelPhotos.length);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <p className="modal-intro">
        메인 사진은 <strong>프랑스 몽생미셸</strong>에서 찍었습니다. 낯선 도시를 걷다 보면 머리가 비워져서, 힘들 때마다
        떠날 계획부터 세워요.
      </p>

      <motion.ul className="years" variants={stagger} initial="hidden" animate="show">
        {travelYears.map((y) => (
          <motion.li key={y.year} variants={pop}>
            <span className="year">{y.year}</span>
            <span className="places">{y.places.join(" · ")}</span>
          </motion.li>
        ))}
      </motion.ul>

      <motion.ul className="gallery" variants={stagger} initial="hidden" animate="show">
        {travelPhotos.map((p, i) => (
          <motion.li key={p.id} variants={pop}>
            <button type="button" className="thumb" onClick={() => setOpen(i)} aria-label={`${p.place} 사진 크게 보기`}>
              <img src={`/travel/${p.id}_thumb.jpg`} alt={p.place} loading="lazy" width="480" height="360" />
              <span>{p.place}</span>
            </button>
          </motion.li>
        ))}
      </motion.ul>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="lightbox"
            onClick={() => setOpen(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button type="button" className="lb-nav lb-prev" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="이전 사진">
              ‹
            </button>
            <motion.figure
              key={travelPhotos[open].id}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <img src={`/travel/${travelPhotos[open].id}.jpg`} alt={travelPhotos[open].place} />
              <figcaption>
                <strong>{travelPhotos[open].place}</strong> {travelPhotos[open].caption}
                <em>
                  {open + 1} / {travelPhotos.length}
                </em>
              </figcaption>
            </motion.figure>
            <button type="button" className="lb-nav lb-next" onClick={(e) => (e.stopPropagation(), go(1))} aria-label="다음 사진">
              ›
            </button>
            <button type="button" className="lb-close" onClick={() => setOpen(null)} aria-label="닫기">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── 재테크 ─────────────────────────────── */
function Invest() {
  return (
    <>
      <p className="modal-intro">{investing.intro}</p>
      <motion.ul className="principles" variants={stagger} initial="hidden" animate="show">
        {investing.principles.map((p) => (
          <motion.li key={p.title} variants={pop}>
            <span className="p-emoji" aria-hidden="true">
              {p.emoji}
            </span>
            <div>
              <strong>{p.title}</strong>
              <p>{p.desc}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </>
  );
}

/* ── 유튜브 ─────────────────────────────── */
function Youtube() {
  return (
    <>
      <p className="modal-intro">{youtube.intro}</p>
      <motion.ul className="episodes" variants={stagger} initial="hidden" animate="show">
        {youtube.favorites.map((f) => (
          <motion.li key={f.title} variants={pop}>
            <a href={youtube.search(f.title)} target="_blank" rel="noopener noreferrer">
              <span className="ep-play" aria-hidden="true">
                ▶
              </span>
              <span>
                <strong>{f.title}</strong>
                <small>{f.note}</small>
              </span>
              <span className="ep-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </motion.li>
        ))}
      </motion.ul>
      <p className="modal-note">누르면 유튜브 검색 결과로 이동합니다.</p>
    </>
  );
}
