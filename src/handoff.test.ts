import { describe, it, expect } from 'vitest';
import { parseCarbHandoff, handoffToFood } from './handoff';

describe('parseCarbHandoff', () => {
  it('カーボ量と料理名を受け取る', () => {
    expect(parseCarbHandoff('?carb=65&name=%E7%89%9B%E4%B8%BC%E4%B8%A6&from=gaishoku')).toEqual({ name: '牛丼並', carbs: 65 });
  });
  it('小数は四捨五入', () => {
    expect(parseCarbHandoff('?carb=42.6')?.carbs).toBe(43);
  });
  it('名前なしは「外食メニュー」', () => {
    expect(parseCarbHandoff('?carb=30')?.name).toBe('外食メニュー');
  });
  it('パラメータなし・不正値・範囲外は無視', () => {
    for (const s of ['', '?name=a', '?carb=', '?carb=abc', '?carb=0', '?carb=-5', '?carb=301', '?carb=1e3', '?carb=50g']) {
      expect(parseCarbHandoff(s)).toBeNull();
    }
  });
  it('長い名前は40字で切り、制御文字を除く', () => {
    const h = parseCarbHandoff(`?carb=10&name=${encodeURIComponent('あ'.repeat(60) + '\n')}`);
    expect(h?.name).toBe('あ'.repeat(40));
  });
  it('FoodItemに変換', () => {
    expect(handoffToFood({ name: 'ラーメン', carbs: 70 })).toMatchObject({ name: '🥢ラーメン', carbs: 70, category: '外食カーボ手帖' });
  });
});
