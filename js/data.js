/* ─────────────────────────────────────────────────────────────
   전시 / 작가 데이터
   실제 작업물로 교체할 때는 이 파일만 수정하면 됩니다.

   description : 도록 왼쪽에 들어가는 작품 설명 텍스트
   link    : (선택) 설명 아래 외부 링크 { label, url }
   ratio   : (선택) 영상 비율, 기본 '16:9'
   thumb   : 홈 화면 포스터 이미지 경로, A5 비율 1:1.414 (예: 'assets/01/cover.jpg')
             비워두면('') 자동 생성된 임시 이미지가 들어갑니다.
   video   : 작품 영상 경로 (예: 'assets/01/work.mp4')
   catalog : 웹 도록 이미지 경로 배열 (위→아래 순서)
             예: ['assets/01/p01.jpg', 'assets/01/p02.jpg', ...]
             비워두면([]) 임시 도록 6페이지가 자동 생성됩니다.
   ───────────────────────────────────────────────────────────── */

window.EXHIBITION = {
  title: 'FRAME(S)',
  year: '2026',
  subtitle: 'Graduation Exhibition — Moving Image',
  dates: '2026.11.03–11.08',
  venue: '성신여자대학교 수정관 1층 가온',
  // 포스터 상단 정보 블록 (홈 / About / 푸터)
  org: 'SSWD Design Graduation Exhibition / AI Studio',
  datesLong: 'Tuesday 3rd November 2026 – Sunday 8th November 2026',
  location: '2, Bomun-ro 34da-gil, Seongbuk-gu, Seoul, Nanhyang Building 4F π Room',
  hours: ['Tue : 14:00 – 20:00', 'Wed – Sat : 10:00 – 20:00 / Sun : 10:00 – 18:00'],
  hoursNote: '*Screening every half hour.',
  // 프로젝트 로고 (없으면 텍스트 로고로 대체)
  logo: { black: 'assets/logo/logo_black.svg', white: 'assets/logo/logo_white.svg' },
  // About 화면 본문 (문단별)
  statement: [
    '2026 성신여자대학교 AI 디자인스튜디오의 Film 프로젝트입니다.',
    '7명의 디자이너가 AI를 활용해 각자의 프레임 안에서 서로 다른 이야기를 단편 영화로 풀어냅니다.',
    '각 작품의 전체 영상을 감상하고 아이디어가 영상으로 완성되기까지의 제작 과정을 살펴보세요.'
  ]
};

