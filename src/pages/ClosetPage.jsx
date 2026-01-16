// src/pages/ClosetPage.jsx
import { useState, useEffect } from 'react'
import BottomSheet from '../components/BottomSheet'
import CategorySection from '../components/CategorySection'
import {
  Cloud, Eraser, Heart, Moon, Rainbow, SearchCheck, Sparkles, Star, X, Check
} from 'lucide-react'

/* ================= 1. 加深顏色與圖示樣式設定 ================= */
const CATEGORY_ICON = {
  top: Sparkles, bottom: Heart, skirt: Cloud, 
  outer: Moon, shoes: Star, bag: Rainbow 
}

// 加強飽和度：用於選中時的圖示背景、圖示主色與卡片邊框
const CATEGORY_STYLE = {
  top:   { main: '#FF5F5F', bg: '#FFE4E1' }, // 櫻花粉
  bottom: { main: '#FF8C00', bg: '#FFEFD5' }, // 奶油橘
  skirt:  { main: '#D4A017', bg: '#FFF9E3' }, // 檸檬黃
  outer:  { main: '#2E7D32', bg: '#E8F5E9' }, // 薄荷綠
  shoes:  { main: '#5C5CFF', bg: '#E6E6FA' }, // 薰衣草紫
  bag:    { main: '#FBC02D', bg: '#FAFAD2' }  // 暖陽黃
};

/* ================= 2. 優化網格選項元件 ================= */

function GridOption({ label, active, onClick, icon: Icon, typeKey, dotColor, emoji, isAll }) {
  // 取得對應顏色的深色版本與背景色
  const style = CATEGORY_STYLE[typeKey] || { main: 'var(--color-primary)', bg: 'var(--color-primary-soft)' };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '20px 10px',
        borderRadius: '24px',
        // ⭐ 適配深色模式：底色使用變數
        background: 'var(--color-surface)',
        // 選中時顯示對應深色的邊框
        border: `2.5px solid ${active ? style.main : 'var(--color-border)'}`,
        boxShadow: active ? `0 8px 20px var(--shadow-color)` : 'none',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        textAlign: 'center',
        gridColumn: isAll ? 'span 2' : 'span 1'
      }}
    >
      {Icon ? (
        <div style={{ 
          background: style.bg, 
          padding: '10px', 
          borderRadius: '16px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* 圖示顏色：維持各分類專屬飽和色 */}
          <Icon size={24} color={style.main} strokeWidth={2.8} />
        </div>
      ) : isAll ? (
        /* 放大 All 文字，視覺重量與 Icon 統一 */
        <div style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <span style={{ fontSize: '24px', fontWeight: 900, color: active ? style.main : 'var(--color-text-sub)' }}>All</span>
        </div>
      ) : dotColor ? (
        /* 移除白框，純顏色圓點顯示 */
        <div style={{ 
          width: 28, height: 28, borderRadius: '50%', backgroundColor: dotColor,
          border: dotColor === '#FFFFFF' ? '1px solid var(--color-border)' : 'none' 
        }} />
      ) : emoji ? (
        <span style={{ fontSize: 26 }}>{emoji}</span>
      ) : null}
      
      <span style={{ 
        fontSize: '15px', 
        fontWeight: active ? 900 : 500, 
        // ⭐ 適配深色模式：文字色使用變數
        color: active ? 'var(--color-text-main)' : 'var(--color-text-sub)' 
      }}>
        {label}
      </span>
    </div>
  );
}

function getColorHex(value) {
  const hexMap = {
    black: '#000000', white: '#FFFFFF', gray: '#8E8E8E', beige: '#F5F5DC',
    brown: '#8B4513', blue: '#4169E1', pink: '#FFC0CB', purple: '#912daa',
    yellow: '#FFFF00', orange: '#FFA500', green: '#2E8B57', red: '#FF0000'
  };
  return hexMap[value] || '#EEE';
}

/* ================= 3. Sheet Header 元件 ================= */

