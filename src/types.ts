export interface UserSettings {
  cirMorning: number; // 朝（5〜10時）の炭水化物/インスリン比
  cirNoon: number;    // 昼（11〜16時）の炭水化物/インスリン比
  cirEvening: number; // 夜（17〜翌4時）の炭水化物/インスリン比
  isf: number;        // インスリン効果値
  tdd: number;        // 1日総インスリン量
  targetBg: number;   // 目標血糖 mg/dL
  basalDose: number;  // 1日ベーサル量
}

export interface HistoryEntry {
  id: string;
  date: string;
  time: string;
  foods: string[];
  totalCarbs: number;
  currentBg: number;
  mealBolus: number;
  correctionBolus: number;
  totalBolus: number;
  actualBolus?: number; // 実際に打った単位（修正後）
  memo?: string;
}
