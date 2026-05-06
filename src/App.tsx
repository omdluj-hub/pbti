import { useState, useEffect } from 'react';
import './App.css';
import logo from '../images/logo.gif';
import StatsPage from './StatsPage';

declare global {
  interface Window {
    Kakao: any;
  }
}

type Dimension = 'IE' | 'SN' | 'TF' | 'PJ';

interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  options: [string, string, string]; // [I/S/T/P, Neutral, E/N/F/J]
}

const QUESTIONS: Question[] = [
  // ... (unchanged)
];

const TYPE_INFO: Record<string, { title: string, desc: string, care: string, emoji: string }> = {
  // ... (unchanged)
};

type AppState = 'landing' | 'quiz' | 'loading' | 'result' | 'stats';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({
    I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, P: 0, J: 0
  });
  const [history, setHistory] = useState<number[]>([]);
  const [resultType, setResultType] = useState('');
  const [isAnimate, setIsAnimate] = useState(false);
  const [activeDesc, setActiveDesc] = useState<string | null>(null);

  useEffect(() => {
    // 카카오 SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('4b8cf984941f0ddf07417296461d7c6b');
    }

    // 방문 기록 (API 호출)
    fetch('http://localhost:3001/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error('Visit tracking failed:', err));

    // 관리자 페이지 진입 체크 (URL 파라미터 ?admin=stats)
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'stats') {
      setState('stats');
    }
  }, []);

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
    const info = TYPE_INFO[resultType] || { title: resultType, desc: "", care: "", emoji: "" };
    
    const shareToKakao = () => {
      const kakao = window.Kakao;
      
      if (!kakao) {
        alert('카카오 SDK를 불러오는 중입니다. 잠시만 기다려주세요.');
        return;
      }

      if (!kakao.isInitialized()) {
        try {
          kakao.init('4b8cf984941f0ddf07417296461d7c6b');
        } catch (e) {
          console.error('Kakao Init Error:', e);
        }
      }

      // 현재 페이지의 주소를 가져오되, 쿼리 스트링이나 해시를 제거한 깨끗한 주소 사용
      const currentUrl = window.location.href.split('?')[0].split('#')[0];
      const shareUrl = currentUrl.endsWith('/') ? currentUrl.slice(0, -1) : currentUrl;
      const imageUrl = `${shareUrl}/share.png`;

      try {
        kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `피부 MBTI (PBTI) 테스트 결과 ✨`,
            description: `내 피부는 ${info.title} ${info.emoji} (${resultType})! 너는 어때? 같이 해보자! 😉`,
            imageUrl: imageUrl,
            link: {
              mobileWebUrl: currentUrl,
              webUrl: currentUrl,
            },
          },
          buttons: [
            {
              title: '나도 테스트 하러가기',
              link: {
                mobileWebUrl: currentUrl,
                webUrl: currentUrl,
              },
            },
          ],
        });
      } catch (err) {
        console.error('Kakao Share Error:', err);
        alert('카카오톡 공유 중 오류가 발생했습니다. 카카오 개발자 콘솔의 도메인 설정을 확인해주세요.');
      }
    };

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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', flexWrap: 'nowrap' }}>
            <a href="https://homepage-five-chi.vercel.app/" target="_blank" rel="noopener noreferrer" className="result-branding">
              <img src={logo} alt="후한의원 로고" className="result-branding-logo" />
              <span className="result-branding-text" style={{ whiteSpace: 'nowrap' }}>후한의원 구미점</span>
            </a>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#6b7280', whiteSpace: 'nowrap' }}>과 함께 알아본</span>
          </div>
          <div className="type-badge">당신의 피부 MBTI 결과는?</div>
          <h2 className="type-title" style={{ fontSize: '24px', marginBottom: '5px', marginTop: '20px' }}>{info.title}</h2>
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
                  <div className="score-bar-left" style={{ width: `${leftPercent}%`, backgroundColor: leftScore >= rightScore && !(leftScore === rightScore && dim.tieBreakerRight) ? '#7c3aed' : '#f3f4f6' }}></div>
                  <div className="score-bar-right" style={{ width: `${100 - leftPercent}%`, backgroundColor: (rightScore > leftScore) || (leftScore === rightScore && dim.tieBreakerRight) ? '#7c3aed' : '#f3f4f6' }}></div>
                  <div className="score-divider"></div>
                </div>
                <div className="dimension-tags">
                  <span 
                    className={`dimension-tag-clickable ${leftScore >= rightScore && !(leftScore === rightScore && dim.tieBreakerRight) ? 'tag-active' : ''}`}
                    onClick={() => setActiveDesc(DIMENSION_DESCS[dim.left.key])}
                  >
                    {dim.left.name} ({dim.left.key})
                  </span>
                  <span 
                    className={`dimension-tag-clickable ${(rightScore > leftScore) || (leftScore === rightScore && dim.tieBreakerRight) ? 'tag-active' : ''}`}
                    onClick={() => setActiveDesc(DIMENSION_DESCS[dim.right.key])}
                  >
                    {dim.right.name} ({dim.right.key})
                  </span>
                </div>
              </div>
            );
          })}
          
          {activeDesc && (
            <div className="dimension-info-box fade-in">
              <div className="info-box-header">
                <span>💡 설명</span>
                <button className="info-box-close" onClick={() => setActiveDesc(null)}>×</button>
              </div>
              <p className="info-box-text">{activeDesc}</p>
            </div>
          )}
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
            <button className="btn btn-kakao" onClick={shareToKakao}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.553 1.706 4.8 4.315 6.091l-.81 2.962c-.06.21.173.397.354.273l3.483-2.32c.54.075 1.097.114 1.658.114 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/>
              </svg>
              카톡 공유
            </button>
            <button className="btn btn-outline" onClick={() => {
              const shareUrl = 'https://pbti-iota.vercel.app';
              navigator.clipboard.writeText(shareUrl);
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
          <a href="https://homepage-five-chi.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary">
              내 피부 관리, 후한의원과 상담하기
            </button>
          </a>
        </div>

        <div className="result-disclaimer">
          본 콘텐츠는 후한의원 구미점에서 제공하는 단순 흥미 목적의 자료이며, <br />
          의료법상 진단 행위에 해당하지 않습니다.
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
      {state === 'stats' && <StatsPage />}
    </div>
  );
}

export default App;
