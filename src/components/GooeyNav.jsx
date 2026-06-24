import { useRef, useEffect, useState } from 'react';
import './GooeyNav.css';

var GooeyNav = function GooeyNav({ items, animationTime = 600, particleCount = 15, particleDistances = [90, 10], particleR = 100, timeVariance = 300, colors = [1, 2, 3, 1, 2, 3, 1, 4], initialActiveIndex = 0, onChange }) {
  var containerRef = useRef(null); var navRef = useRef(null); var filterRef = useRef(null); var textRef = useRef(null);
  var [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  function noise(n) { if (n === undefined) n = 1; return n / 2 - Math.random() * n; }
  function getXY(distance, pointIndex, totalPoints) { var angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180); return [distance * Math.cos(angle), distance * Math.sin(angle)]; }
  function createParticle(i, t, d, r) { var rotate = noise(r / 10); return { start: getXY(d[0], particleCount - i, particleCount), end: getXY(d[1] + noise(7), particleCount - i, particleCount), time: t, scale: 1 + noise(0.2), color: colors[Math.floor(Math.random() * colors.length)], rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10 }; }
  function makeParticles(element) {
    var d = particleDistances; var r = particleR; var bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', bubbleTime + 'ms');
    for (var i = 0; i < particleCount; i++) {
      var t = animationTime * 2 + noise(timeVariance * 2); var p = createParticle(i, t, d, r);
      element.classList.remove('active');
      setTimeout(function () {
        var particle = document.createElement('span'); var point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', p.start[0] + 'px'); particle.style.setProperty('--start-y', p.start[1] + 'px');
        particle.style.setProperty('--end-x', p.end[0] + 'px'); particle.style.setProperty('--end-y', p.end[1] + 'px');
        particle.style.setProperty('--time', p.time + 'ms'); particle.style.setProperty('--scale', '' + p.scale);
        particle.style.setProperty('--color', 'var(--color-' + p.color + ', white)'); particle.style.setProperty('--rotate', p.rotate + 'deg');
        point.classList.add('point'); particle.appendChild(point); element.appendChild(particle);
        requestAnimationFrame(function () { element.classList.add('active'); });
        setTimeout(function () { try { element.removeChild(particle); } catch(e) {} }, t);
      }, 30);
    }
  }
  function updateEffectPosition(element) {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    var rect = containerRef.current.getBoundingClientRect(); var pos = element.getBoundingClientRect();
    var styles = { left: pos.x - rect.x + 'px', top: pos.y - rect.y + 'px', width: pos.width + 'px', height: pos.height + 'px' };
    for (var key in styles) { filterRef.current.style[key] = styles[key]; textRef.current.style[key] = styles[key]; }
    textRef.current.innerText = element.innerText;
  }
  function handleClick(e, index) {
    if (activeIndex === index) return;
    setActiveIndex(index);
    if (onChange) onChange(index);
    var liEl = e.currentTarget; updateEffectPosition(liEl);
    if (filterRef.current) { filterRef.current.querySelectorAll('.particle').forEach(function(p) { try { filterRef.current.removeChild(p); } catch(e) {} }); }
    if (textRef.current) { textRef.current.classList.remove('active'); void textRef.current.offsetWidth; textRef.current.classList.add('active'); }
    if (filterRef.current) makeParticles(filterRef.current);
  }
  useEffect(function () {
    if (!navRef.current || !containerRef.current) return;
    var lis = navRef.current.querySelectorAll('li');
    if (lis[activeIndex]) { updateEffectPosition(lis[activeIndex]); if (textRef.current) textRef.current.classList.add('active'); }
    var observer = new ResizeObserver(function () { var lis2 = navRef.current.querySelectorAll('li'); if (lis2[activeIndex]) updateEffectPosition(lis2[activeIndex]); });
    observer.observe(containerRef.current); return function () { observer.disconnect(); };
  }, [activeIndex]);
  return <div className="gooey-nav-container" ref={containerRef}>
    <nav><ul ref={navRef}>{items.map(function (item, index) { return <li key={index} className={activeIndex === index ? 'active' : ''}>
      <a href={item.href} onClick={function (e) { e.preventDefault(); handleClick(e, index); }}>{item.label}</a>
    </li>; })}</ul></nav>
    <span className="effect filter" ref={filterRef} />
    <span className="effect text" ref={textRef} />
  </div>;
};

export default GooeyNav;