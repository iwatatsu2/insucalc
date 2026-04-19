import { describe, it, expect } from 'vitest';
import { foodData, allFoods } from './foodData';

// ============================================================
// 日本食品標準成分表2020年版（八訂）公式値との照合テーブル
// 利用可能炭水化物（質量計）g/100g を基準
// https://fooddb.mext.go.jp/
// ============================================================
const HACHITEI_REFERENCE: Record<string, { per100g: number; note: string }> = {
  // --- 穀類 ---
  '精白米（水稲めし）': { per100g: 35.6, note: '白米の基準' },
  '玄米（水稲めし）': { per100g: 34.2, note: '玄米の基準' },
  '食パン': { per100g: 44.4, note: '食パンの基準' },
  'クロワッサン': { per100g: 42.0, note: 'クロワッサンの基準' },
  'フランスパン': { per100g: 57.5, note: 'バゲットの基準' },
  'ロールパン': { per100g: 48.6, note: 'ロールパンの基準' },
  'あんぱん': { per100g: 51.7, note: 'あんぱんの基準' },
  'クリームパン': { per100g: 45.5, note: 'クリームパンの基準' },
  'メロンパン': { per100g: 58.2, note: 'メロンパンの基準' },
  // --- 麺類 ---
  '中華めん（ゆで）': { per100g: 27.9, note: 'ラーメン・焼きそばの基準' },
  'うどん（ゆで）': { per100g: 20.8, note: 'うどんの基準' },
  'そば（ゆで）': { per100g: 23.1, note: 'そばの基準' },
  'スパゲッティ（ゆで）': { per100g: 30.3, note: 'パスタの基準' },
  // --- 肉まん ---
  '肉まん': { per100g: 35.5, note: '肉まんの基準' },
  'あんまん': { per100g: 44.3, note: 'あんまんの基準' },
  // --- スイーツ ---
  'ショートケーキ': { per100g: 44.4, note: 'ショートケーキの基準' },
  'チーズケーキ': { per100g: 24.3, note: 'チーズケーキの基準' },
  'シュークリーム': { per100g: 25.9, note: 'シュークリームの基準' },
  'どら焼き': { per100g: 55.5, note: 'どら焼きの基準' },
  '大福もち': { per100g: 50.2, note: '大福の基準' },
  'みたらし団子': { per100g: 42.6, note: 'みたらし団子の基準' },
  'ドーナツ（イースト）': { per100g: 42.5, note: 'ドーナツの基準' },
  // --- 果物 ---
  'バナナ': { per100g: 21.4, note: 'バナナの基準' },
  'りんご（皮なし）': { per100g: 14.3, note: 'りんごの基準' },
  'みかん': { per100g: 11.0, note: 'みかんの基準' },
  'ぶどう（皮なし）': { per100g: 15.2, note: 'ぶどうの基準' },
  'いちご': { per100g: 7.1, note: 'いちごの基準' },
  // --- 飲料 ---
  '牛乳': { per100g: 4.8, note: '牛乳 /100ml' },
  // --- その他 ---
  'フライドポテト': { per100g: 38.4, note: 'フライドポテトの基準' },
  'たこ焼き': { per100g: 23.1, note: 'たこ焼きの基準' },
  'お好み焼き': { per100g: 21.3, note: 'お好み焼きの基準' },
};

// 八訂値から計算される期待値と実際のデータの照合
// { foodName, expectedCarbs, tolerance }
const VERIFICATION_TABLE = [
  // 白米: 35.6g/100g
  { name: '白米 小（100g）', expected: 36, tol: 1 },
  { name: '白米 中（150g）', expected: 53, tol: 2 },
  { name: '白米 大（200g）', expected: 71, tol: 2 },
  { name: '白米 特盛（250g）', expected: 89, tol: 2 },
  { name: '玄米 150g', expected: 51, tol: 2 },
  // 食パン: 44.4g/100g
  { name: '食パン 6枚切り1枚（60g）', expected: 27, tol: 1 },
  { name: '食パン 8枚切り1枚（45g）', expected: 20, tol: 1 },
  { name: '食パン 4枚切り1枚（90g）', expected: 40, tol: 1 },
  // クロワッサン: 42.0g/100g × 45g
  { name: 'クロワッサン 1個（45g）', expected: 19, tol: 1 },
  // バゲット: 57.5g/100g × 60g
  { name: 'バゲット 3切れ（60g）', expected: 35, tol: 1 },
  // あんぱん: 51.7g/100g × 90g
  { name: 'あんぱん 1個（90g）', expected: 47, tol: 1 },
  // メロンパン: 58.2g/100g × 100g
  { name: 'メロンパン 1個（100g）', expected: 58, tol: 1 },
  // うどん: 20.8g/100g × 250g
  { name: 'うどん（かけ）', expected: 52, tol: 2 },
  // そば: 23.1g/100g × 200g
  { name: 'そば（もり）', expected: 46, tol: 2 },
  // パスタ: 30.3g/100g × 200g
  { name: 'パスタ（ペペロンチーノ）', expected: 61, tol: 2 },
  // バナナ: 21.4g/100g × 100g
  { name: 'バナナ 1本（中・100g）', expected: 21, tol: 1 },
  // りんご: 14.3g/100g × 125g
  { name: 'りんご 1/2個（125g）', expected: 18, tol: 1 },
  // 牛乳: 4.8g/100ml × 200ml
  { name: '牛乳 200ml', expected: 10, tol: 1 },
  // フライドポテト M: 38.4g/100g × 135g
  { name: 'フライドポテト M（135g）', expected: 52, tol: 2 },
  // たこ焼き: 23.1g/100g × 160g
  { name: 'たこ焼き 8個（160g）', expected: 37, tol: 2 },
  // ショートケーキ: 44.4g/100g × 100g
  { name: 'ショートケーキ 1個（100g）', expected: 44, tol: 1 },
  // 大福: 50.2g/100g × 60g
  { name: '大福 1個（60g）', expected: 30, tol: 1 },
  // どら焼き: 55.5g/100g × 90g
  { name: 'どら焼き 1個（90g）', expected: 50, tol: 1 },
];

