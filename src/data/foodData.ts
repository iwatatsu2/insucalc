// 炭水化物量の出典：日本食品標準成分表2020年版（八訂）文部科学省
// 利用可能炭水化物（質量計）を基準に1食量で計算
// 外食・複合料理は各成分の積算値。±10%の誤差を含む場合あり。

export interface FoodItem {
  name: string;
  carbs: number;
  category: string;
  tags: string[];
  source?: string; // "官公庁DB" | "推計"
}

export const foodData: Record<string, FoodItem[]> = {
  "主食": [
    // 精白米 水稲めし: 35.6g/100g（八訂）
    { name: "白米 小（100g）", carbs: 36, category: "主食", tags: ["和食", "主食"], source: "八訂" },
    { name: "白米 中（150g）", carbs: 53, category: "主食", tags: ["和食", "主食"], source: "八訂" },
    { name: "白米 大（200g）", carbs: 71, category: "主食", tags: ["和食", "主食", "高糖質"], source: "八訂" },
    { name: "白米 特盛（250g）", carbs: 89, category: "主食", tags: ["和食", "主食", "高糖質"], source: "八訂" },
    // 玄米 水稲めし: 34.2g/100g（八訂）
    { name: "玄米 150g", carbs: 51, category: "主食", tags: ["和食", "主食"], source: "八訂" },
    // もち米: 35.1g/100g（おこわ）
    { name: "もち米おこわ 150g", carbs: 53, category: "主食", tags: ["和食", "主食"], source: "八訂" },
    { name: "雑穀ご飯 150g", carbs: 50, category: "主食", tags: ["和食", "主食"], source: "推計" },
    { name: "チャーハン 1人前", carbs: 65, category: "主食", tags: ["中華", "主食", "高糖質"], source: "推計" },
    { name: "ピラフ 1人前", carbs: 62, category: "主食", tags: ["洋食", "主食"], source: "推計" },
    { name: "オムライス 1人前", carbs: 70, category: "主食", tags: ["洋食", "主食", "高糖質"], source: "推計" },
    { name: "リゾット 1人前", carbs: 46, category: "主食", tags: ["洋食", "主食"], source: "推計" },
    { name: "ドリア 1人前", carbs: 53, category: "主食", tags: ["洋食", "主食"], source: "推計" },
    // 赤飯: 39.7g/100g（八訂）
    { name: "赤飯 150g", carbs: 60, category: "主食", tags: ["和食", "主食"], source: "八訂" },
    { name: "寿司 8貫", carbs: 58, category: "主食", tags: ["和食", "主食"], source: "推計" },
    { name: "手巻き寿司 2本", carbs: 38, category: "主食", tags: ["和食", "主食"], source: "推計" },
  ],
  "おにぎり・パン": [
    // コンビニおにぎり（米約100g使用）: 35.6g/100g
    { name: "おにぎり 梅（コンビニ）", carbs: 37, category: "おにぎり・パン", tags: ["和食", "コンビニ"], source: "八訂" },
    { name: "おにぎり ツナマヨ（コンビニ）", carbs: 37, category: "おにぎり・パン", tags: ["和食", "コンビニ"], source: "八訂" },
    { name: "おにぎり 鮭（コンビニ）", carbs: 37, category: "おにぎり・パン", tags: ["和食", "コンビニ"], source: "八訂" },
    { name: "おにぎり 昆布（コンビニ）", carbs: 37, category: "おにぎり・パン", tags: ["和食", "コンビニ"], source: "八訂" },
    { name: "大きめおにぎり 1個（140g）", carbs: 50, category: "おにぎり・パン", tags: ["和食"], source: "八訂" },
    // 食パン: 44.4g/100g（八訂）。6枚切り1枚=60g, 8枚切り=45g, 4枚切り=90g
    { name: "食パン 6枚切り1枚（60g）", carbs: 27, category: "おにぎり・パン", tags: ["パン"], source: "八訂" },
    { name: "食パン 8枚切り1枚（45g）", carbs: 20, category: "おにぎり・パン", tags: ["パン"], source: "八訂" },
    { name: "食パン 4枚切り1枚（90g）", carbs: 40, category: "おにぎり・パン", tags: ["パン", "高糖質"], source: "八訂" },
    { name: "トースト 6枚切り1枚（バター）", carbs: 27, category: "おにぎり・パン", tags: ["パン"], source: "八訂" },
    // クロワッサン: 42.0g/100g（八訂）。1個=45g
    { name: "クロワッサン 1個（45g）", carbs: 19, category: "おにぎり・パン", tags: ["パン"], source: "八訂" },
    // フランスパン: 57.5g/100g（八訂）。3切れ=60g
    { name: "バゲット 3切れ（60g）", carbs: 35, category: "おにぎり・パン", tags: ["パン"], source: "八訂" },
    // ロールパン: 48.6g/100g（八訂）。1個=30g×2
    { name: "ロールパン 2個（60g）", carbs: 29, category: "おにぎり・パン", tags: ["パン"], source: "八訂" },
    { name: "イングリッシュマフィン 1個（60g）", carbs: 26, category: "おにぎり・パン", tags: ["パン"], source: "八訂" },
    { name: "ベーグル 1個（90g）", carbs: 48, category: "おにぎり・パン", tags: ["パン", "高糖質"], source: "推計" },
  ],
  "菓子パン・軽食": [
    // あんぱん: 51.7g/100g（八訂）。1個=90g
    { name: "あんぱん 1個（90g）", carbs: 47, category: "菓子パン・軽食", tags: ["パン", "高糖質"], source: "八訂" },
    // クリームパン: 45.5g/100g（八訂）。1個=80g
    { name: "クリームパン 1個（80g）", carbs: 36, category: "菓子パン・軽食", tags: ["パン"], source: "八訂" },
    // メロンパン: 58.2g/100g（八訂）。1個=100g
    { name: "メロンパン 1個（100g）", carbs: 58, category: "菓子パン・軽食", tags: ["パン", "高糖質"], source: "八訂" },
    { name: "チョココルネ 1個（80g）", carbs: 38, category: "菓子パン・軽食", tags: ["パン"], source: "推計" },
    { name: "カレーパン 1個（100g）", carbs: 36, category: "菓子パン・軽食", tags: ["パン"], source: "推計" },
    { name: "惣菜パン（ウインナー）1個", carbs: 28, category: "菓子パン・軽食", tags: ["パン"], source: "推計" },
    { name: "サンドイッチ（ツナ）1パック", carbs: 30, category: "菓子パン・軽食", tags: ["パン", "コンビニ"], source: "推計" },
    { name: "サンドイッチ（BLT）1パック", carbs: 32, category: "菓子パン・軽食", tags: ["パン", "コンビニ"], source: "推計" },
    { name: "ホットドッグ 1本", carbs: 28, category: "菓子パン・軽食", tags: ["パン", "コンビニ"], source: "推計" },
    // 肉まん: 35.5g/100g（八訂）。1個=90g
    { name: "肉まん 1個（90g）", carbs: 32, category: "菓子パン・軽食", tags: ["中華", "コンビニ"], source: "八訂" },
    // あんまん: 44.3g/100g（八訂）。1個=90g
    { name: "あんまん 1個（90g）", carbs: 40, category: "菓子パン・軽食", tags: ["中華", "コンビニ", "高糖質"], source: "八訂" },
    { name: "ピザまん 1個（90g）", carbs: 30, category: "菓子パン・軽食", tags: ["中華", "コンビニ"], source: "推計" },
    // ホットケーキ: 44.7g/100g（八訂）。2枚=150g
    { name: "ホットケーキ 2枚（150g）", carbs: 67, category: "菓子パン・軽食", tags: ["洋食", "高糖質"], source: "八訂" },
    { name: "ワッフル 2個（100g）", carbs: 43, category: "菓子パン・軽食", tags: ["洋食", "高糖質"], source: "推計" },
  ],
  "麺類": [
    // 中華めん（ゆで）: 27.9g/100g（八訂）。ラーメン1杯=麺200g+スープ
    { name: "ラーメン（醤油）", carbs: 58, category: "麺類", tags: ["外食", "高糖質"], source: "八訂" },
    { name: "ラーメン（豚骨）", carbs: 59, category: "麺類", tags: ["外食", "高糖質"], source: "八訂" },
    { name: "ラーメン（味噌）", carbs: 60, category: "麺類", tags: ["外食", "高糖質"], source: "八訂" },
    { name: "つけ麺 1人前", carbs: 68, category: "麺類", tags: ["外食", "高糖質"], source: "推計" },
    // うどん（ゆで）: 20.8g/100g（八訂）。1人前=250g
    { name: "うどん（かけ）", carbs: 52, category: "麺類", tags: ["和食", "高糖質"], source: "八訂" },
    { name: "うどん（ざる）", carbs: 52, category: "麺類", tags: ["和食", "高糖質"], source: "八訂" },
    { name: "うどん（肉）", carbs: 54, category: "麺類", tags: ["和食", "高糖質"], source: "八訂" },
    { name: "天ぷらうどん", carbs: 62, category: "麺類", tags: ["和食", "高糖質"], source: "八訂" },
    // そば（ゆで）: 23.1g/100g（八訂）。1人前=200g
    { name: "そば（もり）", carbs: 46, category: "麺類", tags: ["和食"], source: "八訂" },
    { name: "そば（かけ）", carbs: 46, category: "麺類", tags: ["和食"], source: "八訂" },
    { name: "そば（天ぷら）", carbs: 56, category: "麺類", tags: ["和食", "高糖質"], source: "八訂" },
    // 中華めん（ゆで）焼きそば: 27.9g/100g×200g
    { name: "焼きそば 1人前", carbs: 56, category: "麺類", tags: ["外食", "高糖質"], source: "八訂" },
    // スパゲッティ（ゆで）: 30.3g/100g（八訂）。1人前=200g
    { name: "パスタ（ナポリタン）", carbs: 65, category: "麺類", tags: ["洋食", "高糖質"], source: "八訂" },
    { name: "パスタ（カルボナーラ）", carbs: 61, category: "麺類", tags: ["洋食", "高糖質"], source: "八訂" },
    { name: "パスタ（ペペロンチーノ）", carbs: 61, category: "麺類", tags: ["洋食", "高糖質"], source: "八訂" },
    { name: "パスタ（ミートソース）", carbs: 63, category: "麺類", tags: ["洋食", "高糖質"], source: "八訂" },
    { name: "パスタ（ボンゴレ）", carbs: 61, category: "麺類", tags: ["洋食", "高糖質"], source: "八訂" },
    { name: "冷やし中華", carbs: 57, category: "麺類", tags: ["中華", "高糖質"], source: "推計" },
    { name: "担々麺", carbs: 58, category: "麺類", tags: ["中華", "高糖質"], source: "推計" },
    // インスタントラーメン（油揚げめん）: 64.7g/100g（八訂）。1袋=80g
    { name: "インスタントラーメン（袋）", carbs: 52, category: "麺類", tags: ["高糖質"], source: "八訂" },
    // カップヌードル（日清）: 公式栄養成分より44g
    { name: "カップヌードル 1個", carbs: 44, category: "麺類", tags: ["コンビニ"], source: "推計" },
    { name: "カップ焼きそば 1個", carbs: 60, category: "麺類", tags: ["コンビニ", "高糖質"], source: "推計" },
  ],
  "丼・定食": [
    // 牛丼：米150g(53g)+具材。吉野家公式値を参考
    { name: "牛丼 並（米160g）", carbs: 76, category: "丼・定食", tags: ["外食", "高糖質"], source: "推計" },
    { name: "牛丼 大盛（米240g）", carbs: 105, category: "丼・定食", tags: ["外食", "高糖質"], source: "推計" },
    { name: "牛丼 小盛（米120g）", carbs: 57, category: "丼・定食", tags: ["外食"], source: "推計" },
    { name: "親子丼（米160g）", carbs: 70, category: "丼・定食", tags: ["和食", "外食", "高糖質"], source: "推計" },
    { name: "カツ丼（米160g）", carbs: 83, category: "丼・定食", tags: ["和食", "外食", "高糖質"], source: "推計" },
    { name: "天丼（米160g）", carbs: 79, category: "丼・定食", tags: ["和食", "外食", "高糖質"], source: "推計" },
    { name: "海鮮丼（米160g）", carbs: 65, category: "丼・定食", tags: ["和食", "外食", "高糖質"], source: "推計" },
    { name: "うな丼（米160g）", carbs: 68, category: "丼・定食", tags: ["和食", "外食", "高糖質"], source: "推計" },
    { name: "カレーライス（普通・米200g）", carbs: 88, category: "丼・定食", tags: ["外食", "高糖質"], source: "推計" },
    { name: "カレーライス（大盛・米300g）", carbs: 113, category: "丼・定食", tags: ["外食", "高糖質"], source: "推計" },
    { name: "カレーライス（子ども量・米150g）", carbs: 62, category: "丼・定食", tags: ["外食", "高糖質"], source: "推計" },
    { name: "カツカレー（米200g）", carbs: 100, category: "丼・定食", tags: ["外食", "高糖質"], source: "推計" },
    { name: "焼き魚定食（ご飯中150g）", carbs: 55, category: "丼・定食", tags: ["和食", "外食"], source: "推計" },
    { name: "唐揚げ定食（ご飯中150g）", carbs: 63, category: "丼・定食", tags: ["和食", "外食"], source: "推計" },
    { name: "とんかつ定食（ご飯中150g）", carbs: 66, category: "丼・定食", tags: ["和食", "外食"], source: "推計" },
    { name: "生姜焼き定食（ご飯中150g）", carbs: 60, category: "丼・定食", tags: ["和食", "外食"], source: "推計" },
    { name: "ハンバーグ定食（ご飯中150g）", carbs: 63, category: "丼・定食", tags: ["洋食", "外食"], source: "推計" },
    { name: "麻婆豆腐定食（ご飯中150g）", carbs: 63, category: "丼・定食", tags: ["中華", "外食"], source: "推計" },
    { name: "チャーハン定食（ご飯大盛）", carbs: 85, category: "丼・定食", tags: ["中華", "外食", "高糖質"], source: "推計" },
    { name: "回鍋肉定食（ご飯中150g）", carbs: 60, category: "丼・定食", tags: ["中華", "外食"], source: "推計" },
  ],
  "ファストフード": [
    { name: "ハンバーガー 1個", carbs: 28, category: "ファストフード", tags: ["外食"], source: "推計" },
    { name: "チーズバーガー 1個", carbs: 30, category: "ファストフード", tags: ["外食"], source: "推計" },
    { name: "ビッグマック 1個", carbs: 45, category: "ファストフード", tags: ["外食"], source: "推計" },
    { name: "フィレオフィッシュ 1個", carbs: 38, category: "ファストフード", tags: ["外食"], source: "推計" },
    { name: "テリヤキバーガー 1個", carbs: 38, category: "ファストフード", tags: ["外食"], source: "推計" },
    // フライドポテト: 38.4g/100g（八訂）。M=135g, L=170g
    { name: "フライドポテト M（135g）", carbs: 52, category: "ファストフード", tags: ["外食", "高糖質"], source: "八訂" },
    { name: "フライドポテト L（170g）", carbs: 65, category: "ファストフード", tags: ["外食", "高糖質"], source: "八訂" },
    { name: "ハンバーガーセット（バーガー+ポテトM）", carbs: 80, category: "ファストフード", tags: ["外食", "高糖質"], source: "推計" },
    { name: "チキンナゲット 6個", carbs: 16, category: "ファストフード", tags: ["外食"], source: "推計" },
    { name: "モスバーガー 1個", carbs: 32, category: "ファストフード", tags: ["外食"], source: "推計" },
    { name: "モスライスバーガー 1個", carbs: 40, category: "ファストフード", tags: ["外食", "高糖質"], source: "推計" },
    { name: "ピザ Mサイズ 1切れ（マルゲリータ）", carbs: 28, category: "ファストフード", tags: ["外食"], source: "推計" },
    { name: "ピザ Mサイズ 2切れ", carbs: 56, category: "ファストフード", tags: ["外食", "高糖質"], source: "推計" },
    { name: "ケンタッキー チキン2本+ビスケット", carbs: 35, category: "ファストフード", tags: ["外食"], source: "推計" },
    { name: "サブウェイ サンドイッチ（15cm）", carbs: 48, category: "ファストフード", tags: ["外食"], source: "推計" },
    // たこ焼き: 23.1g/100g（八訂）。8個=160g
    { name: "たこ焼き 8個（160g）", carbs: 37, category: "ファストフード", tags: ["外食"], source: "八訂" },
    // お好み焼き: 21.3g/100g（八訂）。1枚=200g
    { name: "お好み焼き 1枚（200g）", carbs: 43, category: "ファストフード", tags: ["外食", "高糖質"], source: "八訂" },
  ],
  "コンビニ食品": [
    { name: "幕の内弁当", carbs: 80, category: "コンビニ食品", tags: ["コンビニ", "高糖質"], source: "推計" },
    { name: "のり弁当", carbs: 85, category: "コンビニ食品", tags: ["コンビニ", "高糖質"], source: "推計" },
    { name: "からあげ弁当", carbs: 76, category: "コンビニ食品", tags: ["コンビニ", "高糖質"], source: "推計" },
    { name: "チキン南蛮弁当", carbs: 78, category: "コンビニ食品", tags: ["コンビニ", "高糖質"], source: "推計" },
    { name: "ハンバーグ弁当", carbs: 73, category: "コンビニ食品", tags: ["コンビニ", "高糖質"], source: "推計" },
    { name: "チャーハン弁当", carbs: 83, category: "コンビニ食品", tags: ["コンビニ", "高糖質"], source: "推計" },
    { name: "パスタ弁当（ナポリタン）", carbs: 65, category: "コンビニ食品", tags: ["コンビニ", "高糖質"], source: "推計" },
    { name: "カップ味噌汁", carbs: 4, category: "コンビニ食品", tags: ["コンビニ"], source: "推計" },
    // うどん（冷凍・ゆで）: 20.8g/100g×250g
    { name: "冷凍うどん（1袋・250g）", carbs: 52, category: "コンビニ食品", tags: ["コンビニ", "高糖質"], source: "八訂" },
    { name: "サラダチキン 1個", carbs: 1, category: "コンビニ食品", tags: ["コンビニ", "低糖質"], source: "推計" },
    { name: "ゆで卵 2個", carbs: 1, category: "コンビニ食品", tags: ["コンビニ", "低糖質"], source: "八訂" },
    { name: "シュウマイ 4個", carbs: 18, category: "コンビニ食品", tags: ["コンビニ"], source: "推計" },
    { name: "春巻き 2本", carbs: 20, category: "コンビニ食品", tags: ["コンビニ"], source: "推計" },
    // プリン: 14.9g/100g（八訂）。1個=100g
    { name: "コンビニプリン 1個（100g）", carbs: 15, category: "コンビニ食品", tags: ["コンビニ", "スイーツ"], source: "八訂" },
    { name: "フルーツゼリー", carbs: 20, category: "コンビニ食品", tags: ["コンビニ", "スイーツ"], source: "推計" },
    // ヨーグルト（全脂・加糖）: 11.9g/100g（八訂）。1個=100g
    { name: "ヨーグルト（加糖）1個（100g）", carbs: 12, category: "コンビニ食品", tags: ["コンビニ"], source: "八訂" },
    // ヨーグルト（全脂・無糖）: 4.9g/100g（八訂）
    { name: "ヨーグルト（無糖）1個（100g）", carbs: 5, category: "コンビニ食品", tags: ["コンビニ", "低糖質"], source: "八訂" },
  ],
  "スイーツ": [
    // ショートケーキ: 44.4g/100g（八訂）。1個=100g
    { name: "ショートケーキ 1個（100g）", carbs: 44, category: "スイーツ", tags: ["スイーツ", "高糖質"], source: "八訂" },
    { name: "チョコケーキ 1個（100g）", carbs: 38, category: "スイーツ", tags: ["スイーツ", "高糖質"], source: "推計" },
    { name: "モンブラン 1個（100g）", carbs: 45, category: "スイーツ", tags: ["スイーツ", "高糖質"], source: "推計" },
    // チーズケーキ: 24.3g/100g（八訂）。1個=100g
    { name: "チーズケーキ 1個（100g）", carbs: 24, category: "スイーツ", tags: ["スイーツ"], source: "八訂" },
    // シュークリーム: 25.9g/100g（八訂）。1個=80g
    { name: "シュークリーム 1個（80g）", carbs: 21, category: "スイーツ", tags: ["スイーツ"], source: "八訂" },
    { name: "エクレア 1個（80g）", carbs: 26, category: "スイーツ", tags: ["スイーツ"], source: "推計" },
    // どら焼き: 55.5g/100g（八訂）。1個=90g
    { name: "どら焼き 1個（90g）", carbs: 50, category: "スイーツ", tags: ["和菓子", "高糖質"], source: "八訂" },
    // 大福もち: 50.2g/100g（八訂）。1個=60g
    { name: "大福 1個（60g）", carbs: 30, category: "スイーツ", tags: ["和菓子", "高糖質"], source: "八訂" },
    // おはぎ: 42.7g/100g（八訂）。1個=80g
    { name: "おはぎ 1個（80g）", carbs: 34, category: "スイーツ", tags: ["和菓子", "高糖質"], source: "八訂" },
    // みたらし団子: 42.6g/100g（八訂）。3本=90g
    { name: "みたらし団子 3本（90g）", carbs: 38, category: "スイーツ", tags: ["和菓子", "高糖質"], source: "八訂" },
    // 練り羊羹: 66.7g/100g（八訂）。小棹1本=60g
    { name: "羊羹（小棹）1本（60g）", carbs: 40, category: "スイーツ", tags: ["和菓子", "高糖質"], source: "八訂" },
    // アイスクリーム（高脂肪）: 22.2g/100g（八訂）。1個=90g
    { name: "アイスクリーム（カップ）1個（90g）", carbs: 20, category: "スイーツ", tags: ["スイーツ"], source: "八訂" },
    { name: "アイスバー 1本（70g）", carbs: 16, category: "スイーツ", tags: ["スイーツ"], source: "推計" },
    { name: "ソフトクリーム 1個（100g）", carbs: 20, category: "スイーツ", tags: ["スイーツ"], source: "推計" },
    // プリン: 14.9g/100g（八訂）。1個=100g
    { name: "プリン 1個（100g）", carbs: 15, category: "スイーツ", tags: ["スイーツ"], source: "八訂" },
    // ドーナツ（イースト）: 42.5g/100g（八訂）。1個=70g
    { name: "ドーナツ（プレーン）1個（70g）", carbs: 30, category: "スイーツ", tags: ["スイーツ"], source: "八訂" },
    // チョコレート: 51.9g/100g（八訂）。1/3板=20g
    { name: "チョコレート板（1/3・20g）", carbs: 10, category: "スイーツ", tags: ["スイーツ"], source: "八訂" },
    // せんべい（しょうゆ）: 84.4g/100g（八訂）。5枚=30g
    { name: "せんべい 5枚（30g）", carbs: 25, category: "スイーツ", tags: ["和菓子"], source: "八訂" },
    // ポテトチップス: 50.5g/100g（八訂）。1袋60g
    { name: "ポテトチップス 1袋（60g）", carbs: 30, category: "スイーツ", tags: ["スナック"], source: "八訂" },
    { name: "クッキー 5枚（40g）", carbs: 24, category: "スイーツ", tags: ["スイーツ"], source: "推計" },
  ],
  "飲料": [
    // コーラ: 11.4g/100ml（一般的な値）
    { name: "コーラ 350ml", carbs: 40, category: "飲料", tags: ["飲料", "高糖質"], source: "推計" },
    { name: "コーラ 500ml", carbs: 57, category: "飲料", tags: ["飲料", "高糖質"], source: "推計" },
    // スポーツドリンク: 6.2g/100ml（八訂・市販品平均）
    { name: "スポーツドリンク 500ml", carbs: 31, category: "飲料", tags: ["飲料"], source: "八訂" },
    // オレンジジュース: 11.0g/100ml（八訂・果実飲料・濃縮還元）
    { name: "オレンジジュース 200ml", carbs: 22, category: "飲料", tags: ["飲料"], source: "八訂" },
    // りんごジュース: 11.3g/100ml（八訂・果実飲料・濃縮還元）
    { name: "りんごジュース 200ml", carbs: 23, category: "飲料", tags: ["飲料"], source: "八訂" },
    // 野菜ジュース: 3.7g/100ml（八訂）
    { name: "野菜ジュース 200ml", carbs: 7, category: "飲料", tags: ["飲料"], source: "八訂" },
    // 牛乳: 4.8g/100ml（八訂）
    { name: "牛乳 200ml", carbs: 10, category: "飲料", tags: ["飲料"], source: "八訂" },
    // 豆乳（無調整）: 2.9g/100ml（八訂）
    { name: "豆乳（無調整）200ml", carbs: 6, category: "飲料", tags: ["飲料", "低糖質"], source: "八訂" },
    // 豆乳（調製）: 4.5g/100ml（八訂）
    { name: "豆乳（調製）200ml", carbs: 9, category: "飲料", tags: ["飲料"], source: "八訂" },
    { name: "コーヒー（缶・微糖）185ml", carbs: 8, category: "飲料", tags: ["飲料"], source: "推計" },
    { name: "コーヒー（缶・無糖）185ml", carbs: 1, category: "飲料", tags: ["飲料", "低糖質"], source: "推計" },
    { name: "カフェラテ（コンビニ）", carbs: 12, category: "飲料", tags: ["飲料", "コンビニ"], source: "推計" },
    { name: "緑茶・麦茶 500ml", carbs: 0, category: "飲料", tags: ["飲料", "低糖質"], source: "八訂" },
    { name: "エナジードリンク 250ml", carbs: 28, category: "飲料", tags: ["飲料"], source: "推計" },
    { name: "100%フルーツジュース 300ml", carbs: 33, category: "飲料", tags: ["飲料", "高糖質"], source: "推計" },
    // 甘酒（米こうじ）: 18.3g/100ml（八訂）
    { name: "甘酒 200ml", carbs: 37, category: "飲料", tags: ["飲料", "和食", "高糖質"], source: "八訂" },
    { name: "ポカリスエット 500ml", carbs: 31, category: "飲料", tags: ["飲料"], source: "推計" },
  ],
  "果物": [
    // バナナ: 21.4g/100g（八訂）。中1本=100g
    { name: "バナナ 1本（中・100g）", carbs: 21, category: "果物", tags: ["果物", "高糖質"], source: "八訂" },
    { name: "バナナ 2本（200g）", carbs: 43, category: "果物", tags: ["果物", "高糖質"], source: "八訂" },
    // りんご（皮なし）: 14.3g/100g（八訂）。1/2個=125g
    { name: "りんご 1/2個（125g）", carbs: 18, category: "果物", tags: ["果物"], source: "八訂" },
    { name: "りんご 1個（250g）", carbs: 36, category: "果物", tags: ["果物", "高糖質"], source: "八訂" },
    // みかん: 11.0g/100g（八訂）。1個=80g
    { name: "みかん 2個（160g）", carbs: 18, category: "果物", tags: ["果物"], source: "八訂" },
    // ぶどう（皮なし）: 15.2g/100g（八訂）。1房=150g
    { name: "ぶどう 1房（150g）", carbs: 23, category: "果物", tags: ["果物"], source: "八訂" },
    // 桃（皮なし）: 8.9g/100g（八訂）。1個=200g
    { name: "桃 1個（200g）", carbs: 18, category: "果物", tags: ["果物"], source: "八訂" },
    // いちご: 7.1g/100g（八訂）。10粒=200g
    { name: "いちご 10粒（200g）", carbs: 14, category: "果物", tags: ["果物"], source: "八訂" },
    // スイカ（皮なし）: 9.2g/100g（八訂）。1切れ=200g
    { name: "スイカ 1切れ（200g）", carbs: 18, category: "果物", tags: ["果物"], source: "八訂" },
    // メロン（温室・果肉）: 9.8g/100g（八訂）。1/6個=170g
    { name: "メロン 1/6個（170g）", carbs: 17, category: "果物", tags: ["果物"], source: "八訂" },
    // キウイフルーツ（黄）: 14.0g/100g（八訂）。1個=100g
    { name: "キウイ 2個（200g）", carbs: 28, category: "果物", tags: ["果物"], source: "八訂" },
    // 日本なし（皮なし）: 10.4g/100g（八訂）。1/2個=150g
    { name: "梨 1/2個（150g）", carbs: 16, category: "果物", tags: ["果物"], source: "八訂" },
    // マンゴー（果肉）: 15.6g/100g（八訂）。1/2個=150g
    { name: "マンゴー 1/2個（150g）", carbs: 23, category: "果物", tags: ["果物"], source: "八訂" },
    // パインアップル: 11.9g/100g（八訂）。2切れ=100g
    { name: "パイナップル 2切れ（100g）", carbs: 12, category: "果物", tags: ["果物"], source: "八訂" },
    // かき（甘がき）: 15.9g/100g（八訂）。1個=160g
    { name: "柿 1個（160g）", carbs: 25, category: "果物", tags: ["果物"], source: "八訂" },
  ],

  "おかず・主菜": [
    // 肉類（炭水化物はほぼ0だが、たれ・衣で増える）
    { name: "ステーキ（150g・たれなし）", carbs: 0, category: "おかず・主菜", tags: ["肉", "和食", "洋食"], source: "八訂" },
    { name: "焼き肉（牛・150g）", carbs: 2, category: "おかず・主菜", tags: ["肉", "焼肉"], source: "推計" },
    { name: "豚の生姜焼き 1人前", carbs: 8, category: "おかず・主菜", tags: ["肉", "和食"], source: "推計" },
    { name: "豚カツ 1枚", carbs: 12, category: "おかず・主菜", tags: ["肉", "揚げ物", "和食"], source: "推計" },
    { name: "唐揚げ 3個", carbs: 9, category: "おかず・主菜", tags: ["肉", "揚げ物", "和食"], source: "推計" },
    { name: "鶏の照り焼き 1人前", carbs: 8, category: "おかず・主菜", tags: ["肉", "和食"], source: "推計" },
    { name: "チキンソテー 1枚", carbs: 3, category: "おかず・主菜", tags: ["肉", "洋食"], source: "推計" },
    { name: "ハンバーグ（単品）", carbs: 10, category: "おかず・主菜", tags: ["肉", "洋食"], source: "推計" },
    { name: "餃子 6個", carbs: 18, category: "おかず・主菜", tags: ["肉", "中華"], source: "推計" },
    { name: "酢豚 1人前", carbs: 20, category: "おかず・主菜", tags: ["肉", "中華"], source: "推計" },
    // 魚介類
    { name: "焼き魚（さば・さんま・たれなし）", carbs: 0, category: "おかず・主菜", tags: ["魚", "和食"], source: "八訂" },
    { name: "焼き魚（鮭1切れ・たれなし）", carbs: 0, category: "おかず・主菜", tags: ["魚", "和食"], source: "八訂" },
    { name: "刺身 1人前（醤油・わさび除く）", carbs: 1, category: "おかず・主菜", tags: ["魚", "和食"], source: "八訂" },
    { name: "煮魚 1人前", carbs: 5, category: "おかず・主菜", tags: ["魚", "和食"], source: "推計" },
    { name: "天ぷら（魚・エビ）3個", carbs: 14, category: "おかず・主菜", tags: ["魚", "揚げ物", "和食"], source: "推計" },
    { name: "エビフライ 2本", carbs: 12, category: "おかず・主菜", tags: ["魚", "揚げ物", "洋食"], source: "推計" },
    { name: "アジフライ 1枚", carbs: 10, category: "おかず・主菜", tags: ["魚", "揚げ物", "和食"], source: "推計" },
    { name: "サーモンムニエル 1切れ", carbs: 4, category: "おかず・主菜", tags: ["魚", "洋食"], source: "推計" },
    { name: "マグロ刺身 5切れ", carbs: 0, category: "おかず・主菜", tags: ["魚", "和食"], source: "八訂" },
    { name: "焼きホタテ 3個", carbs: 4, category: "おかず・主菜", tags: ["魚", "和食"], source: "推計" },
    // 卵・大豆
    { name: "目玉焼き 1個（油のみ）", carbs: 0, category: "おかず・主菜", tags: ["卵", "和食", "洋食"], source: "八訂" },
    { name: "卵焼き 2切れ", carbs: 3, category: "おかず・主菜", tags: ["卵", "和食"], source: "推計" },
    { name: "茶碗蒸し 1個", carbs: 4, category: "おかず・主菜", tags: ["卵", "和食"], source: "推計" },
    { name: "冷奴 1丁", carbs: 2, category: "おかず・主菜", tags: ["大豆", "和食"], source: "八訂" },
    { name: "麻婆豆腐 1人前", carbs: 8, category: "おかず・主菜", tags: ["大豆", "中華"], source: "推計" },
  ],

  "副菜・汁物": [
    { name: "味噌汁 1杯", carbs: 3, category: "副菜・汁物", tags: ["和食", "汁物"], source: "推計" },
    { name: "豚汁 1杯", carbs: 8, category: "副菜・汁物", tags: ["和食", "汁物"], source: "推計" },
    { name: "コンソメスープ 1杯", carbs: 2, category: "副菜・汁物", tags: ["洋食", "汁物"], source: "推計" },
    { name: "サラダ（ドレッシングなし）", carbs: 3, category: "副菜・汁物", tags: ["野菜", "洋食"], source: "推計" },
    { name: "ポテトサラダ", carbs: 12, category: "副菜・汁物", tags: ["野菜", "洋食"], source: "推計" },
    { name: "おひたし（ほうれん草）", carbs: 1, category: "副菜・汁物", tags: ["野菜", "和食"], source: "八訂" },
    { name: "きんぴらごぼう", carbs: 8, category: "副菜・汁物", tags: ["野菜", "和食"], source: "推計" },
    { name: "ひじきの煮物", carbs: 6, category: "副菜・汁物", tags: ["野菜", "和食"], source: "推計" },
    { name: "かぼちゃの煮物", carbs: 14, category: "副菜・汁物", tags: ["野菜", "和食"], source: "推計" },
    { name: "漬物（少量）", carbs: 2, category: "副菜・汁物", tags: ["野菜", "和食"], source: "推計" },
    { name: "枝豆 1袋（100g）", carbs: 5, category: "副菜・汁物", tags: ["豆", "和食"], source: "八訂" },
  ],
};

export const allFoods: FoodItem[] = Object.values(foodData).flat();
