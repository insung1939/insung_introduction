import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { api } from "../api.js";

/* 방명록 — 2주차 메모장 실습(GET/POST/DELETE)과 같은 흐름 */
export default function Guestbook() {
  const [entries, setEntries] = useState(null); // null = 아직 안 불러옴
  const [error, setError] = useState(null);
  const [server, setServer] = useState("checking"); // checking | waking | ok | down
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setEntries(await api.guestbook.list()); // GET
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // 처음 뜰 때: 서버가 깨어 있는지 확인 + 목록 불러오기
  useEffect(() => {
    let cancelled = false;
    const slow = setTimeout(() => !cancelled && setServer((s) => (s === "checking" ? "waking" : s)), 5000);
    api
      .health()
      .then(() => !cancelled && setServer("ok"))
      .catch(() => !cancelled && setServer("down"))
      .finally(() => clearTimeout(slow));
    load();
    return () => {
      cancelled = true;
      clearTimeout(slow);
    };
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setFormError("이름과 한 줄을 모두 적어 주세요.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await api.guestbook.create({ name, message }); // POST
      setMessage("");
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.guestbook.remove(id); // DELETE
      setEntries((list) => list.filter((g) => g.id !== id));
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <section className="section container" id="guestbook">
      <motion.div
        className="gb"
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
      >
        <div className="gb-top">
          <div>
            <p className="section-title">Guestbook</p>
            <h2>방명록 ✍️</h2>
          </div>
          <AnimatePresence>
            {server === "waking" && (
              <motion.span
                key="waking"
                className="status waking"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <span className="status-dot" aria-hidden="true" />
                서버를 깨우는 중이에요 ☕ (최대 1분)
              </motion.span>
            )}
            {server === "down" && (
              <motion.span key="down" className="status down" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className="status-dot" aria-hidden="true" />
                지금은 서버에 연결되지 않아요
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="gb-desc">다녀간 흔적을 한 줄 남겨 주세요.</p>

        <form className="gb-form" onSubmit={submit}>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            maxLength={20}
            aria-label="이름"
          />
          <input
            className="input input-grow"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="한 줄 남기기"
            maxLength={200}
            aria-label="메시지"
          />
          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
          >
            {submitting ? "남기는 중…" : "남기기"}
          </motion.button>
        </form>
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        {error && (
          <div className="error-box" role="alert">
            <p>방명록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
            <button type="button" className="btn btn-ghost btn-sm" onClick={load}>
              다시 시도
            </button>
          </div>
        )}

        {!error && entries === null && (
          <div className="skeleton" aria-hidden="true">
            <span style={{ width: "70%" }} />
            <span style={{ width: "50%" }} />
          </div>
        )}

        {entries && (
          <ul className="gb-list">
            {entries.length === 0 && <li className="gb-empty">아직 글이 없어요. 첫 글을 남겨 보세요.</li>}
            <AnimatePresence initial={false}>
              {entries.map((g) => (
                <motion.li
                  key={g.id}
                  className="gb-item"
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  <span className="gb-avatar" aria-hidden="true">
                    {g.name.slice(0, 1)}
                  </span>
                  <div className="gb-body">
                    <p className="gb-head">
                      <strong>{g.name}</strong>
                      <time dateTime={g.created_at}>{timeAgo(g.created_at)}</time>
                    </p>
                    <p className="gb-msg">{g.message}</p>
                  </div>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => remove(g.id)}
                    aria-label={`${g.name}의 글 삭제`}
                  >
                    삭제
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </section>
  );
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return new Date(iso).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}
