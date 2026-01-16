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
        gap: 4,
        color: active
          ? 'var(--color-primary)'
          : 'var(--color-text-sub)',
        fontSize: 12,
        cursor: 'pointer'
      }}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <div>{label}</div>
    </button>
  )
}

function BottomTabBar({ current, onChange }) {
  return (
    <div
      style={{
        // position: 'fixed', <-- 請刪除或註釋掉這一行
        height: 64,
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        width: '100%' // 確保撐滿
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

export default BottomTabBar