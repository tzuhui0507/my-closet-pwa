// src/components/ToolbarButton.jsx

function ToolbarButton({ Icon, label, onClick, disabled, danger }) {
  // 🌓 適配深色模式的顏色邏輯
  const color = danger
    ? (disabled ? '#AFAFAF' : '#FF5F5F') // 危險狀態使用更亮的紅，禁用時變灰
    : disabled
    ? 'var(--color-text-sub)'
    : 'var(--color-text-main)'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        background: 'none',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6, // 稍微加大間距提升精緻感
        color,
        fontSize: 12,
        fontWeight: 600, // 增加字重使其更易讀
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1, // 透過透明度更直觀地表達禁用狀態
        transition: 'all 0.2s ease',
        padding: '8px 0'
      }}
    >
      {/* ⭐ 這裡特別加粗了 strokeWidth 配合整體設計感 */}
      <Icon size={22} strokeWidth={2.2} />
      <div style={{ marginTop: 2 }}>{label}</div>
    </button>
  )
}

export default ToolbarButton;