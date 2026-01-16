// src/components/AppLayout.jsx
function AppLayout({ title, left, right, children }) {
  return (
    <div style={{
      height: '100vh',        // 鎖定視窗高度
      width: '100%',
      // ⭐ 適配深色模式：最外層底色
      background: 'var(--color-bg)',
      display: 'flex',
      justifyContent: 'center',
      overflow: 'hidden',      // ⭐ 鎖死外層大滾輪
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        width: '100%', 
        maxWidth: 1200, 
        // ⭐ 適配深色模式：奶茶色/深色背景變數
        background: 'var(--color-bg)', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh'
      }}>
        {/* 固定 Header：不參與捲動 */}
        <header style={{
          height: 60, 
          flexShrink: 0, 
          // ⭐ 適配深色模式：Header 背景色
          background: 'var(--color-surface)', 
          borderBottom: '1px solid var(--color-border)', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 16px', 
          zIndex: 100,
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}>
          {/* 左側按鈕區域：確保按鈕顏色也繼承變數 */}
          <div style={{ width: 48, display: 'flex', alignItems: 'center', color: 'var(--color-text-main)' }}>{left}</div>
          
          {/* 標題：適配文字變數 */}
          <div style={{ 
            flex: 1, 
            textAlign: 'center', 
            fontWeight: 800, 
            fontSize: 18, 
            color: 'var(--color-text-main)' 
          }}>
            {title}
          </div>
          
          <div style={{ width: 48, textAlign: 'right', color: 'var(--color-text-main)' }}>{right}</div>
        </header>

        {/* 唯一可滾動區域 */}
        <main style={{
          flex: 1, 
          overflowY: 'auto',      // ⭐ 滾輪只會出現在這裡
          WebkitOverflowScrolling: 'touch',
          position: 'relative'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
export default AppLayout;