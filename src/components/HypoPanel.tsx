interface Props {
  onClose: () => void;
}

const FOODS = [
  { item: 'ブドウ糖タブレット', amount: '2〜3粒（10〜15g）', note: '最速。常時携帯推奨', best: true },
  { item: 'ラムネ（森永）', amount: '10〜15粒（約10〜15g）', note: '主成分がブドウ糖', best: true },
  { item: 'ジュース（果汁100%）', amount: '150〜200mL', note: 'オレンジジュース等' },
  { item: 'コーラ・サイダー', amount: '150mL', note: '砂糖入り。ダイエット版は不可' },
  { item: '砂糖・角砂糖', amount: '大さじ1（約10g）', note: '水に溶かして飲む' },
];

const SYMPTOMS = ['手の震え', '冷や汗', '動悸', '空腹感', '脱力感', 'ふらつき', '集中力低下', '視界がぼやける', 'イライラ'];

export default function HypoPanel({ onClose }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#FEF2F2',
      overflowY: 'auto',
      maxWidth: 480, margin: '0 auto',
    }}>
      {/* ヘッダー */}
      <div style={{
        background: '#DC2626', color: '#fff',
        padding: '16px 16px 20px',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 28 }}>🍬</span>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 20,
            padding: '6px 14px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>✕ 閉じる</button>
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>低血糖対応</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, opacity: 0.9 }}>まず補食。インスリンは打たない。</p>
      </div>

      <div style={{ padding: '16px' }}>
        {/* ステップ1 */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '16px',
          border: '2px solid #DC2626', marginBottom: 12,
          boxShadow: '0 4px 12px rgba(220,38,38,0.15)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#DC2626', marginBottom: 10 }}>
            ① ブドウ糖を摂取
          </div>
          {FOODS.map(r => (
            <div key={r.item} style={{
              background: r.best ? '#FEF2F2' : '#F8FAFC',
              border: `1px solid ${r.best ? '#FECACA' : '#E2E8F0'}`,
              borderRadius: 10, padding: '10px 12px', marginBottom: 6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{r.item}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: r.best ? '#DC2626' : '#2563EB' }}>{r.amount}</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{r.note}</div>
            </div>
          ))}
        </div>

        {/* ステップ2 */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '16px',
          border: '2px solid #EA580C', marginBottom: 12,
        }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#EA580C', marginBottom: 8 }}>
            ② 15分待って再測定
          </div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, color: '#475569', lineHeight: 2.2 }}>
            <li><strong>15分後</strong>に血糖値を再測定</li>
            <li>まだ70未満 → <strong>もう一度同量</strong>の補食</li>
            <li>70以上に回復 → 次の食事まで30分以上あれば<strong>追加で炭水化物15g</strong></li>
          </ul>
        </div>

        {/* 子供 */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '16px',
          border: '2px solid #7C3AED', marginBottom: 12,
        }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#7C3AED', marginBottom: 8 }}>
            子どもの場合
          </div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, color: '#475569', lineHeight: 2.2 }}>
            <li>体重30kg未満：ブドウ糖 <strong>5〜10g</strong>（ラムネ5〜10粒）</li>
            <li>体重30kg以上：大人と同じ <strong>10〜15g</strong></li>
            <li>意識があるときだけ口から補食</li>
          </ul>
        </div>

        {/* 症状 */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '16px',
          border: '1px solid #FECACA', marginBottom: 12,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#DC2626', marginBottom: 8 }}>こんな症状が出たら低血糖かも</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SYMPTOMS.map(s => (
              <span key={s} style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#991B1B',
              }}>{s}</span>
            ))}
          </div>
        </div>

        {/* 重症時 */}
        <div style={{
          background: '#450A0A', borderRadius: 16, padding: '16px',
          color: '#fff', marginBottom: 20,
        }}>
          <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>⚠ 意識がない・けいれん</div>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, lineHeight: 2.2, color: '#FCA5A5' }}>
            <li>口に物を入れない（窒息の危険）</li>
            <li>グルカゴン注射（持っていれば）</li>
            <li><strong>すぐに救急車（119）を呼ぶ</strong></li>
          </ul>
        </div>

        <p style={{ fontSize: 10, color: '#991B1B', textAlign: 'center', lineHeight: 1.6 }}>
          頻繁に低血糖が起きる場合はインスリン量の見直しが必要です。<br />担当医に相談してください。
        </p>
      </div>
    </div>
  );
}
