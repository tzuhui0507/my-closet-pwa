// src/components/BottomTabBar.jsx
import { Shirt, LayoutGrid, Calendar } from 'lucide-react'

function TabItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        border: 'none',
        background: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6, // 稍微增加間距
        // ⭐ 適配深色模式：選中使用主題色，未選中使用副文字色
        color: active
          ? 'var(--color-primary)'
          : 'var(--color-text-sub)',
        fontSize: 12,
        fontWeight: active ? 800 : 500, // 選中時加粗文字
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        padding: '8px 0'
      }}
    >
      {/* ⭐ 根據 active 狀態動態調整圖示粗細 */}
      <Icon size={22} strokeWidth={active ? 3 : 2} />
      <div style={{ transform: active ? 'scale(1.05)' : 'scale(1)' }}>{label}</div>
    </button>
  )
}

function BottomTabBar({ current, onChange }) {
  return (
    <div
      style={{
        // 移除 position: 'fixed'
        height: 'calc(64px + env(safe-area-inset-bottom))', // 適配手機底部安全區域
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'var(--color-surface)', // ⭐ 適配深色模式：表面色變數
        borderTop: '1px solid var(--color-border)', // ⭐ 適配深色模式：邊框變數
        display: 'flex',
        width: '100%',
        boxShadow: '0 -4px 15px var(--shadow-color)', // 加入頂部陰影提升層次感
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      <TabItem
        icon={LayoutGrid}
        label="衣櫥"
        active={current === 'closet'}
        onClick={() => onChange('closet')}
      />
      <TabItem
        icon={Shirt}
        label="穿搭"
        active={current === 'outfit'}
        onClick={() => onChange('outfit')}
      />
      <TabItem
        icon={Calendar}
        label="日曆"
        active={current === 'calendar'}
        onClick={() => onChange('calendar')}
      />
    </div>
  )
}

export default BottomTabBar;