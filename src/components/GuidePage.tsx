const T1LIFE_URL = 'https://t1life.vercel.app';

interface Props {
  onClose: () => void;
}

type Section = {
  id: string;
  emoji: string;
  title: string;
  color: string;
  bg: string;
  border: string;
  content: React.ReactNode;
};

export default function GuidePage({ onClose }: Props) {
  const sections: Section[] = [
    {
      id: 'overview',
      emoji: '🧮',
      title: 'このアプリでできること',
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      content: (
        <div>
          <p style={p}>食事前に必要なインスリン量（ボーラス）を自動で計算します。</p>
          <p style={p}>計算は2つの要素の合計です：</p>
          <div style={formula}>
            <span style={formulaMain}>総ボーラス = 食事ボーラス + 補正ボーラス</span>
          </div>
          <p style={note}>※ 結果は0.5単位刻みに丸めて表示されます。</p>
        </div>
      ),
    },
    {
      id: 'meal-bolus',
      emoji: '🍱',
      title: '食事ボーラス（Meal Bolus）',
      color: '#16A34A',
      bg: '#F0FDF4',
      border: '#BBF7D0',
      content: (
        <div>
          <p style={p}>食事の炭水化物量に対して必要なインスリン量です。</p>
          <div style={formula}>
            <span style={formulaMain}>食事ボーラス = 炭水化物(g) ÷ CIR</span>
          </div>
          <ExampleBox color="#16A34A" bg="#F0FDF4" border="#BBF7D0">
            炭水化物 60g、CIR = 10 の場合<br />
            → 60 ÷ 10 = <strong>6単位</strong>
          </ExampleBox>
        </div>
      ),
    },
    {
      id: 'cir',
      emoji: '🔢',
      title: 'CIR（炭水化物/インスリン比）',
      color: '#16A34A',
      bg: '#F0FDF4',
      border: '#BBF7D0',
      content: (
        <div>
          <p style={p}><strong>CIR（Carbohydrate-to-Insulin Ratio）</strong>は、インスリン1単位で処理できる炭水化物の量（g）です。</p>
          <div style={formula}>
            <span style={formulaMain}>CIR = 500 ÷ TDD</span>
            <span style={formulaSub}>（500ルール・目安）</span>
          </div>
          <p style={p}>例えば CIR = 10 なら、「炭水化物10gにつき1単位」が必要という意味です。</p>
          <KeyPoint color="#16A34A" bg="#DCFCE7">
            CIRは個人差が大きく、時間帯（朝・昼・夜）や体調によっても変わります。
            担当医・栄養士と一緒に設定してください。
          </KeyPoint>
        </div>
      ),
    },
    {
      id: 'correction-bolus',
      emoji: '🎯',
      title: '補正ボーラス（Correction Bolus）',
      color: '#EA580C',
      bg: '#FFF7ED',
      border: '#FED7AA',
      content: (
        <div>
          <p style={p}>食前血糖値が目標値より高い場合に、血糖を下げるための追加インスリンです。</p>
          <div style={formula}>
            <span style={formulaMain}>補正ボーラス = (現在血糖 − 目標血糖) ÷ ISF</span>
          </div>
          <ExampleBox color="#EA580C" bg="#FFF7ED" border="#FED7AA">
            血糖 220mg/dL、目標 100mg/dL、ISF = 50 の場合<br />
            → (220 − 100) ÷ 50 = <strong>2.4単位</strong>（→ 2.5単位に丸め）
          </ExampleBox>
          <KeyPoint color="#EA580C" bg="#FFEDD5">
            血糖が目標以下の場合は補正ボーラスは0になります（低血糖のリスクがあるため）。
          </KeyPoint>
        </div>
      ),
    },
    {
      id: 'isf',
      emoji: '📉',
      title: 'ISF（インスリン感受性係数）',
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      content: (
        <div>
          <p style={p}><strong>ISF（Insulin Sensitivity Factor）</strong>は、インスリン1単位が血糖値を何mg/dL下げるかを表します。</p>
          <div style={formula}>
            <span style={formulaMain}>ISF = 1700 ÷ TDD</span>
            <span style={formulaSub}>（1700ルール）</span>
          </div>
          <p style={p}>例えば ISF = 50 なら、「1単位打つと血糖が約50mg/dL下がる」という意味です。</p>
          <ExampleBox color="#7C3AED" bg="#F5F3FF" border="#DDD6FE">
            TDD = 34単位の場合<br />
            → 1700 ÷ 34 = <strong>50 mg/dL/単位</strong>
          </ExampleBox>
          <KeyPoint color="#7C3AED" bg="#EDE9FE">
            設定画面でTDDを入力するとISFが自動計算されます。手動で上書きすることも可能です。
          </KeyPoint>
        </div>
      ),
    },
    {
      id: 'tdd',
      emoji: '📊',
      title: 'TDD（1日総インスリン量）',
      color: '#0EA5E9',
      bg: '#F0F9FF',
      border: '#BAE6FD',
      content: (
        <div>
          <p style={p}><strong>TDD（Total Daily Dose）</strong>は、1日に使用するインスリンの合計量（単位/日）です。</p>
          <div style={formula}>
            <span style={formulaMain}>TDD = ベーサル量 + 全ボーラスの合計</span>
          </div>
          <p style={p}>TDDはCIRとISFを自動計算する際の基準として使用されます：</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {[
              { label: 'CIR計算', formula: '500 ÷ TDD' },
              { label: 'ISF計算', formula: '1700 ÷ TDD' },
            ].map(item => (
              <div key={item.label} style={{ background: '#fff', border: '1px solid #BAE6FD', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#0EA5E9', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0369A1' }}>{item.formula}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'basal',
      emoji: '🕐',
      title: 'ベーサルインスリン（基礎インスリン）',
      color: '#64748B',
      bg: '#F8FAFC',
      border: '#E2E8F0',
      content: (
        <div>
          <p style={p}>食事に関係なく、1日中一定の速度で体内に必要な基礎的なインスリンです。</p>
          <p style={p}>1型糖尿病では、膵臓がインスリンをほぼ分泌できないため、ベーサルインスリン（グラルギン・デグルデクなど）を毎日注射します。</p>
          <KeyPoint color="#64748B" bg="#F1F5F9">
            このアプリで計算するのは「食事ボーラス」と「補正ボーラス」のみです。
            ベーサルインスリンは別途、担当医の指示に従って投与してください。
          </KeyPoint>
        </div>
      ),
    },
    {
      id: 'target-bg',
      emoji: '🎯',
      title: '目標血糖値',
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      content: (
        <div>
          <p style={p}>補正ボーラスの計算で使用する、食前に目指す血糖値です。</p>
          <p style={p}>一般的には <strong>100〜120 mg/dL</strong> が設定されることが多いですが、低血糖が心配な場合や就寝前は高めに設定することもあります。</p>
          <KeyPoint color="#2563EB" bg="#DBEAFE">
            目標血糖値は担当医と相談して決定してください。
          </KeyPoint>
        </div>
      ),
    },
    {
      id: 'hypohyper',
      emoji: '⚠️',
      title: '低血糖・高血糖のサイン',
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FECACA',
      content: (
        <div>
          <p style={p}>このアプリでは以下の血糖値で警告を表示します：</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {[
              { range: '< 50 mg/dL', label: '重篤な低血糖', desc: 'すぐにブドウ糖を補食。インスリンは打たないでください。', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
              { range: '50〜70 mg/dL', label: '低血糖', desc: '炭水化物15〜20gを補食し、15分後に再測定してください。', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
              { range: '> 400 mg/dL', label: '重篤な高血糖', desc: '医療機関に連絡してください。ケトアシドーシスの可能性があります。', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
            ].map(item => (
              <div key={item.range} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: item.color }}>{item.range}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: item.color, background: '#fff', border: `1px solid ${item.border}`, borderRadius: 20, padding: '1px 8px' }}>{item.label}</span>
                </div>
                <p style={{ ...p, margin: 0, color: '#475569' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'rounding',
      emoji: '0.5',
      title: '0.5単位刻みの丸め',
      color: '#64748B',
      bg: '#F8FAFC',
      border: '#E2E8F0',
      content: (
        <div>
          <p style={p}>多くのインスリンペンは0.5単位刻みで投与できます。このアプリでは計算結果を0.5単位刻みに四捨五入します。</p>
          <div style={formula}>
            <span style={formulaMain}>丸め = Math.round(値 × 2) / 2</span>
          </div>
          <ExampleBox color="#64748B" bg="#F1F5F9" border="#E2E8F0">
            3.2単位 → <strong>3.0単位</strong><br />
            3.3単位 → <strong>3.5単位</strong><br />
            4.8単位 → <strong>5.0単位</strong>
          </ExampleBox>
        </div>
      ),
    },
    {
      id: 'disclaimer',
      emoji: '🏥',
      title: '重要な注意事項',
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FECACA',
      content: (
        <div>
          <p style={p}>このアプリは医療機器ではありません。計算結果はあくまで参考値です。</p>
          <ul style={{ paddingLeft: 16, color: '#475569', fontSize: 13, lineHeight: 2 }}>
            <li>実際の投与量は必ず担当医師の指示に従ってください</li>
            <li>体調・運動・ストレスによって必要なインスリン量は変わります</li>
            <li>CIR・ISF・目標血糖値は医師と相談して設定してください</li>
            <li>アプリの不具合・計算ミスによる健康被害について責任を負いません</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div style={{ background: '#F5F7FF', minHeight: '100vh', maxWidth: 480, margin: '0 auto' }}>
      {/* ヘッダー */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 16px', height: 56,
        borderBottom: '1px solid rgba(148,163,184,0.2)',
        position: 'sticky', top: 0,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 100,
      }}>
        <button onClick={onClose} style={{
          background: '#F1F5F9', border: 'none', color: '#64748B',
          borderRadius: 20, width: 36, height: 36,
          fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>←</button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>InsuCalc 使い方ガイド</div>
          <div style={{ fontSize: 10, color: '#94A3B8' }}>インスリン計算の仕組みを解説</div>
        </div>
        <a href={T1LIFE_URL} target="_blank" rel="noopener noreferrer" style={{
          marginLeft: 'auto',
          background: '#EFF6FF', border: '1px solid #BFDBFE',
          color: '#2563EB', borderRadius: 20, padding: '5px 10px',
          fontSize: 11, fontWeight: 700, textDecoration: 'none',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          T1Life ↗
        </a>
      </header>

      {/* ヒーロー */}
      <div style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
        padding: '24px 20px',
        color: '#fff',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>💉</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          インスリン計算の仕組み
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.6 }}>
          CIR・ISF・ボーラス計算について、基礎から分かりやすく解説します。
        </p>
      </div>

      {/* 目次 */}
      <div style={{ padding: '16px', background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>目次</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              fontSize: 11, color: s.color, background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: 20, padding: '4px 10px', textDecoration: 'none', fontWeight: 600,
            }}>
              {s.emoji} {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* コンテンツ */}
      <div style={{ padding: '8px 16px 80px' }}>
        {sections.map(s => (
          <section key={s.id} id={s.id} style={{ marginTop: 16 }}>
            <div style={{
              background: '#fff', border: `1.5px solid ${s.border}`,
              borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                background: s.bg, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: `1px solid ${s.border}`,
              }}>
                <span style={{ fontSize: 20 }}>{s.emoji}</span>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: s.color }}>{s.title}</h2>
              </div>
              <div style={{ padding: '14px 16px' }}>
                {s.content}
              </div>
            </div>
          </section>
        ))}

        {/* T1Lifeバナー */}
        <a href={T1LIFE_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'block', marginTop: 20,
          background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
          borderRadius: 20, padding: '20px', textDecoration: 'none',
          boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, background: 'rgba(255,255,255,0.2)',
              borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>T1</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 2 }}>T1Life</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>1型糖尿病コミュニティへ →</div>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
            同じ1型糖尿病の仲間との情報交換、体験談の共有ができるコミュニティです。
          </p>
        </a>
      </div>

      {/* 戻るボタン */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, padding: '12px 16px 34px',
        background: 'linear-gradient(transparent, #F5F7FF 30%)',
      }}>
        <button onClick={onClose} style={{
          width: '100%', padding: '14px', background: '#2563EB', color: '#fff',
          border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
        }}>
          ← 計算画面に戻る
        </button>
      </div>
    </div>
  );
}

// スタイル定数
const p: React.CSSProperties = { fontSize: 13, color: '#475569', lineHeight: 1.7, marginBottom: 10 };
const formula: React.CSSProperties = {
  background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12,
  padding: '12px 14px', margin: '10px 0', textAlign: 'center',
};
const formulaMain: React.CSSProperties = { fontSize: 14, fontWeight: 800, color: '#1E293B', display: 'block' };
const formulaSub: React.CSSProperties = { fontSize: 11, color: '#94A3B8', display: 'block', marginTop: 4 };
const note: React.CSSProperties = { fontSize: 11, color: '#94A3B8', marginTop: 4 };

function ExampleBox({ children, color, bg, border }: { children: React.ReactNode; color: string; bg: string; border: string }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: '10px 14px', marginTop: 8, fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 4 }}>計算例</div>
      {children}
    </div>
  );
}

function KeyPoint({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${color}`, borderRadius: '0 10px 10px 0', padding: '10px 14px', marginTop: 10, fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
      {children}
    </div>
  );
}
