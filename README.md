# 조인성 개인 소개 페이지 · 프론트엔드/백엔드 연동

KAIST 디지털금융 MBA 〈클라우드컴퓨팅실습〉 개인 과제입니다.

"신영증권 미래금융팀에서 금융 데이터와 AI 관련 일을 하는 조인성"을 가볍게 소개하는 한 페이지 홈페이지이고,
같은 페이지의 방명록이 Render에 배포한 FastAPI 백엔드를 호출합니다.

## 배포 주소

| 항목 | 주소 |
|---|---|
| 소개 페이지 + 연동 결과 (Vercel) | https://insung-introduction.vercel.app |
| 백엔드 Swagger UI (Render) | https://insung-introduction-api.onrender.com/docs |
| GitHub 저장소 | https://github.com/insung1939/insung_introduction |

> Render 무료 플랜은 15분 동안 요청이 없으면 잠듭니다. 첫 요청이 30~60초 걸릴 수 있고, 그동안 페이지에 "서버를 깨우는 중" 안내가 표시됩니다.

## 주요 구성

```
insung_introduction/
├── frontend/                     # Vercel — Root Directory: frontend
│   ├── index.html                # 페이지 진입점
│   ├── public/                   # 사진, 여행 사진(travel/), 신영증권 로고, 파비콘
│   └── src/
│       ├── App.jsx               # 상단 바, 다크 모드, 섹션 배치
│       ├── api.js                # fetch 래퍼 (VITE_API_URL)
│       ├── offwork.js            # Off work 모달 콘텐츠(문구·사진 목록)
│       ├── styles.css            # 흰색 / 짙은 남색 / 회색 토큰, 다크 모드
│       └── components/
│           ├── Hero.jsx          # 인사 + 사진 무대(배경 덩어리·틸트·떠다니는 배지)
│           ├── Sections.jsx      # What I do · About · Currently · Off work
│           ├── OffWorkModal.jsx  # 스포츠/여행 갤러리/재테크/유튜브 모달
│           ├── Cursor.jsx        # 커스텀 커서
│           └── Guestbook.jsx     # 방명록 (GET / POST / DELETE)
└── backend/                      # Render — Root Directory: backend
    ├── main.py                   # FastAPI (CORS, Pydantic, 엔드포인트)
    ├── requirements.txt
    └── render.yaml               # Render 설정값 참고용
```

### 페이지 흐름 (한 페이지 스크롤)

1. **Hero** — 이름, 소속(신영증권 미래금융팀), 한 줄 소개, 사진. 인트로 커튼이 걷히면 글자가 솟아오르고 사진과 배지가 튀어나옵니다.
2. **What I do** — Financial Data · AI & LLM · Build Things 카드 3개
3. **About me** — 세 줄
4. **Currently** — 요즘 하는 것 4가지
5. **Off work** — 스포츠 보기 · 힐링하는 여행 · 재테크 · 유튜브. 각 스티커를 누르면 모달이 열립니다 (여행은 연도 탭으로 넘겨 보는 사진 21장 갤러리와 라이트박스).
6. **방명록** — 이름과 한 줄을 남기면 FastAPI 서버에 저장되고 목록이 갱신됩니다. 삭제도 됩니다.

### 백엔드 API

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/health` | 서버 상태 (콜드 스타트 안내용) |
| GET | `/api/guestbook` | 방명록 목록 (최신순) |
| POST | `/api/guestbook` | 방명록 작성 — `name` 1~20자, `message` 1~200자 |
| DELETE | `/api/guestbook/{id}` | 방명록 삭제 |

2주차 실습워크북의 메모장 API(Pydantic 모델 + CORS 환경변수 + GET/POST/DELETE) 구조를 그대로 따르고, 다루는 데이터만 방명록으로 바꿨습니다. 저장소는 인메모리 리스트라 서버가 재시작되면 방명록은 초기화됩니다.

### 사용 기술

- Frontend: React 19, Vite 8, [Motion](https://motion.dev) (애니메이션), Pretendard
- Backend: Python 3.13, FastAPI, Uvicorn, Pydantic
- Deploy: Vercel(프론트) · Render(백엔드) · GitHub

## 로컬 실행

```bash
# 백엔드 → http://localhost:8000 (Swagger: /docs)
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install "fastapi[standard]"
fastapi dev main.py

# 프론트엔드 → http://localhost:5173
cd frontend
npm install
npm run dev        # .env 의 VITE_API_URL=http://localhost:8000 사용
```

## 배포 설정

**Render** (백엔드, Web Service)

| 항목 | 값 |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Environment Variable | `ALLOWED_ORIGINS` = Vercel 주소 (끝에 `/` 없이) |

**Vercel** (프론트엔드)

| 항목 | 값 |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Vite (자동 감지) |
| Build Command / Output | `npm run build` / `dist` |
| Environment Variable | `VITE_API_URL` = Render 주소 (끝에 `/` 없이) |

바뀌는 값은 코드가 아니라 환경변수로 관리합니다. Vite 환경변수는 빌드 시점에 굳어지므로 값을 바꾸면 재배포가 필요합니다.

## 사용성에서 신경 쓴 점

- **콜드 스타트 안내** — 응답이 5초 넘게 없으면 "서버를 깨우는 중"으로 바꿔 무료 서버의 느린 첫 응답을 오류로 오해하지 않게 했습니다.
- **상태별 화면** — 로딩 스켈레톤, 오류 + 다시 시도, 빈 방명록 문구를 각각 두었습니다.
- **애니메이션 (Motion)** — 인트로 커튼, 마스크 아래에서 솟아오르는 제목, 모양이 계속 바뀌는 배경 덩어리, 마우스를 따라 기울어지는 사진과 카드, 스크롤 패럴랙스, 떠다니는 배지, 키워드 띠, 위에서 툭 떨어지는 스티커, 방명록 글의 등장·퇴장. `prefers-reduced-motion` 설정을 켜면 큰 움직임은 꺼집니다.
- **다크 모드** — 1주차에 배운 클래스 토글을 확장해 시스템 설정을 따르고 선택을 기억합니다.
- **모바일** — 한 열로 접히는 레이아웃, 큰 터치 영역.

## 이미지 출처

- 신영증권 CI: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:ShinyoungCI.png) (CC BY-SA 4.0)
- 르브론 제임스 사진: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:LeBron_James_Lakers_(cropped).jpg), All-Pro Reels (CC BY-SA 2.0)
- 그 외 사진은 모두 직접 찍은 사진이며, 위치 정보 등 EXIF는 제거했습니다.

## AI 활용

페이지 구조와 코드는 Claude Code의 도움을 받아 작성했고, 소개 내용은 제가 정리한 프로필 문서를 바탕으로 골랐습니다. 생성된 코드는 로컬에서 실행해 curl과 브라우저로 확인한 뒤 반영했습니다.
