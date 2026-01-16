// src/pages/ItemDetailPage.jsx
import { useState } from 'react'
import AppLayout from '../components/AppLayout'
import SettingRow from '../components/SettingRow'
import BottomSheet from '../components/BottomSheet'
import ColorDot from '../components/ColorDot'
import { ArrowLeft, Trash2, RotateCcw, Scissors } from 'lucide-react'

function ItemDetailPage({
  item,
  items,
  setItems,
  setSelected,
  onBack,
  onRemoveBackground,
  CATEGORY_LABEL,
  COLOR_LABEL,
  SEASON_LABEL
}) {
  const [showCategorySheet, setShowCategorySheet] = useState(false)
  const [showColorSheet, setShowColorSheet] = useState(false)
  const [showSeasonSheet, setShowSeasonSheet] = useState(false)

  if (!item) return null

  // 🚀 核心修正函數：同時更新清單與當前選中項
  const handleUpdate = (updates) => {
    const updatedItem = { ...item, ...updates };

    // 1. 更新 App.jsx 中的 items 總清單
    const nextItems = items.map(i =>
      i.id === item.id ? updatedItem : i
    );
    setItems(nextItems); 

    // 2. 關鍵：立即更新當前頁面正在使用的 selected 物件
    setSelected(updatedItem);
  };

  return (
    <AppLayout
      title="單品詳情"
      left={<button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer' }}><ArrowLeft size={20} /></button>}
    >
      <div style={{ padding: 16, backgroundColor: 'var(--color-bg)', minHeight: '100%' }}>
        {/* 圖片展示 - 適配背景色 */}
        <div style={{ 
          background: 'var(--color-surface)', 
          borderRadius: 24, 
          marginBottom: 16, 
          height: 320, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 15px var(--shadow-color)'
        }}>
          <img
            src={item.cutout}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* 去背按鈕 - 適配主題色 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button style={{ 
            flex: 1, padding: '12px 0', borderRadius: 16, border: 'none',
            background: 'var(--color-surface)', color: 'var(--color-text-main)',
            display: 'flex', justifyContent: 'center', gap: 8, fontWeight: 600,
            boxShadow: '0 2px 8px var(--shadow-color)', cursor: 'pointer'
          }} onClick={() => onRemoveBackground(item)}>
            <Scissors size={18} /> 去背
          </button>
          <button style={{ 
            flex: 1, padding: '12px 0', borderRadius: 16, border: 'none',
            background: 'var(--color-surface)', color: 'var(--color-text-main)',
            display: 'flex', justifyContent: 'center', gap: 8, fontWeight: 600,
            boxShadow: '0 2px 8px var(--shadow-color)', cursor: 'pointer'
          }} onClick={() => handleUpdate({ cutout: item.original })}>
            <RotateCcw size={18} /> 還原
          </button>
        </div>

        {/* 設定清單 - 適配深色模式容器 */}
        <div style={{ 
          background: 'var(--color-surface)', 
          borderRadius: 24, 
          overflow: 'hidden', 
          boxShadow: '0 4px 15px var(--shadow-color)', 
          marginBottom: 24,
          border: '1px solid var(--color-border)'
        }}>
          <SettingRow
            label="分類"
            value={CATEGORY_LABEL[item.category] || '未設定'}
            onClick={() => setShowCategorySheet(true)}
          />
          <SettingRow
            label="顏色"
            value={item.color ? COLOR_LABEL[item.color] : '未設定'}
            onClick={() => setShowColorSheet(true)}
          />
          <SettingRow
            label="季節"
            value={(item.seasons?.length > 0 ? item.seasons : ['all']).map(s => SEASON_LABEL[s]).join(', ')}
            onClick={() => setShowSeasonSheet(true)}
          />
        </div>

        {/* 刪除按鈕 */}
        <button
          style={{ 
            width: '100%', height: 52, borderRadius: 16, border: 'none', 
            background: 'var(--color-surface)', color: '#FF5F5F', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontWeight: 700, boxShadow: '0 4px 15px var(--shadow-color)', cursor: 'pointer'
          }}
          onClick={() => {
            if (window.confirm('確定要刪除嗎？')) {
              setItems(items.filter(i => i.id !== item.id));
              onBack();
            }
          }}
        >
          <Trash2 size={20} /> 刪除單品
        </button>
      </div>

      {/* 分類選擇 - 適配 BottomSheet 深色模式 */}
      <BottomSheet visible={showCategorySheet} onClose={() => setShowCategorySheet(false)}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, padding: '0 12px', color: 'var(--color-text-main)' }}>選擇分類</div>
        {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
          <div
            key={key}
            onClick={() => {
              handleUpdate({ category: key });
              setShowCategorySheet(false);
            }}
            style={{ 
              padding: '18px 12px', 
              borderBottom: '1px solid var(--color-border)', 
              cursor: 'pointer', 
              fontSize: 16,
              color: item.category === key ? 'var(--color-primary)' : 'var(--color-text-main)',
              fontWeight: item.category === key ? 700 : 400
            }}
          >
            {label} {item.category === key && ' ✓'}
          </div>
        ))}
      </BottomSheet>

      {/* 顏色選擇 */}
      <BottomSheet visible={showColorSheet} onClose={() => setShowColorSheet(false)}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, padding: '0 12px', color: 'var(--color-text-main)' }}>選擇顏色</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 12 }}>
          {Object.keys(COLOR_LABEL).map(color => (
            <div key={color} onClick={() => { handleUpdate({ color }); setShowColorSheet(false); }} style={{ cursor: 'pointer' }}>
              <ColorDot color={color} selected={item.color === color} />
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* 季節選擇 */}
      <BottomSheet visible={showSeasonSheet} onClose={() => setShowSeasonSheet(false)}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, padding: '0 12px', color: 'var(--color-text-main)' }}>選擇季節</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.keys(SEASON_LABEL).filter(s => s !== 'all').map(season => {
            const isChecked = (item.seasons || []).includes(season);
            return (
              <label key={season} style={{ 
                display: 'flex', alignItems: 'center', gap: 12, padding: '18px 12px', 
                borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
                color: 'var(--color-text-main)', fontSize: 16
              }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  style={{ width: 20, height: 20, accentColor: 'var(--color-primary)' }}
                  onChange={() => {
                    let nextSeasons = item.seasons || [];
                    nextSeasons = isChecked ? nextSeasons.filter(s => s !== season) : [...nextSeasons, season];
                    handleUpdate({ seasons: nextSeasons });
                  }}
                />
                {SEASON_LABEL[season]}
              </label>
            );
          })}
        </div>
      </BottomSheet>
    </AppLayout>
  );
}

export default ItemDetailPage;