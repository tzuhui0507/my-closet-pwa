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
const CATEGORY_LABEL = { top: '上衣', bottom: '褲子', skirt: '裙子', outer: '外套', shoes: '鞋子', bag: '包包' }
const COLOR_LABEL = { black: '黑色', white: '白色', gray: '灰色', blue: '藍色', red: '紅色', green: '綠色', brown: '棕色', beige: '米色', pink: '粉色', purple: '紫色', yellow: '黃色', orange: '橘色' }
const SEASON_LABEL = { spring: '春天', summer: '夏天', fall: '秋天', winter: '冬天', all: '四季' }

function App() {
  /* ===== 狀態控制 ===== */
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('closet') 
  const [isEditing, setIsEditing] = useState(false)
  const [outfits, setOutfits] = useState(() => {
    const saved = localStorage.getItem('closet-outfits');
    return saved ? JSON.parse(saved) : [{ id: '1', name: '我的第一套', items: [], preview: null }];
  });
  const [currentOutfitId, setCurrentOutfitId] = useState(null)
  const [calendarLogs, setCalendarLogs] = useState(() => {
    const saved = localStorage.getItem('closet-calendar');
    return saved ? JSON.parse(saved) : {};
  });
  const [filter, setFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState([]);
  const [seasonFilter, setSeasonFilter] = useState([]);

  /* ===== 資料持久化 & 處理邏輯 ===== */
  useEffect(() => {
    const saved = localStorage.getItem('closet-items')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  function saveItems(next) { setItems(next); localStorage.setItem('closet-items', JSON.stringify(next)); }
  function saveOutfits(next) { setOutfits(next); localStorage.setItem('closet-outfits', JSON.stringify(next)); }
  function saveCalendarLogs(next) { setCalendarLogs(next); localStorage.setItem('closet-calendar', JSON.stringify(next)); }

  function handleAdd(e, categoryKey) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image(); img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; let width = img.width, height = img.height;
        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        const newItem = { id: crypto.randomUUID(), original: compressedDataUrl, cutout: compressedDataUrl, category: categoryKey, color: null, seasons: [] };
        const next = [newItem, ...items]; saveItems(next); setSelected(newItem);
      }
    }
    reader.readAsDataURL(file);
  }

  function removeBackground(item) {
    const img = new Image(); img.src = item.original;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) { if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) data[i + 3] = 0; }
      ctx.putImageData(imageData, 0, 0);
      const result = canvas.toDataURL('image/png');
      const next = items.map(i => i.id === item.id ? { ...i, cutout: result } : i);
      saveItems(next); setSelected({ ...item, cutout: result });
    }
  }

  const handleEditOutfitFromCalendar = (outfit) => { setCurrentOutfitId(outfit.id); setMode('outfit'); setIsEditing(true); };

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

  return (
    <div className="app-container">
      {/* 1. Header：背景延伸到動態島下方 */}
      {!isEditing && (
        <header className="header">
          <div className="header-title">
            {mode === 'closet' ? '我的衣櫥' : mode === 'outfit' ? '我的穿搭' : '穿搭日曆'}
          </div>
        </header>
      )}

      {/* 2. Content Area：主要捲動區塊 */}
      <main className={`main-content ${isEditing ? 'no-scroll' : ''}`}>
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
      </main>

      {/* 3. Tab Bar：模仿 IG 沉浸式效果 */}
      {!isEditing && (
        <footer className="tab-bar">
          <div 
            className={`tab-item ${mode === 'closet' ? 'active' : ''}`} 
            onClick={() => setMode('closet')}
          >
            <LayoutGrid size={24} />
            <span>衣櫥</span>
          </div>
          <div 
            className={`tab-item ${mode === 'outfit' ? 'active' : ''}`} 
            onClick={() => setMode('outfit')}
          >
            <Shirt size={24} />
            <span>穿搭</span>
          </div>
          <div 
            className={`tab-item ${mode === 'calendar' ? 'active' : ''}`} 
            onClick={() => setMode('calendar')}
          >
            <CalendarDays size={24} />
            <span>日曆</span>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App;