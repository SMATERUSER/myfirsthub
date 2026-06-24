import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';
import './CircularText.css';

export default function CircularText({ text = '', spinDuration = 20, onHover = 'speedUp' }) {
  const letters = Array.from(text);
  const controls = useAnimation();
  const radius = 150;

  const spinTransition = (duration) => ({
    rotate: {
      from: 0,
      to: 360,
      ease: 'linear',
      duration,
      type: 'tween',
      repeat: Infinity
    }
  });

  useEffect(() => {
    controls.start({ rotate: 360, transition: spinTransition(spinDuration) });
  }, [spinDuration, controls]);

  const handleHover = () => {
    controls.start({ rotate: 360, transition: spinTransition(spinDuration / 4) });
  };

  const handleHoverEnd = () => {
    controls.start({ rotate: 360, transition: spinTransition(spinDuration) });
  };

  return (
    <div className="circular-text-wrapper" style={{ width: radius * 2, height: radius * 2 }}>
      <motion.div
        className="circular-text"
        animate={controls}
        onMouseEnter={onHover ? handleHover : undefined}
        onMouseLeave={onHover ? handleHoverEnd : undefined}
      >
        {letters.map((letter, i) => {
          const angle = (i / letters.length) * 360;
          const rad = (angle * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);
          return (
            <span
              key={i}
              className="circular-letter"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% - ${y}px)`
              }}
            >
              {letter}
            </span>
          );
        })}
      </motion.div>
      <div className="circular-text-label">DESIGN YOURSELF</div>
    </div>
  );
}