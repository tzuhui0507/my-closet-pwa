// src/components/SettingRow.jsx

function SettingRow({ label, value, onClick, right }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 12px', // 稍微加大內距提升點擊舒適度
        // ⭐ 適配深色模式：邊框顏色使用變數
        borderBottom: '1px solid var(--color-border)',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: 'var(--color-surface)', // 確保底色一致
        transition: 'background-color 0.2s ease'
      }}
    >
      {/* ⭐ 適配深色模式：標題文字顏色 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 600, 
        color: 'var(--color-text-main)' 
      }}>
        {label}
      </div>

      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          // ⭐ 適配深色模式：次要文字顏色
          color: 'var(--color-text-sub)',
          fontSize: 15,
          fontWeight: 500
        }}
      >
        {value}
        {/* ⭐ 右側箭頭圖示顏色同步適配 */}
        {right ?? (
          <span style={{ 
            marginLeft: 8, 
            fontSize: 18, 
            opacity: 0.5, 
            color: 'var(--color-text-sub)' 
          }}>
            ›
          </span>
        )}
      </div>
    </div>
  )
}

export default SettingRow;