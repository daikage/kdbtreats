import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CounterNumber({ value, prefix = '', suffix = '', duration = 2, className = '' }) {
  const numberRef = useRef(null);

  useEffect(() => {
    const el = numberRef.current;
    
    // Parse value to number (strip commas if any, but assume it's passed as a number)
    const endValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

    let obj = { val: 0 };

    gsap.to(obj, {
      val: endValue,
      duration: duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      onUpdate: () => {
        // Format with commas
        const formatted = Math.floor(obj.val).toLocaleString('en-US');
        el.innerText = `${prefix}${formatted}${suffix}`;
      }
    });
  }, [value, prefix, suffix, duration]);

  return (
    <span ref={numberRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
