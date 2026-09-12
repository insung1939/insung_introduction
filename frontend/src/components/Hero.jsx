import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/* 글자가 마스크 아래에서 솟아오르는 제목 */
function RevealLines({ lines, delay = 0 }) {
  return (
    <>
      {lines.map((line, i) => (
        <span className="reveal-line" key={i}>
          <motion.span
            className="reveal-inner"
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 20, delay: delay + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const base = reduce ? 0 : 1.0; // 인트로 커튼이 걷힌 뒤 시작

  return (
    <section className="hero container" id="top">
      <div className="hero-text">
        <motion.a
          className="company-chip"
          href="https://www.shinyoung.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: base, duration: 0.5 }}
          whileHover={{ y: -2 }}
        >
          <img src="/shinyoung-symbol.png" alt="" width="18" height="18" />
          신영증권 미래금융팀
        </motion.a>

        <h1 className="hero-title">
          <RevealLines lines={["안녕하세요,", "조인성입니다."]} delay={base + 0.1} />
        </h1>

        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: base + 0.5, duration: 0.6 }}
        >
          신영증권 미래금융팀에서 금융 데이터와 AI를 활용한 서비스를 만들고 있습니다. 데이터를 분석하는 것을
          좋아하고, 요즘은 금융과 AI가 만나는 지점을 계속 공부하고 있어요.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: base + 0.65, duration: 0.6 }}
        >
          <motion.a className="btn btn-primary" href="#guestbook" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
            방명록 남기기 ✍️
          </motion.a>
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
        </motion.div>

        <motion.p
          className="keywords"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: base + 0.9, duration: 0.8 }}
        >
          Finance <span className="x">×</span> Data <span className="x">×</span> AI
        </motion.p>
      </div>

      <PhotoStage base={base} reduce={reduce} />
    </section>
  );
}

/* 사진 무대: 살아 움직이는 배경 덩어리 + 기울어지는 사진 + 떠다니는 배지 */
function PhotoStage({ base, reduce }) {
  const ref = useRef(null);

  // 마우스 틸트
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 180, damping: 18 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  // 스크롤 패럴랙스: 사진은 천천히, 배지는 반대로
  const { scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -60]);
  const badgeY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 40]);

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
    <div className="stage" ref={ref} onMouseMove={onMove} onMouseLeave={reset}>
      {/* 배경 덩어리: 모양이 계속 천천히 바뀐다 */}
      <motion.div
        className="blob"
        aria-hidden="true"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          reduce
            ? { scale: 1, opacity: 1 }
            : {
                scale: 1,
                opacity: 1,
                borderRadius: [
                  "60% 40% 30% 70% / 60% 30% 70% 40%",
                  "30% 60% 70% 40% / 50% 60% 30% 60%",
                  "50% 50% 40% 60% / 40% 60% 60% 40%",
                  "60% 40% 30% 70% / 60% 30% 70% 40%",
                ],
                rotate: [0, 8, -6, 0],
              }
        }
        transition={{
          scale: { type: "spring", stiffness: 120, damping: 16, delay: base },
          opacity: { delay: base, duration: 0.4 },
          borderRadius: { duration: 14, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="photo"
        style={{ rotateX, rotateY, y: photoY }}
        initial={{ opacity: 0, y: 60, rotate: -6, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 16, delay: base + 0.15 }}
      >
        <img src="/insung.jpg" alt="조인성" width="960" height="1200" />
        <motion.span className="glare" aria-hidden="true" style={{ "--gx": glareX, "--gy": glareY }} />
      </motion.div>

      <motion.div
        className="badge badge-a"
        style={{ y: badgeY }}
        initial={{ opacity: 0, x: -30, rotate: -8 }}
        animate={{ opacity: 1, x: 0, rotate: -4 }}
        transition={{ type: "spring", stiffness: 160, damping: 14, delay: base + 0.6 }}
      >
        <motion.span
          className="badge-inner"
          animate={reduce ? {} : { y: [0, -7, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/shinyoung-symbol.png" alt="" width="20" height="20" />
          <span>
            <b>신영증권</b>
            <small>미래금융팀</small>
          </span>
        </motion.span>
      </motion.div>

      <motion.div
        className="badge badge-b"
        style={{ y: badgeY }}
        initial={{ opacity: 0, x: 30, rotate: 8 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ type: "spring", stiffness: 160, damping: 14, delay: base + 0.75 }}
      >
        <motion.span
          className="badge-inner"
          animate={reduce ? {} : { y: [0, -9, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          <span className="badge-emoji">🎓</span>
          <span>
            <b>KAIST</b>
            <small>Digital Finance MBA</small>
          </span>
        </motion.span>
      </motion.div>
    </div>
  );
}
