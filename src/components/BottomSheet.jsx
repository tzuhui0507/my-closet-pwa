// src/components/BottomSheet.jsx
function BottomSheet({ visible, onClose, children }) {
  if (!visible) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.3)',
        zIndex: 1000
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 16,
          maxHeight: '70vh',
          overflowY: 'auto'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default BottomSheet