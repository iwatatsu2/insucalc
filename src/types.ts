export interface UserSettings {
  cir: number;       // 炭水化物/インスリン比
  isf: number;       // インスリン効果値
  tdd: number;       // 1日総インスリン量
  targetBg: number;  // 目標血糖 mg/dL
  basalDose: number; // 1日ベーサル量
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
}
