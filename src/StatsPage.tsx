import { useState, useEffect } from 'react';

interface Visit {
  ip: string;
  visit_time: string;
}

interface DailyStat {
  date: string;
  count: number;
}

interface StatsData {
  totalVisits: number;
  todayVisits: number;
  recentVisits: Visit[];
  dailyStats: DailyStat[];
}

function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="app-container"><p>통계 데이터를 불러오는 중...</p></div>;
  if (error) return <div className="app-container"><p style={{ color: 'red' }}>에러: {error}</p></div>;
  if (!stats) return null;

  return (
    <div className="app-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'left' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>방문자 통계 분석 ✨</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#7c3aed', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>총 방문횟수</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalVisits.toLocaleString()}</div>
        </div>
        <div style={{ background: '#10b981', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>오늘 방문횟수</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.todayVisits.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>일별 방문 추이 (최근 14일)</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
          {stats.dailyStats.slice().reverse().map((day) => {
            const max = Math.max(...stats.dailyStats.map(d => d.count), 1);
            const height = (day.count / max) * 150;
            return (
              <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  height: `${height}px`, 
                  background: '#7c3aed', 
                  borderRadius: '4px 4px 0 0',
                  minHeight: day.count > 0 ? '5px' : '0'
                }}></div>
                <div style={{ fontSize: '10px', marginTop: '5px', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                  {day.date.split('-').slice(1).join('/')}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '15px' }}>{day.count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>최근 방문 기록</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                <th style={{ padding: '10px', fontSize: '14px', color: '#64748b' }}>IP 주소</th>
                <th style={{ padding: '10px', fontSize: '14px', color: '#64748b' }}>방문 시간</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentVisits.map((visit, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', fontSize: '14px' }}>{visit.ip}</td>
                  <td style={{ padding: '10px', fontSize: '14px', color: '#64748b' }}>{new Date(visit.visit_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          className="btn btn-outline" 
          onClick={() => window.location.href = '/'}
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default StatsPage;
