// src/components/OutfitItem.jsx
import { useRef } from 'react'

function OutfitItem({
  item,
  outfitItems,
  setOutfitItems,
  active,
  onSelect,
  readOnly = false
}) {
  const pointersRef = useRef(new Map())
  const startRef = useRef({
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    startDistance: null,
    startScale: 1
  })

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  // 修正：改用 ID 來尋找並更新單品，避免 index 錯位
  function updateItem(nextItemData) {
    if (readOnly) return 
    const nextItems = outfitItems.map(it => 
      it.id === item.id ? { ...it, ...nextItemData } : it
    )
    setOutfitItems(nextItems)
  }

  function onPointerDown(e) {
    if (readOnly) return 

    // 阻止冒泡，確保不會點到畫布背景
    e.stopPropagation();

    onSelect(item.id)
    
    // 鎖定指標，確保手指滑出圖片範圍也能繼續拖動
    e.currentTarget.setPointerCapture(e.pointerId)

    pointersRef.current.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY
    })

    // 紀錄起始點
    startRef.current.startX = e.clientX
    startRef.current.startY = e.clientY
    startRef.current.originX = item.x || 0
    startRef.current.originY = item.y || 0

    // 處理雙指縮放
    if (pointersRef.current.size === 2) {
      const [p1, p2] = [...pointersRef.current.values()]
      startRef.current.startDistance = distance(p1, p2)
      startRef.current.startScale = item.scale || 1
    }
  }

  function onPointerMove(e) {
    if (readOnly || !pointersRef.current.has(e.pointerId)) return

    pointersRef.current.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY
    })

    const pointers = [...pointersRef.current.values()]

    // 情況 A：單指拖拽
    if (pointers.length === 1) {
      const dx = e.clientX - startRef.current.startX
      const dy = e.clientY - startRef.current.startY
      
      updateItem({
        x: startRef.current.originX + dx,
        y: startRef.current.originY + dy
      })
    }

    // 情況 B：雙指縮放
    if (pointers.length === 2 && startRef.current.startDistance) {
      const newDistance = distance(pointers[0], pointers[1])
      const scale = Math.max(
        0.2,
        Math.min(
          3,
          startRef.current.startScale * (newDistance / startRef.current.startDistance)
        )
      )
      updateItem({ scale })
    }
  }

  function onPointerUp(e) {
    pointersRef.current.delete(e.pointerId)
    if (pointersRef.current.size < 2) {
      startRef.current.startDistance = null
    }
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'absolute',
        // 使用 translate3d 效能更好
        transform: `translate3d(${item.x}px, ${item.y}px, 0) scale(${item.scale || 1})`,
        transformOrigin: 'center center',
        zIndex: active ? 100 : 1,
        touchAction: 'none',
        cursor: readOnly ? 'default' : (active ? 'grabbing' : 'grab'),
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <img
        src={item.cutout}
        alt="單品"
        draggable="false"
        style={{
          display: 'block',
          width: '150px',
          height: 'auto',
          pointerEvents: 'none',
          // ⭐ 適配深色模式：選中外框改用主題變數
          outline: (active && !readOnly) ? `2.5px solid var(--color-primary)` : 'none',
          outlineOffset: '4px',
          borderRadius: '12px',
          // ⭐ 加入柔和陰影增加層次感
          boxShadow: active ? '0 8px 24px var(--shadow-color)' : 'none',
          transition: 'outline 0.15s ease, box-shadow 0.15s ease'
        }}
      />
    </div>
  )
}

export default OutfitItem;