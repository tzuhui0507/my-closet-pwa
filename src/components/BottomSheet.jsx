// src/components/BottomSheet.jsx

function BottomSheet({ visible, onClose, children }) {
  if (!visible) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        // ⭐ 深色模式下稍微加深遮罩透明度
        background: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 1000,
        backdropFilter: 'blur(4px)', // 加入毛玻璃效果提升質感
        transition: 'all 0.3s ease'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // ⭐ 適配深色模式：背景使用表面色變數
          background: 'var(--color-surface)',
          borderTopLeftRadius: 32, // 加大圓角更有現代感
          borderTopRightRadius: 32,
          padding: '12px 16px 32px', // 適配手機底部安全區
          maxHeight: '85vh', // 稍微增加最大高度
          overflowY: 'auto',
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.15)',
          borderTop: '1px solid var(--color-border)',
          transition: 'background-color 0.3s ease'
        }}
      >
        {/* ⭐ 加入頂部手柄條 (Handle Bar) */}
        <div style={{
          width: 40,
          height: 5,
          backgroundColor: 'var(--color-border)',
          borderRadius: 2.5,
          margin: '0 auto 20px',
          opacity: 0.6
        }} />

        <div style={{ color: 'var(--color-text-main)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default BottomSheet;