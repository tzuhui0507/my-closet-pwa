// src/components/CategorySection.jsx
import { PlusCircle } from 'lucide-react'

/* ⭐ 僅定義 Icon 本身的深色系，用於提升白色背景上的對比度 */
const DEEP_ICON_COLOR = {
  top:   '#FF5F5F', // 櫻花粉加深
  bottom: '#FF8C00', // 奶油橘加深
  skirt:  '#D4A017', // 檸檬黃加深
  outer:  '#2E7D32', // 薄荷綠加深
  shoes:  '#5C5CFF', // 薰衣草紫加深
  bag:    '#FBC02D'  // 暖陽黃加深
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
    return '#6D6D6D'; // 預設深灰色
  };

  const activeDeepColor = getDeepColor();

  return (
    <div style={{
      marginBottom: 20,
      borderRadius: 28, 
      overflow: 'hidden',
      background: '#fff',
      boxShadow: `0 8px 20px ${color}33`,
      transition: 'transform 0.2s ease-in-out'
    }}>
      {/* ===== 分類 Header ===== */}
      <div
        style={{
          height: 52,
          padding: '0 16px',
          backgroundColor: color, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#6D6D6D', 
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {Icon && (
            <div style={{ 
              /* ⭐ 維持白色底色方塊不變 */
              background: '#fff', 
              padding: '5px', 
              borderRadius: '10px', 
              display: 'flex',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              {/* ⭐ 修正點：僅加深 Icon 顏色，並加粗 strokeWidth 至 3 */}
              <Icon size={16} color={activeDeepColor} strokeWidth={1.5} /> 
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
            opacity: 0.7
          }}
        >
          <PlusCircle size={20} color="#6D6D6D" />
        </button>
      </div>

      {/* ===== 內容區保持原樣 ===== */}
      <div
        style={{
          padding: 16,
          minHeight: 80,
          background:
            items.length === 0
              ? 'repeating-linear-gradient(45deg, #f6f2f0, #f6f2f0 6px, #faf7f5 6px, #faf7f5 12px)'
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
              width: 64,
              height: 64,
              objectFit: 'cover',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
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
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: 16,
            border: '1px dashed rgba(0,0,0,0.1)',
            marginTop: 10
          }}>
            <span style={{ fontSize: 20, color: '#9E9E9E', marginBottom: 8, fontWeight: 'bold' }}>
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
            <div style={{ color: '#AFAFAF', fontSize: 13 }}>
              {totalCount === 0 ? '尚未新增喔' : '找不到東西呢'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategorySection;