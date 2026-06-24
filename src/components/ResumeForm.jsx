import { useState } from 'react';
import './ResumeForm.css';

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="form-section">
      <div className="section-header" onClick={() => setOpen(!open)}>
        <h3>{title}</h3>
        <span className={`section-toggle${open ? ' open' : ''}`}>▾</span>
      </div>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div className="form-row">
      <label>{label}</label>
      {children}
    </div>
  );
}

export default function ResumeForm({ data, updatePersonal, updateArray, addItem, removeItem, updateItem }) {
  const { personalInfo, education, experience, skills, projects } = data;

  return (
    <div className="resume-form">
      <Section title="基本信息">
        <FormRow label="姓名">
          <input value={personalInfo.name} onChange={e => updatePersonal('name', e.target.value)} placeholder="你的姓名" />
        </FormRow>
        <div className="form-row-inline">
          <FormRow label="电话">
            <input value={personalInfo.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="手机号码" />
          </FormRow>
          <FormRow label="邮箱">
            <input value={personalInfo.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="邮箱地址" />
          </FormRow>
        </div>
        <FormRow label="地址">
          <input value={personalInfo.address} onChange={e => updatePersonal('address', e.target.value)} placeholder="所在城市/地址" />
        </FormRow>
        <FormRow label="求职意向">
          <input value={personalInfo.title} onChange={e => updatePersonal('title', e.target.value)} placeholder="如：前端开发工程师" />
        </FormRow>
        <FormRow label="个人简介">
          <textarea value={personalInfo.summary} onChange={e => updatePersonal('summary', e.target.value)} placeholder="简短介绍自己，突出核心优势…" rows={3} />
        </FormRow>
      </Section>

      <Section title="教育经历">
        {education.map(item => (
          <div key={item.id} className="array-item">
            <button className="array-item-remove" onClick={() => removeItem('education', item.id)}>✕</button>
            <FormRow label="学校">
              <input value={item.school || ''} onChange={e => updateItem('education', item.id, 'school', e.target.value)} placeholder="学校名称" />
            </FormRow>
            <div className="form-row-inline">
              <FormRow label="学位">
                <input value={item.degree || ''} onChange={e => updateItem('education', item.id, 'degree', e.target.value)} placeholder="学士/硕士/博士" />
              </FormRow>
              <FormRow label="专业">
                <input value={item.major || ''} onChange={e => updateItem('education', item.id, 'major', e.target.value)} placeholder="专业名称" />
              </FormRow>
            </div>
            <div className="form-row-inline">
              <FormRow label="开始时间">
                <input type="month" value={item.startDate || ''} onChange={e => updateItem('education', item.id, 'startDate', e.target.value)} />
              </FormRow>
              <FormRow label="结束时间">
                <input type="month" value={item.endDate || ''} onChange={e => updateItem('education', item.id, 'endDate', e.target.value)} />
              </FormRow>
            </div>
            <FormRow label="描述">
              <textarea value={item.description || ''} onChange={e => updateItem('education', item.id, 'description', e.target.value)} placeholder="相关荣誉、GPA 或课程描述…" rows={2} />
            </FormRow>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem('education', { school: '', degree: '', major: '', startDate: '', endDate: '', description: '' })}>
          + 添加教育经历
        </button>
      </Section>

      <Section title="工作经历">
        {experience.map(item => (
          <div key={item.id} className="array-item">
            <button className="array-item-remove" onClick={() => removeItem('experience', item.id)}>✕</button>
            <div className="form-row-inline">
              <FormRow label="公司">
                <input value={item.company || ''} onChange={e => updateItem('experience', item.id, 'company', e.target.value)} placeholder="公司名称" />
              </FormRow>
              <FormRow label="职位">
                <input value={item.position || ''} onChange={e => updateItem('experience', item.id, 'position', e.target.value)} placeholder="职位名称" />
              </FormRow>
            </div>
            <div className="form-row-inline">
              <FormRow label="开始时间">
                <input type="month" value={item.startDate || ''} onChange={e => updateItem('experience', item.id, 'startDate', e.target.value)} />
              </FormRow>
              <FormRow label="结束时间">
                <input type="month" value={item.endDate || ''} onChange={e => updateItem('experience', item.id, 'endDate', e.target.value)} />
              </FormRow>
            </div>
            <FormRow label="工作描述">
              <textarea value={item.description || ''} onChange={e => updateItem('experience', item.id, 'description', e.target.value)} placeholder="主要工作职责和成就…" rows={2} />
            </FormRow>
            <FormRow label="工作要点">
              <div className="bullet-list">
                {(item.bulletPoints || []).map((bp, i) => (
                  <div key={i} className="bullet-row">
                    <input value={bp} onChange={e => {
                      const newBp = [...(item.bulletPoints || [])];
                      newBp[i] = e.target.value;
                      updateItem('experience', item.id, 'bulletPoints', newBp);
                    }} placeholder="工作要点" />
                    <button className="bullet-remove" onClick={() => {
                      const newBp = [...(item.bulletPoints || [])];
                      newBp.splice(i, 1);
                      updateItem('experience', item.id, 'bulletPoints', newBp);
                    }}>✕</button>
                  </div>
                ))}
                <button className="add-bullet-btn" onClick={() => {
                  const newBp = [...(item.bulletPoints || []), ''];
                  updateItem('experience', item.id, 'bulletPoints', newBp);
                }}>+ 添加要点</button>
              </div>
            </FormRow>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '', bulletPoints: [] })}>
          + 添加工作经历
        </button>
      </Section>

      <Section title="专业技能">
        {skills.map(item => (
          <div key={item.id} className="array-item">
            <button className="array-item-remove" onClick={() => removeItem('skills', item.id)}>✕</button>
            <div className="form-row-inline">
              <FormRow label="技能名称">
                <input value={item.name || ''} onChange={e => updateItem('skills', item.id, 'name', e.target.value)} placeholder="如：React" />
              </FormRow>
              <FormRow label="熟练度">
                <select value={item.level || '中级'} onChange={e => updateItem('skills', item.id, 'level', e.target.value)}>
                  <option value="入门">入门</option>
                  <option value="初级">初级</option>
                  <option value="中级">中级</option>
                  <option value="高级">高级</option>
                  <option value="精通">精通</option>
                </select>
              </FormRow>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem('skills', { name: '', level: '中级' })}>
          + 添加技能
        </button>
      </Section>

      <Section title="项目经历">
        {projects.map(item => (
          <div key={item.id} className="array-item">
            <button className="array-item-remove" onClick={() => removeItem('projects', item.id)}>✕</button>
            <FormRow label="项目名称">
              <input value={item.name || ''} onChange={e => updateItem('projects', item.id, 'name', e.target.value)} placeholder="项目名称" />
            </FormRow>
            <FormRow label="角色">
              <input value={item.role || ''} onChange={e => updateItem('projects', item.id, 'role', e.target.value)} placeholder="你的角色" />
            </FormRow>
            <FormRow label="描述">
              <textarea value={item.description || ''} onChange={e => updateItem('projects', item.id, 'description', e.target.value)} placeholder="项目描述、你的贡献和成果…" rows={2} />
            </FormRow>
            <FormRow label="技术栈">
              <input value={(item.technologies || []).join(', ')} onChange={e => updateItem('projects', item.id, 'technologies', e.target.value.split(',').map(s => s.trim()))} placeholder="用逗号分隔，如 React, Node.js" />
            </FormRow>
            <div className="form-row-inline">
              <FormRow label="开始时间">
                <input type="month" value={item.startDate || ''} onChange={e => updateItem('projects', item.id, 'startDate', e.target.value)} />
              </FormRow>
              <FormRow label="结束时间">
                <input type="month" value={item.endDate || ''} onChange={e => updateItem('projects', item.id, 'endDate', e.target.value)} />
              </FormRow>
            </div>
            <FormRow label="链接">
              <input value={item.url || ''} onChange={e => updateItem('projects', item.id, 'url', e.target.value)} placeholder="项目链接（选填）" />
            </FormRow>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem('projects', { name: '', role: '', description: '', technologies: [], startDate: '', endDate: '', url: '' })}>
          + 添加项目经历
        </button>
      </Section>
    </div>
  );
}
