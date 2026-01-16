// src/App.jsx
import { useEffect, useState } from 'react'
import { LayoutGrid, Shirt, CalendarDays } from 'lucide-react' 

import ClosetPage from './pages/ClosetPage'
import OutfitPage from './pages/OutfitPage'
import ItemDetailPage from './pages/ItemDetailPage'
import CalendarPage from './pages/CalendarPage'

/* ===== 常數定義 ===== */
const CATEGORY_ORDER = [
  { key: 'top', label: '上衣' },
  { key: 'bottom', label: '褲子' },
  { key: 'skirt', label: '裙子' },
  { key: 'outer', label: '外套' },
  { key: 'shoes', label: '鞋子' },
  { key: 'bag', label: '包包' }
]
const CATEGORY_LABEL = { 
  top: '上衣', bottom: '褲子', skirt: '裙子', 
  outer: '外套', shoes: '鞋子', bag: '包包' 
}
const COLOR_LABEL = { 
  black: '黑色', white: '白色', gray: '灰色', 
  blue: '藍色', red: '紅色', green: '綠色', 
  brown: '棕色', beige: '米色', pink: '粉色',
  purple: '紫色', yellow: '黃色', orange: '橘色'
}
const SEASON_LABEL = { 
  spring: '春天', summer: '夏天', fall: '秋天', 
  winter: '冬天', all: '四季' 
}

