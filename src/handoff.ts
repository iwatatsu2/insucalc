import type { FoodItem } from './data/foodData';

// 外食カーボ手帖から ?carb=65&name=牛丼並&from=gaishoku で受け取る（端末内のみ・送信なし）
export interface CarbHandoff {
  name: string;
  carbs: number;
}

const MAX_CARBS = 300;
const MAX_NAME = 40;

export function parseCarbHandoff(search: string): CarbHandoff | null {
  const p = new URLSearchParams(search);
  const raw = p.get('carb');
  if (raw === null || !/^\d{1,3}(\.\d)?$/.test(raw.trim())) return null;
  const carbs = Math.round(parseFloat(raw));
  if (!(carbs > 0 && carbs <= MAX_CARBS)) return null;
  // 制御文字を除き、長さを切る（表示はReactがエスケープ）
  const name = (p.get('name') || '外食メニュー').replace(/\p{Cc}/gu, '').trim().slice(0, MAX_NAME) || '外食メニュー';
  return { name, carbs };
}

export function handoffToFood(h: CarbHandoff): FoodItem {
  return { name: `🥢${h.name}`, carbs: h.carbs, category: '外食カーボ手帖', tags: [], source: '外食カーボ手帖' };
}

// 再読み込みで二重に入らないよう、受け取ったらURLから消す
export function clearHandoffParams(): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('carb')) return;
  ['carb', 'name', 'from'].forEach(k => url.searchParams.delete(k));
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}
