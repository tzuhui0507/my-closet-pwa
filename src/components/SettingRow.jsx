// src/components/SettingRow.jsx
function SettingRow({ label, value, onClick, right }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 12px',
        borderBottom: '1px solid #eee',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div style={{ fontSize: 16 }}>{label}</div>

      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          color: '#666',
          fontSize: 15
        }}
      >
        {value}
        {right ?? <span style={{ marginLeft: 6 }}>›</span>}
      </div>
    </div>
  )
}

export default SettingRow