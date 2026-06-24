import { useEffect, useRef } from 'react';
import './OrbitGallery.css';

export default function OrbitGallery({ items = [], onSelect }) {
  const orbitRef = useRef(null);

  useEffect(() => {
    const el = orbitRef.current;
    if (!el || items.length === 0) return;
    const cards = el.querySelectorAll('.orbit-card');
    const total = items.length;
    const speed = 0.008;
    let rafId;
    let startTime = Date.now();

    const animate = () => {
      const t = (Date.now() - startTime) * speed;
      const cx = el.clientWidth / 2;
      const cy = el.clientHeight / 2;
      const rx = Math.min(cx * 0.85, 340);
      const ry = Math.min(cy * 0.3, 110);

      cards.forEach((card, i) => {
        const angle = (i / total) * Math.PI * 2 + t;
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        const z = Math.cos(angle) * 0.3 + 0.7;
        card.style.transform = 'translate(-50%, -50%) translate(' + x + 'px,' + y + 'px) scale(' + z + ')';
        card.style.opacity = 0.5 + 0.5 * z;
        card.style.zIndex = Math.round(z * 100);
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [items.length]);

  return (
    <div className="orbit-gallery" ref={orbitRef}>
      {items.map((item) => (
        <div key={item.id} className="orbit-card" onClick={() => onSelect && onSelect(item)}>
          <div className="orbit-card-bar" style={{ background: item.themeColor }} />
          <div className="orbit-card-content">
            <div className="orbit-card-name" style={{ color: item.themeColor }}>{item.name}</div>
            <div className="orbit-card-title">{item.data.personalInfo.title}</div>
            <div className="orbit-card-skills">
              {item.data.skills.slice(0, 3).map((s) => (
                <span key={s.id} className="orbit-card-skill" style={{ background: item.themeColor + '18', color: item.themeColor }}>{s.name}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}