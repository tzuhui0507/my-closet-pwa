// src/components/CategorySection.jsx
import { PlusCircle } from 'lucide-react'

/* ⭐ 僅定義 Icon 本身的深色系，用於提升白色背景上的對比度 */
const DEEP_ICON_COLOR = {
  top:    '#FF5F5F', // 櫻花粉加深
  bottom: '#FF8C00', // 奶油橘加深
  skirt:  '#D4A017', // 檸檬黃加深
  outer:  '#2E7D32', // 薄荷綠加深
  shoes:  '#5C5CFF', // 薰衣草紫加深
  bag:    '#FBC02D'  // 暖陽黃加深
};

function CategorySection({
  title,
  items,
  totalCount = 0,
  onItemClick,
  onAddClick,
  color = 'var(--color-primary-soft)',
  icon: Icon = null
}) {
  
  /* ⭐ 根據標題自動匹配 Icon 的加深顏色 */
  const getDeepColor = () => {
    if (title.includes('上衣')) return DEEP_ICON_COLOR.top;
    if (title.includes('褲子')) return DEEP_ICON_COLOR.bottom;
    if (title.includes('裙子')) return DEEP_ICON_COLOR.skirt;
    if (title.includes('外套')) return DEEP_ICON_COLOR.outer;
    if (title.includes('鞋子')) return DEEP_ICON_COLOR.shoes;
    if (title.includes('包包')) return DEEP_ICON_COLOR.bag;
    return 'var(--color-text-main)'; // 預設使用主文字色
  };

  const activeDeepColor = getDeepColor();

  return (
    <div style={{
      marginBottom: 20,
      borderRadius: 28, 
      overflow: 'hidden',
      // ⭐ 適配深色模式：背景改用 surface 變數
      background: 'var(--color-surface)',
      boxShadow: `0 8px 20px var(--shadow-color)`,
      border: '1px solid var(--color-border)',
      transition: 'transform 0.2s ease-in-out'
    }}>
      {/* ===== 分類 Header ===== */}
      <div
        style={{
          height: 52,
          padding: '0 16px',
          // Header 背景維持傳入的淺色系 (color)
          backgroundColor: color, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--color-text-main)', 
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && (
            <div style={{ 
              /* ⭐ 維持白色底色方塊不變，確保 Icon 顏色跳脫 */
              background: '#fff', 
              padding: '6px', 
              borderRadius: '10px', 
              display: 'flex',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Icon size={16} color={activeDeepColor} strokeWidth={1.8} /> 
            </div>
          )}
          <span style={{ fontWeight: 800, fontSize: '15px' }}>{title}</span>
        </div>

        <button
          onClick={onAddClick}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.8
          }}
        >
          {/* 新增按鈕也改用主文字色 */}
          <PlusCircle size={22} color="var(--color-text-main)" />
        </button>
      </div>

      {/* ===== 內容區適配 ===== */}
      <div
        style={{
          padding: 16,
          minHeight: 80,
          background:
            items.length === 0
              ? 'repeating-linear-gradient(45deg, var(--color-bg), var(--color-bg) 6px, var(--color-surface) 6px, var(--color-surface) 12px)'
              : 'transparent',
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'flex-start'
        }}
      >
        {items.map((item) => (
          <img
            key={item.id}
            src={item.cutout}
            alt=""
            onClick={() => onItemClick(item)}
            style={{
              width: 66,
              height: 66,
              objectFit: 'cover',
              borderRadius: 14,
              cursor: 'pointer',
              backgroundColor: '#fff', // 確保去背圖在深色下有白底
              boxShadow: '0 4px 10px var(--shadow-color)',
              border: '1.5px solid var(--color-border)'
            }}
          />
        ))}

        {items.length === 0 && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 0',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 16,
            border: '1px dashed var(--color-border)',
            marginTop: 10
          }}>
            <span style={{ fontSize: 22, color: 'var(--color-text-sub)', marginBottom: 8, fontWeight: 'bold' }}>
              {(() => {
                if (title.includes('上衣')) return '(〃∀〃)';
                if (title.includes('褲子')) return '(๑´ㅂ`๑)';
                if (title.includes('裙子')) return '(*´∀`)~♥';
                if (title.includes('外套')) return '꒰⑅ᵕ༚ᵕ꒱˖♡';
                if (title.includes('鞋子')) return '(òωó)ｂ';
                if (title.includes('包包')) return ' (σ′▽‵)′▽‵)σ';
                return '(´･ω･`)';
              })()}
            </span>
            <div style={{ color: 'var(--color-text-sub)', fontSize: 13, fontWeight: 500 }}>
              {totalCount === 0 ? '尚未新增喔' : '找不到東西呢'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategorySection;