import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { api } from "../api.js";

/* 방명록 — 2주차 메모장 실습(GET/POST/DELETE)과 같은 흐름 */
export default function Guestbook() {
  const [entries, setEntries] = useState(null); // null = 아직 안 불러옴
  const [error, setError] = useState(null);
  const [health, setHealth] = useState("checking"); // checking | waking | ok | down
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setEntries(await api.guestbook.list()); // 목록 조회 GET
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // 처음 뜰 때: 서버 상태 확인 + 목록 불러오기
  useEffect(() => {
    let cancelled = false;
    const slow = setTimeout(() => !cancelled && setHealth((h) => (h === "checking" ? "waking" : h)), 5000);
    api
      .health()
      .then(() => !cancelled && setHealth("ok"))
      .catch(() => !cancelled && setHealth("down"))
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
      setFormError("이름과 메시지를 모두 적어 주세요.");
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
      setEntries((list) => list.filter((g) => g.id !== id)); // 사라지는 애니메이션을 위해 즉시 반영
    } catch (err) {
      setFormError(err.message);
    }
  };

  const statusText = {
    checking: "백엔드 확인 중…",
    waking: "Render 서버를 깨우는 중 (최대 1분)",
    ok: "FastAPI 연결됨",
    down: "백엔드에 연결하지 못했어요",
  }[health];

  return (
    <section className="section container" id="guestbook">
      <motion.div
        className="gb"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <div className="gb-top">
          <h2>방명록 ✍️</h2>
          <span className={`status ${health}`} aria-live="polite">
            <span className="status-dot" aria-hidden="true" />
            {statusText}
          </span>
        </div>
        <p className="gb-desc">
          한 줄 남기면 Render에 있는 FastAPI 서버로 전송됩니다. 실습용 인메모리 저장소라 서버가 재시작되면
          초기화돼요.
        </p>

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
            placeholder="한 줄 남기기 (200자 이내)"
            maxLength={200}
            aria-label="메시지"
          />
          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
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
            <p>
              <strong>불러오기 실패</strong> · {error}
            </p>
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
                  initial={{ opacity: 0, y: -12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, height: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
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
