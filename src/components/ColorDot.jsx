// src/components/ColorDot.jsx

function ColorDot({ color, selected, onClick }) {
  // 定義顏色顯示邏輯
  const hexMap = {
    black: '#000000', white: '#FFFFFF', gray: '#8E8E8E', beige: '#F5F5DC',
    brown: '#8B4513', blue: '#4169E1', pink: '#FFC0CB', purple: '#912daa',
    yellow: '#FFFF00', orange: '#FFA500', green: '#2E8B57', red: '#FF0000'
  };

  // 取得真實色碼
  const realColor = hexMap[color] || color;

  return (
    <div
      onClick={onClick}
      style={{
        width: 40, // 稍微放大一點更好點擊
        height: 40,
        borderRadius: '50%',
        background: realColor,
        // ⭐ 適配深色模式：選中時改用主題色或主文字色邊框
        border: selected 
          ? `3px solid var(--color-primary)` 
          : `1px solid var(--color-border)`,
        // 如果是白色點，在淺色模式下增加一點點陰影
        boxShadow: (realColor.toUpperCase() === '#FFFFFF' || color === 'white') 
          ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' 
          : active ? '0 4px 10px var(--shadow-color)' : 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: selected ? 'scale(1.1)' : 'scale(1)'
      }}
    />
  )
}

export default ColorDot;