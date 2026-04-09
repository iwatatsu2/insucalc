import type { UserSettings } from '../types';

interface Props {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
  onClose: () => void;
}

const Field = ({ label, value, onChange, min, max, step = 1, hint }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; hint?: string;
}) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <label style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>{label}</label>
      {hint && <span style={{ fontSize: 11, color: '#94A3B8' }}>{hint}</span>}
    </div>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      inputMode="decimal"
      style={{
        width: '100%', padding: '12px 14px', borderRadius: 12,
        border: '1.5px solid #E2E8F0',
        background: '#F8FAFC', color: '#1E293B', fontSize: 18, fontWeight: 700,
        outline: 'none', textAlign: 'right', boxSizing: 'border-box',
      }}
    />
  </div>
);

export default function SettingsPanel({ settings, onUpdate, onClose }: Props) {
  const isf = Math.round(1700 / settings.tdd);

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
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', margin: 0 }}>⚙️ 設定</h2>
          <button onClick={onClose} style={{
            background: '#F1F5F9', border: 'none', color: '#64748B',
            borderRadius: 20, width: 32, height: 32,
            fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        <Field label="CIR（炭水化物/インスリン比）" value={settings.cir} onChange={v => onUpdate({ cir: v })} min={1} max={30} hint="炭水化物何gで1単位" />
        <Field label="ISF（インスリン効果値）" value={settings.isf} onChange={v => onUpdate({ isf: v })} min={10} max={200} hint="1単位で何mg/dL下がるか" />
        <Field label="1日総インスリン量（TDD）" value={settings.tdd} onChange={v => onUpdate({ tdd: v, isf: Math.round(1700 / v) })} min={5} max={200} hint="単位/日" />
        <Field label="1日ベーサルインスリン量" value={settings.basalDose} onChange={v => onUpdate({ basalDose: v })} min={0} max={100} hint="単位/日" />
        <Field label="目標血糖値" value={settings.targetBg} onChange={v => onUpdate({ targetBg: v })} min={70} max={180} hint="mg/dL" />

        <div style={{
          background: '#EFF6FF', border: '1px solid #BFDBFE',
          borderRadius: 14, padding: '12px 14px', marginBottom: 20,
        }}>
          <div style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600, marginBottom: 4 }}>TDDから自動計算されたISF</div>
          <div style={{ fontSize: 22, color: '#2563EB', fontWeight: 800 }}>
            {isf} <span style={{ fontSize: 13, fontWeight: 600 }}>mg/dL/単位</span>
          </div>
          <div style={{ fontSize: 11, color: '#93C5FD', marginTop: 4 }}>
            1700 ÷ {settings.tdd} = {isf}（上記ISF欄で上書き可能）
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '16px', background: '#2563EB', color: '#fff',
            border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}
        >
          保存して閉じる
        </button>
      </div>
    </div>
  );
}
