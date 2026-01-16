// src/components/ColorDot.jsx
function ColorDot({ color, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: color,
        border: selected ? '3px solid #000' : '1px solid #ccc',
        cursor: 'pointer'
      }}
    />
  )
}

export default ColorDot