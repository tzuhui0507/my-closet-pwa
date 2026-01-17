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
        // 確保畫布起始是透明的
        ctx.clearRect(0, 0, width, height); 
        ctx.drawImage(img, 0, 0, width, height);
        
        // 🚀 關鍵修正：改用 image/png 才能保留透明背景
        const compressedDataUrl = canvas.toDataURL('image/png'); 
        
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
    img.crossOrigin = "Anonymous"; // 避免跨域權限問題
    img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width; canvas.height = img.height;
        // 🚀 關鍵修正：明確要求支援 alpha 通道
        const ctx = canvas.getContext('2d', { alpha: true }); 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
        // 簡易判斷白色
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

  const themeColor = '#B18F89';
  const inactiveColor = '#A8A8A8';

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', 
      height: '100vh', width: '100vw', 
      overflow: 'hidden', // ⭐ 鎖死最外層，根除雙滾輪
      backgroundColor: '#F5F0E9', position: 'fixed', top: 0, left: 0
    }}>
      
      {/* 1. 唯一的固定 Header */}
      {!isEditing && (
        <header style={{
          height: 60, flexShrink: 0, background: '#fff', 
          borderBottom: '1px solid #eee', display: 'flex', 
          alignItems: 'center', padding: '0 16px', zIndex: 100
        }}>
          <div style={{ width: 48 }}></div>
          <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 18, color: '#4A4238' }}>
            {mode === 'closet' ? '我的衣櫥' : mode === 'outfit' ? '我的穿搭' : '穿搭日曆'}
          </div>
          <div style={{ width: 48 }}></div>
        </header>
      )}

      {/* 2. 唯一的捲動內容區 */}
      <main style={{ 
        flex: 1, 
        minHeight: 0, // ⭐ 防止子元素撐開父容器
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
        {!isEditing && <div style={{ height: 60 }} />}
      </main>

      {/* 3. 固定 Tab Bar */}
      {!isEditing && (
        <footer style={{
          height: 70, flexShrink: 0, borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fff', paddingBottom: 'env(safe-area-inset-bottom)',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100
        }}>
          <button onClick={() => setMode('closet')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', width: '33%', color: mode === 'closet' ? themeColor : inactiveColor }}>
            <LayoutGrid size={22} strokeWidth={mode === 'closet' ? 2.5 : 2} />
            <span style={{ fontSize: '11px', fontWeight: mode === 'closet' ? '700' : '500' }}>衣櫥</span>
          </button>
          <button onClick={() => setMode('outfit')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', width: '33%', color: mode === 'outfit' ? themeColor : inactiveColor }}>
            <Shirt size={22} strokeWidth={mode === 'outfit' ? 2.5 : 2} />
            <span style={{ fontSize: '11px', fontWeight: mode === 'outfit' ? '700' : '500' }}>穿搭</span>
          </button>
          <button onClick={() => setMode('calendar')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', width: '33%', color: mode === 'calendar' ? themeColor : inactiveColor }}>
            <CalendarDays size={22} strokeWidth={mode === 'calendar' ? 2.5 : 2} />
            <span style={{ fontSize: '11px', fontWeight: mode === 'calendar' ? '700' : '500' }}>日曆</span>
          </button>
        </footer>
      )}
    </div>
  )
}

export default App;