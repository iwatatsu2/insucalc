import { useState } from 'react';
import FoodSelector from './components/FoodSelector';
import ResultDisplay from './components/ResultDisplay';
import SettingsPanel from './components/SettingsPanel';
import HistoryPanel from './components/HistoryPanel';
import GuidePage from './components/GuidePage';
import AboutPage from './components/AboutPage';
import DrawerMenu from './components/DrawerMenu';
import { useSettings } from './hooks/useSettings';
import { useHistory } from './hooks/useHistory';

function roundToHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

type MealTime = 'morning' | 'noon' | 'evening';

function getMealTime(): MealTime {
  const h = new Date().getHours();
  if (h >= 5 && h <= 10) return 'morning';
  if (h >= 11 && h <= 16) return 'noon';
  return 'evening';
}

const MEAL_TIME_LABEL: Record<MealTime, string> = {
  morning: '朝',
  noon: '昼',
  evening: '夜',
};

type Page = 'home' | 'guide' | 'history' | 'settings' | 'about';

export default function App() {
  const { settings, updateSettings } = useSettings();
  const { history, addEntry, updateEntry, deleteEntry, clearHistory } = useHistory();

  const [page, setPage] = useState<Page>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [totalCarbs, setTotalCarbs] = useState(0);
  const [foodSummary, setFoodSummary] = useState<string[]>([]);
  const [currentBg, setCurrentBg] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [mealTime, setMealTime] = useState<MealTime>(getMealTime());

  const cirKey = `cir${mealTime.charAt(0).toUpperCase()}${mealTime.slice(1)}` as 'cirMorning' | 'cirNoon' | 'cirEvening';
  const cir = settings[cirKey];

  const bg = parseFloat(currentBg) || 0;
  const mealBolus = totalCarbs > 0 ? totalCarbs / cir : 0;
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

  // ガイド・About・設定・履歴はページとして表示
  if (page === 'guide') return (
    <PageWrapper>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={setPage} currentPage="guide" />
      <GuidePage onClose={() => setPage('home')} />
    </PageWrapper>
  );
  if (page === 'about') return (
    <PageWrapper>
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={setPage} currentPage="about" />
      <AboutPage onClose={() => setPage('home')} />
    </PageWrapper>
  );

  return (
    <div style={{ background: '#DAE3F5', minHeight: '100vh', color: '#1E293B', fontFamily: "'Hiragino Sans', 'Noto Sans JP', -apple-system, sans-serif", maxWidth: 480, margin: '0 auto', overflowX: 'hidden' }}>

      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={setPage} currentPage={page} />

      {/* ヘッダー */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 16px', height: 56,
        borderBottom: '1px solid rgba(148,163,184,0.25)',
        position: 'sticky', top: 0,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        zIndex: 100,
      }}>
        {/* ハンバーガー＋ロゴ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 10,
              width: 36, height: 36, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: 16, height: 2, background: '#475569', borderRadius: 1 }} />
            ))}
          </button>
          <div>
            <span style={{ fontSize: 17, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.3px' }}>Insu</span>
            <span style={{ fontSize: 17, fontWeight: 900, color: '#2563EB' }}>Calc</span>
          </div>
        </div>
      </header>

      <div style={{ padding: '16px 16px 100px' }}>
        {/* 時間帯セレクター */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, background: '#fff', borderRadius: 14, padding: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}>
          {(['morning', 'noon', 'evening'] as MealTime[]).map(t => (
            <button
              key={t}
              onClick={() => setMealTime(t)}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: mealTime === t ? '#2563EB' : 'transparent',
                color: mealTime === t ? '#fff' : '#64748B',
                fontSize: 12, fontWeight: 700,
                transition: 'all 0.15s',
              }}
            >
              {MEAL_TIME_LABEL[t]}
            </button>
          ))}
        </div>

        {/* パラメータ表示 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { label: `CIR（${MEAL_TIME_LABEL[mealTime]}）`, value: cir, color: '#2563EB' },
            { label: 'ISF', value: settings.isf, color: '#7C3AED' },
            { label: '目標血糖', value: `${settings.targetBg}`, color: '#0EA5E9' },
          ].map(item => (
            <div key={item.label} style={{
              flex: 1, background: '#fff', border: '1.5px solid #E2E8F0',
              borderRadius: 12, padding: '8px 10px', textAlign: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
            }}>
              <div style={{ color: '#94A3B8', fontSize: 10, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
              <div style={{ color: item.color, fontWeight: 800, fontSize: 14 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* ①食事入力 */}
        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
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
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
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
                border: `1.5px solid ${bg > 400 || (bg < 70 && bg > 0) ? '#EF4444' : '#CBD5E1'}`,
                background: '#fff', color: '#1E293B', fontSize: 28, fontWeight: 700,
                outline: 'none', textAlign: currentBg ? 'right' : 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
              }}
            />
            <span style={{ fontSize: 14, color: '#94A3B8', flexShrink: 0 }}>mg/dL</span>
          </div>
        </section>

        {/* ③計算結果 */}
        {(totalCarbs > 0 || bg > 0) && (
          <section style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
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
        {/* 免責事項 */}
        <section style={{
          background: '#FEF9C3', border: '1px solid #FDE68A',
          borderRadius: 16, padding: '14px 16px', marginTop: 4,
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#92400E', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>⚠️</span> 免責事項・重要なお知らせ
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 11, color: '#78350F', lineHeight: 2.0 }}>
            <li>本アプリは<strong>医療機器ではありません</strong>。計算結果は参考値であり、医療行為を構成するものではありません。</li>
            <li>実際のインスリン投与量は、<strong>必ず担当医師の指示に従って</strong>決定してください。</li>
            <li>CIR・ISF・目標血糖値は個人差が大きく、体調・運動・ストレス等により変動します。定期的に担当医と見直してください。</li>
            <li>低血糖（&lt;70 mg/dL）時はインスリンを打たず、まず炭水化物を補食してください。</li>
            <li>本アプリの利用により生じたいかなる健康被害についても、開発者は責任を負いません。</li>
          </ul>
        </section>

        {/* T1Life セクション */}
        <div style={{ marginTop: 24 }}>
          {/* セクション見出し */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>1型糖尿病コミュニティ</span>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>

          <a
            href="https://t1life.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', textDecoration: 'none' }}
          >
            <div style={{
              background: '#fff',
              border: '1.5px solid #E2E8F0',
              borderRadius: 18,
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              {/* T1ロゴ */}
              <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: '#2563EB', borderRadius: 12,
                  transform: 'rotate(6deg)', opacity: 0.25,
                }} />
                <div style={{
                  position: 'relative', width: 44, height: 44,
                  background: 'linear-gradient(135deg, #3B82F6, #4F46E5)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, letterSpacing: '-0.5px' }}>T1</span>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.2px' }}>
                  T1<span style={{ color: '#2563EB' }}>Life</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>1型糖尿病の仲間とつながるコミュニティ</div>
              </div>

              <span style={{ fontSize: 16, color: '#CBD5E1' }}>↗</span>
            </div>
          </a>
        </div>

      </div>

      {/* 下部ボタン */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, padding: '12px 16px 34px',
        background: 'linear-gradient(transparent, #DAE3F5 30%)',
        display: 'flex', gap: 10,
      }}>
        <button onClick={handleReset} style={{
          flex: 1, padding: '14px', background: '#fff',
          border: '1.5px solid #CBD5E1', color: '#64748B',
          borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
        }}>
          リセット
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave || saved}
          style={{
            flex: 2, padding: '14px', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: canSave ? 'pointer' : 'default',
            background: saved ? '#DCFCE7' : canSave ? '#2563EB' : '#E2E8F0',
            color: saved ? '#16A34A' : canSave ? '#fff' : '#94A3B8',
            transition: 'all 0.2s',
            boxShadow: canSave && !saved ? '0 4px 14px rgba(37,99,235,0.35)' : 'none',
          }}
        >
          {saved ? '✓ 保存しました' : '💾 履歴に保存'}
        </button>
      </div>

      {/* 設定・履歴はオーバーレイパネル */}
      {page === 'settings' && (
        <SettingsPanel settings={settings} onUpdate={updateSettings} onClose={() => setPage('home')} />
      )}
      {page === 'history' && (
        <HistoryPanel history={history} onUpdate={updateEntry} onDelete={deleteEntry} onClear={clearHistory} onClose={() => setPage('home')} />
      )}
    </div>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      {children}
    </div>
  );
}
