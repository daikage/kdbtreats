import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function MagneticButton({ children, className = '', onClick, as = 'button', ...props }) {
  const btnRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn || !text) return;

    // Only apply on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const textXTo = gsap.quickTo(text, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const textYTo = gsap.quickTo(text, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = btn.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x * 0.3);
      yTo(y * 0.3);
      textXTo(x * 0.1);
      textYTo(y * 0.1);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      textXTo(0);
      textYTo(0);
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const Component = as;

  return (
    <Component
      ref={btnRef}
      className={`btn ${className}`}
      onClick={(e) => {
        // Ripple effect logic
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
        
        e.currentTarget.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);

        if (onClick) onClick(e);
      }}
      data-cursor-hover
      {...props}
    >
      <span ref={textRef} style={{ display: 'inline-block', pointerEvents: 'none' }}>
        {children}
      </span>
    </Component>
  );
}
