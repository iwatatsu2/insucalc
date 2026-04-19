import { useState } from 'react';

interface Props {
  onAccept: () => void;
  viewOnly?: boolean;
}

export default function ConsentScreen({ onAccept, viewOnly }: Props) {
  const [checked, setChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 30) {
      setScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (!checked) return;
    localStorage.setItem('insucalc_consent', JSON.stringify({
      version: '1.0',
      acceptedAt: new Date().toISOString(),
    }));
    onAccept();
  };

  return (
    <div style={{
      ...(viewOnly ? { position: 'fixed' as const, inset: 0, zIndex: 1000, overflowY: 'auto' as const } : { minHeight: '100vh' }),
      background: '#F8FAFC',
      display: 'flex', flexDirection: 'column',
      maxWidth: 480, margin: '0 auto',
      fontFamily: "'Hiragino Sans', 'Noto Sans JP', -apple-system, sans-serif",
    }}>
      <div style={{ padding: '24px 16px 8px' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>💉</div>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#1E293B' }}>Insu</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#2563EB' }}>Calc</span>
          </div>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>ご利用の前に以下をお読みください</p>
        </div>
      </div>

      <div
        onScroll={handleScroll}
        style={{
          flex: 1, margin: '0 16px', padding: '16px',
          background: '#fff', borderRadius: 16,
          border: '1.5px solid #E2E8F0',
          overflowY: 'auto', maxHeight: 'calc(100vh - 280px)',
          fontSize: 13, color: '#475569', lineHeight: 1.9,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 900, color: '#1E293B', marginTop: 0 }}>利用規約・免責事項</h2>

        <p style={{ fontSize: 12, color: '#94A3B8' }}>最終更新日: 2026年4月19日</p>

        <Section title="1. 本アプリの性質">
          <p>InsuCalc（以下「本アプリ」）は、糖質量およびインスリン投与量の<strong>参考計算</strong>を行うツールです。</p>
          <Warn>
            本アプリは医療機器ではなく、医療行為を行うものではありません。薬機法（医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律）に定める医療機器プログラムには該当しません。
          </Warn>
        </Section>

        <Section title="2. 計算結果の取り扱い">
          <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
            <li>本アプリが表示する計算結果は、あくまで<strong>参考値</strong>であり、医学的な助言・診断・処方を構成するものではありません。</li>
            <li>実際のインスリン投与量は、<strong>必ず担当医師の指示に従って</strong>決定してください。</li>
            <li>CIR（糖質/インスリン比）、ISF（インスリン感受性係数）、目標血糖値等のパラメータは個人差が大きく、体調・運動・ストレス・月経周期等により変動します。</li>
            <li>食品の炭水化物量は日本食品標準成分表2020年版（八訂）等に基づく推計値であり、実際の値とは異なる場合があります。</li>
          </ul>
        </Section>

        <Section title="3. 低血糖対応情報について">
          <p>本アプリに含まれる低血糖対応マニュアルは、一般的な情報提供を目的としたものであり、<strong>個別の医療状況に応じた指導ではありません</strong>。</p>
          <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
            <li>低血糖時の具体的な対処法は、担当医師の指示に従ってください。</li>
            <li>補食の種類・量は個人差があります。担当医と事前に確認してください。</li>
            <li>重篤な低血糖（意識消失・けいれん等）の場合は、直ちに救急サービス（119番）に連絡してください。</li>
          </ul>
        </Section>

        <Section title="4. 免責事項">
          <Warn>
            本アプリの利用により生じたいかなる健康被害、身体的損害、精神的損害、経済的損失その他一切の損害について、開発者は責任を負いません。
          </Warn>
          <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
            <li>本アプリの計算結果に基づいてインスリンを投与した結果生じた低血糖、高血糖、その他の合併症について、開発者は一切の責任を負いません。</li>
            <li>本アプリの不具合、データの誤り、通信障害等により正確な計算結果が得られなかった場合についても、開発者は責任を負いません。</li>
            <li>ユーザーは、自己の責任において本アプリを利用するものとします。</li>
          </ul>
        </Section>

        <Section title="5. 利用条件">
          <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
            <li>本アプリは、担当医師からインスリン療法（カーボカウント法）の指導を受けている方を対象としています。</li>
            <li>医師の指導を受けていない方が本アプリの計算結果に基づいてインスリンを投与することは極めて危険であり、絶対にお止めください。</li>
            <li>未成年者が利用する場合は、保護者の監督のもとで使用してください。</li>
          </ul>
        </Section>

        <Section title="6. データの取り扱い">
          <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
            <li>本アプリの設定情報・履歴データはすべてお使いの端末内（ローカルストレージ）に保存されます。</li>
            <li>開発者がユーザーの個人情報や健康情報を収集・送信することはありません。</li>
            <li>端末の紛失・初期化等によりデータが失われた場合、開発者は復旧の責任を負いません。</li>
          </ul>
        </Section>

        <Section title="7. 規約の変更">
          <p>本規約は、事前の通知なく変更されることがあります。変更後の規約は、本アプリ内に掲載された時点で効力を生じるものとします。</p>
        </Section>

        <Section title="8. 準拠法・管轄裁判所">
          <p>本規約は日本法に準拠し、本アプリに関する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
        </Section>
      </div>

      <div style={{ padding: '12px 16px 34px' }}>
        {viewOnly ? (
          <button
            onClick={onAccept}
            style={{
              width: '100%', padding: '14px',
              background: '#2563EB', color: '#fff',
              border: 'none', borderRadius: 14,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            }}
          >
            閉じる
          </button>
        ) : (
          <>
            {!scrolledToBottom && (
              <p style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>
                最後までスクロールしてお読みください
              </p>
            )}

            <label style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', background: '#fff',
              borderRadius: 12, border: '1.5px solid #E2E8F0',
              marginBottom: 10, cursor: scrolledToBottom ? 'pointer' : 'default',
              opacity: scrolledToBottom ? 1 : 0.4,
            }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={e => scrolledToBottom && setChecked(e.target.checked)}
                disabled={!scrolledToBottom}
                style={{ width: 20, height: 20, accentColor: '#2563EB' }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', lineHeight: 1.5 }}>
                上記の利用規約・免責事項を理解し、<br />自己の責任において本アプリを利用することに同意します
              </span>
            </label>

            <button
              onClick={handleAccept}
              disabled={!checked}
              style={{
                width: '100%', padding: '14px',
                background: checked ? '#2563EB' : '#E2E8F0',
                color: checked ? '#fff' : '#94A3B8',
                border: 'none', borderRadius: 14,
                fontSize: 15, fontWeight: 700, cursor: checked ? 'pointer' : 'default',
                boxShadow: checked ? '0 4px 14px rgba(37,99,235,0.35)' : 'none',
              }}
            >
              同意して利用を開始する
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', marginBottom: 6, marginTop: 16 }}>{title}</h3>
      <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.9 }}>{children}</div>
    </div>
  );
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#FEF2F2', border: '1px solid #FECACA',
      borderRadius: 10, padding: '10px 14px', margin: '8px 0',
      fontSize: 13, fontWeight: 700, color: '#DC2626', lineHeight: 1.7,
    }}>
      {children}
    </div>
  );
}