window.ARTISTS = [
  {
    id: '01', name: 'Kim Jane', nameKo: '김제인',
    title: 'THE CRITIC',
    description: 'AI에 선택과 판단을 맡기는 일상을 가까운 미래로 확장한 스페큘러티브 디자인 프로젝트다. 가상의 AI 브랜드 AETER와 그 기술을 활용하는 음식 비평가의 이야기를 단편 영화로 풀어낸다.',
    year: 2026, runtime: '08:00',
    medium: 'Speculative design film',
    ratio: '21:9', // 영상 비율 (기본 16:9)
    // 작품 설명 아래에 표시될 외부 링크
    link: { label: 'Pre-production WEB', url: 'https://jane-0120.github.io/THECRITIC/' },
    thumb: 'assets/01/thumb.png',
    video: 'assets/01/video-h264.mp4', // THE_CRITIC.mp4 re-encoded to 1080p H.264 (~96MB, under GitHub's 100MB limit)
    // 1.jpg ~ 36.jpg 순서대로
    catalog: Array.from({ length: 36 }, (_, k) => `assets/01/${k + 1}.jpg`)
  },
  {
    id: '02', name: 'Kim Seongyun', nameKo: '김성윤',
    title: 'ENTROPY',
    description: '끊기고 지연되는 신호 속에서 전달되지 못한 말들을 기록한다. 두 개의 화면은 서로를 향해 말을 걸지만, 노이즈와 공백이 그 사이를 계속해서 가로막는다.',
    year: 2026, runtime: '03:18',
    medium: 'Two-channel video, b&w, sound',
    thumb: '',
    video: 'assets/02/video-h264.mp4', // 김성윤_ENTROPY.mp4 (video.mp4) re-encoded to H.264 under 100MB
    catalog: []
  },
  {
    id: '03', name: 'Myeong Suyeon', nameKo: '명수연',
    title: 'NEVERAFTER',
    description: "NEVERAFTER는 '어린 왕자'의 상징을 재해석한 뒤틀린 동화 속 세계를 배경으로, 사회의 기준에 맞춰 끊임없이 자신을 소모하는 현대인의 모습을 그린 가상 밴드 뮤직비디오 프로젝트이다.",
    year: 2026, runtime: '08:03',
    medium: 'Single-channel video, 4K, color, sound',
    thumb: 'assets/03/thumb.jpg',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    // 1.jpg ~ 9.jpg 순서대로
    catalog: Array.from({ length: 9 }, (_, k) => `assets/03/${k + 1}.jpg`)
  },
  {
    id: '04', name: 'Baek Jeongwon', nameKo: '백정원',
    title: 'DÉDOUBLEMENT',
    description: '‘나는 누구인가’라는 질문에서 출발한 실사와 2D 애니메이션이 결합된 단편 영화이다. 현실에서 분리된 인물이 다양한 자아와 감정으로 이루어진 내면세계를 통과하는 과정을 통해, 자신을 마주하고 바라본다는 것의 의미를 고찰한다.',
    year: 2026, runtime: '03:20',
    medium: 'Video installation, color, silent',
    thumb: 'assets/04/thumb.jpg',
    video: 'assets/04/video.mp4',
    // 1.jpg ~ 5.jpg 순서대로
    catalog: Array.from({ length: 5 }, (_, k) => `assets/04/${k + 1}.jpg`)
  },
  {
    id: '05', name: 'Woo Seoyeon', nameKo: '우서연',
    title: 'Low Tide',
    description: '썰물이 빠져나간 갯벌의 풍경을 오랜 시간 관찰했다. 물러난 것과 남겨진 것, 드러남과 사라짐의 리듬이 화면 전체에 느리게 흐른다.',
    year: 2026, runtime: '07:50',
    medium: 'Single-channel video, color, sound',
    thumb: '',
    video: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    catalog: []
  },
  {
    id: '06', name: 'Choi Jeewon', nameKo: '최지원',
    title: 'Still in Inferno: Limbo',
    description: '해가 진 직후 하늘이 푸르게 물드는 짧은 시간을 하나의 규칙처럼 반복하는 3D 애니메이션. 가상의 도시는 매일 같은 시각, 같은 빛으로 다시 깨어난다.',
    year: 2026, runtime: '01:47',
    medium: '3D animation, color, sound',
    thumb: '',
    video: 'assets/06/video-h264.mp4', // 최지원_Still in Inferno_Limbo.mp4 (video.mp4) re-encoded to H.264 under 100MB
    catalog: []
  },
  {
    id: '07', name: 'Choi Ji eun', nameKo: '최지은',
    title: 'UNINVITED',
    description: 'UNINVITED는 고향으로 돌아온 작은 파리가 낯설게 변해버린 도시를 마주하며 겪는 여정을 그린 단편 애니메이션이다. 익숙했던 공간에서 이방인이 되어버린 파리의 시선을 통해, 우리가 당연하게 여겨온 공존의 의미를 되묻는 작품이다.',
    year: 2026, runtime: '03:12',
    medium: 'Single-channel video, color, sound',
    thumb: 'assets/07/thumb.jpg',
    video: 'assets/07/video-h264.mp4', // 최지은_UNINVITED.mp4 (video.mp4) re-encoded to H.264 under 100MB
    // 1.jpg ~ 24.jpg 순서대로
    catalog: Array.from({ length: 24 }, (_, k) => `assets/07/${k + 1}.jpg`)
  }
];
