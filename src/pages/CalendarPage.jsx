// src/pages/CalendarPage.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Edit3, RefreshCcw } from 'lucide-react';

function CalendarPage({ outfits, calendarLogs, setCalendarLogs, onEditOutfit }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => null);

  const handlePrev = () => setViewDate(new Date(year, month - 1));
  const handleNext = () => setViewDate(new Date(year, month + 1));

  const currentOutfitId = calendarLogs[selectedDateStr];
  const currentOutfit = outfits.find(o => o.id === currentOutfitId);

  const handleSelectOutfit = (outfitId) => {
    const nextLogs = { ...calendarLogs, [selectedDateStr]: outfitId };
    setCalendarLogs(nextLogs);
    setShowPicker(false);
  };

  const themePink = '#FFE4E1';
  const accentPink = '#FF8A80';
  const textColor = '#8B5E52';

  return (
    <div style={{ 
      height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', 
      backgroundColor: '#F9F7F5', overflow: 'hidden', position: 'fixed', top: 0, left: 0 
    }}>
      
      {/* 1. Header */}
      <div style={{
        height: 60, display: 'flex', alignItems: 'center', padding: '0 16px',
        background: '#fff', borderBottom: '1px solid #e6dcd9', flexShrink: 0, zIndex: 100
      }}>
        <div style={{ width: 48 }} />
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 16, color: '#5a4a47' }}>
          我的穿搭日曆
        </div>
        <div style={{ width: 48 }} />
      </div>

      {/* 2. 內容區 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', boxSizing: 'border-box', overflow: 'hidden' }}>
        
        {/* 月份切換 */}
        <div style={{
          height: '52px', marginBottom: '12px', borderRadius: '20px', backgroundColor: themePink,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#fff', padding: '5px', borderRadius: '10px', display: 'flex' }}>
              <CalendarIcon size={16} color={accentPink} />
            </div>
            <span style={{ fontWeight: '800', fontSize: '16px', color: textColor }}>
              {year}年 {month + 1}月
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrev} style={navBtnStyle}><ChevronLeft size={22} color={accentPink} strokeWidth={3} /></button>
            <button onClick={handleNext} style={navBtnStyle}><ChevronRight size={22} color={accentPink} strokeWidth={3} /></button>
          </div>
        </div>

        {/* 日曆網格 */}
        <div style={{ 
          background: '#fff', padding: '12px', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
          flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '80px', minHeight: 0
        }}>
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', 
            gridTemplateRows: '28px repeat(5, 1fr)', gap: '6px', height: '100%' 
          }}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: '#6D6D6D', fontWeight: '800' }}>{d}</div>
            ))}
            
            {padding.concat(days).map((day, idx) => {
              const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
              const isSelected = selectedDateStr === dateStr;
              const outfitId = calendarLogs[dateStr];
              const dayOutfit = outfits.find(o => o.id === outfitId);

              return (
                <div 
                  key={idx} 
                  onClick={() => { 
                    if(!day) return;
                    setSelectedDateStr(dateStr);
                    if (isSelected) {
                        if (dayOutfit) setShowDetail(true);
                        else setShowPicker(true);
                    }
                  }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    padding: '2px', borderRadius: '12px',
                    backgroundColor: isSelected ? themePink : '#FDFDFD', 
                    border: isSelected ? `2px solid ${accentPink}` : '1px solid #F8F8F8',
                    // 👇 確保方格高度固定，避免圖片撐開版面
                    height: '100%', minHeight: '60px', 
                    overflow: 'hidden', cursor: day ? 'pointer' : 'default'
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: isSelected ? '900' : '600', color: day ? (isSelected ? accentPink : '#6D6D6D') : 'transparent' }}>
                    {day}
                  </span>
                  
                  {day && dayOutfit && (
                    <div style={{ 
                      width: '100%', 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      minHeight: 0,
                      padding: '2px' // 給圖片一點內距，避免貼邊
                    }}>
                      {/* 👇 關鍵修正：確保圖片在小格子裡不被切掉 */}
                      <img 
                        src={dayOutfit.preview} 
                        style={{ 
                          maxWidth: '95%', 
                          maxHeight: '90%', 
                          objectFit: 'contain', // 確保完整呈現，不論是長裙還是寬上衣
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' // 增加一點立體感
                        }} 
                      />
                      {/* 5 欄或 4 欄模式下，日曆格子的文字建議極小或隱藏 */}
                      <div style={{ 
                        width: '100%', 
                        fontSize: '8px', 
                        color: textColor, 
                        fontWeight: '700', 
                        textAlign: 'center', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        marginTop: '1px'
                      }}>
                        {dayOutfit.name}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. 穿搭選擇彈窗 - 4 欄平衡美觀版 */}
      {showPicker && (
        <div style={{...modalOverlayStyle, alignItems: 'center'}}>
          <div style={{
            ...modalContentStyle, 
            width: '92%',          // 寬度稍微收緊，更有卡片感
            borderRadius: '28px', 
            maxHeight: '75vh', 
            display: 'flex', 
            flexDirection: 'column',
            margin: '0 auto',
            padding: '20px 12px'
          }}>
            {/* 標題區 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
              <h3 style={{ margin: 0, color: '#5a4a47', fontWeight: 800, fontSize: '18px' }}>選擇今日穿搭</h3>
              <button onClick={() => setShowPicker(false)} style={closeBtnStyle}><X size={20} color="#6D6D6D" /></button>
            </div>

            {/* 列表區：4 欄佈局 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', // 設定為 4 欄
              gap: '10px',                          // 間距稍微加寬一點點，比較不擁擠
              overflowY: 'auto', 
              padding: '4px',
              flex: 1 
            }}>
              {outfits.map(outfit => (
                <div 
                  key={outfit.id} 
                  onClick={() => handleSelectOutfit(outfit.id)} 
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {/* 圖片容器 */}
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '1/1',    // 保持正方形排列
                    background: '#F9F7F5', 
                    borderRadius: '12px',  // 圓角稍微加大，更有親和力
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid #eee',
                    overflow: 'hidden' 
                  }}>
                    <img 
                      src={outfit.preview} 
                      style={{ 
                        maxWidth: '90%', 
                        maxHeight: '90%', 
                        objectFit: 'contain' 
                      }} 
                    />
                  </div>
                  {/* 名稱文字 */}
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: textColor, 
                    textAlign: 'center',
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {outfit.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. 穿搭詳情彈窗 - 完整資訊版 */}
      {showDetail && currentOutfit && (
        <div style={{...modalOverlayStyle, alignItems: 'center'}}>
          <div style={{
            ...modalContentStyle, 
            width: '92%', 
            borderRadius: '32px', 
            maxHeight: '85vh', 
            display: 'flex', 
            flexDirection: 'column',
            margin: '0 auto',
            padding: '24px 20px',
            overflowY: 'auto' // 防止備註太長時超出螢幕
          }}> 
            {/* 標題與關閉 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: 32 }} />
              <h3 style={{ margin: 0, color: textColor, fontWeight: 800, fontSize: '18px' }}>
                {selectedDateStr.replace(/-/g, '/')} 穿搭
              </h3>
              <button onClick={() => setShowDetail(false)} style={closeBtnStyle}><X size={20} color="#6D6D6D" /></button>
            </div>
            
            {/* 穿搭大圖 */}
            <div style={{ 
                width: '100%', height: '35vh', backgroundColor: '#F9F7F5', 
                borderRadius: '24px', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', marginBottom: '16px', border: '1px solid #eee'
            }}>
                <img src={currentOutfit.preview} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
            </div>

            {/* 資訊欄位區 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {/* 名字 */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: '900', color: textColor }}>{currentOutfit.name || '未命名穿搭'}</span>
              </div>

              <div style={{ height: '1px', backgroundColor: '#eee', margin: '4px 0' }} />

              {/* 1. 場合 & 溫度 */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={infoBoxStyle}>
                  <span style={infoLabelStyle}>場合</span>
                  {/* 修正：使用資料庫/物件中的 occasion，若無則顯示預設 */}
                  <span style={infoValueStyle}>{currentOutfit.occasion || '未設定'}</span>
                </div>
                <div style={infoBoxStyle}>
                  <span style={infoLabelStyle}>適穿溫度</span>
                  <span style={infoValueStyle}>
                    {/* 這裡改成 .temperature (對應你的畫布頁) */}
                    {currentOutfit.temperature ? `${currentOutfit.temperature} °C` : '-- °C'}
                  </span>
                </div>
              </div>

              {/* 2. 備註 */}
              <div style={{ ...infoBoxStyle, alignItems: 'flex-start', minHeight: '60px' }}>
                <span style={infoLabelStyle}>穿搭備註</span>
                <span style={{ ...infoValueStyle, whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                  {/* 這裡改成 .note (對應你的畫布頁) */}
                  {currentOutfit.note || '尚無備註'}
                </span>
              </div>
            </div>

            {/* 按鈕組 1:1 */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                    onClick={() => { setShowDetail(false); setShowPicker(true); }}
                    style={detailBtnSecondaryStyle}
                >
                    <RefreshCcw size={18} /> 更換搭配
                </button>
                <button 
                    onClick={() => { setShowDetail(false); onEditOutfit(currentOutfit); }}
                    style={detailBtnPrimaryStyle}
                >
                    <Edit3 size={18} /> 編輯畫布
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const navBtnStyle = { background: '#fff', border: 'none', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', padding: '0' };
const closeBtnStyle = { width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '0' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 1200 };
const modalContentStyle = { width: '100%', backgroundColor: '#fff', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '24px', boxSizing: 'border-box' };
const pickerItemStyle = { padding: '12px', backgroundColor: '#fff', border: '1px solid #F0F0F0', borderRadius: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' };
const infoBoxStyle = {
  flex: 1,
  backgroundColor: '#FDFDFD',
  padding: '12px',
  borderRadius: '16px',
  border: '1px solid #F0F0F0',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  alignItems: 'center'
};

const infoLabelStyle = {
  fontSize: '11px',
  color: '#A8A8A8',
  fontWeight: '600'
};

const infoValueStyle = {
  fontSize: '14px',
  color: '#5A4A47',
  fontWeight: '700'
};

const detailBtnPrimaryStyle = {
  flex: 1, height: '50px', borderRadius: '16px', border: 'none', 
  background: '#FF8A80', color: '#fff', fontWeight: '800', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
};

const detailBtnSecondaryStyle = {
  flex: 1, height: '50px', borderRadius: '16px', border: '2px solid #FFE4E1', 
  background: '#fff', color: '#8B5E52', fontWeight: '800', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
};
export default CalendarPage;