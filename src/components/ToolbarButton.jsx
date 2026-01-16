// src/components/ToolbarButton.jsx
function ToolbarButton({ Icon, label, onClick, disabled, danger }) {
  const color = danger
    ? '#d05c5c'
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
        gap: 4,
        color,
        fontSize: 12,
        cursor: disabled ? 'default' : 'pointer'
      }}
    >
      <Icon size={22} strokeWidth={1.8} />
      <div>{label}</div>
    </button>
  )
}

export default ToolbarButton