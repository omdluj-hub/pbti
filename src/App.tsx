import { useState, useEffect } from 'react';
import './App.css';
import logo from '../images/logo.gif';

type Dimension = 'IE' | 'SN' | 'TF' | 'PJ';

interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  options: [string, string, string]; // [I/S/T/P, Neutral, E/N/F/J]
}

const QUESTIONS: Question[] = [
  // IE: Internal vs External
  {
    id: 1,
    dimension: 'IE',
    text: "Q1. 평소 피부가 뒤집어지는 가장 큰 원인은 무엇인가요?",
    options: [
      "수면 부족, 과로, 생리 주기 등 내 몸의 컨디션 문제",
      "그때그때 다르거나 특별한 이유를 모르겠다.",
      "맞지 않는 화장품, 미세먼지, 날씨 등 외부 환경 문제"
    ]
  },
  {
    id: 2,
    dimension: 'IE',
    text: "Q2. 화장품을 새로 바꿨을 때 내 피부의 반응은?",
    options: [
      "처음엔 괜찮다가 피곤할 때쯤 서서히 트러블이 올라온다.",
      "딱히 큰 변화 없이 무난하게 적응하는 편이다.",
      "맞지 않으면 바른 직후나 하루 안에 바로 붉어지거나 따갑다."
    ]
  },
  {
    id: 3,
    dimension: 'IE',
    text: "Q3. 피부 컨디션이 가장 나빠 보일 때는 언제인가요?",
    options: [
      "스트레스를 많이 받거나 밤을 지새운 다음 날 아침",
      "실내외 온도 차가 크거나 건조한 장소에 오래 있을 때",
      "햇볕을 많이 쬐었거나 미세먼지가 심한 날 외출하고 돌아왔을 때"
    ]
  },
  {
    id: 4,
    dimension: 'IE',
    text: "Q4. 피부 관리를 위해 내가 더 신경 쓰는 부분은?",
    options: [
      "충분한 휴식, 영양제 섭취 등 이너 뷰티와 건강 관리",
      "그때그때 피부 상태에 맞는 기초 화장품 사용",
      "자외선 차단제, 꼼꼼한 세안 등 외부 자극 차단과 진정"
    ]
  },
  // SN: Sticky vs Non-sticky
  {
    id: 5,
    dimension: 'SN',
    text: "Q5. 세안 후 아무것도 바르지 않았을 때, 내 피부 상태는?",
    options: [
      "얼마 지나지 않아 코나 이마에서 자연스럽게 기름기가 올라온다.",
      "당기지도 번들거리지도 않는 딱 적당한 상태가 유지된다.",
      "얼굴 전체가 팽팽하게 당기고, 입가나 눈가가 푸석해지는 느낌이 든다."
    ]
  },
  {
    id: 6,
    dimension: 'SN',
    text: "Q6. 메이크업이나 선크림을 바르고 4~5시간이 지났을 때?",
    options: [
      "유분 때문에 화장이 지워지거나 뭉쳐서 수정 화장이 반드시 필요하다.",
      "티존(T-zone)만 살짝 번들거릴 뿐 전체적으로는 양호하다.",
      "화장이 들뜨거나 가뭄 난 것처럼 갈라져서 미스트가 간절하다."
    ]
  },
  {
    id: 7,
    dimension: 'SN',
    text: "Q7. 내가 선호하는 기초 화장품의 제형(텍스처)은?",
    options: [
      "유분감이 거의 없는 산뜻한 젤이나 가벼운 로션 타입을 선호한다.",
      "적당한 보습감이 느껴지는 일반적인 크림 타입을 선호한다.",
      "영양감이 풍부하고 묵직하게 피부를 감싸주는 오일이나 밤 타입을 선호한다."
    ]
  },
  {
    id: 8,
    dimension: 'SN',
    text: "Q8. 기름종이를 사용했을 때 내 피부의 반응은?",
    options: [
      "한 장으로는 부족할 정도로 유분이 많이 묻어나온다.",
      "가끔 필요할 때 쓰면 적당히 묻어 나오는 정도다.",
      "기름종이를 쓸 일이 거의 없으며, 쓰면 오히려 피부가 더 건조해진다."
    ]
  },
  // TF: Trouble vs Feel
  {
    id: 9,
    dimension: 'TF',
    text: "Q9. 거울을 볼 때 가장 먼저 눈에 들어오는 것은?",
    options: [
      "툭 튀어나온 뾰루지, 진한 잡티, 붉은 여드름 자국",
      "전체적인 얼굴의 안색이나 톤",
      "푸석푸석해 보이는 피부 결이나 눈에 띄게 늘어진 탄력"
    ]
  },
  {
    id: 10,
    dimension: 'TF',
    text: "Q10. 피부가 나빠졌다고 느낄 때 드는 생각은?",
    options: [
      "\"빨리 저 트러블을 없애거나 가려야 하는데...\" (해결 중심)",
      "\"요즘 관리가 좀 소홀했나 보네.\"",
      "\"피부 컨디션이 떨어지니까 기분까지 안 좋아지네...\" (기분 중심)"
    ]
  },
  {
    id: 11,
    dimension: 'TF',
    text: "Q11. 병원이나 관리실을 방문할 때 나의 주된 목적은?",
    options: [
      "염증 주사, 레이저 등 특정 고민 부위의 즉각적인 치료",
      "주기적인 검진 및 일반적인 피부 관리",
      "거친 피부 결 개선, 수분 충전 등 전체적인 컨디션 회복"
    ]
  },
  {
    id: 12,
    dimension: 'TF',
    text: "Q12. 새로운 화장품이나 시술을 결정할 때 가장 중요한 기준은?",
    options: [
      "\"트러블 완화\", \"잡티 제거\" 등 특정 증상에 대한 확실한 효과",
      "주변 사람들의 후기나 무난한 평판",
      "바를 때의 부드러운 발림성, 향, 혹은 시술 후 느껴지는 매끈한 피부 촉감"
    ]
  },
  // PJ: Plain vs Jagged
  {
    id: 13,
    dimension: 'PJ',
    text: "Q13. 컨디션이 정말 안 좋은 날, 주변 사람들의 반응은?",
    options: [
      "\"피곤해 보이긴 하는데, 피부는 평소랑 똑같아 보여.\" (티가 안 남)",
      "\"평소보다 조금 안색이 안 좋아 보이네?\" 하는 정도.",
      "\"무슨 일 있어? 얼굴이 왜 이렇게 뒤집혔어?\"라는 말을 듣는다. (티가 확 남)"
    ]
  },
  {
    id: 14,
    dimension: 'PJ',
    text: "Q14. 피부 컨디션의 기복(변화)을 느끼는 정도는?",
    options: [
      "1년 내내 큰 변화 없이 어느 정도 일정한 상태를 유지한다.",
      "환절기나 아주 피곤할 때만 가끔 변화를 느낀다.",
      "어제는 꿀피부였다가 오늘은 칙칙해지는 등 하루 단위로 기복이 심하다."
    ]
  },
  {
    id: 15,
    dimension: 'PJ',
    text: "Q15. 피부에 문제가 생겼을 때, 내가 느끼는 당혹감은?",
    options: [
      "겉으로 보기엔 멀쩡해서 나만 아는 불편함(속당김 등)이 더 크다.",
      "화장으로 어느 정도 커버 가능한 수준의 변화다.",
      "붉은기나 각질이 도드라져서 화장으로도 잘 가려지지 않아 스트레스를 받는다."
    ]
  },
  {
    id: 16,
    dimension: 'PJ',
    text: "Q16. 세안 직후 거울 속에 비친 내 얼굴의 안색은?",
    options: [
      "세안 전이나 후나 톤의 변화가 거의 없이 일정하다.",
      "가끔 컨디션에 따라 살짝 맑아 보이거나 어두워 보이는 정도다.",
      "세안 직후에는 환했다가, 금방 붉어지거나 칙칙하게 변하는 등 변화가 역동적이다."
    ]
  }
];

