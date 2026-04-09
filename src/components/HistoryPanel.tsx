import type { HistoryEntry } from '../types';

interface Props {
  history: HistoryEntry[];
  onClear: () => void;
  onClose: () => void;
}

export default function HistoryPanel({ history, onClear, onClose }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        width: '100%', background: '#fff', borderRadius: '24px 24px 0 0',
        padding: '20px 20px 40px', maxHeight: '85vh', overflowY: 'auto',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
      }}>
        {/* ハンドル */}
        <div style={{ width: 36, height: 4, background: '#E2E8F0', borderRadius: 2, margin: '0 auto 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', margin: 0 }}>📋 履歴</h2>
          <button onClick={onClose} style={{
            background: '#F1F5F9', border: 'none', color: '#64748B',
            borderRadius: 20, width: 32, height: 32,
            fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#CBD5E1', padding: '40px 0' }}>履歴がありません</p>
        ) : (
          <>
            {history.map(entry => (
              <div key={entry.id} style={{
                background: '#F8FAFC', border: '1px solid #E2E8F0',
                borderRadius: 16, padding: '14px', marginBottom: 10,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{entry.date} {entry.time}</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#2563EB' }}>{entry.totalBolus.toFixed(1)} 単位</span>
                </div>
                <div style={{ fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: 500 }}>
                  {entry.foods.length > 0 ? entry.foods.join('、') : '食事なし'}
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#94A3B8' }}>
                  <span>炭水化物 {entry.totalCarbs}g</span>
                  <span>血糖 {entry.currentBg} mg/dL</span>
                  <span>食事 {entry.mealBolus.toFixed(1)} + 補正 {entry.correctionBolus.toFixed(1)}</span>
                </div>
              </div>
            ))}
            <button
              onClick={() => { if (confirm('履歴を全て削除しますか？')) onClear(); }}
              style={{
                width: '100%', padding: '12px', background: 'transparent',
                border: '1.5px solid #E2E8F0', borderRadius: 12,
                color: '#94A3B8', fontSize: 14, cursor: 'pointer', marginTop: 8,
              }}
            >
              履歴をクリア
            </button>
          </>
        )}
      </div>
    </div>
  );
}