function App() {
  /* ===== 狀態控制 ===== */
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('closet') 
  const [isEditing, setIsEditing] = useState(false)

  const [outfits, setOutfits] = useState(() => {
    const saved = localStorage.getItem('closet-outfits')
    return saved ? JSON.parse(saved) : [{ id: '1', name: '我的第一套', items: [], preview: null }]
  })
  const [currentOutfitId, setCurrentOutfitId] = useState(null)

  const [calendarLogs, setCalendarLogs] = useState(() => {
    const saved = localStorage.getItem('closet-calendar')
    return saved ? JSON.parse(saved) : {}
  })

  const [filter, setFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState([]);
  const [seasonFilter, setSeasonFilter] = useState([]);

  /* ===== 資料持久化 ===== */
  useEffect(() => {
    const saved = localStorage.getItem('closet-items')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  function saveItems(next) {
    setItems(next)
    localStorage.setItem('closet-items', JSON.stringify(next))
  }

  function saveOutfits(next) {
    setOutfits(next)
    localStorage.setItem('closet-outfits', JSON.stringify(next))
  }

  function saveCalendarLogs(next) {
    setCalendarLogs(next)
    localStorage.setItem('closet-calendar', JSON.stringify(next))
  }

  /* ===== 圖片處理邏輯 ===== */
  function handleAdd(e, categoryKey) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        let width = img.width, height = img.height
        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        const newItem = { id: crypto.randomUUID(), original: compressedDataUrl, cutout: compressedDataUrl, category: categoryKey, color: null, seasons: [] }
        const next = [newItem, ...items];
        saveItems(next);
        setSelected(newItem);
      }
    }
    reader.readAsDataURL(file)
  }

  function removeBackground(item) {
    const img = new Image()
    img.src = item.original
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) data[i + 3] = 0;
      }
      ctx.putImageData(imageData, 0, 0);
      const result = canvas.toDataURL('image/png');
      const next = items.map(i => i.id === item.id ? { ...i, cutout: result } : i);
      saveItems(next);
      setSelected({ ...item, cutout: result });
    }
  }

  const handleEditOutfitFromCalendar = (outfit) => {
    setCurrentOutfitId(outfit.id);
    setMode('outfit');
    setIsEditing(true);
  };

  /* ===== 渲染控制 ===== */
  if (selected) {
    return (
      <ItemDetailPage
        item={selected} items={items} setItems={saveItems}
        setSelected={setSelected} onBack={() => setSelected(null)}
        onRemoveBackground={removeBackground}
        CATEGORY_LABEL={CATEGORY_LABEL} COLOR_LABEL={COLOR_LABEL} SEASON_LABEL={SEASON_LABEL}
      />
    )
  }

  // 使用 CSS 變數定義 UI 色彩
  const themeActive = 'var(--color-primary)';
  const inactiveColor = 'var(--color-text-sub)';

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', 
      height: '100vh', width: '100vw', 
      overflow: 'hidden', 
      backgroundColor: 'var(--color-bg)', position: 'fixed', top: 0, left: 0,
      transition: 'background-color 0.3s ease'
    }}>
      
      {/* 1. 唯一的固定 Header */}
      {!isEditing && (
        <header style={{
          height: 60, flexShrink: 0, 
          background: 'var(--color-surface)', 
          borderBottom: '1px solid var(--color-border)', 
          display: 'flex', 
          alignItems: 'center', padding: '0 16px', zIndex: 100,
          transition: 'background-color 0.3s ease'
        }}>
          <div style={{ width: 48 }}></div>
          <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 18, color: 'var(--color-text-main)' }}>
            {mode === 'closet' ? '我的衣櫥' : mode === 'outfit' ? '我的穿搭' : '穿搭日曆'}
          </div>
          <div style={{ width: 48 }}></div>
        </header>
      )}

      {/* 2. 唯一的捲動內容區 */}
      <main style={{ 
        flex: 1, 
        minHeight: 0, 
        overflowY: isEditing ? 'hidden' : 'auto', 
        WebkitOverflowScrolling: 'touch', 
        position: 'relative'
      }}>
        {mode === 'closet' && (
          <ClosetPage 
            items={items} setSelected={setSelected} handleAdd={handleAdd} 
            CATEGORY_ORDER={CATEGORY_ORDER} filter={filter} setFilter={setFilter} 
            colorFilter={colorFilter} setColorFilter={setColorFilter} 
            seasonFilter={seasonFilter} setSeasonFilter={setSeasonFilter} 
          />
        )}
        {mode === 'outfit' && (
          <OutfitPage 
            outfits={outfits} setOutfits={saveOutfits} 
            currentOutfitId={currentOutfitId} setCurrentOutfitId={setCurrentOutfitId} 
            isEditing={isEditing} setIsEditing={setIsEditing} allClosetItems={items} 
          />
        )}
        {mode === 'calendar' && (
          <CalendarPage 
            outfits={outfits} calendarLogs={calendarLogs} 
            setCalendarLogs={saveCalendarLogs} onEditOutfit={handleEditOutfitFromCalendar} 
          />
        )}
        
        {/* 底部墊片：確保內容捲到底時在 TabBar 上方 */}
        {!isEditing && <div style={{ height: 70 }} />}
      </main>

      {/* 3. 固定 Tab Bar */}
      {!isEditing && (
        <footer style={{
          height: 70, flexShrink: 0, 
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)', 
          paddingBottom: 'env(safe-area-inset-bottom)',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100,
          transition: 'background-color 0.3s ease'
        }}>
          <button onClick={() => setMode('closet')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', width: '33%', color: mode === 'closet' ? themeActive : inactiveColor }}>
            <LayoutGrid size={22} strokeWidth={mode === 'closet' ? 2.5 : 2} />
            <span style={{ fontSize: '11px', fontWeight: mode === 'closet' ? '700' : '500' }}>衣櫥</span>
          </button>
          <button onClick={() => setMode('outfit')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', width: '33%', color: mode === 'outfit' ? themeActive : inactiveColor }}>
            <Shirt size={22} strokeWidth={mode === 'outfit' ? 2.5 : 2} />
            <span style={{ fontSize: '11px', fontWeight: mode === 'outfit' ? '700' : '500' }}>穿搭</span>
          </button>
          <button onClick={() => setMode('calendar')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', width: '33%', color: mode === 'calendar' ? themeActive : inactiveColor }}>
            <CalendarDays size={22} strokeWidth={mode === 'calendar' ? 2.5 : 2} />
            <span style={{ fontSize: '11px', fontWeight: mode === 'calendar' ? '700' : '500' }}>日曆</span>
          </button>
        </footer>
      )}
    </div>
  )
}

export default App;