/* Off work 섹션의 콘텐츠. 문구와 사진은 여기서만 고치면 된다. */

export const travelYears = [
  { year: 2019, places: ["괌", "프랑스", "스위스", "이탈리아"] },
  { year: 2020, places: ["마카오"] },
  { year: 2023, places: ["코타키나발루"] },
  {
    year: 2024,
    places: ["영국", "아일랜드", "아이슬란드", "노르웨이", "프랑스", "네덜란드", "포르투갈", "스페인", "헝가리", "오스트리아", "체코"],
  },
  { year: 2025, places: ["중국", "일본"] },
];

// 파일은 frontend/public/travel/<id>.jpg 와 <id>_thumb.jpg
export const travelPhotos = [
  { id: "switzerland_landscape", place: "스위스", caption: "알프스 호수. 물색이 진짜 이렇습니다." },
  { id: "italy", place: "이탈리아 · 부라노", caption: "알록달록한 집들이 늘어선 섬" },
  { id: "paris", place: "프랑스 · 파리", caption: "에펠탑, 해 질 무렵" },
  { id: "paris2", place: "프랑스 · 파리", caption: "밤이 되면 반짝이는 에펠탑" },
  { id: "guam_nightseeing", place: "괌", caption: "밤에 내려다본 투몬 해변" },
  { id: "macau", place: "마카오", caption: "화려한 호텔 야경" },
  { id: "kotakinabalu_malaysia", place: "말레이시아 · 코타키나발루", caption: "야자수와 바다, 그리고 아무것도 안 하기" },
  { id: "london", place: "영국 · 런던", caption: "타워 브리지" },
  { id: "london_with_sonheungmin", place: "영국 · 런던", caption: "토트넘 홈경기 직관. 손흥민 선수를 직접 봤습니다" },
  { id: "ireland_landscape", place: "아일랜드 · 모허 절벽", caption: "바람이 정말 셉니다" },
  { id: "iceland_spring", place: "아이슬란드", caption: "동굴 사이로 흐르는 온천" },
  { id: "norway_landscape", place: "노르웨이", caption: "피오르 앞에서" },
  { id: "netherland_amsterdam", place: "네덜란드 · 암스테르담", caption: "운하와 중앙역 앞" },
  { id: "portugal_porto", place: "포르투갈 · 포르투", caption: "도루 강의 노을" },
  { id: "spain_barcelona", place: "스페인 · 바르셀로나", caption: "사그라다 파밀리아" },
  { id: "hungary_budapest", place: "헝가리 · 부다페스트", caption: "국회의사당 야경" },
  { id: "austria_vien", place: "오스트리아 · 빈", caption: "프라터 대관람차" },
  { id: "czech_prague", place: "체코 · 프라하", caption: "해 지는 프라하" },
  { id: "china_shanghai", place: "중국 · 상하이", caption: "동방명주" },
  { id: "china_suzhou", place: "중국 · 쑤저우", caption: "호수 건너 도심 야경" },
  { id: "japan_tokyo", place: "일본 · 도쿄", caption: "끝없이 이어지는 도쿄의 밤" },
];

export const sports = [
  {
    emoji: "⚽",
    name: "축구",
    desc: "주말엔 유럽 축구를 챙겨 봅니다. 런던 여행 때 토트넘 홈경기에서 손흥민 선수를 직접 봤어요.",
    photo: "london_with_sonheungmin",
  },
  {
    emoji: "🏀",
    name: "NBA",
    desc: "플레이오프 시즌이 제일 바쁩니다. 예전엔 선수 데이터로 올해의 퍼스트 팀을 예측하는 머신러닝 모델을 만들어 보기도 했어요.",
  },
  {
    emoji: "🥊",
    name: "UFC",
    desc: "넘버 시리즈는 꼭 봅니다. 3라운드 내내 긴장하게 되는 게 매력이에요.",
  },
];

export const investing = {
  intro: "빨리 부자 되는 법보다는 오래 버티는 법에 관심이 많습니다.",
  principles: [
    { emoji: "🧺", title: "분산 · 적립식", desc: "지수 ETF를 꾸준히 모으는 게 기본. 타이밍보다 시간." },
    { emoji: "📊", title: "데이터로 검증", desc: "S&P 500 데이터로 정액분할매수와 변형 전략을 직접 비교해 본 적이 있어요." },
    { emoji: "📚", title: "제대로 배우는 중", desc: "KAIST MBA에서 투자분석·기업재무를 들으며 감이 아니라 근거로 판단하려고 합니다." },
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
