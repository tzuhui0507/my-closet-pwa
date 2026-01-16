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

  // 適配 CSS 變數
  const themePink = 'var(--tag-bg-orange)'; 
  const accentPink = 'var(--tag-text-orange)';
  const textColor = 'var(--color-text-main)';

  return (
    <div style={{ 
      height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', 
      backgroundColor: 'var(--color-bg)', overflow: 'hidden', position: 'fixed', top: 0, left: 0 
    }}>
      
      {/* 1. Header 適配 */}
      <div style={{
        height: 60, display: 'flex', alignItems: 'center', padding: '0 16px',
        background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0, zIndex: 100
      }}>
        <div style={{ width: 48 }} />
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 18, color: 'var(--color-text-main)' }}>
          我的穿搭日曆
        </div>
        <div style={{ width: 48 }} />
      </div>

      {/* 2. 內容區 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', boxSizing: 'border-box', overflow: 'hidden' }}>
        
        {/* 月份切換適配 */}
        <div style={{
          height: '52px', marginBottom: '12px', borderRadius: '20px', backgroundColor: themePink,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--color-surface)', padding: '5px', borderRadius: '10px', display: 'flex' }}>
              <CalendarIcon size={16} color={accentPink} />
            </div>
            <span style={{ fontWeight: '800', fontSize: '16px', color: accentPink }}>
              {year}年 {month + 1}月
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrev} style={navBtnStyle}><ChevronLeft size={22} color={accentPink} strokeWidth={3} /></button>
            <button onClick={handleNext} style={navBtnStyle}><ChevronRight size={22} color={accentPink} strokeWidth={3} /></button>
          </div>
        </div>

        {/* 日曆網格適配 */}
        <div style={{ 
          background: 'var(--color-surface)', padding: '12px', borderRadius: '24px', boxShadow: '0 8px 24px var(--shadow-color)',
          flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '80px', minHeight: 0,
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', 
            gridTemplateRows: '28px repeat(5, 1fr)', gap: '6px', height: '100%' 
          }}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-text-sub)', fontWeight: '800' }}>{d}</div>
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
                    backgroundColor: isSelected ? themePink : 'transparent', 
                    border: isSelected ? `2.5px solid ${accentPink}` : '1px solid var(--color-border)',
                    height: '100%', minHeight: '60px', 
                    overflow: 'hidden', cursor: day ? 'pointer' : 'default'
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: isSelected ? '900' : '600', color: day ? (isSelected ? accentPink : 'var(--color-text-main)') : 'transparent' }}>
                    {day}
                  </span>
                  
                  {day && dayOutfit && (
                    <div style={{ 
                      width: '100%', flex: 1, display: 'flex', flexDirection: 'column', 
                      alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: '2px' 
                    }}>
                      <img 
                        src={dayOutfit.preview} 
                        style={{ 
                          maxWidth: '95%', maxHeight: '90%', objectFit: 'contain',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }} 
                      />
                      <div style={{ 
                        width: '100%', fontSize: '8px', color: 'var(--color-text-sub)', 
                        fontWeight: '700', textAlign: 'center', whiteSpace: 'nowrap', 
                        overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px'
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

      {/* 3. 穿搭選擇彈窗 適配 */}
      {showPicker && (
        <div style={{...modalOverlayStyle, alignItems: 'center'}}>
          <div style={{
            ...modalContentStyle, 
            backgroundColor: 'var(--color-surface)',
            width: '92%', borderRadius: '28px', maxHeight: '75vh', 
            display: 'flex', flexDirection: 'column', margin: '0 auto', padding: '20px 12px',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
              <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontWeight: 800, fontSize: '18px' }}>選擇今日穿搭</h3>
              <button onClick={() => setShowPicker(false)} style={closeBtnStyle}><X size={20} color="var(--color-text-sub)" /></button>
            </div>

            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', 
              overflowY: 'auto', padding: '4px', flex: 1 
            }}>
              {outfits.map(outfit => (
                <div key={outfit.id} onClick={() => handleSelectOutfit(outfit.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ 
                    width: '100%', aspectRatio: '1/1', background: 'var(--color-bg)', 
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--color-border)', overflow: 'hidden' 
                  }}>
                    <img src={outfit.preview} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-main)', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {outfit.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. 穿搭詳情彈窗 適配 */}
      {showDetail && currentOutfit && (
        <div style={{...modalOverlayStyle, alignItems: 'center'}}>
          <div style={{
            ...modalContentStyle, 
            backgroundColor: 'var(--color-surface)',
            width: '92%', borderRadius: '32px', maxHeight: '85vh', 
            display: 'flex', flexDirection: 'column', margin: '0 auto', padding: '24px 20px',
            overflowY: 'auto', border: '1px solid var(--color-border)'
          }}> 
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: 32 }} />
              <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontWeight: 800, fontSize: '18px' }}>
                {selectedDateStr.replace(/-/g, '/')} 穿搭
              </h3>
              <button onClick={() => setShowDetail(false)} style={closeBtnStyle}><X size={20} color="var(--color-text-sub)" /></button>
            </div>
            
            <div style={{ 
                width: '100%', height: '35vh', backgroundColor: 'var(--color-bg)', 
                borderRadius: '24px', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', marginBottom: '16px', border: '1px solid var(--color-border)'
            }}>
                <img src={currentOutfit.preview} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-text-main)' }}>{currentOutfit.name || '未命名穿搭'}</span>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ ...infoBoxStyle, backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                  <span style={infoLabelStyle}>場合</span>
                  <span style={{ ...infoValueStyle, color: 'var(--color-text-main)' }}>{currentOutfit.occasion || '未設定'}</span>
                </div>
                <div style={{ ...infoBoxStyle, backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                  <span style={infoLabelStyle}>適穿溫度</span>
                  <span style={{ ...infoValueStyle, color: 'var(--color-text-main)' }}>
                    {currentOutfit.temperature ? `${currentOutfit.temperature} °C` : '-- °C'}
                  </span>
                </div>
              </div>

              <div style={{ ...infoBoxStyle, backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', alignItems: 'flex-start', minHeight: '60px' }}>
                <span style={infoLabelStyle}>穿搭備註</span>
                <span style={{ ...infoValueStyle, color: 'var(--color-text-main)', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                  {currentOutfit.note || '尚無備註'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { setShowDetail(false); setShowPicker(true); }} style={{ ...detailBtnSecondaryStyle, background: 'var(--color-surface)', borderColor: themePink, color: 'var(--color-text-main)' }}>
                    <RefreshCcw size={18} /> 更換搭配
                </button>
                <button onClick={() => { setShowDetail(false); onEditOutfit(currentOutfit); }} style={{ ...detailBtnPrimaryStyle, background: accentPink }}>
                    <Edit3 size={18} /> 編輯畫布
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 基礎樣式微調適配
const navBtnStyle = { background: 'var(--color-surface)', border: 'none', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px var(--shadow-color)', padding: '0' };
const closeBtnStyle = { width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '0' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 1200 };
const modalContentStyle = { width: '100%', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '24px', boxSizing: 'border-box' };
const infoBoxStyle = { flex: 1, padding: '12px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' };
const infoLabelStyle = { fontSize: '11px', color: 'var(--color-text-sub)', fontWeight: '600' };
const infoValueStyle = { fontSize: '14px', fontWeight: '700' };
const detailBtnPrimaryStyle = { flex: 1, height: '50px', borderRadius: '16px', border: 'none', color: '#fff', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' };
const detailBtnSecondaryStyle = { flex: 1, height: '50px', borderRadius: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' };

export default CalendarPage;