const TYPE_INFO: Record<string, { title: string, desc: string, care: string, emoji: string }> = {
  ISTP: { 
    title: "철벽 방어 내실형", 
    desc: "속은 예민해도 겉은 멀쩡, 웬만한 자극에는 끄떡없는 유분 부자",
    care: "과도한 유분을 조절하면서 피부속 열을 내리는 진정팩을 추천해요.",
    emoji: "🛡️"
  },
  ISTJ: { 
    title: "시시각각 유분 주의보", 
    desc: "몸 컨디션에 따라 유분감이 요동치며 바로 티가 나는 예민러",
    care: "기복이 심한 유분을 잡기 위해 규칙적인 압출과 진정 약침이 필요합니다.",
    emoji: "⚠️"
  },
  ISFP: { 
    title: "실속형 수분 부족형", 
    desc: "겉보기엔 매끈하고 평온하지만, 속으로는 늘 당김과 씨름 중",
    care: "겉은 매끈해도 속당김이 심하니 심부 보습을 채워주는 게 중요해요.",
    emoji: "🏜️"
  },
  ISFJ: { 
    title: "유리 멘탈 수분 부족형", 
    desc: "작은 내부 변화에도 안색이 칙칙해지는, 보습이 절실한 타입",
    care: "안색 개선을 위해 안면 기혈 순환을 돕는 정안침으로 생기를 더해보세요.",
    emoji: "💎"
  },
  INTP: { 
    title: "보송보송 철벽형", 
    desc: "산뜻한 피부 결을 가졌지만, 컨디션 난조는 나만 아는 속앓이형",
    care: "산뜻함을 유지하되, 컨디션 저하 시엔 스킨부스터로 수분 보호막을 씌워주세요.",
    emoji: "🧊"
  },
  INTJ: { 
    title: "예측 불허 산뜻형", 
    desc: "평소엔 보송하지만 피곤하면 거칠고 푸석함이 그대로 드러남",
    care: "갑작스러운 거칠어짐을 대비해 주기적인 약초필링으로 피부결을 정돈하세요.",
    emoji: "⚡"
  },
  INFP: { 
    title: "외유내강 실크형", 
    desc: "매끈한 결을 중시하며, 속은 민감해도 겉으론 평온을 유지함",
    care: "예민한 속 피부를 위해 자극이 적은 천연 모델링팩으로 부드럽게 관리하세요.",
    emoji: "🦢"
  },
  INFJ: { 
    title: "기복 심한 실크형", 
    desc: "피부 컨디션에 따라 기분이 좌우되는, 섬세하고 투명한 타입",
    care: "감정 스트레스가 피부로 오지 않게 심신을 안정시키고 진정 케어를 병행하세요.",
    emoji: "🌊"
  },
  ESTP: { 
    title: "강철 체력 기름 부자", 
    desc: "외부 자극에도 튼튼하지만, 번들거림과 트러블은 참지 않음",
    care: "두꺼운 각질과 유분을 정리하는 약초필링과 압출 관리가 효과적입니다.",
    emoji: "🌋"
  },
  ESTJ: { 
    title: "솔직 과격 기름 부자", 
    desc: "미세먼지나 날씨에 반응이 빠르고 유분 폭발이 눈에 보이는 타입",
    care: "외부 자극으로 성난 유분형 트러블은 열독을 빼주는 것이 중요합니다.",
    emoji: "🚨"
  },
  ESFP: { 
    title: "장벽 튼튼 수분 부족형", 
    desc: "외부 자극엔 강해도 결이 푸석해지기 쉬워 보습 관리가 필수",
    care: "외부 자극에 강해지도록 피부 장벽을 강화하는 약침, 스킨부스터를 권장합니다.",
    emoji: "🧱"
  },
  ESFJ: { 
    title: "민감 반응 수분 부족형", 
    desc: "조금만 덥거나 추워도 피부가 바로 메마르고 칙칙해 보이는 타입",
    care: "환경 변화에 민감한 건조함을 잡기 위해 수분크림과 아쿠아필링이 필수예요.",
    emoji: "🌵"
  },
  ENTP: { 
    title: "산뜻한 외부 방어형", 
    desc: "웬만한 환경 변화엔 강하지만, 가끔 올라오는 트러블에 진심인 편",
    care: "가끔 생기는 고집 센 트러블은 뿌리까지 뽑는 압출 관리로 해결하세요.",
    emoji: "🏹"
  },
  ENTJ: { 
    title: "다이나믹 산뜻형", 
    desc: "외부 환경에 따라 피부 상태가 널뛰지만 해결 의지가 누구보다 강함",
    care: "널뛰는 피부 컨디션을 즉각 잡아주는 진정 팩과 한약 복용이 중요합니다.",
    emoji: "🌪️"
  },
  ENFP: { 
    title: "매끈 결 철벽 수호자", 
    desc: "겉보기에 늘 평온하지만, 미세먼지 등 외부 자극에만 조용히 민감함",
    care: "미세먼지 등 외부 오염에 대비해 꼼꼼한 저자극 클렌징에 집중하세요.",
    emoji: "✨"
  },
  ENFJ: { 
    title: "투명한 감성 피부", 
    desc: "외부 자극에 바로 붉어지거나 거칠어지는, 관리가 곧 힐링인 타입",
    care: "붉어지기 쉬운 얇은 피부를 위해 혈관을 강화하고 진정시키는 한약 복용을 추천합니다.",
    emoji: "🌡️"
  }
};