// カテゴリ別の妥当な炭水化物量の範囲
const CATEGORY_RANGES: Record<string, { min: number; max: number }> = {
  '主食': { min: 30, max: 120 },
  'おにぎり・パン': { min: 15, max: 55 },
  '菓子パン・軽食': { min: 25, max: 70 },
  '麺類': { min: 40, max: 70 },
  '丼・定食': { min: 50, max: 120 },
  'ファストフード': { min: 10, max: 100 },
  'コンビニ食品': { min: 1, max: 90 },
  'スイーツ': { min: 5, max: 60 },
  '飲料': { min: 0, max: 60 },
  '果物': { min: 10, max: 45 },
  'おかず・主菜': { min: 0, max: 25 },
  '副菜・汁物': { min: 0, max: 20 },
};

// ============================================================
// テスト
// ============================================================

describe('foodData 基本構造', () => {
  it('全食品に必須フィールドがある', () => {
    for (const food of allFoods) {
      expect(food.name).toBeTruthy();
      expect(typeof food.carbs).toBe('number');
      expect(food.carbs).toBeGreaterThanOrEqual(0);
      expect(food.category).toBeTruthy();
      expect(Array.isArray(food.tags)).toBe(true);
    }
  });

  it('食品名が重複していない', () => {
    const names = allFoods.map(f => f.name);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    expect(dupes).toEqual([]);
  });

  it('categoryフィールドがfoodDataのキーと一致する', () => {
    for (const [key, items] of Object.entries(foodData)) {
      for (const item of items) {
        expect(item.category).toBe(key);
      }
    }
  });

  it('sourceは「八訂」または「推計」のみ', () => {
    for (const food of allFoods) {
      if (food.source) {
        expect(['八訂', '推計']).toContain(food.source);
      }
    }
  });
});

describe('八訂データ照合（公式値との突合）', () => {
  for (const v of VERIFICATION_TABLE) {
    it(`${v.name} → 期待値 ${v.expected}g ± ${v.tol}g`, () => {
      const food = allFoods.find(f => f.name === v.name);
      expect(food).toBeDefined();
      expect(food!.carbs).toBeGreaterThanOrEqual(v.expected - v.tol);
      expect(food!.carbs).toBeLessThanOrEqual(v.expected + v.tol);
    });
  }
});

describe('カテゴリ別 炭水化物量レンジチェック', () => {
  for (const [category, range] of Object.entries(CATEGORY_RANGES)) {
    it(`「${category}」の全食品が ${range.min}〜${range.max}g の範囲内`, () => {
      const items = foodData[category];
      if (!items) return;
      for (const food of items) {
        expect(
          food.carbs >= range.min && food.carbs <= range.max,
          `${food.name}: ${food.carbs}g が範囲外 (${range.min}〜${range.max}g)`
        ).toBe(true);
      }
    });
  }
});

describe('異常値検出', () => {
  it('炭水化物が150gを超える食品がない', () => {
    const extreme = allFoods.filter(f => f.carbs > 150);
    expect(extreme.map(f => `${f.name}: ${f.carbs}g`)).toEqual([]);
  });

  it('おかず・主菜で炭水化物が30gを超える食品がない（主食混入の可能性）', () => {
    const suspicious = (foodData['おかず・主菜'] || []).filter(f => f.carbs > 30);
    expect(suspicious.map(f => `${f.name}: ${f.carbs}g`)).toEqual([]);
  });

  it('副菜・汁物で炭水化物が25gを超える食品がない', () => {
    const suspicious = (foodData['副菜・汁物'] || []).filter(f => f.carbs > 25);
    expect(suspicious.map(f => `${f.name}: ${f.carbs}g`)).toEqual([]);
  });
});