function SheetHeader({ title, onCancel, onConfirm }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '0 4px' }}>
      <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-sub)', display: 'flex' }}><X size={24} /></button>
      <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text-main)' }}>{title}</span>
      <button onClick={onConfirm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', display: 'flex' }}><Check size={26} strokeWidth={3} /></button>
    </div>
  )
}

/* ================= 4. 主要頁面組件 ================= */

function ClosetPage({
  items = [], setSelected, filter = 'all', setFilter, colorFilter = [], 
  setColorFilter, seasonFilter = [], setSeasonFilter, handleAdd, CATEGORY_ORDER
}) {
  const [sheet, setSheet] = useState(null)
  const [tempFilter, setTempFilter] = useState(filter)
  const [tempColor, setTempColor] = useState(colorFilter)
  const [tempSeason, setTempSeason] = useState(seasonFilter)

  useEffect(() => {
    if (sheet === 'category') setTempFilter(filter)
    if (sheet === 'color') setTempColor(colorFilter)
    if (sheet === 'season') setTempSeason(seasonFilter)
  }, [sheet, filter, colorFilter, seasonFilter])

  const handleConfirm = () => {
    if (sheet === 'category') setFilter(tempFilter)
    if (sheet === 'color') setColorFilter(tempColor)
    if (sheet === 'season') setSeasonFilter(tempSeason)
    setSheet(null)
  }

  const safeItems = Array.isArray(items) ? items : [];
  const hasActiveFilter = filter !== 'all' || colorFilter.length > 0 || seasonFilter.length > 0

  const filteredItems = safeItems.filter(item => {
    if (filter !== 'all' && item.category !== filter) return false
    if (colorFilter.length > 0 && item.color && !colorFilter.includes(item.color)) return false
    if (seasonFilter.length > 0) {
      const itemSeasons = item.seasons || ['all'];
      const isMatch = itemSeasons.includes('all') || itemSeasons.some(s => seasonFilter.includes(s));
      if (!isMatch) return false;
    }
    return true
  })

  return (
    <>
      <div style={{ padding: '20px 16px' }}>
        {/* 篩選卡片：適配深色模式 */}
        <div style={{ 
          background: 'var(--color-surface)', 
          borderRadius: 24, 
          padding: 20, 
          marginBottom: 24, 
          border: '1px solid var(--color-border)', 
          boxShadow: '0 4px 15px var(--shadow-color)' 
        }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-text-main)' }}>
              <SearchCheck size={20} />
              <span>篩選衣櫥</span>
           </div>
           <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <FilterChip label="分類" value={filter === 'all' ? '全部分類' : CATEGORY_ORDER.find(c => c.key === filter)?.label} onClick={() => setSheet('category')} />
              <FilterChip label="顏色" value={colorFilter.length === 0 ? '所有顏色' : `已選 ${colorFilter.length}`} onClick={() => setSheet('color')} />
              <FilterChip label="季節" value={seasonFilter.length === 0 ? '所有季節' : `已選 ${seasonFilter.length}`} onClick={() => setSheet('season')} />
              {hasActiveFilter && (
                <button 
                  onClick={() => { setFilter('all'); setColorFilter([]); setSeasonFilter([]); }} 
                  style={{ marginLeft: 'auto', padding: '10px 16px', borderRadius: 16, border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                >
                  <Eraser size={16} /> 清除
                </button>
              )}
           </div>
        </div>

        {/* 分類清單渲染 */}
        {CATEGORY_ORDER
          .filter(cat => filter === 'all' || cat.key === filter)
          .map(cat => {
            const visibleCategoryItems = filteredItems.filter(i => i.category === cat.key);
            const totalCategoryItems = safeItems.filter(i => i.category === cat.key);
            const countDisplay = totalCategoryItems.length === visibleCategoryItems.length ? `(${totalCategoryItems.length})` : `(${visibleCategoryItems.length}/${totalCategoryItems.length})`;

            return (
              <div key={cat.key} style={{ marginBottom: 20 }}>
                <CategorySection
                  title={`${cat.label} ${countDisplay}`}
                  items={visibleCategoryItems}
                  onItemClick={item => setSelected(item)}
                  onAddClick={() => {
                    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
                    input.onchange = e => handleAdd(e, cat.key); input.click();
                  }}
                  // 衣櫥卡片標題列維持淺色背景，適配深淺色模式由 CategorySection 內部處理
                  color={CATEGORY_STYLE[cat.key]?.bg || 'var(--color-primary-soft)'}
                  icon={CATEGORY_ICON[cat.key]}
                  categoryKey={cat.key}
                />
              </div>
            );
          })}
      </div>

      {/* 1. 選擇分類：2 欄 4 列佈局 */}
      <BottomSheet visible={sheet === 'category'} onClose={() => setSheet(null)}>
        <SheetHeader title="選擇分類" onCancel={() => setSheet(null)} onConfirm={handleConfirm} />
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '16px', 
          padding: '0 16px 24px' 
        }}>
          <GridOption isAll label="全部分類" active={tempFilter === 'all'} onClick={() => setTempFilter('all')} />
          {CATEGORY_ORDER.map(c => (
            <GridOption key={c.key} typeKey={c.key} label={c.label} active={tempFilter === c.key} onClick={() => setTempFilter(c.key)} icon={CATEGORY_ICON[c.key]} />
          ))}
        </div>
      </BottomSheet>

      {/* 2. 選擇顏色 */}
      <BottomSheet visible={sheet === 'color'} onClose={() => setSheet(null)}>
        <SheetHeader title="選擇顏色" onCancel={() => setSheet(null)} onConfirm={handleConfirm} />
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '14px', 
          padding: '0 12px 24px' 
        }}>
          {COLOR_OPTIONS.map(([value, label]) => {
            const checked = tempColor.includes(value);
            return (
              <GridOption key={value} label={label} active={checked} dotColor={getColorHex(value)} onClick={() => setTempColor(prev => checked ? prev.filter(v => v !== value) : [...prev, value])} />
            );
          })}
        </div>
      </BottomSheet>

      {/* 3. 選擇季節 */}
      <BottomSheet visible={sheet === 'season'} onClose={() => setSheet(null)}>
        <SheetHeader title="選擇季節" onCancel={() => setSheet(null)} onConfirm={handleConfirm} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, padding: '0 12px 24px' }}>
          {SEASON_OPTIONS.map(([value, label]) => {
            const checked = tempSeason.includes(value);
            return (
              <GridOption key={value} label={label} active={checked} emoji={value === 'spring' ? '🌸' : value === 'summer' ? '☀️' : value === 'fall' ? '🍂' : '❄️'} onClick={() => setTempSeason(prev => checked ? prev.filter(v => v !== value) : [...prev, value])} />
            );
          })}
        </div>
      </BottomSheet>
    </>
  )
}

function FilterChip({ label, value, onClick }) {
  return (
    <button onClick={onClick} style={{ 
      padding: '10px 18px', 
      borderRadius: 16, 
      border: '1px solid var(--color-border)', 
      background: 'var(--color-surface)', 
      fontSize: 13, fontWeight: 500, 
      display: 'flex', gap: 8, cursor: 'pointer',
      color: 'var(--color-text-main)'
    }}>
      <span style={{ color: 'var(--color-text-sub)' }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </button>
  )
}

const COLOR_OPTIONS = [['black', '黑色'], ['white', '白色'], ['gray', '灰色'], ['beige', '米色'], ['brown', '棕色'], ['blue', '藍色'], ['pink', '粉色'], ['purple', '紫色'], ['yellow', '黃色'], ['orange', '橘色'], ['green', '綠色'], ['red', '紅色']]
const SEASON_OPTIONS = [['spring', '春天'], ['summer', '夏天'], ['fall', '秋天'], ['winter', '冬天']]

export default ClosetPage;