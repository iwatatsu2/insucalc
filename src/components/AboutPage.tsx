interface Props {
  onClose: () => void;
}

export default function AboutPage({ onClose }: Props) {
  const links = [
    {
      emoji: '📸',
      label: 'Instagram',
      handle: '@dr.iwatatsu',
      url: 'https://www.instagram.com/dr.iwatatsu/',
      color: '#E1306C',
      bg: '#FFF0F5',
      border: '#FECDD3',
    },
    {
      emoji: '🌐',
      label: 'ホームページ',
      handle: 'dr-iwatatsu.com',
      url: 'https://dr-iwatatsu.com',
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
    },
    {
      emoji: '🐦',
      label: 'X (Twitter)',
      handle: '@dr_iwatatsu',
      url: 'https://x.com/dr_iwatatsu',
      color: '#0F172A',
      bg: '#F8FAFC',
      border: '#E2E8F0',
    },
  ];

  const profile = [
    { label: '専門', value: '糖尿病・内分泌内科' },
    { label: '資格', value: '糖尿病専門医・内分泌代謝専門医' },
    { label: '活動', value: '1型糖尿病啓発・医療情報発信' },
  ];

  return (
    <div style={{ background: '#F0F4FF', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: "'Hiragino Sans', 'Noto Sans JP', -apple-system, sans-serif" }}>

      {/* ヒーロー */}
      <div style={{
        background: 'linear-gradient(160deg, #1D4ED8 0%, #4F46E5 60%, #7C3AED 100%)',
        padding: '56px 24px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 装飾円 */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: 20, left: -30, width: 120, height: 120, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

        {/* 戻るボタン */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, left: 16,
          background: 'rgba(255,255,255,0.15)', border: 'none',
          color: '#fff', borderRadius: 20, padding: '6px 14px',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ← 戻る
        </button>

        {/* イラスト＋名前 */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 140, height: 140, margin: '0 auto 16px',
            borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.3)',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            <img
              src="/dr-iwatatsu.png"
              alt="Dr いわたつ"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                (e.target as HTMLImageElement).src = '/dr-iwatatsu.jpg';
              }}
            />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            Dr いわたつ
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: '0 0 20px' }}>
            岩本 達也 / 糖尿病・内分泌内科医
          </p>

          {/* バッジ */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {['糖尿病専門医', '内分泌代謝専門医', '1型糖尿病啓発'].map(tag => (
              <span key={tag} style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff', borderRadius: 20, padding: '4px 12px',
                fontSize: 11, fontWeight: 600,
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* 波形 */}
        <div style={{ height: 32, overflow: 'hidden', marginBottom: -1 }}>
          <svg viewBox="0 0 480 32" style={{ width: '100%', display: 'block' }} preserveAspectRatio="none">
            <path d="M0,32 C120,0 360,0 480,32 L480,32 L0,32 Z" fill="#F0F4FF" />
          </svg>
        </div>
      </div>

      <div style={{ padding: '20px 20px 80px' }}>

        {/* 自己紹介 */}
        <div style={{
          background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 20,
          padding: '20px', marginBottom: 16,
          boxShadow: '0 2px 8px rgba(37,99,235,0.06)',
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: '#2563EB', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>👨‍⚕️</span> プロフィール
          </h2>
          <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
            糖尿病・内分泌内科を専門とする医師。1型糖尿病を中心に、患者さんが自分の病気を理解して前向きに治療に向き合えるよう、SNSや各種アプリを通じた医療情報の発信に取り組んでいます。
          </p>
          <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, margin: 0 }}>
            インスリン療法や血糖管理についての正確な知識を、専門用語を使わずに分かりやすく伝えることをモットーとしています。
          </p>

          {/* プロフィール詳細 */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {profile.map(p => (
              <div key={p.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, padding: '2px 8px', flexShrink: 0, marginTop: 1 }}>
                  {p.label}
                </span>
                <span style={{ fontSize: 13, color: '#475569' }}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* このアプリについて */}
        <div style={{
          background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 20,
          padding: '20px', marginBottom: 16,
          boxShadow: '0 2px 8px rgba(37,99,235,0.06)',
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: '#2563EB', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>💉</span> InsuCalc について
          </h2>
          <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, margin: '0 0 12px' }}>
            1型糖尿病の患者さんが食前インスリンを正確に計算できるよう開発したWebアプリです。食品交換表に基づく炭水化物計算と、CIR・ISFを用いたボーラス計算をスマートフォンで手軽に行えます。
          </p>
          <div style={{ background: '#FEF9C3', border: '1px solid #FDE68A', borderRadius: 12, padding: '10px 14px' }}>
            <p style={{ fontSize: 11, color: '#92400E', margin: 0, lineHeight: 1.7 }}>
              ⚠️ このアプリは医療機器ではありません。計算結果は参考値であり、実際のインスリン投与量は必ず担当医師の指示に従ってください。
            </p>
          </div>
        </div>

        {/* SNS・リンク */}
        <div style={{
          background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 20,
          padding: '20px', marginBottom: 16,
          boxShadow: '0 2px 8px rgba(37,99,235,0.06)',
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: '#2563EB', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🔗</span> SNS・リンク
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {links.map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: link.bg, border: `1.5px solid ${link.border}`,
                borderRadius: 14, padding: '14px 16px', textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{link.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: link.color }}>{link.label}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>{link.handle}</div>
                </div>
                <span style={{ fontSize: 16, color: link.color, opacity: 0.6 }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* T1Lifeバナー */}
        <a href="https://t1life.vercel.app" target="_blank" rel="noopener noreferrer" style={{
          display: 'block',
          background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
          borderRadius: 20, padding: '20px', textDecoration: 'none',
          boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>T1</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>T1Life</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>1型糖尿病コミュニティ</div>
            </div>
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>↗</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
            1型糖尿病と生きる仲間との情報交換・体験談の共有ができるコミュニティです。ぜひ参加してください。
          </p>
        </a>
      </div>
    </div>
  );
}
