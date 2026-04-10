import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: 'home' | 'history' | 'settings' | 'guide' | 'about') => void;
  currentPage: string;
}

const MENU_ITEMS = [
  { key: 'home',     emoji: '💉', label: 'インスリン計算',     sub: 'ボーラス自動計算' },
  { key: 'guide',    emoji: '📖', label: '使い方ガイド',       sub: '計算の仕組みを解説' },
  { key: 'history',  emoji: '📋', label: '履歴',              sub: '過去の記録を確認' },
  { key: 'settings', emoji: '⚙️', label: '設定',              sub: 'CIR・ISF・目標血糖値' },
  { key: 'about',    emoji: '👨‍⚕️', label: 'Dr いわたつについて', sub: '製作者プロフィール' },
] as const;

const T1LIFE_URL = 'https://t1life.vercel.app';


export default function DrawerMenu({ isOpen, onClose, onNavigate, currentPage }: Props) {
  // スクロール禁止
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* ドロワー本体 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 280, zIndex: 201,
        background: '#fff',
        boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* ヘッダー */}
        <div style={{
          background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
          padding: '48px 20px 24px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>💉</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
                Insu<span style={{ color: '#BAE6FD' }}>Calc</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>インスリン計算アプリ</div>
            </div>
          </div>
        </div>

        {/* メニュー */}
        <div style={{ flex: 1, padding: '12px 0' }}>
          {MENU_ITEMS.map(item => {
            const active = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { onNavigate(item.key as any); onClose(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 20px', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  borderLeft: `3px solid ${active ? '#2563EB' : 'transparent'}`,
                  background: active ? '#EFF6FF' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0, width: 28, textAlign: 'center' }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: active ? 800 : 600, color: active ? '#2563EB' : '#1E293B' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{item.sub}</div>
                </div>
                {active && (
                  <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* フッター：T1Lifeリンク */}
        <div style={{ padding: '16px 20px 32px', borderTop: '1px solid #F1F5F9', flexShrink: 0 }}>
          <a href={T1LIFE_URL} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
            borderRadius: 14, padding: '12px 16px', textDecoration: 'none',
          }}>
            <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>T1</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>T1Life</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>1型糖尿病コミュニティ ↗</div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
