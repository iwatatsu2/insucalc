interface Props {
  mealBolus: number;
  correctionBolus: number;
  totalBolus: number;
  currentBg: number;
  warning: string | null;
  onHypoGuide?: () => void;
}

export default function ResultDisplay({ mealBolus, correctionBolus, totalBolus, currentBg, warning, onHypoGuide }: Props) {
  const isHypo = currentBg > 0 && currentBg < 70;
  return (
    <div style={{
      background: '#fff', border: '1.5px solid #E2E8F0',
      borderRadius: 20, padding: '20px 16px',
      boxShadow: '0 4px 16px rgba(37,99,235,0.08)',
    }}>
      {warning && (
        <div style={{
          background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
          borderRadius: 12, padding: '10px 14px', marginBottom: 16,
          fontSize: 13, fontWeight: 700,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            ⚠️ {warning}
          </div>
          {isHypo && onHypoGuide && (
            <button onClick={onHypoGuide} style={{
              marginTop: 8, width: '100%', padding: '8px',
              background: '#DC2626', color: '#fff', border: 'none',
              borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
              🍬 低血糖対応マニュアルを見る
            </button>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>投与インスリン量</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: '#2563EB', lineHeight: 1, letterSpacing: '-3px' }}>
          {totalBolus.toFixed(1)}
        </div>
        <div style={{ fontSize: 18, color: '#94A3B8', marginTop: 4, fontWeight: 600 }}>単位</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 14, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 600, marginBottom: 4 }}>食事ボーラス</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#16A34A' }}>
            {mealBolus.toFixed(1)}<span style={{ fontSize: 13, fontWeight: 600 }}> 単位</span>
          </div>
        </div>
        <div style={{ background: correctionBolus > 0 ? '#FFF7ED' : '#F8FAFC', border: `1px solid ${correctionBolus > 0 ? '#FED7AA' : '#E2E8F0'}`, borderRadius: 14, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: correctionBolus > 0 ? '#EA580C' : '#94A3B8', fontWeight: 600, marginBottom: 4 }}>補正ボーラス</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: correctionBolus > 0 ? '#EA580C' : '#CBD5E1' }}>
            {correctionBolus > 0 ? '+' : ''}{correctionBolus.toFixed(1)}<span style={{ fontSize: 13, fontWeight: 600 }}> 単位</span>
          </div>
        </div>
      </div>

      <div style={{
        background: '#F8FAFC', borderRadius: 12, padding: '10px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        border: '1px solid #F1F5F9',
      }}>
        <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>現在血糖値</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: currentBg < 70 ? '#EF4444' : currentBg > 250 ? '#F97316' : '#1E293B' }}>
          {currentBg} mg/dL
        </span>
      </div>

      <p style={{ fontSize: 10, color: '#CBD5E1', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
        ※ この計算結果は参考値です。実際の投与量は担当医師の指示に従ってください。
      </p>
    </div>
  );
}
