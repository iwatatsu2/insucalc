import { useState } from 'react';
import FoodSelector from './components/FoodSelector';
import ResultDisplay from './components/ResultDisplay';
import SettingsPanel from './components/SettingsPanel';
import HistoryPanel from './components/HistoryPanel';
import GuidePage from './components/GuidePage';
import { useSettings } from './hooks/useSettings';
import { useHistory } from './hooks/useHistory';

const T1LIFE_URL = 'https://t1life.vercel.app';

function roundToHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

export default function App() {
  const { settings, updateSettings } = useSettings();
  const { history, addEntry, clearHistory } = useHistory();

  const [totalCarbs, setTotalCarbs] = useState(0);
  const [foodSummary, setFoodSummary] = useState<string[]>([]);
  const [currentBg, setCurrentBg] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const bg = parseFloat(currentBg) || 0;

  const mealBolus = totalCarbs > 0 ? totalCarbs / settings.cir : 0;
  const rawCorrection = bg > 0 ? (bg - settings.targetBg) / settings.isf : 0;
  const correctionBolus = Math.max(0, rawCorrection);
  const totalBolus = roundToHalf(mealBolus + correctionBolus);

  let warning: string | null = null;
  if (bg > 0 && bg < 50) warning = '低血糖の可能性があります（血糖 < 50）。直ちに補食してください。';
  else if (bg > 400) warning = '血糖値が非常に高い（> 400）。緊急の対応が必要な可能性があります。';

  const canSave = totalCarbs > 0 || bg > 0;

  const handleSave = () => {
    if (!canSave) return;
    const now = new Date();
    addEntry({
      date: now.toLocaleDateString('ja-JP'),
      time: now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      foods: foodSummary,
      totalCarbs,
      currentBg: bg,
      mealBolus: roundToHalf(mealBolus),
      correctionBolus: roundToHalf(correctionBolus),
      totalBolus,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setTotalCarbs(0);
    setFoodSummary([]);
    setCurrentBg('');
    setSaved(false);
    setResetKey(k => k + 1);
  };

  if (showGuide) return <GuidePage onClose={() => setShowGuide(false)} />;

  return (
    <div style={{ background: '#F5F7FF', minHeight: '100vh', color: '#1E293B', fontFamily: "'Hiragino Sans', 'Noto Sans JP', -apple-system, sans-serif", maxWidth: 480, margin: '0 auto' }}>
      {/* ヘッダー */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 16px', height: 56,
        borderBottom: '1px solid rgba(148,163,184,0.2)',
        position: 'sticky', top: 0,
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}>
            <span style={{ fontSize: 16 }}>💉</span>
          </div>
          <div>
            <span style={{ fontSize: 17, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.3px' }}>Insu</span>
            <span style={{ fontSize: 17, fontWeight: 900, color: '#2563EB' }}>Calc</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <a href={T1LIFE_URL} target="_blank" rel="noopener noreferrer" style={{
            background: '#EFF6FF', border: '1px solid #BFDBFE',
            color: '#2563EB', borderRadius: 20, padding: '5px 10px',
            fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            T1Life ↗
          </a>
          <button onClick={() => setShowGuide(true)} style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#64748B', borderRadius: 20, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>？ 使い方</button>
          <button onClick={() => setShowHistory(true)} style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#64748B', borderRadius: 20, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>📋</button>
          <button onClick={() => setShowSettings(true)} style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#64748B', borderRadius: 20, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>⚙️</button>
        </div>
      </header>

      <div style={{ padding: '16px 16px 100px' }}>
        {/* パラメータ表示 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'CIR', value: settings.cir, color: '#2563EB' },
            { label: 'ISF', value: settings.isf, color: '#7C3AED' },
            { label: '目標血糖', value: `${settings.targetBg}`, color: '#0EA5E9' },
          ].map(item => (
            <div key={item.label} style={{ flex: 1, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '8px 10px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#94A3B8', fontSize: 10, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
              <div style={{ color: item.color, fontWeight: 800, fontSize: 14 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* ①食事入力 */}
        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#64748B', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ background: '#2563EB', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>1</span>
            食事を入力
          </h2>
          <FoodSelector
            key={resetKey}
            onChange={(carbs, summary) => { setTotalCarbs(carbs); setFoodSummary(summary); }}
          />
        </section>

        {/* ②血糖入力 */}
        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#64748B', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ background: '#2563EB', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>2</span>
            現在の血糖値
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="number"
              value={currentBg}
              onChange={e => setCurrentBg(e.target.value)}
              placeholder="例: 180"
              inputMode="numeric"
              style={{
                flex: 1, padding: '16px', borderRadius: 14,
                border: `1.5px solid ${bg > 400 || (bg < 70 && bg > 0) ? '#EF4444' : '#E2E8F0'}`,
                background: '#fff', color: '#1E293B', fontSize: 28, fontWeight: 700,
                outline: 'none', textAlign: 'right',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            />
            <span style={{ fontSize: 14, color: '#94A3B8', flexShrink: 0 }}>mg/dL</span>
          </div>
        </section>

        {/* ③計算結果 */}
        {(totalCarbs > 0 || bg > 0) && (
          <section style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: '#64748B', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ background: '#2563EB', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>3</span>
              計算結果
            </h2>
            <ResultDisplay
              mealBolus={roundToHalf(mealBolus)}
              correctionBolus={roundToHalf(correctionBolus)}
              totalBolus={totalBolus}
              currentBg={bg}
              warning={warning}
            />
          </section>
        )}
      </div>

      {/* 下部ボタン */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, padding: '12px 16px 34px',
        background: 'linear-gradient(transparent, #F5F7FF 30%)',
        display: 'flex', gap: 10,
      }}>
        <button onClick={handleReset} style={{ flex: 1, padding: '14px', background: '#fff', border: '1.5px solid #E2E8F0', color: '#64748B', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          リセット
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave || saved}
          style={{
            flex: 2, padding: '14px', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: canSave ? 'pointer' : 'default',
            background: saved ? '#DCFCE7' : canSave ? '#2563EB' : '#F1F5F9',
            color: saved ? '#16A34A' : canSave ? '#fff' : '#CBD5E1',
            transition: 'all 0.2s',
            boxShadow: canSave && !saved ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
          }}
        >
          {saved ? '✓ 保存しました' : '💾 履歴に保存'}
        </button>
      </div>

      {showSettings && <SettingsPanel settings={settings} onUpdate={updateSettings} onClose={() => setShowSettings(false)} />}
      {showHistory && <HistoryPanel history={history} onClear={clearHistory} onClose={() => setShowHistory(false)} />}
    </div>
  );
}
