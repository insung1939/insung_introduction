/* Off work 섹션의 콘텐츠. 문구와 사진은 여기서만 고치면 된다. */

// 파일은 frontend/public/travel/<id>.jpg 와 <id>_thumb.jpg. 연도는 사진의 촬영 정보 기준.
export const travelPhotos = [
  { id: "guam_nightseeing", year: 2019, place: "괌", caption: "밤에 내려다본 투몬 해변" },
  { id: "switzerland_landscape", year: 2019, place: "스위스", caption: "알프스 호수. 물색이 진짜 이렇습니다." },
  { id: "italy", year: 2019, place: "이탈리아 · 부라노", caption: "알록달록한 집들이 늘어선 섬" },
  { id: "macau", year: 2020, place: "마카오", caption: "화려한 호텔 야경" },
  { id: "kotakinabalu_malaysia", year: 2023, place: "말레이시아 · 코타키나발루", caption: "야자수와 바다, 그리고 아무것도 안 하기" },
  { id: "ireland_landscape", year: 2024, place: "아일랜드 · 모허 절벽", caption: "바람이 정말 셉니다" },
  { id: "iceland_spring", year: 2024, place: "아이슬란드", caption: "동굴 사이로 흐르는 온천" },
  { id: "norway_landscape", year: 2024, place: "노르웨이", caption: "피오르 앞에서" },
  { id: "paris", year: 2024, place: "프랑스 · 파리", caption: "에펠탑, 해 질 무렵" },
  { id: "paris2", year: 2024, place: "프랑스 · 파리", caption: "밤이 되면 반짝이는 에펠탑" },
  { id: "london", year: 2024, place: "영국 · 런던", caption: "타워 브리지" },
  { id: "london_with_sonheungmin", year: 2024, place: "영국 · 런던", caption: "토트넘 홈구장에서 손흥민 선수와 함께 (빨간 동그라미)" },
  { id: "netherland_amsterdam", year: 2024, place: "네덜란드 · 암스테르담", caption: "운하와 중앙역 앞" },
  { id: "portugal_porto", year: 2024, place: "포르투갈 · 포르투", caption: "도루 강의 노을" },
  { id: "spain_barcelona", year: 2024, place: "스페인 · 바르셀로나", caption: "사그라다 파밀리아" },
  { id: "austria_vien", year: 2024, place: "오스트리아 · 빈", caption: "프라터 대관람차" },
  { id: "hungary_budapest", year: 2024, place: "헝가리 · 부다페스트", caption: "국회의사당 야경" },
  { id: "czech_prague", year: 2024, place: "체코 · 프라하", caption: "해 지는 프라하" },
  { id: "china_suzhou", year: 2025, place: "중국 · 쑤저우", caption: "호수 건너 도심 야경" },
  { id: "china_shanghai", year: 2025, place: "중국 · 상하이", caption: "동방명주" },
  { id: "japan_tokyo", year: 2025, place: "일본 · 도쿄", caption: "끝없이 이어지는 도쿄의 밤" },
];

export const travelYears = [...new Set(travelPhotos.map((p) => p.year))].sort();

export const sports = [
  {
    emoji: "⚽",
    name: "축구",
    desc: "성인이 되고 나서는 거의 안 하지만, 가장 좋아하는 스포츠이고 보는 것도 좋아합니다.",
  },
  {
    emoji: "🏀",
    name: "NBA",
    desc: "플레이오프 시즌이 제일 바쁩니다. 대학교 때는 경기를 풀로 봤지만 이제는 하이라이트로 봐요. 예전엔 선수 데이터로 올해의 퍼스트 팀을 예측하는 머신러닝 모델을 만들어 보기도 했습니다. 제일 좋아하는 선수는 르브론 제임스.",
    photo: "/lebron.jpg",
    photoAlt: "르브론 제임스",
  },
  {
    emoji: "🥊",
    name: "UFC",
    desc: "최근에 박진감 넘치고 손에 땀을 쥐게 만드는 UFC의 매력에 빠졌습니다.",
  },
];

export const investing = {
  intro: "주식, 비트코인 등에 관심이 많고, 장기적으로 꾸준히 매수할 수 있는 종목을 찾는 데 관심이 많습니다.",
  interests: [
    { emoji: "📈", title: "주식", desc: "국내외 우량주와 지수 ETF" },
    { emoji: "₿", title: "비트코인", desc: "디지털 자산도 꾸준히 지켜봅니다" },
    { emoji: "🧺", title: "장기 적립", desc: "타이밍보다 시간. 오래 들고 갈 종목 찾기" },
  ],
};

export const youtube = {
  intro: "밥 먹을 때 틀어 두는 건 거의 무한도전입니다. 몇 번을 봐도 웃겨요.",
  favorites: [
    { title: "무한상사", note: "정 과장의 눈물 연기" },
    { title: "못친소 페스티벌", note: "못생긴 친구를 소개합니다" },
    { title: "무한도전 가요제", note: "영동고속도로 가요제가 최고" },
    { title: "돈가방을 갖고 튀어라", note: "추격전의 정석" },
    { title: "명수는 12살", note: "박명수 레전드" },
    { title: "나비효과 특집", note: "북극에서 얼음 위에 서 있던 그 장면" },
  ],
  search: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent("무한도전 " + q)}`,
};

export const game = {
  intro: "요즘 하는 게임은 하스스톤 전장(Battlegrounds)입니다. 한 판이 짧아서 부담 없이 켜게 돼요.",
  points: [
    { emoji: "🃏", title: "하스스톤 전장", desc: "8명이 하수인을 사고팔며 마지막까지 살아남는 오토 배틀러" },
    { emoji: "⏱️", title: "한 판 20분", desc: "퇴근 후 딱 한 판 하기 좋은 길이" },
    { emoji: "🎲", title: "매 판 다른 전략", desc: "영웅과 등장하는 종족이 매번 달라서 질리지 않아요" },
  ],
};
