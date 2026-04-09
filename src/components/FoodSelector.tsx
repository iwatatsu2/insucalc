import { useState } from 'react';
import { foodData, type FoodItem } from '../data/foodData';

// 主食の交換表係数
const STAPLES = [
  { key: 'rice',   label: '米飯',          unit: 'g', ratio: 0.40, emoji: '🍚', hint: '×40%' },
  { key: 'bread',  label: 'パン・もち',     unit: 'g', ratio: 0.50, emoji: '🍞', hint: '×50%' },
  { key: 'noodle', label: '麺類(ゆで)・芋類', unit: 'g', ratio: 0.20, emoji: '🍜', hint: '×20%' },
] as const;

type StapleKey = typeof STAPLES[number]['key'];

interface Props {
  onChange: (totalCarbs: number, summary: string[]) => void;
}

export default function FoodSelector({ onChange }: Props) {
  const [tab, setTab] = useState<'staple' | 'side'>('staple');
  const [stapleGrams, setStapleGrams] = useState<Record<StapleKey, string>>({ rice: '', bread: '', noodle: '' });
  const [selectedSides, setSelectedSides] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // おかずカテゴリ（主食系を除く）
  const allSideCategories = Object.keys(foodData);

  const searchResults = search.trim()
    ? Object.values(foodData).flat().filter(f =>
        f.name.includes(search) || f.tags.some(t => t.includes(search))
      ).slice(0, 20)
    : activeCategory ? foodData[activeCategory] : [];

  // 主食の炭水化物合計
  const stapleCarbs = STAPLES.reduce((sum, s) => {
    const g = parseFloat(stapleGrams[s.key]) || 0;
    return sum + Math.round(g * s.ratio);
  }, 0);

  // おかずの炭水化物合計
  const sideCarbs = selectedSides.reduce((sum, f) => sum + f.carbs, 0);

  const totalCarbs = stapleCarbs + sideCarbs;

  // サマリー生成してコールバック
  const notify = (newStapleGrams: typeof stapleGrams, newSides: FoodItem[]) => {
    const sc = STAPLES.reduce((sum, s) => sum + Math.round((parseFloat(newStapleGrams[s.key]) || 0) * s.ratio), 0);
    const sd = newSides.reduce((sum, f) => sum + f.carbs, 0);
    const summary: string[] = [];
    STAPLES.forEach(s => {
      const g = parseFloat(newStapleGrams[s.key]) || 0;
      if (g > 0) summary.push(`${s.label} ${g}g`);
    });
    newSides.forEach(f => summary.push(f.name));
    onChange(sc + sd, summary);
  };

  const handleStapleChange = (key: StapleKey, val: string) => {
    const next = { ...stapleGrams, [key]: val };
    setStapleGrams(next);
    notify(next, selectedSides);
  };

  const addSide = (food: FoodItem) => {
    const next = [...selectedSides, food];
    setSelectedSides(next);
    notify(stapleGrams, next);
  };

  const removeSide = (i: number) => {
    const next = selectedSides.filter((_, idx) => idx !== i);
    setSelectedSides(next);
    notify(stapleGrams, next);
  };

  return (
    <div>
      {/* タブ */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[
          { key: 'staple', label: '🍚 主食', sub: `${stapleCarbs}g` },
          { key: 'side',   label: '🍱 おかず', sub: `${sideCarbs}g` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as 'staple' | 'side')}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 14,
              border: `1.5px solid ${tab === t.key ? '#2563EB' : '#E2E8F0'}`,
              background: tab === t.key ? '#EFF6FF' : '#fff',
              color: tab === t.key ? '#2563EB' : '#64748B',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}
          >
            <span>{t.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>炭水化物 {t.sub}</span>
          </button>
        ))}
      </div>

      {/* 主食タブ */}
      {tab === 'staple' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STAPLES.map(s => {
            const g = parseFloat(stapleGrams[s.key]) || 0;
            const carbs = Math.round(g * s.ratio);
            return (
              <div key={s.key} style={{
                background: '#fff', border: '1.5px solid #E2E8F0',
                borderRadius: 16, padding: '12px 14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 15 }}>{s.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginLeft: 6 }}>{s.label}</span>
                    <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 6 }}>（重量 {s.hint}）</span>
                  </div>
                  {g > 0 && (
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#2563EB' }}>{carbs}g</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    value={stapleGrams[s.key]}
                    onChange={e => handleStapleChange(s.key, e.target.value)}
                    placeholder="0"
                    inputMode="numeric"
                    style={{
                      flex: 1, padding: '10px 12px', borderRadius: 10,
                      border: `1.5px solid ${g > 0 ? '#BFDBFE' : '#E2E8F0'}`,
                      background: g > 0 ? '#EFF6FF' : '#F8FAFC',
                      color: '#1E293B', fontSize: 20, fontWeight: 700,
                      outline: 'none', textAlign: 'right',
                    }}
                  />
                  <span style={{ fontSize: 13, color: '#94A3B8', flexShrink: 0 }}>g</span>
                  {g > 0 && (
                    <button
                      onClick={() => handleStapleChange(s.key, '')}
                      style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, width: 28, height: 28, color: '#EF4444', cursor: 'pointer', fontSize: 14, flexShrink: 0 }}
                    >×</button>
                  )}
                </div>
              </div>
            );
          })}
          <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 4 }}>
            黒田暁生ほか 糖尿病53(6): 391-395, 2010 の食品交換表に基づく計算式
          </p>
        </div>
      )}

      {/* おかずタブ */}
      {tab === 'side' && (
        <div>
          {/* 選択済みおかず */}
          {selectedSides.length > 0 && (
            <div style={{ marginBottom: 12, padding: '12px 14px', background: '#EFF6FF', borderRadius: 14, border: '1.5px solid #BFDBFE' }}>
              <div style={{ fontSize: 11, color: '#3B82F6', fontWeight: 700, marginBottom: 8 }}>選択中のおかず</div>
              {selectedSides.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '5px 0',
                  borderBottom: i < selectedSides.length - 1 ? '1px solid #DBEAFE' : 'none',
                }}>
                  <span style={{ fontSize: 13, color: '#1E40AF' }}>{f.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#2563EB', fontWeight: 700 }}>{f.carbs}g</span>
                    <button onClick={() => removeSide(i)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid #BFDBFE' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>おかず 炭水化物合計</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#2563EB' }}>{sideCarbs}g</span>
              </div>
            </div>
          )}

          {/* 検索 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14,
            padding: '10px 14px', marginBottom: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2.5}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory(null); }}
              placeholder="食品を検索..."
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: '#1E293B', fontSize: 15 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* カテゴリタブ */}
          {!search && (
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 8, scrollbarWidth: 'none' }}>
              {allSideCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  style={{
                    flexShrink: 0, padding: '6px 12px', borderRadius: 20, border: '1.5px solid',
                    borderColor: activeCategory === cat ? '#2563EB' : '#E2E8F0',
                    background: activeCategory === cat ? '#EFF6FF' : '#fff',
                    color: activeCategory === cat ? '#2563EB' : '#64748B',
                    fontSize: 12, fontWeight: activeCategory === cat ? 700 : 500,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* 食品リスト */}
          {searchResults.length > 0 && (
            <div style={{ maxHeight: 240, overflowY: 'auto', borderRadius: 14, border: '1.5px solid #E2E8F0', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              {searchResults.map((food, i) => (
                <button
                  key={i}
                  onClick={() => addSide(food)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 14px', background: 'transparent', border: 'none',
                    borderBottom: i < searchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                    color: '#1E293B', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{food.name}</span>
                  <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>炭水化物 {food.carbs}g</span>
                </button>
              ))}
            </div>
          )}

          {!search && !activeCategory && (
            <p style={{ textAlign: 'center', color: '#CBD5E1', fontSize: 13, marginTop: 8 }}>カテゴリを選択または検索してください</p>
          )}
        </div>
      )}

      {/* 合計バー（両方に入力がある場合） */}
      {totalCarbs > 0 && (
        <div style={{
          marginTop: 14, background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
          borderRadius: 14, padding: '12px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
        }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
            合計炭水化物（主食 {stapleCarbs}g ＋ おかず {sideCarbs}g）
          </span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{totalCarbs}g</span>
        </div>
      )}
    </div>
  );
}
