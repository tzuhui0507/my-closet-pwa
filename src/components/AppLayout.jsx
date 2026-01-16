// src/components/AppLayout.jsx
function AppLayout({ title, left, right, children }) {
  return (
    <div style={{
      height: '100vh',        // 鎖定視窗高度
      width: '100%',
      background: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      overflow: 'hidden'      // ⭐ 鎖死外層大滾輪
    }}>
      <div style={{
        width: '100%', 
        maxWidth: 1200, 
        background: '#F5F0E9', // 奶茶色背景
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh'
      }}>
        {/* 固定 Header：不參與捲動 */}
        <header style={{
          height: 60, flexShrink: 0, background: '#fff', 
          borderBottom: '1px solid #eee', display: 'flex', 
          alignItems: 'center', padding: '0 16px', zIndex: 100
        }}>
          <div style={{ width: 48 }}>{left}</div>
          <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 18, color: '#4A4238' }}>{title}</div>
          <div style={{ width: 48, textAlign: 'right' }}>{right}</div>
        </header>

        {/* 唯一可滾動區域 */}
        <main style={{
          flex: 1, 
          overflowY: 'auto',      // ⭐ 滾輪只會出現在這裡
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