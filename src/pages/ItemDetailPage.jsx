// src/pages/ItemDetailPage.jsx
import { useState, useRef, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as bodyPix from '@tensorflow-models/body-pix'
import AppLayout from '../components/AppLayout'
import SettingRow from '../components/SettingRow'
import BottomSheet from '../components/BottomSheet'
import { 
  ArrowLeft, Trash2, RotateCcw, Scissors, X, Check, 
  Sparkles, Heart, Cloud, Moon, Star, Rainbow,
  Sun, Snowflake, Leaf, CloudSun, Loader2, Eraser, Save, Pencil, MousePointer2
} from 'lucide-react'

const CATEGORY_CONFIG = {
  top:    { icon: Sparkles,  main: '#FF5F5F', bg: '#FFE4E1' },
  bottom: { icon: Heart,     main: '#FF8C00', bg: '#FFEFD5' },
  skirt:  { icon: Cloud,     main: '#D4A017', bg: '#FFF9E3' },
  outer:  { icon: Moon,      main: '#2E7D32', bg: '#E8F5E9' },
  shoes:  { icon: Star,      main: '#5C5CFF', bg: '#E6E6FA' },
  bag:    { icon: Rainbow,   main: '#FBC02D', bg: '#FAFAD2' }
};

const SEASON_CONFIG = {
  spring: { icon: CloudSun,  main: '#FFB7B2', bg: '#FFF1F1' },
  summer: { icon: Sun,       main: '#FFD97D', bg: '#FFF9E5' },
  fall:   { icon: Leaf,      main: '#D4A373', bg: '#F9F4EF' },
  winter: { icon: Snowflake, main: '#A2D2FF', bg: '#F0F8FF' }
};

function ItemDetailPage({
  item, items, setItems, setSelected, onBack,
  CATEGORY_LABEL, COLOR_LABEL, SEASON_LABEL
}) {
  const [showCategorySheet, setShowCategorySheet] = useState(false)
  const [showColorSheet, setShowColorSheet] = useState(false)
  const [showSeasonSheet, setShowSeasonSheet] = useState(false)
  const [tempValue, setTempValue] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);

  // 🚀 精修相關狀態
  const [isEditing, setIsEditing] = useState(false);
  const [brushMode, setBrushMode] = useState('erase'); // 'erase' (減) 或 'restore' (加)
  const [brushSize, setBrushSize] = useState(20);
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  if (!item) return null

  const handleUpdate = (updates) => {
    const updatedItem = { ...item, ...updates };
    const nextItems = items.map(i => i.id === item.id ? updatedItem : i);
    setItems(nextItems);
    setSelected(updatedItem);
  };

  const renderModalHeader = (title, onConfirm) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '0 4px' }}>
      <button onClick={() => { setShowCategorySheet(false); setShowColorSheet(false); setShowSeasonSheet(false); }} 
              style={{ background: 'none', border: 'none', color: '#8E735B', cursor: 'pointer' }}>
        <X size={24} />
      </button>
      <div style={{ fontWeight: 800, fontSize: 18, color: '#4A4238' }}>{title}</div>
      <button onClick={onConfirm} 
              style={{ background: 'none', border: 'none', color: '#B18F89', cursor: 'pointer' }}>
        <Check size={26} strokeWidth={3} />
      </button>
    </div>
  );

  // --- 1. AI 自動去背 ---
  const handleAIRemoveBackground = async (targetItem) => {
    try {
      setIsRemoving(true);
      const net = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
      });
      const img = new Image();
      img.src = targetItem.original;
      img.crossOrigin = "Anonymous";
      img.onload = async () => {
        const segmentation = await net.segmentPerson(img, { internalResolution: 'medium', segmentationThreshold: 0.7 });
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        for (let i = 0; i < pixelData.length; i += 4) {
          if (segmentation.data[i / 4] === 0) { pixelData[i + 3] = 0; }
        }
        ctx.putImageData(imageData, 0, 0);
        handleUpdate({ cutout: canvas.toDataURL('image/png') });
        setIsRemoving(false);
      };
    } catch (error) {
      console.error(error);
      setIsRemoving(false);
    }
  };

  // --- 2. 手動精修畫布邏輯 ---
  useEffect(() => {
    if (isEditing && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const img = new Image();
      img.src = item.original;
      img.crossOrigin = "Anonymous";
      const cutoutImg = new Image();
      cutoutImg.src = item.cutout || item.original;
      cutoutImg.crossOrigin = "Anonymous";

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        // 建立隱藏畫布存放原圖，供「加回」使用
        const offCanvas = document.createElement('canvas');
        offCanvas.width = img.width;
        offCanvas.height = img.height;
        offCanvas.getContext('2d').drawImage(img, 0, 0);
        offscreenCanvasRef.current = offCanvas;

        cutoutImg.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(cutoutImg, 0, 0);
        };
      };
    }
  }, [isEditing, item.cutout, item.original]);

  const handleDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (brushMode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(offscreenCanvasRef.current, 0, 0); // 從原圖刷回來
      ctx.restore();
    }
  };

  return (
    <AppLayout
      title={isEditing ? "手動精修" : "單品詳情"}
      left={<button onClick={isEditing ? () => setIsEditing(false) : onBack} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={20} /></button>}
    >
      <div style={{ padding: 16 }}>
        {/* 🚀 圖片展示區 */}
        <div style={{ 
          background: isEditing ? 'url(https://www.transparenttextures.com/patterns/checkerboard.png)' : '#f5f5f5', 
          borderRadius: 12, marginBottom: 12, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' 
        }}>
          {isEditing ? (
            <canvas ref={canvasRef} onMouseMove={(e) => e.buttons === 1 && handleDraw(e)} onTouchMove={(e) => { e.preventDefault(); handleDraw(e); }} style={{ maxWidth: '100%', maxHeight: '100%', cursor: 'crosshair', touchAction: 'none' }} />
          ) : (
            <img src={item.cutout} style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: isRemoving ? 0.5 : 1 }} alt="item cutout" />
          )}
          {isRemoving && (
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Loader2 className="animate-spin" size={32} color="#B18F89" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#5a4a47' }}>AI 處理中...</span>
            </div>
          )}
        </div>

        {/* 🚀 工具欄 */}
        {isEditing ? (
          <div style={{ background: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button onClick={() => setBrushMode('erase')} style={{ flex: 1, padding: 10, borderRadius: 12, border: 'none', display: 'flex', justifyContent: 'center', gap: 6, background: brushMode === 'erase' ? '#B18F89' : '#f5f5f5', color: brushMode === 'erase' ? '#fff' : '#8E735B' }}><Eraser size={18} /> 橡皮擦 (減)</button>
              <button onClick={() => setBrushMode('restore')} style={{ flex: 1, padding: 10, borderRadius: 12, border: 'none', display: 'flex', justifyContent: 'center', gap: 6, background: brushMode === 'restore' ? '#B18F89' : '#f5f5f5', color: brushMode === 'restore' ? '#fff' : '#8E735B' }}><Pencil size={18} /> 恢復畫筆 (加)</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: '#8E735B' }}>大小</span>
              <input type="range" min="5" max="60" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} style={{ flex: 1, accentColor: '#B18F89' }} />
              <span style={{ fontSize: 12, width: 20 }}>{brushSize}</span>
            </div>
            <button onClick={() => { handleUpdate({ cutout: canvasRef.current.toDataURL() }); setIsEditing(false); }} style={{ width: '100%', padding: '12px', background: '#4A4238', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 700, display: 'flex', justifyContent: 'center', gap: 8 }}><Save size={18} /> 儲存編輯</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            <button disabled={isRemoving} onClick={() => handleAIRemoveBackground(item)} style={{ padding: '12px 0', borderRadius: 12, border: '1px solid #eee', background: '#fff', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}><Scissors size={16} /> AI 去背</button>
            <button onClick={() => setIsEditing(true)} style={{ padding: '12px 0', borderRadius: 12, border: '1px solid #eee', background: '#fff', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}><MousePointer2 size={16} /> 手動精修</button>
            <button style={{ gridColumn: 'span 2', padding: '12px 0', borderRadius: 12, border: '1px solid #eee', background: '#fff', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }} onClick={() => handleUpdate({ cutout: item.original })}><RotateCcw size={16} /> 還原照片</button>
          </div>
        )}

        {/* 設定清單 (編輯時隱藏) */}
        {!isEditing && (
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 20 }}>
            <SettingRow label="分類" value={CATEGORY_LABEL[item.category] || '未設定'} onClick={() => { setTempValue(item.category); setShowCategorySheet(true); }} />
            <SettingRow label="顏色" value={item.color ? COLOR_LABEL[item.color] : '未設定'} onClick={() => { setTempValue(item.color); setShowColorSheet(true); }} />
            <SettingRow label="季節" value={(item.seasons?.length > 0 ? item.seasons : ['all']).map(s => SEASON_LABEL[s]).join(', ')} onClick={() => { setTempValue(item.seasons || []); setShowSeasonSheet(true); }} />
          </div>
        )}

        {!isEditing && (
          <button style={{ width: '100%', height: 52, borderRadius: 16, border: 'none', background: '#fff', color: '#d00', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
            onClick={() => { if (window.confirm('確定要刪除嗎？')) { setItems(items.filter(i => i.id !== item.id)); onBack(); } }}>
            <Trash2 size={18} /> 刪除單品
          </button>
        )}
      </div>

      {/* 🚀 彈窗選擇部分 (保留原有邏輯) */}
      <BottomSheet visible={showCategorySheet} onClose={() => setShowCategorySheet(false)}>
        {renderModalHeader("選擇分類", () => { handleUpdate({ category: tempValue }); setShowCategorySheet(false); })}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '0 8px 20px' }}>
          {Object.entries(CATEGORY_LABEL).map(([key, label]) => {
            const config = CATEGORY_CONFIG[key];
            const active = tempValue === key;
            return (
              <div key={key} onClick={() => setTempValue(key)} style={{
                padding: '24px 10px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer',
                background: '#fff', border: `2.5px solid ${active ? config.main : '#F5F0E9'}`, transition: 'all 0.2s'
              }}>
                <div style={{ background: config.bg, padding: '10px', borderRadius: '16px', display: 'flex' }}> <config.icon size={24} color={config.main} strokeWidth={2} /> </div>
                <div style={{ fontSize: 15, fontWeight: active ? 900 : 500, color: active ? '#4A4238' : '#8E735B' }}>{label}</div>
              </div>
            )
          })}
        </div>
      </BottomSheet>

      {/* 顏色彈窗 */}
      <BottomSheet visible={showColorSheet} onClose={() => setShowColorSheet(false)}>
        {renderModalHeader("選擇顏色", () => { handleUpdate({ color: tempValue }); setShowColorSheet(false); })}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, padding: '0 8px 20px' }}>
          {Object.entries(COLOR_LABEL).map(([key, label]) => {
            const active = tempValue === key;
            const hex = { black: '#000', white: '#FFF', gray: '#8E8E8E', beige: '#F5F5DC', brown: '#8B4513', blue: '#4169E1', pink: '#FFC0CB', purple: '#912daa', yellow: '#FFFF00', orange: '#FFA500', green: '#2E8B57', red: '#FF0000' }[key];
            return (
              <div key={key} onClick={() => setTempValue(key)} style={{
                padding: '20px 10px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer',
                background: '#fff', border: `2.5px solid ${active ? '#8E735B' : '#F5F0E9'}`
              }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: hex, border: key === 'white' ? '1px solid #EEE' : 'none' }} />
                <div style={{ fontSize: 14, fontWeight: active ? 900 : 500, color: active ? '#4A4238' : '#8E735B' }}>{label}</div>
              </div>
            )
          })}
        </div>
      </BottomSheet>

      {/* 季節彈窗 */}
      <BottomSheet visible={showSeasonSheet} onClose={() => setShowSeasonSheet(false)}>
        {renderModalHeader("選擇季節", () => { handleUpdate({ seasons: tempValue }); setShowSeasonSheet(false); })}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '0 8px 20px' }}>
          {Object.entries(SEASON_LABEL).filter(([k]) => k !== 'all').map(([key, label]) => {
            const config = SEASON_CONFIG[key];
            const safeTemp = Array.isArray(tempValue) ? tempValue : [];
            const active = safeTemp.includes(key);
            return (
              <div key={key} onClick={() => {
                const next = active ? safeTemp.filter(s => s !== key) : [...safeTemp, key];
                setTempValue(next);
              }} style={{
                padding: '24px 10px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer',
                background: '#fff', border: `2.5px solid ${active ? config.main : '#F5F0E9'}`
              }}>
                <div style={{ background: config.bg, padding: '10px', borderRadius: '16px', display: 'flex' }}> <config.icon size={26} color={config.main} strokeWidth={2.2} /> </div>
                <div style={{ fontSize: 15, fontWeight: active ? 900 : 500, color: active ? '#4A4238' : '#8E735B' }}>{label}</div>
              </div>
            );
          })}
        </div>
      </BottomSheet>
    </AppLayout>
  );
}

export default ItemDetailPage;