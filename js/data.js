/* ─────────────────────────────────────────────────────────────
   전시 / 작가 데이터
   실제 작업물로 교체할 때는 이 파일만 수정하면 됩니다.

   description : 도록 왼쪽에 들어가는 작품 설명 텍스트
   link    : (선택) 설명 아래 외부 링크 { label, url }
   ratio   : (선택) 영상 비율, 기본 '16:9'
   thumb   : 홈 화면 포스터 이미지 경로, A5 비율 1:1.414 (예: 'assets/01/thumb.webp')
             비워두면('') 자동 생성된 임시 이미지가 들어갑니다.
   video   : 작품 영상 경로 (예: 'assets/01/work.mp4')
   catalog : 웹 도록 이미지 경로 배열 (위→아래 순서)
             예: ['assets/01/p01.jpg', 'assets/01/p02.jpg', ...]
             (선택) 항목을 { src, srcset, w, h }로 쓰면 화면별 해상도 선택 + 자리 미리 잡기 (아래 pages() 참고)
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

/* 도록 페이지 목록 (WebP)
   pages('02', [[1920, 1080], ...]) → 1.webp, 2.webp … 순서대로
   [폭, 높이]는 각 이미지의 실제 크기: 로딩 전에 자리를 미리 잡아 화면이 밀리지 않게 함
   폭이 1920보다 크면 n-1920.webp / n-2560.webp 축소본도 함께 두고, 브라우저가 화면에 맞는 것만 받음 */