type AppState = 'landing' | 'quiz' | 'loading' | 'result';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({
    I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, P: 0, J: 0
  });
  const [history, setHistory] = useState<number[]>([]);
  const [resultType, setResultType] = useState('');
  const [isAnimate, setIsAnimate] = useState(false);

  const startTest = () => {
    setState('quiz');
    setCurrentIdx(0);
    setScores({ I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, P: 0, J: 0 });
    setHistory([]);
    setIsAnimate(false);
  };

  const handleAnswer = (optionIdx: number) => {
    const question = QUESTIONS[currentIdx];
    const newScores = { ...scores };

    if (optionIdx === 0) {
      const letter = question.dimension[0] as keyof typeof scores;
      newScores[letter] += 1;
    } else if (optionIdx === 2) {
      const letter = question.dimension[1] as keyof typeof scores;
      newScores[letter] += 1;
    }

    setScores(newScores);
    setHistory([...history, optionIdx]);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateResult(newScores);
      setState('loading');
    }
  };

  const goBack = () => {
    if (currentIdx === 0) return;

    const lastOptionIdx = history[history.length - 1];
    const prevIdx = currentIdx - 1;
    const question = QUESTIONS[prevIdx];
    const newScores = { ...scores };

    if (lastOptionIdx === 0) {
      const letter = question.dimension[0] as keyof typeof scores;
      newScores[letter] -= 1;
    } else if (lastOptionIdx === 2) {
      const letter = question.dimension[1] as keyof typeof scores;
      newScores[letter] -= 1;
    }

    setScores(newScores);
    setHistory(history.slice(0, -1));
    setCurrentIdx(prevIdx);
  };

  const calculateResult = (finalScores: typeof scores) => {
    let type = '';
    
    // I vs E: Tie -> E
    type += finalScores.I > finalScores.E ? 'I' : 'E';
    // S vs N: Tie -> S
    type += finalScores.S >= finalScores.N ? 'S' : 'N';
    // T vs F: Tie -> T
    type += finalScores.T >= finalScores.F ? 'T' : 'F';
    // P vs J: Tie -> J
    type += finalScores.P > finalScores.J ? 'P' : 'J';

    setResultType(type);
  };

  useEffect(() => {
    if (state === 'loading') {
      const timer = setTimeout(() => {
        setState('result');
      }, 2500);
      return () => clearTimeout(timer);
    }
    if (state === 'result') {
      const timer = setTimeout(() => {
        setIsAnimate(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const renderLanding = () => (
    <div className="fade-in">
      <h1>피부 MBTI ✨<br /><span style={{ fontSize: '18px', color: '#7c3aed', fontWeight: '800' }}>(aka. PBTI)</span></h1>
      <p className="description">
        내 피부는 어떤 체질일까요?<br />
        16가지 질문을 통해 당신의 <b>PBTI</b>를 분석해 드립니다.
      </p>

      <a href="https://homepage-five-chi.vercel.app/" target="_blank" rel="noopener noreferrer" className="branding-section">
        <img src={logo} alt="후한의원 로고" className="branding-logo" />
        <span className="hospital-name">후한의원 구미점</span>
      </a>

      <button className="btn btn-primary" onClick={startTest}>
        테스트 시작하기
      </button>

      <div style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
        현재 12,405명이 참여했습니다 ✨
      </div>
    </div>
  );

  const renderQuiz = () => {
    const question = QUESTIONS[currentIdx];
    const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

    return (
      <div className="fade-in">
        <div className="quiz-header">
          <button 
            className="btn-back" 
            onClick={goBack} 
            style={{ visibility: currentIdx > 0 ? 'visible' : 'hidden' }}
          >
            ← 이전으로
          </button>
          <div className="step-count">{currentIdx + 1} / {QUESTIONS.length}</div>
          <div style={{ width: '60px' }}></div> {/* Spacer for balance */}
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="question-text">{question.text}</div>
        <div className="options-container">
          {question.options.map((option, idx) => (
            <button key={idx} className="btn" onClick={() => handleAnswer(idx)}>
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="loading-container fade-in">
      <div className="spinner"></div>
      <div className="question-text" style={{ textAlign: 'center' }}>
        체질 분석 중...
      </div>
      <p className="description">당신의 피부 데이터를 정밀하게 계산하고 있습니다.</p>
    </div>
  );

  const renderResult = () => {
    const info = TYPE_INFO[resultType] || { title: resultType, desc: "", care: "" };
    
    const getPercentage = (val1: number, val2: number, tieBreakerRight: boolean) => {
      if (!isAnimate) return 50; // 애니메이션 전에는 정중앙

      const total = val1 + val2;
      if (total === 0) return tieBreakerRight ? 45 : 55; // 0:0일 때도 살짝 치우치게
      
      let p1 = (val1 / total) * 100;
      // 동점일 때 처리
      if (val1 === val2) {
        return tieBreakerRight ? 48 : 52; // 한쪽으로 2% 살짝 치우치게
      }
      return p1;
    };

    const dimensions = [
      { 
        label: '자극 반응', 
        left: { key: 'I', name: '내부 민감형' }, 
        right: { key: 'E', name: '외부 자극형' },
        desc: resultType[0] === 'I' ? '내부 컨디션에 민감해요' : '외부 환경 변화에 민감해요',
        tieBreakerRight: true // E 우선
      },
      { 
        label: '유수분 밸런스', 
        left: { key: 'S', name: '유분 중심(Sticky)' }, 
        right: { key: 'N', name: '수분 중심(Non-sticky)' },
        desc: resultType[1] === 'S' ? '피지 조절이 중요해요' : '수분 공급이 중요해요',
        tieBreakerRight: false // S 우선 (left)
      },
      { 
        label: '관리 집중도', 
        left: { key: 'T', name: '트러블 집중' }, 
        right: { key: 'F', name: '결/감촉 집중' },
        desc: resultType[2] === 'T' ? '문제 해결이 시급해요' : '피부 컨디션 회복이 우선이에요',
        tieBreakerRight: false // T 우선 (left)
      },
      { 
        label: '피부 기복', 
        left: { key: 'P', name: '평온한 내실형' }, 
        right: { key: 'J', name: '역동적 표출형' },
        desc: resultType[3] === 'P' ? '겉으론 일정해 보여요' : '상태 변화가 눈에 띄어요',
        tieBreakerRight: true // J 우선
      }
    ];

    return (
      <div className="fade-in">
        <div className="result-header">
          <a href="https://homepage-five-chi.vercel.app/" target="_blank" rel="noopener noreferrer" className="result-branding">
            <img src={logo} alt="후한의원 로고" className="result-branding-logo" />
            <span className="result-branding-text">후한의원 구미점</span>
          </a>
          <div className="type-badge">과 함께 알아본 당신의 피부 MBTI 결과는?</div>
          <h2 className="type-title" style={{ fontSize: '24px', marginBottom: '5px' }}>{info.title}</h2>
          <h1 className="type-title" style={{ fontSize: '48px', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
            <span>{info.emoji}</span>
            <span>{resultType}</span>
          </h1>
          <p className="description" style={{ marginTop: '15px', padding: '0 20px', fontWeight: '500' }}>
            {info.desc}
          </p>
        </div>

        <div className="result-card">
          {dimensions.map((dim, idx) => {
            const leftScore = scores[dim.left.key as keyof typeof scores];
            const rightScore = scores[dim.right.key as keyof typeof scores];
            const leftPercent = getPercentage(leftScore, rightScore, dim.tieBreakerRight);
            
            return (
              <div key={idx} className="dimension-section">
                <div className="dimension-header">
                  <span className="dimension-label">{dim.label}</span>
                  <span className="dimension-desc">{dim.desc}</span>
                </div>
                <div className="score-bar-container">
                  <div className="score-bar-left" style={{ width: `${leftPercent}%`, backgroundColor: leftScore >= rightScore && !(leftScore === rightScore && dim.tieBreakerRight) ? '#3b82f6' : '#cbd5e1' }}></div>
                  <div className="score-bar-right" style={{ width: `${100 - leftPercent}%`, backgroundColor: (rightScore > leftScore) || (leftScore === rightScore && dim.tieBreakerRight) ? '#3b82f6' : '#cbd5e1' }}></div>
                  <div className="score-divider"></div>
                </div>
                <div className="dimension-tags">
                  <span className={leftScore >= rightScore && !(leftScore === rightScore && dim.tieBreakerRight) ? 'tag-active' : ''}>{dim.left.name} ({dim.left.key})</span>
                  <span className={(rightScore > leftScore) || (leftScore === rightScore && dim.tieBreakerRight) ? 'tag-active' : ''}>{dim.right.name} ({dim.right.key})</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="care-section">
          <div className="care-title">
            <span>✨</span> 맞춤 피부 관리법
          </div>
          <p className="care-desc">{info.care}</p>
        </div>

        <div className="share-teaser">
          <p className="teaser-text">
            내 피부 MBTI는 <br />
            <span className="teaser-highlight">{info.title} {info.emoji} {resultType}</span>
            너는 어때? 같이 해보자! 😉
          </p>
        </div>

        <div className="share-container">
          <div className="share-row">
            <button className="btn btn-kakao" onClick={() => alert('카카오톡 공유 기능은 실제 카카오 API 키 설정이 필요합니다.')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.553 1.706 4.8 4.315 6.091l-.81 2.962c-.06.21.173.397.354.273l3.483-2.32c.54.075 1.097.114 1.658.114 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/>
              </svg>
              카톡 공유
            </button>
            <button className="btn btn-outline" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('링크가 복사되었습니다!');
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              링크 복사
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setState('landing')}>
            테스트 다시하기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {state === 'landing' && renderLanding()}
      {state === 'quiz' && renderQuiz()}
      {state === 'loading' && renderLoading()}
      {state === 'result' && renderResult()}
    </div>
  );
}

export default App;
