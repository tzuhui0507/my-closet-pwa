// src/pages/OutfitPage.jsx
import { useState, useRef } from 'react'
import * as htmlToImage from 'html-to-image'
import { Plus, ArrowLeft, ZoomIn, ZoomOut, Layers, Trash2, Info, Check, X, MapPin, Thermometer } from 'lucide-react'
import ToolbarButton from '../components/ToolbarButton'
import BottomSheet from '../components/BottomSheet'
import OutfitItem from '../components/OutfitItem'

// 使用 CSS 變數適配深色模式
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: 6 };
const labelStyle = { fontSize: 13, color: 'var(--color-text-sub)', fontWeight: 500, paddingLeft: 4 };
const inputStyle = { 
  width: '100%', padding: '12px', borderRadius: 12, 
  border: '1px solid var(--color-border)', 
  backgroundColor: 'var(--color-bg)', 
  color: 'var(--color-text-main)',
  fontSize: 15, outline: 'none' 
};

function OutfitPage({ outfits, setOutfits, currentOutfitId, setCurrentOutfitId, isEditing, setIsEditing, allClosetItems = [] }) {
  const outfitRef = useRef(null)
  const [activeItemId, setActiveItemId] = useState(null)
  const [showInfoSheet, setShowInfoSheet] = useState(false)
  const [showAddItemSheet, setShowAddItemSheet] = useState(false)
  const [tempData, setTempData] = useState({ name: '', occasion: '', temperature: '', note: '' });

  const currentOutfit = outfits.find(o => o.id === currentOutfitId) || { items: [], name: '新穿搭', occasion: '', temperature: '', note: '' }
  const outfitItems = currentOutfit.items || []

  function updateCurrentOutfit(payload) {
    const next = outfits.map(o => o.id === currentOutfitId ? { ...o, ...payload } : o)
    setOutfits(next)
    localStorage.setItem('closet-outfits', JSON.stringify(next))
  }

  // --- 操作邏輯 ---

  const handleScale = (factor) => {
    if (!activeItemId) return;
    const nextItems = outfitItems.map(item => 
      item.id === activeItemId ? { ...item, scale: (item.scale || 1) * factor } : item
    );
    updateCurrentOutfit({ items: nextItems });
  };

  const handleBringToFront = () => {
    if (!activeItemId) return;
    const targetItem = outfitItems.find(i => i.id === activeItemId);
    const otherItems = outfitItems.filter(i => i.id !== activeItemId);
    updateCurrentOutfit({ items: [...otherItems, targetItem] });
  };

  const handleDelete = () => {
    if (!activeItemId) return;
    const nextItems = outfitItems.filter(item => item.id !== activeItemId);
    updateCurrentOutfit({ items: nextItems });
    setActiveItemId(null);
  };

  const handleOpenInfo = () => {
    setTempData({ 
      name: currentOutfit.name || '', 
      occasion: currentOutfit.occasion || '', 
      temperature: currentOutfit.temperature || '', 
      note: currentOutfit.note || '' 
    });
    setShowInfoSheet(true);
  };

  const handleExitEdit = async () => {
    setActiveItemId(null);
    let previewUrl = currentOutfit.preview;
    if (outfitRef.current) {
      try {
        await new Promise(r => setTimeout(r, 150));
        // 生成預覽圖時建議維持白色背景，以確保圖片在各種設備上的可讀性
        previewUrl = await htmlToImage.toPng(outfitRef.current, { pixelRatio: 1, backgroundColor: '#ffffff' });
      } catch (err) { console.error(err); }
    }
    updateCurrentOutfit({ preview: previewUrl });
    setIsEditing(false);
  }

  // --- 模式 A：總覽介面 ---
  if (!isEditing) {
    return (
      <div style={{ padding: '20px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div 
          onClick={() => {
            const newId = crypto.randomUUID();
            const newOutfit = { id: newId, name: '新穿搭', items: [], occasion: '', temperature: '', note: '' };
            setOutfits([newOutfit, ...outfits]);
            setCurrentOutfitId(newId);
            setIsEditing(true);
          }}
          style={{ 
            height: '360px', 
            border: '2px dashed var(--color-border)', 
            borderRadius: 24, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
            color: 'var(--color-text-sub)', cursor: 'pointer', 
            background: 'var(--color-surface)' 
          }}
        >
          <Plus size={32} />
          <span style={{ fontSize: 13, marginTop: 8, fontWeight: 600 }}>建立新穿搭</span>
        </div>

        {outfits.map(outfit => (
          <div key={outfit.id} onClick={() => { setCurrentOutfitId(outfit.id); setIsEditing(true); }} 
            style={{ 
              background: 'var(--color-surface)', 
              borderRadius: 24, padding: '12px', 
              boxShadow: '0 4px 15px var(--shadow-color)', 
              cursor: 'pointer', display: 'flex', flexDirection: 'column', 
              border: '1px solid var(--color-border)', 
              height: '360px' 
            }}
          >
            <div style={{ height: '185px', background: 'var(--color-bg)', borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
              {outfit.preview ? <img src={outfit.preview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eee' }}><Plus size={20} /></div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--color-text-main)' }}>{outfit.name || '新穿搭'}</div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {outfit.occasion && (
                  <div style={{ background: 'var(--tag-bg-blue)', color: 'var(--tag-text-blue)', padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} strokeWidth={2.5} />
                    {outfit.occasion}
                  </div>
                )}
                {outfit.temperature && (
                  <div style={{ background: 'var(--tag-bg-orange)', color: 'var(--tag-text-orange)', padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Thermometer size={12} strokeWidth={2.5} />
                    {outfit.temperature}°C
                  </div>
                )}
              </div>

              {outfit.note && <div style={{ fontSize: '11px', color: 'var(--color-text-sub)', backgroundColor: 'var(--color-bg)', padding: '8px 10px', borderRadius: '12px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{outfit.note}</div>}
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0', fontSize: '10px', color: 'var(--color-text-sub)', borderTop: '1px solid var(--color-border)' }}>
              <span>{outfit.items?.length || 0} 件單品</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // --- 模式 B：編輯模式 ---
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
      {/* Header 適配 */}
      <div style={{ height: 60, background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-main)' }} onClick={handleExitEdit}><ArrowLeft size={20}/></button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 18, color: 'var(--color-text-main)' }}>{currentOutfit.name || '編輯穿搭'}</div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-main)' }} onClick={handleOpenInfo}><Info size={20}/></button>
      </div>

      {/* 畫布適配 */}
      <div style={{ flex: 1, position: 'relative', margin: '16px', background: 'var(--color-surface)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 20px var(--shadow-color)', touchAction: 'none' }}>
        <div ref={outfitRef} style={{ width: '100%', height: '100%', position: 'relative' }} onPointerDown={(e) => { if (e.target === e.currentTarget) setActiveItemId(null) }}>
          {outfitItems.map((item) => (
            <OutfitItem 
              key={item.id} 
              item={item} 
              active={item.id === activeItemId} 
              onSelect={setActiveItemId} 
              outfitItems={outfitItems} 
              setOutfitItems={nextItems => updateCurrentOutfit({ items: nextItems })} 
            />
          ))}
        </div>
      </div>

      {/* Toolbar 適配 */}
      <div style={{ background: 'var(--color-surface)', padding: '12px 16px env(safe-area-inset-bottom, 24px)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-around', flexShrink: 0 }}>
        <ToolbarButton Icon={Plus} label="新增" onClick={() => setShowAddItemSheet(true)} />
        <ToolbarButton Icon={ZoomIn} label="放大" disabled={!activeItemId} onClick={() => handleScale(1.1)} />
        <ToolbarButton Icon={ZoomOut} label="縮小" disabled={!activeItemId} onClick={() => handleScale(0.9)} />
        <ToolbarButton Icon={Layers} label="置頂" disabled={!activeItemId} onClick={handleBringToFront} />
        <ToolbarButton Icon={Trash2} label="刪除" danger disabled={!activeItemId} onClick={handleDelete} />
      </div>

      {/* 穿搭資訊 Sheet 適配 */}
      <BottomSheet visible={showInfoSheet} onClose={() => setShowInfoSheet(false)}>
        <div style={{ padding: '0 8px 24px', color: 'var(--color-text-main)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <button onClick={() => setShowInfoSheet(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)' }}><X size={24} /></button>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>穿搭資訊</h3>
            <button onClick={() => { updateCurrentOutfit(tempData); setShowInfoSheet(false); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)' }} ><Check size={26} strokeWidth={3} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={inputGroupStyle}><label style={labelStyle}>名稱</label><input value={tempData.name} onChange={e => setTempData({ ...tempData, name: e.target.value })} style={inputStyle} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={inputGroupStyle}><label style={labelStyle}>場合</label><input value={tempData.occasion} onChange={e => setTempData({ ...tempData, occasion: e.target.value })} style={inputStyle} /></div>
              <div style={inputGroupStyle}><label style={labelStyle}>溫度</label><input type="number" value={tempData.temperature} onChange={e => setTempData({ ...tempData, temperature: e.target.value })} style={inputStyle} /></div>
            </div>
            <div style={inputGroupStyle}><label style={labelStyle}>備註</label><textarea value={tempData.note} onChange={e => setTempData({ ...tempData, note: e.target.value })} style={{ ...inputStyle, minHeight: 100 }} /></div>
          </div>
        </div>
      </BottomSheet>

      {/* 選擇單品 Sheet 適配 */}
      <BottomSheet visible={showAddItemSheet} onClose={() => setShowAddItemSheet(false)}>
        <div style={{ paddingBottom: 20, color: 'var(--color-text-main)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: 20, fontWeight: 800 }}>選擇衣物</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {allClosetItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => { 
                  const newItem = { id: crypto.randomUUID(), cutout: item.cutout || item.original, x: 50, y: 50, scale: 0.8 }; 
                  updateCurrentOutfit({ items: [...outfitItems, newItem] }); 
                  setShowAddItemSheet(false); 
                }} 
                style={{ background: 'var(--color-bg)', borderRadius: 24, padding: 8, aspectRatio: '1/1', display: 'flex', alignItems: 'center', cursor: 'pointer', border: '1px solid var(--color-border)' }}
              >
                <img src={item.cutout || item.original} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}

export default OutfitPage;