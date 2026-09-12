import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { api } from "../api.js";

// 등장 애니메이션: 자식들이 순서대로 떠오른다.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 26 } },
};

export default function Hero() {
  return (
    <section className="hero container" id="top">
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.p className="eyebrow" variants={rise}>
          Finance <SpinX /> Data <SpinX /> AI
        </motion.p>
        <motion.h1 variants={rise}>
          안녕하세요,
          <br />
          조인성입니다 <Wave />
        </motion.h1>
        <motion.p className="lead" variants={rise}>
          신영증권에서 금융 데이터와 AI를 활용한 서비스를 만들고 있습니다. 데이터를 분석하는 것도, 직접
          코드를 짜서 돌아가는 무언가를 만드는 것도 좋아해요.
        </motion.p>
        <motion.div variants={rise}>
          <HelloButton />
        </motion.div>
      </motion.div>

      <PhotoCard />
    </section>
  );
}

/* "×" 기호가 마우스를 올리면 빙글 돈다 */
function SpinX() {
  return (
    <motion.span className="x" whileHover={{ rotate: 180, scale: 1.3 }} transition={{ type: "spring", stiffness: 300 }}>
      ×
    </motion.span>
  );
}

/* 손 흔들기 */
function Wave() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="wave"
      aria-hidden="true"
      animate={reduce ? {} : { rotate: [0, 16, -8, 16, -4, 0] }}
      transition={{ duration: 1.6, delay: 0.8, repeat: Infinity, repeatDelay: 3 }}
      whileHover={{ rotate: [0, 20, -10, 20, 0], transition: { duration: 0.6 } }}
    >
      👋
    </motion.span>
  );
}

/* 버튼을 누르면 FastAPI 백엔드가 인사하는 말풍선이 튀어나온다 */
function HelloButton() {
  const [state, setState] = useState({ status: "idle", data: null, error: null });
  const slowTimer = useRef(null);

  const sayHello = async () => {
    setState({ status: "loading", data: null, error: null });
    // Render 무료 플랜: 잠들어 있으면 첫 응답이 30~60초 걸린다 → 5초 지나면 안내
    slowTimer.current = setTimeout(() => setState((s) => (s.status === "loading" ? { ...s, status: "waking" } : s)), 5000);
    try {
      const data = await api.profile();
      setState({ status: "done", data, error: null });
    } catch (err) {
      setState({ status: "error", data: null, error: err.message });
    } finally {
      clearTimeout(slowTimer.current);
    }
  };

  useEffect(() => () => clearTimeout(slowTimer.current), []);

  const busy = state.status === "loading" || state.status === "waking";

  return (
    <>
      <div className="hero-actions">
        <motion.button
          type="button"
          className="btn btn-primary"
          onClick={sayHello}
          disabled={busy}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          {busy ? "백엔드 부르는 중…" : "Say hello to my backend 👋"}
        </motion.button>
        <motion.a
          className="btn btn-ghost"
          href="https://github.com/insung1939"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          GitHub
        </motion.a>
      </div>

      <div className="bubble-wrap" aria-live="polite">
        <AnimatePresence mode="wait">
          {state.status === "waking" && (
            <Bubble key="waking" tone="wait">
              <p className="bubble-msg">서버를 깨우는 중이에요 ☕</p>
              <p className="bubble-sub">Render 무료 플랜이라 잠들어 있으면 첫 응답에 최대 1분 정도 걸립니다.</p>
            </Bubble>
          )}
          {state.status === "done" && (
            <Bubble key="done">
              <p className="bubble-msg">{state.data.message}</p>
              <p className="bubble-meta">
                <span>
                  name <b>{state.data.name}</b>
                </span>
                <span>
                  company <b>{state.data.company}</b>
                </span>
                <span>
                  focus <b>{state.data.focus}</b>
                </span>
              </p>
              <p className="bubble-sub">
                <code>GET /api/profile</code> 응답을 그대로 보여 주고 있어요.
              </p>
            </Bubble>
          )}
          {state.status === "error" && (
            <Bubble key="error" tone="error">
              <p className="bubble-msg">백엔드가 대답이 없네요 😅</p>
              <p className="bubble-sub">{state.error} · 잠시 후 다시 눌러 보세요.</p>
            </Bubble>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function Bubble({ children, tone }) {
  return (
    <motion.div
      className={`bubble${tone ? ` is-${tone}` : ""}`}
      initial={{ opacity: 0, scale: 0.6, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -6, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}

/* 마우스를 따라 살짝 기울어지는 사진 카드 */
function PhotoCard() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="photo-card"
      style={{ rotateX, rotateY, perspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.25 }}
      whileHover={{ scale: 1.02 }}
    >
      <img src="/insung.jpg" alt="여행 중 찍은 조인성의 사진" width="960" height="1200" />
      <motion.span
        className="photo-caption"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        여행 중 한 컷 ✈️
      </motion.span>
    </motion.div>
  );
}
