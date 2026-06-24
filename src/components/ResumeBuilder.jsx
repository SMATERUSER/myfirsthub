import { useState, useCallback, useRef, useEffect } from 'react';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import Silk from './Silk';
import GooeyNav from './GooeyNav';
import StarBorder from './StarBorder';
import FuzzyText from './FuzzyText';
import { exportPDF } from '../utils/pdfExport';
import { templates } from '../data/templates';
import './ResumeBuilder.css';

var STORAGE_KEY = 'resume-builder-data';
var THEME_KEY = 'resume-builder-theme';
var emptyData = { personalInfo: { name: '', phone: '', email: '', address: '', title: '', summary: '', birthDate: '', school: '', major: '', avatar: null }, education: [], experience: [], skills: [], certificates: [], extraTexts: [], projects: [] };

function loadSavedData() { try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
function saveData(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (e) {} }
function saveTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }

function downloadJSON(data, name) {
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = name || 'resume-data.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function TemplateCard({ tpl, onSelect }) {
  var [imgUrl, setImgUrl] = useState(null);
  useState(function () {
    var c = document.createElement('canvas'); c.width = 300; c.height = 420;
    var ctx = c.getContext('2d'); var clr = tpl.themeColor; var p = 14;
    ctx.fillStyle = clr; ctx.fillRect(0, 0, c.width, 4);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 4, c.width, c.height - 4);
    ctx.fillStyle = clr; ctx.font = 'bold 16px sans-serif'; ctx.fillText(tpl.data.personalInfo.name, p, 34);
    ctx.fillStyle = 'rgba(26,26,46,0.4)'; ctx.font = '11px sans-serif'; ctx.fillText(tpl.data.personalInfo.title, p, 52);
    ctx.fillStyle = clr; ctx.font = 'bold 9px sans-serif'; ctx.fillText('工作经历', p, 82);
    tpl.data.experience.slice(0, 2).forEach(function (exp, i) {
      ctx.fillStyle = '#1a1a2e'; ctx.font = 'bold 9px sans-serif'; ctx.fillText(exp.position, p, 100 + i * 24);
      ctx.fillStyle = 'rgba(26,26,46,0.5)'; ctx.font = '8px sans-serif'; ctx.fillText(exp.company, p, 112 + i * 24);
    });
    ctx.fillStyle = clr; ctx.font = 'bold 9px sans-serif'; ctx.fillText('教育经历', p, 168);
    tpl.data.education.slice(0, 1).forEach(function (edu) { ctx.fillStyle = '#1a1a2e'; ctx.font = '8px sans-serif'; ctx.fillText(edu.school, p, 184); });
    ctx.fillStyle = clr; ctx.font = 'bold 9px sans-serif'; ctx.fillText('技能', p, 218);
    tpl.data.skills.slice(0, 6).forEach(function (sk, i) {
      var x = p + (i % 3) * 90; var y = 234 + Math.floor(i / 3) * 20; ctx.fillStyle = clr + '18';
      ctx.beginPath(); ctx.moveTo(x + 8, y); ctx.lineTo(x + 80 - 8, y); ctx.quadraticCurveTo(x + 80, y, x + 80, y + 8); ctx.lineTo(x + 80, y + 18 - 8); ctx.quadraticCurveTo(x + 80, y + 18, x + 80 - 8, y + 18); ctx.lineTo(x + 8, y + 18); ctx.quadraticCurveTo(x, y + 18, x, y + 18 - 8); ctx.lineTo(x, y + 8); ctx.quadraticCurveTo(x, y, x + 8, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = clr; ctx.font = '7px sans-serif'; ctx.fillText(sk.name, x + 40 - ctx.measureText(sk.name).width / 2, y + 12);
    });
    setImgUrl(c.toDataURL());
  }, []);
  if (!imgUrl) return <div className="tpl-card tpl-card-loading" />;
  return <div className="tpl-card" onClick={function () { onSelect(tpl); }}>
    <div className="tpl-card-img-wrap"><img src={imgUrl} alt={tpl.name} className="tpl-card-img" /></div>
    <div className="tpl-card-body"><div className="tpl-card-name" style={{ color: tpl.themeColor }}>{tpl.name}</div><div className="tpl-card-desc">{tpl.description}</div></div>
    <div className="tpl-card-overlay"><span className="tpl-card-btn" style={{ background: tpl.themeColor }}>选择此模板</span></div>
  </div>;
}

