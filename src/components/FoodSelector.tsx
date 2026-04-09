import { useState } from 'react';
import { foodData, type FoodItem } from '../data/foodData';

interface Props {
  selectedFoods: FoodItem[];
  onAdd: (food: FoodItem) => void;
  onRemove: (index: number) => void;
}

export default function FoodSelector({ selectedFoods, onAdd, onRemove }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Object.keys(foodData);

  const searchResults = search.trim()
    ? Object.values(foodData).flat().filter(f =>
        f.name.includes(search) || f.tags.some(t => t.includes(search))
      ).slice(0, 20)
    : activeCategory ? foodData[activeCategory] : [];

  const totalCarbs = selectedFoods.reduce((sum, f) => sum + f.carbs, 0);

  return (
    <div>
      {/* 選択済み食事 */}
      {selectedFoods.length > 0 && (
        <div style={{ marginBottom: 12, padding: '12px 14px', background: '#EFF6FF', borderRadius: 14, border: '1.5px solid #BFDBFE' }}>
          <div style={{ fontSize: 11, color: '#3B82F6', fontWeight: 700, marginBottom: 8 }}>選択中の食事</div>
          {selectedFoods.map((f, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '5px 0',
              borderBottom: i < selectedFoods.length - 1 ? '1px solid #DBEAFE' : 'none',
            }}>
              <span style={{ fontSize: 13, color: '#1E40AF' }}>{f.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#2563EB', fontWeight: 700 }}>{f.carbs}g</span>
                <button onClick={() => onRemove(i)} style={{
                  background: 'none', border: 'none', color: '#EF4444',
                  cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px',
                }}>×</button>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid #BFDBFE' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>合計炭水化物</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#2563EB' }}>{totalCarbs}g</span>
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
          placeholder="食事を検索..."
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            color: '#1E293B', fontSize: 15,
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
        )}
      </div>

      {/* カテゴリタブ */}
      {!search && (
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 8, scrollbarWidth: 'none' }}>
          {categories.map(cat => (
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
        <div style={{
          maxHeight: 240, overflowY: 'auto', borderRadius: 14,
          border: '1.5px solid #E2E8F0', background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          {searchResults.map((food, i) => (
            <button
              key={i}
              onClick={() => onAdd(food)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', background: 'transparent', border: 'none',
                borderBottom: i < searchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                color: '#1E293B', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 14 }}>{food.name}</span>
              <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                炭水化物 {food.carbs}g
              </span>
            </button>
          ))}
        </div>
      )}

      {!search && !activeCategory && (
        <p style={{ textAlign: 'center', color: '#CBD5E1', fontSize: 13, marginTop: 8 }}>
          カテゴリを選択または検索してください
        </p>
      )}
    </div>
  );
}
