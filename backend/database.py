"""
DB 연결 설정 (2주차 워크북 4~5단계 방식)

- 로컬: DATABASE_URL 이 없으면 SQLite 파일(guestbook.db)을 쓴다.
- 배포: Render 환경변수 DATABASE_URL 에 Supabase(PostgreSQL) Session pooler 주소를 넣는다.
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./guestbook.db")

# Supabase가 주는 주소는 postgresql:// 로 시작하지만, 예전 postgres:// 형태도 받아 준다.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite 는 한 스레드에서만 접근하도록 막는 기본값이 있어 풀어 준다. PostgreSQL 은 해당 없음.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,  # 잠들었다 깬 연결을 쓰기 전에 살아 있는지 확인
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    """요청마다 세션을 하나 열고, 끝나면 반드시 닫는다."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
