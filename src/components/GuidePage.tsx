import { useState } from 'react';

const T1LIFE_URL = 'https://t1life.vercel.app';

interface Props {
  onClose: () => void;
}

// ステップ順に整理（TDD → CIR → ISF → ベーサル → 目標血糖 → 食事ボーラス → 補正ボーラス → 合計 → 丸め → 警告 → 注意）
const STEPS = [
  {
    id: 'tdd',
    step: 1,
    emoji: '📊',
    title: 'TDD（1日総インスリン量）',
    color: '#0EA5E9',
    bg: '#F0F9FF',
    border: '#BAE6FD',
    body: (
      <>
        <P><strong>TDD（Total Daily Dose）</strong>は、1日に使用するインスリンの合計量です。</P>
        <Formula>TDD = ベーサル量 + 全ボーラスの合計（単位/日）</Formula>
        <P>CIRとISFはこのTDDを元に自動計算されます。設定画面でTDDを入力してください。</P>
      </>
    ),
  },
  {
    id: 'cir',
    step: 2,
    emoji: '🔢',
    title: 'CIR（炭水化物/インスリン比）',
    color: '#16A34A',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    body: (
      <>
        <P><strong>CIR（Carbohydrate-to-Insulin Ratio）</strong>は、インスリン1単位で処理できる炭水化物の量（g）です。</P>
        <Formula sub="500ルール（目安）">CIR = 500 ÷ TDD</Formula>
        <P>CIR = 10 なら「炭水化物10gにつき1単位」という意味です。</P>
        <KeyPoint color="#16A34A" bg="#DCFCE7">
          CIRは個人差・時間帯・体調で変わります。担当医と相談して設定してください。
        </KeyPoint>
      </>
    ),
  },
  {
    id: 'isf',
    step: 3,
    emoji: '📉',
    title: 'ISF（インスリン感受性係数）',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    body: (
      <>
        <P><strong>ISF（Insulin Sensitivity Factor）</strong>は、インスリン1単位が血糖値を何mg/dL下げるかを表します。</P>
        <Formula sub="1700ルール">ISF = 1700 ÷ TDD</Formula>
        <Example color="#7C3AED" bg="#F5F3FF" border="#DDD6FE">
          TDD = 34単位 の場合<br />
          → 1700 ÷ 34 = <strong>50 mg/dL / 1単位</strong>
        </Example>
      </>
    ),
  },
  {
    id: 'basal',
    step: 4,
    emoji: '🕐',
    title: 'ベーサルインスリン（基礎インスリン）',
    color: '#64748B',
    bg: '#F8FAFC',
    border: '#E2E8F0',
    body: (
      <>
        <P>食事に関わらず、1日中継続して補充する基礎的なインスリンです（グラルギン・デグルデクなど）。</P>
        <P>1型糖尿病では膵臓がインスリンをほぼ分泌できないため、毎日定時に注射します。</P>
        <KeyPoint color="#64748B" bg="#F1F5F9">
          このアプリが計算するのは食事・補正ボーラスのみです。ベーサルは担当医の指示に従って投与してください。
        </KeyPoint>
      </>
    ),
  },
  {
    id: 'target-bg',
    step: 5,
    emoji: '🎯',
    title: '目標血糖値',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    body: (
      <>
        <P>補正ボーラス計算で使う「食前に目指す血糖値」です。</P>
        <P>一般的には <strong>100〜120 mg/dL</strong> が目安ですが、低血糖が心配な場合や就寝前は高めに設定することもあります。</P>
        <KeyPoint color="#2563EB" bg="#DBEAFE">
          担当医と相談して決定してください。
        </KeyPoint>
      </>
    ),
  },
  {
    id: 'meal-bolus',
    step: 6,
    emoji: '🍱',
    title: '食事ボーラス',
    color: '#16A34A',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    body: (
      <>
        <P>食事の炭水化物量に対して必要なインスリンです。</P>
        <Formula>食事ボーラス = 炭水化物(g) ÷ CIR</Formula>
        <Example color="#16A34A" bg="#F0FDF4" border="#BBF7D0">
          炭水化物 60g、CIR = 10 の場合<br />
          → 60 ÷ 10 = <strong>6単位</strong>
        </Example>
      </>
    ),
  },
  {
    id: 'correction-bolus',
    step: 7,
    emoji: '📈',
    title: '補正ボーラス',
    color: '#EA580C',
    bg: '#FFF7ED',
    border: '#FED7AA',
    body: (
      <>
        <P>食前血糖が目標値より高い場合に、血糖を下げるための追加インスリンです。</P>
        <Formula>補正ボーラス = (現在血糖 − 目標血糖) ÷ ISF</Formula>
        <Example color="#EA580C" bg="#FFF7ED" border="#FED7AA">
          血糖 220、目標 100、ISF = 50 の場合<br />
          → (220 − 100) ÷ 50 = <strong>2.4単位</strong>
        </Example>
        <KeyPoint color="#EA580C" bg="#FFEDD5">
          血糖が目標以下の場合は補正ボーラスは0になります。
        </KeyPoint>
      </>
    ),
  },
  {
    id: 'total',
    step: 8,
    emoji: '🧮',
    title: '合計ボーラス（このアプリの計算）',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    body: (
      <>
        <P>食事ボーラスと補正ボーラスを合算したものが、食前に打つ総インスリン量です。</P>
        <Formula>合計ボーラス = 食事ボーラス + 補正ボーラス</Formula>
        <P>結果は <strong>0.5単位刻み</strong> に丸めて表示されます（次のステップ参照）。</P>
      </>
    ),
  },
  {
    id: 'rounding',
    step: 9,
    emoji: '½',
    title: '0.5単位刻みの丸め',
    color: '#64748B',
    bg: '#F8FAFC',
    border: '#E2E8F0',
    body: (
      <>
        <P>HD（ハーフドーズ）製剤のみ0.5単位刻みで対応可能です（商品名：ヒューマログ注ミリオペンHD など）。計算結果を0.5単位刻みに四捨五入します。</P>
        <Example color="#64748B" bg="#F1F5F9" border="#E2E8F0">
          3.2単位 → <strong>3.0単位</strong>　／　3.3単位 → <strong>3.5単位</strong>　／　4.8単位 → <strong>5.0単位</strong>
        </Example>
      </>
    ),
  },
  {
    id: 'hypohyper',
    step: 10,
    emoji: '⚠️',
    title: '血糖値の警告ライン',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    body: (
      <>
        <P>以下の血糖値では計算画面に警告を表示します。インスリンより先に対処してください。</P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {[
            { range: '< 50 mg/dL', label: '重篤な低血糖', desc: 'すぐにブドウ糖を補食。インスリンは打たないでください。', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
            { range: '50〜70 mg/dL', label: '低血糖', desc: '炭水化物15〜20gを補食し、15分後に再測定。', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
            { range: '> 400 mg/dL', label: '重篤な高血糖', desc: '医療機関に連絡。ケトアシドーシスの可能性があります。', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
          ].map(item => (
            <div key={item.range} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 12, padding: '10px 14px' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: item.color }}>{item.range}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: item.color, background: '#fff', border: `1px solid ${item.border}`, borderRadius: 20, padding: '1px 8px' }}>{item.label}</span>
              </div>
              <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'disclaimer',
    step: 11,
    emoji: '🏥',
    title: '重要な注意事項',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    body: (
      <>
        <P>このアプリは医療機器ではありません。計算結果はあくまで参考値です。</P>
        <ul style={{ paddingLeft: 18, color: '#475569', fontSize: 13, lineHeight: 2.0, margin: 0 }}>
          <li>実際の投与量は必ず担当医師の指示に従ってください</li>
          <li>体調・運動・ストレスによって必要量は変わります</li>
          <li>CIR・ISF・目標血糖値は医師と相談して設定してください</li>
          <li>アプリの不具合による健康被害について責任を負いません</li>
        </ul>
      </>
    ),
  },
];

export default function GuidePage({ onClose }: Props) {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div style={{ background: '#F5F7FF', minHeight: '100vh', maxWidth: 480, margin: '0 auto' }}>
      {/* ヘッダー */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 16px', height: 56,
        borderBottom: '1px solid rgba(148,163,184,0.2)',
        position: 'sticky', top: 0,
        background: 'rgba(255,255,255,0.92)',
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
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>インスリン計算の仕組み</div>
          <div style={{ fontSize: 10, color: '#94A3B8' }}>全{STEPS.length}ステップで解説</div>
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
        background: 'linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)',
        padding: '24px 20px 20px',
        color: '#fff',
      }}>
        <div style={{ fontSize: 30, marginBottom: 8 }}>💉</div>
        <h1 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          InsuCalc 使い方ガイド
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.7 }}>
          TDD・CIR・ISFの意味から、<br />食事・補正ボーラスの計算まで順を追って解説します。
        </p>
      </div>

      {/* 目次（縦） */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
        <button
          onClick={() => setTocOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700, letterSpacing: '0.05em' }}>目次</span>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>{tocOpen ? '▲ 閉じる' : '▼ 開く'}</span>
        </button>

        {tocOpen && (
          <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {STEPS.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setTocOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 10,
                  background: s.bg, border: `1px solid ${s.border}`,
                  textDecoration: 'none',
                }}
              >
                <span style={{
                  fontSize: 10, fontWeight: 800, color: '#fff',
                  background: s.color, borderRadius: 20,
                  minWidth: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{s.step}</span>
                <span style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ステップカード */}
      <div style={{ padding: '12px 16px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STEPS.map(s => (
          <section key={s.id} id={s.id}>
            <div style={{
              background: '#fff',
              border: `1.5px solid ${s.border}`,
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              {/* カードヘッダー */}
              <div style={{
                background: s.bg, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: `1px solid ${s.border}`,
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 800, color: '#fff',
                  background: s.color, borderRadius: 20,
                  minWidth: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{s.step}</span>
                <span style={{ fontSize: 15 }}>{s.emoji}</span>
                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: s.color }}>{s.title}</h2>
              </div>
              {/* カードボディ */}
              <div style={{ padding: '14px 16px' }}>
                {s.body}
              </div>
            </div>
          </section>
        ))}

        {/* T1Lifeバナー */}
        <a href={T1LIFE_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'block', marginTop: 8,
          background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
          borderRadius: 18, padding: '18px 20px', textDecoration: 'none',
          boxShadow: '0 8px 24px rgba(37,99,235,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, background: 'rgba(255,255,255,0.2)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>T1</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>T1Life</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>1型糖尿病コミュニティへ →</div>
            </div>
          </div>
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

// ---- 内部コンポーネント ----
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.75, marginBottom: 10, marginTop: 0 }}>{children}</p>;
}

function Formula({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{
      background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12,
      padding: '12px 14px', margin: '10px 0', textAlign: 'center',
    }}>
      <span style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', display: 'block' }}>{children}</span>
      {sub && <span style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginTop: 4 }}>{sub}</span>}
    </div>
  );
}

function Example({ children, color, bg, border }: { children: React.ReactNode; color: string; bg: string; border: string }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: '10px 14px', marginTop: 8, fontSize: 13, color: '#475569', lineHeight: 1.75 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 4 }}>計算例</div>
      {children}
    </div>
  );
}

function KeyPoint({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${color}`, borderRadius: '0 10px 10px 0', padding: '10px 14px', marginTop: 10, fontSize: 12, color: '#475569', lineHeight: 1.75 }}>
      {children}
    </div>
  );
}
