import { useState, useRef, useEffect, useCallback } from 'react';
import { foodData, type FoodItem } from '../data/foodData';

// 主食の交換表係数
const STAPLE_OPTIONS = [
  { key: 'rice',   label: '米飯',           emoji: '🍚', ratio: 0.40, min: 50,  max: 400, hint: '×40%' },
  { key: 'bread',  label: 'パン・もち',      emoji: '🍞', ratio: 0.50, min: 30,  max: 200, hint: '×50%' },
  { key: 'noodle', label: '麺類（ゆで）・芋類', emoji: '🍜', ratio: 0.20, min: 50,  max: 400, hint: '×20%' },
] as const;

type StapleKey = typeof STAPLE_OPTIONS[number]['key'];

// ---- ホイールピッカー ----
const ITEM_H = 40;
const VISIBLE = 5;

function WheelPicker({
  value, onChange, min, max, step = 10, unit = 'g'
}: {
  value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; unit?: string;
}) {
  const items: number[] = [];
  for (let v = min; v <= max; v += step) items.push(v);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startScroll = useRef(0);
  const isDragging = useRef(false);

  const idx = Math.max(0, items.indexOf(value));

  const scrollToIdx = useCallback((i: number, smooth = true) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: i * ITEM_H,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  useEffect(() => { scrollToIdx(idx, false); }, []); // 初期位置

  const handleScroll = () => {
    if (!containerRef.current || isDragging.current) return;
    const top = containerRef.current.scrollTop;
    const i = Math.round(top / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    if (items[clamped] !== value) onChange(items[clamped]);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScroll.current = containerRef.current?.scrollTop ?? 0;
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    containerRef.current.scrollTop = startScroll.current - (e.clientY - startY.current);
  };
  const onPointerUp = () => {
    isDragging.current = false;
    if (!containerRef.current) return;
    const top = containerRef.current.scrollTop;
    const i = Math.round(top / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    onChange(items[clamped]);
    scrollToIdx(clamped);
  };

  return (
    <div style={{ position: 'relative', height: ITEM_H * VISIBLE, userSelect: 'none' }}>
      {/* 選択枠 */}
      <div style={{
        position: 'absolute', top: ITEM_H * 2, left: 0, right: 0, height: ITEM_H,
        background: 'rgba(37,99,235,0.08)', borderTop: '1.5px solid #BFDBFE',
        borderBottom: '1.5px solid #BFDBFE', borderRadius: 8, pointerEvents: 'none', zIndex: 1,
      }} />
      {/* 上下のグラデーション */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_H * 2, background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), transparent)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_H * 2, background: 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)', zIndex: 1, pointerEvents: 'none' }} />

      {/* スクロールエリア */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          height: '100%', overflowY: 'scroll',
          scrollbarWidth: 'none',
          scrollSnapType: 'y mandatory',
          cursor: 'grab',
        }}
      >
        {/* 上パディング */}
        <div style={{ height: ITEM_H * 2 }} />
        {items.map((v) => (
          <div
            key={v}
            onClick={() => { onChange(v); scrollToIdx(items.indexOf(v)); }}
            style={{
              height: ITEM_H, display: 'flex', alignItems: 'center', justifyContent: 'center',
              scrollSnapAlign: 'center',
              fontSize: v === value ? 17 : 14,
              fontWeight: v === value ? 800 : 400,
              color: v === value ? '#1E293B' : '#94A3B8',
              transition: 'all 0.15s',
            }}
          >
            {v}{unit}
          </div>
        ))}
        {/* 下パディング */}
        <div style={{ height: ITEM_H * 2 }} />
      </div>
    </div>
  );
}

// ---- メインコンポーネント ----
interface Props {
  onChange: (totalCarbs: number, summary: string[]) => void;
}

