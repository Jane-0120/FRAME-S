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
  title: 'FRAMERS',
  year: '2026',
  subtitle: 'Graduation Exhibition — Moving Image',
  dates: '2026.11.03–11.08',
  venue: '성신여자대학교 파이룸',
  // About 화면 본문 (문단별)
  statement: [
    '2026 성신여자대학교 졸업전시 AI디자인스튜디오의 Film 프로젝트입니다. 7명의 디자이너가 다양한 AI 툴을 활용해, 각자의 프레임 안에서 서로 다른 주제와 이야기를 영상으로 풀어냅니다.',
    '각 작품의 전체 영상을 감상하고, 아이디어가 영상으로 완성되기까지의 제작 과정을 살펴보세요.'
  ]
};

window.ARTISTS = [
  {
    id: '01', name: 'Kim Jane', nameKo: '김제인',
    title: 'THE CRITIC',
    description: 'AI에 선택과 판단을 맡기는 일상을 가까운 미래로 확장한 스페큘러티브 디자인 프로젝트다. 가상의 AI 브랜드 AETER와 그 기술을 활용하는 음식 비평가의 이야기를 단편 영화로 풀어낸다.',
    year: 2026, runtime: '00:21',
    medium: 'Speculative design film',
    ratio: '21:9', // 영상 비율 (기본 16:9)
    // 작품 설명 아래에 표시될 외부 링크
    link: { label: 'Pre-production WEB', url: 'https://jane-0120.github.io/THECRITIC/' },
    thumb: 'assets/01/thumb.png',
    video: 'assets/01/video-h264.mp4', // H.264 copy of video.mp4 (HEVC) so every browser can play it
    // 1.jpg ~ 36.jpg 순서대로
    catalog: Array.from({ length: 36 }, (_, k) => `assets/01/${k + 1}.jpg`)
  },
  {
    id: '02', name: 'Kim Seongyun', nameKo: '김성윤',
    title: 'Signal Loss',
    description: '끊기고 지연되는 신호 속에서 전달되지 못한 말들을 기록한다. 두 개의 화면은 서로를 향해 말을 걸지만, 노이즈와 공백이 그 사이를 계속해서 가로막는다.',
    year: 2026, runtime: '04:15',
    medium: 'Two-channel video, b&w, sound',
    thumb: '',
    video: 'https://vjs.zencdn.net/v/oceans.mp4',
    catalog: []
  },
  {
    id: '03', name: 'Myeong Suyeon', nameKo: '명수연',
    title: 'Soft Archive',
    description: '버려진 사진과 홈비디오를 다시 촬영해 만든 부드러운 아카이브. 정확한 기록 대신 온도와 질감으로 남은 개인의 역사를 천천히 펼쳐 보인다.',
    year: 2026, runtime: '08:03',
    medium: 'Single-channel video, 4K, color, sound',
    thumb: '',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    catalog: []
  },
  {
    id: '04', name: 'Baek Jeongwon', nameKo: '백정원',
    title: 'Between Frames',
    description: '프레임과 프레임 사이, 보이지 않는 시간의 틈에 주목한다. 정지와 움직임의 경계를 늘리고 비틀며 관객이 시간을 감각하는 방식을 다시 묻는다.',
    year: 2026, runtime: '05:27',
    medium: 'Video installation, color, silent',
    thumb: '',
    video: 'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4',
    catalog: []
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
    id: '06', name: 'Choi Jiwon', nameKo: '최지원',
    title: 'Blue Hour Protocol',
    description: '해가 진 직후 하늘이 푸르게 물드는 짧은 시간을 하나의 규칙처럼 반복하는 3D 애니메이션. 가상의 도시는 매일 같은 시각, 같은 빛으로 다시 깨어난다.',
    year: 2026, runtime: '03:58',
    medium: '3D animation, color, sound',
    thumb: '',
    video: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4',
    catalog: []
  },
  {
    id: '07', name: 'Choi Jieun', nameKo: '최지은',
    title: 'Residual Heat',
    description: '사람이 떠난 자리에 남은 열기를 시각화한 작업이다. 열화상 이미지와 실사 영상을 교차시키며 부재 속에 남겨진 존재의 흔적을 더듬는다.',
    year: 2026, runtime: '09:12',
    medium: 'Single-channel video, color, sound',
    thumb: '',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    catalog: []
  }
];
