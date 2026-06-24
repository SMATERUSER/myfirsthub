import { useEffect, useRef } from 'react';
import './PillNav.css';

export default function PillNav({ items = [], onChange, baseColor = '#1a1a2e', pillColor = '#ffffff', pillTextColor }) {
  var textColor = pillTextColor || baseColor;
  var navRef = useRef(null);
  var pillsRef = useRef([]);

  useEffect(function () {
    if (!navRef.current) return;
    pillsRef.current.forEach(function (pill) {
      if (!pill) return;
      var h = pill.offsetHeight;
      var w = pill.offsetWidth;
      var R = ((w * w) / 4 + h * h) / (2 * h);
      var D = Math.ceil(2 * R) + 2;
      var delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      var circle = pill.querySelector('.pnt-circle');
      if (circle) { circle.style.width = D + 'px'; circle.style.height = D + 'px'; circle.style.bottom = '-' + delta + 'px'; }
    });
  });

  var cssVars = { '--base': baseColor, '--pill-bg': pillColor, '--pill-text': textColor };

  return <div className="pill-nav-toolbar" style={cssVars}>
    <div className="pnt-nav" ref={navRef}>
      <div className="pnt-list">{items.map(function (item, i) { return <div key={i} className="pnt-pill" onClick={function () { if (onChange) onChange(i); }}>
        <span className="pnt-circle" />
        <span className="pnt-label-stack">
          <span className="pnt-label">{item.label}</span>
        </span>
      </div>; })}</div>
    </div>
  </div>;
}