const pages = (id, sizes) => sizes.map(([w, h], k) => {
  const n = `assets/${id}/${k + 1}`;
  const steps = [1920, 2560].filter(s => s < w);
  return {
    src: `${n}.webp`, w, h,
    srcset: steps.length ? [...steps.map(s => `${n}-${s}.webp ${s}w`), `${n}.webp ${w}w`].join(', ') : ''
  };
});
const fill = (n, size) => Array.from({ length: n }, () => size);

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
    thumb: 'assets/01/thumb.webp',
    video: 'assets/01/video-h264.mp4', // THE_CRITIC.mp4 re-encoded to 1080p H.264 (~96MB, under GitHub's 100MB limit)
    // 1.webp ~ 54.webp 순서대로 (THE_CRITIC_L_2x/01~54.png → WebP)
    catalog: pages('01', [
      [3840, 1778], [3840, 1780], [3840, 844], [3840, 1598], [3840, 1120], [3840, 1928], [3840, 1640], [3840, 1120], [3840, 1928],
      [3840, 1120], [3840, 844], [3840, 1274], [3840, 1200], [3840, 2096], [3840, 1200], [3840, 2178], [3840, 1200], [3840, 2178],
      [3840, 844], [3840, 1434], [3840, 2282], [3840, 1904], [3840, 2168], [3840, 784], [3840, 784], [3840, 784], [3840, 2122],
      [3840, 1904], [3840, 2170], [3840, 784], [3840, 784], [3840, 784], [3840, 2200], [3840, 1904], [3840, 2168], [3840, 784],
      [3840, 784], [3840, 2200], [3840, 1904], [3840, 1652], [3840, 784], [3840, 784], [3840, 844], [3840, 1986], [3840, 1724],
      [3840, 2929], [3840, 1894], [3840, 398], [3840, 1200], [3840, 1084], [3840, 916], [3840, 1988], [3840, 1728], [3840, 1942]
    ])
  },
  {
    id: '02', name: 'Kim Seongyun', nameKo: '김성윤',
    title: 'Project#365247',
    description: '엔트로피를 극복한 미래를 배경으로, 완벽함을 얻는 과정에서 인간이 잃어버린 감정과 존재의 조건을 탐구하는 프로젝트이다. 미래의 신인류가 과거 인류의 사랑과 죽음을 연구하는 과정을 통해 결핍과 상실, 유한성이 인간다움을 형성하는 중요한 조건이었음을 이야기한다.',
    year: 2026, runtime: '03:18',
    medium: 'Two-channel video, b&w, sound',
    thumb: 'assets/02/thumb.webp',
    video: 'assets/02/video-h264.mp4', // 김성윤_ENTROPY.mp4 (video.mp4) re-encoded to H.264 under 100MB
    // 1.webp ~ 6.webp 순서대로 (원본 8001px PNG → 1920px)
    catalog: pages('02', fill(6, [1920, 1080]))
  },
  {
    id: '03', name: 'Myeong Suyeon', nameKo: '명수연',
    title: 'NEVERAFTER',
    description: "NEVERAFTER는 '어린 왕자'의 상징을 재해석한 뒤틀린 동화 속 세계를 배경으로, 사회의 기준에 맞춰 끊임없이 자신을 소모하는 현대인의 모습을 그린 가상 밴드 뮤직비디오 프로젝트이다.",
    year: 2026, runtime: '08:03',
    medium: 'Single-channel video, 4K, color, sound',
    thumb: 'assets/03/thumb.webp',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    // 1.webp ~ 9.webp 순서대로 (Adobe RGB → sRGB 변환)
    catalog: pages('03', fill(9, [1920, 1080]))
  },
  {
    id: '04', name: 'Baek Jeongwon', nameKo: '백정원',
    title: 'DÉDOUBLEMENT',
    description: '‘나는 누구인가’라는 질문에서 출발한 실사와 2D 애니메이션이 결합된 단편 영화이다. 현실에서 분리된 인물이 다양한 자아와 감정으로 이루어진 내면세계를 통과하는 과정을 통해, 자신을 마주하고 바라본다는 것의 의미를 고찰한다.',
    year: 2026, runtime: '03:20',
    medium: 'Video installation, color, silent',
    thumb: 'assets/04/thumb.webp',
    video: 'assets/04/video.mp4',
    // 1.webp ~ 5.webp 순서대로
    catalog: pages('04', fill(5, [1920, 1080]))
  },
  {
    id: '05', name: 'Woo Seoyeon', nameKo: '우서연',
    title: '詩NEMA',
    description: '자작시를 영화로 옮긴 AI POETRY FILM 프로젝트.\n글을 더 선호하는 사람이 있고, 영상을 더 선호하는 사람이 있다. 요즘은 더욱이 영상을 선호하는 사람들이 많은 듯하다. 따라서 나는 글을 좋아하는 이들뿐만 아니라 영상을 더 선호하는 사람들도 내 시를 감상해 주길 바라는 마음에 詩NEMA를 기획하게 되었다. 영상은 눈사람, 금붕어의 다짐, 자두 총 3개로 구성된다.',
    year: 2026, runtime: '07:50',
    medium: 'Single-channel video, color, sound',
    thumb: 'assets/05/thumb.webp',
    video: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    // 1.webp ~ 16.webp 순서대로
    catalog: pages('05', fill(16, [1920, 1080]))
  },
  {
    id: '06', name: 'Choi Jeewon', nameKo: '최지원',
    title: 'Still in Inferno',
    description: '《Still in Inferno》는 단테의 《지옥편(Inferno)》 속 단계별 지옥을 모티브로, 현대인이 일상에서 직면하는 무기력, 분노, 집착, 고립, 그리고 타성이라는 고통의 메커니즘을 옴니버스 형식으로 조명한다.\n지옥은 비현실적인 유황 불길이 아닌, 매일 반복되는 어두운 방안의 고요, 차가운 액정 화면의 잔상, 벗어나지 못하는 무겁고 막막한 새벽의 공기 속에서 조용히 작동한다.',
    year: 2026, runtime: '01:47',
    medium: '3D animation, color, sound',
    thumb: 'assets/06/thumb.webp', // SII_A5_최지원.jpg
    video: 'assets/06/video-h264.mp4', // 최지원_Still in Inferno_Limbo.mp4 (video.mp4) re-encoded to H.264 under 100MB
    // 1.webp ~ 15.webp 순서대로
    catalog: pages('06', fill(15, [1920, 1080]))
  },
  {
    id: '07', name: 'Choi Ji eun', nameKo: '최지은',
    title: 'UNINVITED',
    description: 'UNINVITED는 고향으로 돌아온 작은 파리가 낯설게 변해버린 도시를 마주하며 겪는 여정을 그린 단편 애니메이션이다. 익숙했던 공간에서 이방인이 되어버린 파리의 시선을 통해, 우리가 당연하게 여겨온 공존의 의미를 되묻는 작품이다.',
    year: 2026, runtime: '03:12',
    medium: 'Single-channel video, color, sound',
    thumb: 'assets/07/thumb.webp',
    video: 'assets/07/video-h264.mp4', // 최지은_UNINVITED.mp4 (video.mp4) re-encoded to H.264 under 100MB
    // 1.webp ~ 24.webp 순서대로 (13~24는 4000px 원본 그대로)
    catalog: pages('07', [...fill(12, [1920, 1080]), ...fill(12, [4000, 2250])])
  }
];
