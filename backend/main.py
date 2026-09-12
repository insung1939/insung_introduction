"""
조인성 개인 소개 페이지 · FastAPI 백엔드

2주차 실습워크북의 메모장 API 구조(Pydantic 모델 + CORS 환경변수 + GET/POST/DELETE)를
그대로 따르고, 메모 대신 '프로필'과 '방명록'을 다룬다.
저장소는 인메모리 리스트라 서버가 재시작되면(Render 슬립 포함) 방명록은 초기화된다.
"""

import os
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Insung Cho · Intro API",
    description="개인 소개 페이지용 FastAPI 백엔드. 프로필 조회와 간단한 방명록을 제공합니다.",
    version="2.0.0",
)

# ── CORS: 허용 출처를 환경변수로 (배포 시 Vercel 주소로) ──
# 로컬: http://localhost:5173 / 배포: ALLOWED_ORIGINS="https://<프로젝트>.vercel.app"
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_origin_regex=r"https://.*\.vercel\.app",  # Vercel 프리뷰 주소도 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STARTED_AT = datetime.now(timezone.utc)


# ── 주고받을 데이터의 모양 (Pydantic) ──
class Profile(BaseModel):
    name: str
    company: str
    focus: str
    message: str


class GuestbookIn(BaseModel):  # 요청 본문: 클라이언트가 보내는 데이터
    name: str = Field(min_length=1, max_length=20, examples=["하나"])
    message: str = Field(min_length=1, max_length=200, examples=["페이지 잘 봤어요!"])


class GuestbookOut(BaseModel):  # 응답 본문: 서버가 돌려주는 데이터
    id: int
    name: str
    message: str
    created_at: datetime


# ── 인메모리 저장소 (리스트에 저장 → 서버 끄면 사라짐) ──
guestbook: list[dict] = [
    {
        "id": 1,
        "name": "인성",
        "message": "첫 글은 제가 남겨요. 편하게 한 줄 남겨 주세요 🙂",
        "created_at": STARTED_AT,
    }
]
next_id = 2


# ── 엔드포인트 ──
@app.get("/", tags=["meta"])
def root():
    return {"service": "insung-intro-api", "docs": "/docs"}


@app.get("/api/health", tags=["meta"])
def health():
    """프론트엔드가 서버 생존 여부(콜드 스타트 포함)를 확인할 때 쓴다."""
    now = datetime.now(timezone.utc)
    return {"status": "ok", "uptime_seconds": int((now - STARTED_AT).total_seconds())}


@app.get("/api/profile", response_model=Profile, tags=["profile"])
def get_profile():
    return Profile(
        name="Insung Cho",
        company="Shinyoung Securities",
        focus="Finance × Data × AI",
        message="Hello from FastAPI! 👋 Render에서 잘 돌아가고 있어요.",
    )


@app.get("/api/guestbook", response_model=list[GuestbookOut], tags=["guestbook"])
def list_guestbook():
    return list(reversed(guestbook))  # 최신 글이 위로


@app.post("/api/guestbook", response_model=GuestbookOut, status_code=201, tags=["guestbook"])
def create_guestbook(entry: GuestbookIn):
    global next_id
    new = {
        "id": next_id,
        "name": entry.name.strip(),
        "message": entry.message.strip(),
        "created_at": datetime.now(timezone.utc),
    }
    guestbook.append(new)
    next_id += 1
    return new


@app.delete("/api/guestbook/{entry_id}", tags=["guestbook"])
def delete_guestbook(entry_id: int):
    global guestbook
    for g in guestbook:
        if g["id"] == entry_id:
            guestbook = [x for x in guestbook if x["id"] != entry_id]
            return {"ok": True}
    raise HTTPException(status_code=404, detail="Guestbook entry not found")
