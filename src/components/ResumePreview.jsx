import { forwardRef, useState, useRef, useEffect } from 'react';
import './ResumePreview.css';
function InlineEdit({ value, onSave, style }) {
  var [editing, setEditing] = useState(false); var [val, setVal] = useState(value || ''); var ref = useRef(null);
  useEffect(function () { if (editing && ref.current) { ref.current.focus(); ref.current.select(); } }, [editing]);
  function save() { setEditing(false); if (val !== value && val.trim()) onSave(val.trim()); }
  if (editing) return <input ref={ref} className="inline-input" style={style} value={val} onChange={function (e) { setVal(e.target.value); }} onBlur={save} onKeyDown={function (e) { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setVal(value); setEditing(false); } }} />;
  return <span className="inline-text" style={style} onClick={function () { setEditing(true); }}>{value || '\u70B9\u51FB\u7F16\u8F91'}</span>;
}
function InlineTextarea({ value, onSave, style }) {
  var [editing, setEditing] = useState(false); var [val, setVal] = useState(value || ''); var ref = useRef(null);
  useEffect(function () { if (editing && ref.current) ref.current.focus(); }, [editing]);
  function save() { setEditing(false); if (val !== value) onSave(val); }
  if (editing) return <textarea ref={ref} className="inline-textarea" rows={3} style={style} value={val} onChange={function (e) { setVal(e.target.value); }} onBlur={save} />;
  return <span className="inline-text" style={style} onClick={function () { setEditing(true); }}>{value || '\u70B9\u51FB\u7F16\u8F91'}</span>;
}
function BulletEditor({ items, onUpdate }) {
  function addB() { onUpdate([...(items || []), '']); }
  function updB(i, v) { var n = [...(items || [])]; n[i] = v; onUpdate(n); }
  function delB(i) { var n = [...(items || [])]; n.splice(i, 1); onUpdate(n); }
  return <div className="rpb-editor">{(items || []).map(function (bp, i) { return <div key={i} className="rpb-row"><span className="rpb-dash">-</span><InlineEdit value={bp} onSave={function (v) { updB(i, v); }} style={{ fontSize: '14.5px', color: '#555', background: 'transparent', border: 'none', padding: 0 }} /><button className="rpb-del" onClick={function () { delB(i); }}>x</button></div>; })}<button className="rpb-add" onClick={addB}>{'\u6DFB\u52A0\u5185\u5BB9'}</button></div>;
}
var ResumePreview = forwardRef(function ResumePreview({ data, themeColor = '#1a1a2e', updatePersonal, updateItem, updateArray }, ref) {
  var { personalInfo, education, experience, skills, certificates, projects, extraTexts } = data;
  var hasContent = personalInfo.name || education.length || experience.length || skills.length || projects.length;
  if (!hasContent) return <div className="resume-preview-wrapper" ref={ref} style={{ '--theme-color': themeColor }}><div className="resume-preview-empty"><div className="preview-empty-icon">馃搫</div><div>{'\u9009\u62E9\u6A21\u677F\u540E\u9884\u89C8\u5C06\u663E\u793A\u5728\u6B64\u5904'}</div></div></div>;
  function fd(d) { if (!d) return ''; var p = d.split('-'); return p[0] + '\u5E74' + parseInt(p[1]) + '\u6708'; }
  return <div className="resume-preview-wrapper" ref={ref} style={{ '--theme-color': themeColor }}>
    <div className="rpl-container">
      <div className="rpl-left">
        <div className="rpl-avatar-wrap" onClick={function () { var inp = document.getElementById('rpl-av-inp'); if (inp) inp.click(); }}>
          <input id="rpl-av-inp" type="file" accept="image/*" style={{ display: 'none' }} onChange={function (e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function (ev) { updatePersonal && updatePersonal('avatar', ev.target.result); }; r.readAsDataURL(f); }} />
          {personalInfo.avatar ? <img src={personalInfo.avatar} className="rpl-avatar-img" alt="" /> : <div className="rpl-avatar-holder"><span>+</span></div>}
          <div className="rpl-avatar-overlay"><span>{personalInfo.avatar ? '\u66F4\u6362' : '\u6DFB\u52A0\u5934\u50CF'}</span></div>
        </div>
        <div className="rpl-name"><InlineEdit value={personalInfo.name} onSave={function (v) { updatePersonal && updatePersonal('name', v); }} style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', background: 'transparent', border: 'none', textAlign: 'center', padding: 0 }} /></div>
        <div className="rpl-block"><div className="rpl-block-title">{'\u57FA\u672C\u4FE1\u606F'}</div>
          <div className="rpl-info-list">
            <div className="rpl-info-item"><span className="rpl-info-lbl">{'\u51FA\u751F\u5E74\u6708'}</span><InlineEdit value={personalInfo.birthDate} onSave={function (v) { updatePersonal && updatePersonal('birthDate', v); }} style={{ fontSize: 15, color: '#555', background: 'transparent', border: 'none', padding: 0 }} /></div>
            <div className="rpl-info-item"><span className="rpl-info-lbl">{'\u6BD5\u4E1A\u9662\u6821'}</span><InlineEdit value={personalInfo.school} onSave={function (v) { updatePersonal && updatePersonal('school', v); }} style={{ fontSize: 15, color: '#555', background: 'transparent', border: 'none', padding: 0 }} /></div>
            <div className="rpl-info-item"><span className="rpl-info-lbl">{'\u624B\u673A\u53F7\u7801'}</span><InlineEdit value={personalInfo.phone} onSave={function (v) { updatePersonal && updatePersonal('phone', v); }} style={{ fontSize: 15, color: '#555', background: 'transparent', border: 'none', padding: 0 }} /></div>
            <div className="rpl-info-item"><span className="rpl-info-lbl">{'\u90AE\u7BB1'}</span><InlineEdit value={personalInfo.email} onSave={function (v) { updatePersonal && updatePersonal('email', v); }} style={{ fontSize: 15, color: '#555', background: 'transparent', border: 'none', padding: 0 }} /></div>
            <div className="rpl-info-item"><span className="rpl-info-lbl">{'\u4E13\u4E1A'}</span><InlineEdit value={personalInfo.major} onSave={function (v) { updatePersonal && updatePersonal('major', v); }} style={{ fontSize: 15, color: '#555', background: 'transparent', border: 'none', padding: 0 }} /></div>
          </div>
        </div>
        <div className="rpl-block"><div className="rpl-block-title">{'\u6301\u6709\u7684\u8BC1\u4E66'}</div>
          {certificates ? certificates.map(function (c, idx) { return <div key={c.id} className="rpl-cert-item"><InlineEdit value={c.name} onSave={function (v) { var nc = [...certificates]; nc[idx] = { ...nc[idx], name: v }; updateArray && updateArray('certificates', nc); }} style={{ fontSize: 15, color: '#555', background: 'transparent', border: 'none', padding: 0 }} /><button className="rpl-cert-del" onClick={function () { var nc = [...certificates]; nc.splice(idx, 1); updateArray && updateArray('certificates', nc); }}>x</button></div>; }) : null}
          <button className="rpl-cert-add" onClick={function () { updateArray && updateArray('certificates', [...(certificates || []), { id: 'c' + Date.now(), name: '' }]); }}>{'\u6DFB\u52A0\u8BC1\u4E66'}</button>
        </div>
        <div className="rpl-block"><div className="rpl-block-title">{'\u81EA\u6211\u8BC4\u4EF7'}</div>
          <InlineTextarea value={personalInfo.summary} onSave={function (v) { updatePersonal && updatePersonal('summary', v); }} style={{ fontSize: '14.5px', lineHeight: '1.7', color: '#555', background: 'transparent', border: 'none', width: '100%' }} />
        </div>
      </div>
      <div className="rpl-right">
        <div className="rpl-resume-title">{'\u4E2A\u4EBA\u7B80\u5386'}</div>
        {experience.length > 0 ? <div className="rpl-block"><div className="rpl-block-title">{'\u5DE5\u4F5C\u7ECF\u5386'}</div>
          {experience.map(function (exp) { return <div key={exp.id} className="rpl-entry">
            <div className="rpl-entry-hdr"><span className="rpl-entry-title"><InlineEdit value={exp.position} onSave={function (v) { updateItem && updateItem('experience', exp.id, 'position', v); }} style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e', background: 'transparent', border: 'none', padding: 0 }} /></span>{exp.company ? <span className="rpl-entry-sub">  <InlineEdit value={exp.company} onSave={function (v) { updateItem && updateItem('experience', exp.id, 'company', v); }} style={{ fontSize: 15, color: 'var(--theme-color)', opacity: 0.7, background: 'transparent', border: 'none', padding: 0 }} /></span> : null}</div>
            {exp.description ? <InlineTextarea value={exp.description} onSave={function (v) { updateItem && updateItem('experience', exp.id, 'description', v); }} style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#555', background: 'transparent', border: 'none', width: '100%' }} /> : null}
            <BulletEditor items={exp.bulletPoints || []} onUpdate={function (v) { updateItem && updateItem('experience', exp.id, 'bulletPoints', v); }} />
          </div>; })}
        </div> : null}
        {education.length > 0 ? <div className="rpl-block"><div className="rpl-block-title">{'\u6559\u80B2\u7ECF\u5386'}</div>
          {education.map(function (edu) { return <div key={edu.id} className="rpl-entry">
            <div className="rpl-entry-hdr"><span className="rpl-entry-title"><InlineEdit value={edu.school} onSave={function (v) { updateItem && updateItem('education', edu.id, 'school', v); }} style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e', background: 'transparent', border: 'none', padding: 0 }} /></span>{edu.degree ? <span className="rpl-entry-sub">  <InlineEdit value={edu.degree} onSave={function (v) { updateItem && updateItem('education', edu.id, 'degree', v); }} style={{ fontSize: 15, color: 'var(--theme-color)', opacity: 0.7, background: 'transparent', border: 'none', padding: 0 }} /></span> : null}{edu.major ? <span className="rpl-entry-sub">  <InlineEdit value={edu.major} onSave={function (v) { updateItem && updateItem('education', edu.id, 'major', v); }} style={{ fontSize: 15, color: 'var(--theme-color)', opacity: 0.7, background: 'transparent', border: 'none', padding: 0 }} /></span> : null}</div>
            {edu.description ? <InlineTextarea value={edu.description} onSave={function (v) { updateItem && updateItem('education', edu.id, 'description', v); }} style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#555', background: 'transparent', border: 'none', width: '100%' }} /> : null}
            <BulletEditor items={edu.bulletPoints || []} onUpdate={function (v) { updateItem && updateItem('education', edu.id, 'bulletPoints', v); }} />
          </div>; })}
        </div> : null}
        {projects.length > 0 ? <div className="rpl-block"><div className="rpl-block-title">{'\u9879\u76EE\u7ECF\u5386'}</div>
          {projects.map(function (proj) { return <div key={proj.id} className="rpl-entry">
            <div className="rpl-entry-hdr"><span className="rpl-entry-title"><InlineEdit value={proj.name} onSave={function (v) { updateItem && updateItem('projects', proj.id, 'name', v); }} style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e', background: 'transparent', border: 'none', padding: 0 }} /></span>{proj.role ? <span className="rpl-entry-sub">  <InlineEdit value={proj.role} onSave={function (v) { updateItem && updateItem('projects', proj.id, 'role', v); }} style={{ fontSize: 15, color: 'var(--theme-color)', opacity: 0.7, background: 'transparent', border: 'none', padding: 0 }} /></span> : null}</div>
            {proj.description ? <InlineTextarea value={proj.description} onSave={function (v) { updateItem && updateItem('projects', proj.id, 'description', v); }} style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#555', background: 'transparent', border: 'none', width: '100%' }} /> : null}
            <BulletEditor items={proj.bulletPoints || []} onUpdate={function (v) { updateItem && updateItem('projects', proj.id, 'bulletPoints', v); }} />
          </div>; })}
        </div> : null}
        {extraTexts && extraTexts.length > 0 ? extraTexts.map(function (et, idx) { return <div key={et.id} className="rpl-block" style={{ borderTop: '1px dashed #ddd' }}>
          <div className="rpl-block-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <InlineEdit value={et.title} onSave={function (v) { var ne = [...extraTexts]; ne[idx] = { ...ne[idx], title: v }; updateArray('extraTexts', ne); }} style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e', background: 'transparent', border: 'none', padding: 0 }} />
            <button className="rpl-del" onClick={function () { var ne = [...extraTexts]; ne.splice(idx, 1); updateArray('extraTexts', ne); }}>x</button>
          </div>
          <InlineTextarea value={et.content} onSave={function (v) { var ne = [...extraTexts]; ne[idx] = { ...ne[idx], content: v }; updateArray('extraTexts', ne); }} style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#555', background: 'transparent', border: 'none', width: '100%' }} />
        </div>; }) : null}
      </div>
    </div>
  </div>;
});
export default ResumePreview;