function TemplateGallery({ onSelect, onBack }) {
  return <div className="gallery-page">
    <div className="gallery-header">
      <button className="gallery-back-btn" onClick={onBack}>
        <FuzzyText baseIntensity={0.08} hoverIntensity={0.3} enableHover={true} fontSize="0.9rem" fontWeight={500} color="#ffffff" direction="horizontal" fuzzRange={15} letterSpacing={1}>{'\u2190 \u8FD4\u56DE\u9996\u9875'}</FuzzyText>
      </button>
      <div className="gallery-title-wrap">
        <FuzzyText baseIntensity={0.12} hoverIntensity={0.4} enableHover={true} fontSize="2rem" fontWeight={700} color="#ffffff" direction="horizontal" fuzzRange={25} letterSpacing={2}>{'\u9009\u62E9\u7B80\u5386\u6A21\u677F'}</FuzzyText>
      </div>
    </div>
    <div className="tpl-grid">{templates.map(function (tpl) { return <TemplateCard key={tpl.id} tpl={tpl} onSelect={onSelect} />; })}</div>
    {loadSavedData() ? <div className="gallery-resume-bar">
      <span>{'\u68C0\u6D4B\u5230\u4E00\u4EFD\u672A\u5B8C\u6210\u7684\u7B80\u5386'}</span>
      <button className="gallery-resume-btn" onClick={function () { var d = loadSavedData(); if (d) onSelect({ data: d, themeColor: localStorage.getItem(THEME_KEY) || '#1a1a2e' }); }}>{'\u7EE7\u7EED\u7F16\u8F91'}</button>
    </div> : null}
  </div>;
}

export default function ResumeBuilder() {
  var [mode, setMode] = useState('gallery');
  var [data, setData] = useState(emptyData);
  var [themeColor, setThemeColor] = useState('#1a1a2e');
  var [exporting, setExporting] = useState(false);
  var importRef = useRef(null);
  var previewRef = useRef(null);
  var loadedRef = useRef(false);

  // Auto-save to localStorage when data changes
  useEffect(function () { if (mode === 'edit') { saveData(data); saveTheme(themeColor); } }, [data, themeColor, mode]);

  function handleSelectTemplate(tpl) {
    setData(JSON.parse(JSON.stringify(tpl.data)));
    setThemeColor(tpl.themeColor);
    setMode('edit');
  }

  var updatePersonal = useCallback(function (field, value) { setData(function (prev) { return { ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }; }); }, []);
  var updateArray = useCallback(function (key, items) { setData(function (prev) { return { ...prev, [key]: items }; }); }, []);
  var updateItem = useCallback(function (key, id, field, value) { setData(function (prev) { return { ...prev, [key]: prev[key].map(function (item) { return item.id === id ? { ...item, [field]: value } : item; }) }; }); }, []);

  async function handleExport() { setExporting(true); try { await exportPDF(previewRef.current); } finally { setExporting(false); } }
  function handleExportJSON() { downloadJSON({ data: data, themeColor: themeColor }, '\u6211\u7684\u7B80\u5386.json'); }
  function handleImportJSON(e) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      try { var obj = JSON.parse(ev.target.result); if (obj.data) { setData(obj.data); if (obj.themeColor) setThemeColor(obj.themeColor); setMode('edit'); } } catch (err) { alert('\u5BFC\u5165\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6587\u4EF6\u683C\u5F0F'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  }
  function handleNewResume() { if (confirm('\u786E\u5B9A\u8981\u521B\u5EFA\u65B0\u7B80\u5386\u5417\uFF1F\u5F53\u524D\u7F16\u8F91\u5185\u5BB9\u5C06\u6E05\u9664\u3002')) { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(THEME_KEY); setData(emptyData); setThemeColor('#1a1a2e'); setMode('gallery'); } }

  if (mode === 'gallery') {
    return <><Silk speed={5} scale={1} color="#414144" noiseIntensity={1.5} rotation={0} />
        <div className="builder-outer">
          <TemplateGallery onSelect={handleSelectTemplate} onBack={function () { window.history.back(); }} /></div></>;
  }

  return <div className="builder-outer">
    <Silk speed={5} scale={1} color="#414144" noiseIntensity={1.5} rotation={0} />
    <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportJSON} />
    <div className="builder-toolbar">
      <button className="builder-toolbar-btn" onClick={function() { setMode('gallery'); }}>
        {'← 模板'}
      </button>
      <button className="builder-toolbar-btn" onClick={handleNewResume}>
        {'+ 新建'}
      </button>
      <button className="builder-toolbar-btn" onClick={function() { importRef.current.click(); }}>
        {'导入'}
      </button>
      <button className="builder-toolbar-btn bt-primary" onClick={handleExport} disabled={exporting}>
        {exporting ? '导出中...' : '导出 PDF'}
      </button>
    </div>
    <div className="inline-layout">
      <div className="inline-main">
        <ResumePreview ref={previewRef} data={data} themeColor={themeColor} updatePersonal={updatePersonal} updateArray={updateArray} updateItem={updateItem} />
      </div>
    </div>
  </div>;
}