export default function FoodSelector({ onChange }: Props) {
  const [tab, setTab] = useState<'staple' | 'side'>('staple');

  // 主食: key → grams (0=未選択)
  const [stapleGrams, setStapleGrams] = useState<Record<StapleKey, number>>({ rice: 0, bread: 0, noodle: 0 });
  // 開いているピッカーのキー
  const [openPicker, setOpenPicker] = useState<StapleKey | null>(null);

  const [selectedSides, setSelectedSides] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allSideCategories = Object.keys(foodData);

  const searchResults = search.trim()
    ? Object.values(foodData).flat().filter(f =>
        f.name.includes(search) || f.tags.some(t => t.includes(search))
      ).slice(0, 20)
    : activeCategory ? foodData[activeCategory] : [];

  const stapleCarbs = STAPLE_OPTIONS.reduce((sum, s) => {
    const g = stapleGrams[s.key];
    return sum + (g > 0 ? Math.round(g * s.ratio) : 0);
  }, 0);
  const sideCarbs  = selectedSides.reduce((sum, f) => sum + f.carbs, 0);
  const totalCarbs = stapleCarbs + sideCarbs;

  const notify = (sg: typeof stapleGrams, sides: FoodItem[]) => {
    const sc = STAPLE_OPTIONS.reduce((sum, s) => sum + (sg[s.key] > 0 ? Math.round(sg[s.key] * s.ratio) : 0), 0);
    const sd = sides.reduce((sum, f) => sum + f.carbs, 0);
    const summary: string[] = [];
    STAPLE_OPTIONS.forEach(s => { if (sg[s.key] > 0) summary.push(`${s.emoji}${s.label} ${sg[s.key]}g`); });
    sides.forEach(f => summary.push(f.name));
    onChange(sc + sd, summary);
  };

  const handleStapleGrams = (key: StapleKey, g: number) => {
    const next = { ...stapleGrams, [key]: g };
    setStapleGrams(next);
    notify(next, selectedSides);
  };

  const removeStaple = (key: StapleKey) => {
    const next = { ...stapleGrams, [key]: 0 };
    setStapleGrams(next);
    if (openPicker === key) setOpenPicker(null);
    notify(next, selectedSides);
  };

  const addSide = (food: FoodItem) => {
    const next = [...selectedSides, food];
    setSelectedSides(next); notify(stapleGrams, next);
  };
  const removeSide = (i: number) => {
    const next = selectedSides.filter((_, idx) => idx !== i);
    setSelectedSides(next); notify(stapleGrams, next);
  };

  return (
    <div>
      {/* タブ */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[
          { key: 'staple', label: '🍚 主食', sub: `${stapleCarbs}g` },
          { key: 'side',   label: '🍱 おかず', sub: `${sideCarbs}g` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as 'staple' | 'side')} style={{
            flex: 1, padding: '10px 8px', borderRadius: 14,
            border: `1.5px solid ${tab === t.key ? '#2563EB' : '#E2E8F0'}`,
            background: tab === t.key ? '#EFF6FF' : '#fff',
            color: tab === t.key ? '#2563EB' : '#64748B',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span>{t.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>炭水化物 {t.sub}</span>
          </button>
        ))}
      </div>

      {/* 主食タブ */}
      {tab === 'staple' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STAPLE_OPTIONS.map(opt => {
            const g = stapleGrams[opt.key];
            const isOpen = openPicker === opt.key;
            const isSelected = g > 0;

            return (
              <div key={opt.key}>
                {/* 選択ボタン行 */}
                <button
                  onClick={() => setOpenPicker(isOpen ? null : opt.key)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: isOpen ? '14px 14px 0 0' : 14,
                    border: `1.5px solid ${isSelected ? '#BFDBFE' : '#E2E8F0'}`,
                    borderBottom: isOpen ? '1px solid #EFF6FF' : undefined,
                    background: isSelected ? '#EFF6FF' : '#fff',
                    cursor: 'pointer', textAlign: 'left',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#1E40AF' : '#1E293B' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>
                        {isSelected ? `${g}g → 炭水化物 ${Math.round(g * opt.ratio)}g` : 'タップして量を選択'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isSelected && (
                      <button
                        onClick={e => { e.stopPropagation(); removeStaple(opt.key); }}
                        style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, width: 24, height: 24, color: '#EF4444', cursor: 'pointer', fontSize: 13 }}
                      >×</button>
                    )}
                    <span style={{ fontSize: 14, color: '#94A3B8' }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* ホイールピッカー（展開） */}
                {isOpen && (
                  <div style={{
                    border: '1.5px solid #BFDBFE', borderTop: 'none',
                    borderRadius: '0 0 14px 14px',
                    background: '#fff', padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.08)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <WheelPicker
                          value={g > 0 ? g : opt.min}
                          onChange={v => handleStapleGrams(opt.key, v)}
                          min={opt.min} max={opt.max} step={10} unit="g"
                        />
                      </div>
                      <div style={{ textAlign: 'center', minWidth: 72 }}>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>炭水化物</div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: '#2563EB', lineHeight: 1 }}>
                          {g > 0 ? Math.round(g * opt.ratio) : Math.round(opt.min * opt.ratio)}
                        </div>
                        <div style={{ fontSize: 13, color: '#94A3B8' }}>g</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (g === 0) handleStapleGrams(opt.key, opt.min);
                        setOpenPicker(null);
                      }}
                      style={{
                        width: '100%', marginTop: 10, padding: '10px',
                        background: '#2563EB', color: '#fff', border: 'none',
                        borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      決定
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <p style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: 2 }}>
            黒田暁生ほか 糖尿病53(6): 391-395, 2010 の食品交換表に基づく
          </p>
        </div>
      )}

      {/* おかずタブ */}
      {tab === 'side' && (
        <div>
          {selectedSides.length > 0 && (
            <div style={{ marginBottom: 12, padding: '12px 14px', background: '#EFF6FF', borderRadius: 14, border: '1.5px solid #BFDBFE' }}>
              <div style={{ fontSize: 11, color: '#3B82F6', fontWeight: 700, marginBottom: 8 }}>選択中のおかず</div>
              {selectedSides.map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: i < selectedSides.length - 1 ? '1px solid #DBEAFE' : 'none' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '10px 14px', marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2.5}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory(null); }}
              placeholder="ステーキ・焼き魚・唐揚げ…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: '#1E293B', fontSize: 15 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
            )}
          </div>

          {!search && (
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 8, scrollbarWidth: 'none' }}>
              {allSideCategories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)} style={{
                  flexShrink: 0, padding: '6px 12px', borderRadius: 20, border: '1.5px solid',
                  borderColor: activeCategory === cat ? '#2563EB' : '#E2E8F0',
                  background: activeCategory === cat ? '#EFF6FF' : '#fff',
                  color: activeCategory === cat ? '#2563EB' : '#64748B',
                  fontSize: 12, fontWeight: activeCategory === cat ? 700 : 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {searchResults.length > 0 && (
            <div style={{ maxHeight: 260, overflowY: 'auto', borderRadius: 14, border: '1.5px solid #E2E8F0', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              {searchResults.map((food, i) => (
                <button key={i} onClick={() => addSide(food)} style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px', background: 'transparent', border: 'none',
                  borderBottom: i < searchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                  color: '#1E293B', cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 14 }}>{food.name}</span>
                  <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                    炭水化物 {food.carbs}g
                  </span>
                </button>
              ))}
            </div>
          )}

          {!search && !activeCategory && (
            <p style={{ textAlign: 'center', color: '#CBD5E1', fontSize: 13, marginTop: 8 }}>カテゴリを選択または検索してください</p>
          )}
        </div>
      )}

      {/* 合計バー */}
      {totalCarbs > 0 && (
        <div style={{
          marginTop: 14, background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
          borderRadius: 14, padding: '12px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
            合計（主食 {stapleCarbs}g ＋ おかず {sideCarbs}g）
          </span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{totalCarbs}g</span>
        </div>
      )}
    </div>
  );
}
