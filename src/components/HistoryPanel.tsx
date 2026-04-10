import { useState } from 'react';
import type { HistoryEntry } from '../types';

interface Props {
  history: HistoryEntry[];
  onUpdate: (id: string, updates: Partial<HistoryEntry>) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function EditModal({ entry, onSave, onDelete, onClose }: {
  entry: HistoryEntry;
  onSave: (updates: Partial<HistoryEntry>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [bg, setBg] = useState(String(entry.currentBg || ''));
  const [carbs, setCarbs] = useState(String(entry.totalCarbs || ''));
  const [actual, setActual] = useState(String(entry.actualBolus ?? entry.totalBolus));
  const [memo, setMemo] = useState(entry.memo ?? '');

  const handleSave = () => {
    onSave({
      currentBg: parseFloat(bg) || 0,
      totalCarbs: parseFloat(carbs) || 0,
      actualBolus: parseFloat(actual) || 0,
      memo: memo.trim(),
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: '1.5px solid #E2E8F0', background: '#F8FAFC',
    color: '#1E293B', fontSize: 16, fontWeight: 700,
    outline: 'none', boxSizing: 'border-box', textAlign: 'right',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: '#fff', borderRadius: 24,
        padding: '24px 20px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1E293B' }}>✏️ 履歴を修正</h3>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', color: '#64748B', borderRadius: 20, width: 30, height: 30, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 16 }}>{entry.date} {entry.time}　{entry.foods.join('、') || '食事なし'}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="血糖値（mg/dL）">
            <input type="number" value={bg} onChange={e => setBg(e.target.value)} inputMode="numeric" style={inputStyle} />
          </Field>
          <Field label="炭水化物（g）">
            <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} inputMode="numeric" style={inputStyle} />
          </Field>
          <Field label="実際に打った単位（単位）">
            <input type="number" value={actual} onChange={e => setActual(e.target.value)} inputMode="decimal" step="0.5" style={{ ...inputStyle, color: '#2563EB' }} />
          </Field>
          <Field label="メモ">
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="運動前・シックデイなど"
              rows={2}
              style={{ ...inputStyle, textAlign: 'left', fontWeight: 400, fontSize: 14, resize: 'none', lineHeight: 1.6 }}
            />
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={() => { if (confirm('この記録を削除しますか？')) { onDelete(); onClose(); } }}
            style={{ flex: 1, padding: '12px', background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#EF4444', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            削除
          </button>
          <button
            onClick={handleSave}
            style={{ flex: 2, padding: '12px', background: '#2563EB', border: 'none', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

export default function HistoryPanel({ history, onUpdate, onDelete, onClear, onClose }: Props) {
  const [editTarget, setEditTarget] = useState<HistoryEntry | null>(null);

  return (
    <>
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
              {history.map(entry => {
                const displayBolus = entry.actualBolus ?? entry.totalBolus;
                const isEdited = entry.actualBolus !== undefined && entry.actualBolus !== entry.totalBolus;
                return (
                  <div key={entry.id} style={{
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                    borderRadius: 16, padding: '14px', marginBottom: 10,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{entry.date} {entry.time}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: '#2563EB' }}>{displayBolus.toFixed(1)} 単位</span>
                          {isEdited && (
                            <div style={{ fontSize: 10, color: '#94A3B8' }}>計算値 {entry.totalBolus.toFixed(1)}</div>
                          )}
                        </div>
                        <button
                          onClick={() => setEditTarget(entry)}
                          style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                          編集
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: 500 }}>
                      {entry.foods.length > 0 ? entry.foods.join('、') : '食事なし'}
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#94A3B8', flexWrap: 'wrap' }}>
                      <span>炭水化物 {entry.totalCarbs}g</span>
                      <span>血糖 {entry.currentBg} mg/dL</span>
                      <span>食事 {entry.mealBolus.toFixed(1)} + 補正 {entry.correctionBolus.toFixed(1)}</span>
                    </div>
                    {entry.memo && (
                      <div style={{ marginTop: 8, padding: '6px 10px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, fontSize: 12, color: '#92400E' }}>
                        📝 {entry.memo}
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() => { if (confirm('履歴を全て削除しますか？')) onClear(); }}
                style={{
                  width: '100%', padding: '12px', background: 'transparent',
                  border: '1.5px solid #E2E8F0', borderRadius: 12,
                  color: '#94A3B8', fontSize: 14, cursor: 'pointer', marginTop: 8,
                }}
              >
                履歴をすべて削除
              </button>
            </>
          )}
        </div>
      </div>

      {editTarget && (
        <EditModal
          entry={editTarget}
          onSave={updates => onUpdate(editTarget.id, updates)}
          onDelete={() => onDelete(editTarget.id)}
          onClose={() => setEditTarget(null)}
        />
      )}
    </>
  );
}
