import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Custom cursor with golden dot + ring.
 * Magnetic hover effect on interactive elements.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only on devices with a fine pointer (no touch)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.classList.add('has-custom-cursor');
    const dot = dotRef.current;
    const ring = ringRef.current;

    const moveCursor = (e) => {
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = () => {
      ring.classList.add('is-hovering');
    };

    const handleMouseLeave = () => {
      ring.classList.remove('is-hovering');
    };

    const handleMouseDown = () => {
      ring.classList.add('is-clicking');
    };

    const handleMouseUp = () => {
      ring.classList.remove('is-clicking');
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Observe interactive elements for hover effects
    const observeInteractives = () => {
      const interactives = document.querySelectorAll('a, button, [data-cursor-hover]');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Re-observe on DOM changes
    const observer = new MutationObserver(observeInteractives);
    observer.observe(document.body, { childList: true, subtree: true });
    observeInteractives();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('has-custom-cursor');
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
