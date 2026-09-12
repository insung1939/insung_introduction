// 백엔드 API 주소. VITE_ 로 시작하는 변수만 브라우저 코드에 노출된다(보안상 중요).
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

// fetch 를 감싸서 JSON 파싱과 오류 메시지 처리를 한 곳에서 한다.
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const detail = data?.detail;
    throw new Error(Array.isArray(detail) ? detail.map((d) => d.msg).join(", ") : detail || `HTTP ${res.status}`);
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),
  guestbook: {
    list: () => request("/api/guestbook"),
    create: (body) => request("/api/guestbook", { method: "POST", body: JSON.stringify(body) }),
    remove: (id) => request(`/api/guestbook/${id}`, { method: "DELETE" }),
  },
};
