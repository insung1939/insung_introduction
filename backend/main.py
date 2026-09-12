"""
조인성 개인 소개 페이지 · FastAPI 백엔드

2주차 실습워크북의 메모장 API 구조(Pydantic 모델 + CORS 환경변수 + GET/POST/DELETE + SQLAlchemy)를
그대로 따르고, 메모 대신 '방명록'을 다룬다.
저장소: 로컬은 SQLite(guestbook.db), 배포는 Supabase PostgreSQL (환경변수 DATABASE_URL).
"""

import os
from datetime import datetime, timezone

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_serializer
from sqlalchemy.orm import Session

import models
from database import Base, SessionLocal, engine, get_db

# 테이블이 없으면 만든다 (models 를 import 한 뒤에 호출해야 테이블 정의를 안다)
Base.metadata.create_all(bind=engine)


def seed_first_entry():
    """방명록이 비어 있으면 첫 글 하나를 넣어 둔다."""
    with SessionLocal() as db:
        if db.query(models.Guestbook).first() is None:
            db.add(models.Guestbook(name="인성", message="첫 글은 제가 남겨요. 편하게 한 줄 남겨 주세요 🙂"))
            db.commit()


seed_first_entry()

app = FastAPI(
    title="Insung Cho · Intro API",
    description="개인 소개 페이지용 FastAPI 백엔드. 간단한 방명록 API를 제공합니다.",
    version="3.0.0",
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
class GuestbookIn(BaseModel):  # 요청 본문: 클라이언트가 보내는 데이터
    name: str = Field(min_length=1, max_length=20, examples=["하나"])
    message: str = Field(min_length=1, max_length=200, examples=["페이지 잘 봤어요!"])


class GuestbookOut(BaseModel):  # 응답 본문: 서버가 돌려주는 데이터
    model_config = {"from_attributes": True}  # ORM 객체를 그대로 응답으로 변환

    id: int
    name: str
    message: str
    created_at: datetime

    @field_serializer("created_at")
    def _with_timezone(self, dt: datetime) -> str:
        # SQLite 는 시간대 정보를 버리므로 UTC 로 명시해 브라우저가 올바르게 해석하게 한다.
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat()


# ── 엔드포인트 ──
@app.get("/", tags=["meta"])
def root():
    return {"service": "insung-introduction-api", "docs": "/docs"}


@app.get("/api/health", tags=["meta"])
def health():
    """프론트엔드가 서버 생존 여부(콜드 스타트 포함)를 확인할 때 쓴다."""
    now = datetime.now(timezone.utc)
    return {"status": "ok", "uptime_seconds": int((now - STARTED_AT).total_seconds())}


@app.get("/api/guestbook", response_model=list[GuestbookOut], tags=["guestbook"])
def list_guestbook(db: Session = Depends(get_db)):
    # 최신 글이 위로
    return db.query(models.Guestbook).order_by(models.Guestbook.id.desc()).all()


@app.post("/api/guestbook", response_model=GuestbookOut, status_code=201, tags=["guestbook"])
def create_guestbook(entry: GuestbookIn, db: Session = Depends(get_db)):
    new = models.Guestbook(name=entry.name.strip(), message=entry.message.strip())
    db.add(new)
    db.commit()
    db.refresh(new)  # DB가 채운 id, created_at 을 읽어 온다
    return new


@app.delete("/api/guestbook/{entry_id}", tags=["guestbook"])
def delete_guestbook(entry_id: int, db: Session = Depends(get_db)):
    row = db.get(models.Guestbook, entry_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Guestbook entry not found")
    db.delete(row)
    db.commit()
    return {"ok": True}
