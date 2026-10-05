import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ children, animation = 'fade-up', delay = 0, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    
    let varsFrom = { opacity: 0 };
    let varsTo = { opacity: 1, duration: 1, ease: 'power3.out', delay };

    switch (animation) {
      case 'fade-up':
        varsFrom.y = 50;
        varsTo.y = 0;
        break;
      case 'fade-down':
        varsFrom.y = -50;
        varsTo.y = 0;
        break;
      case 'fade-left':
        varsFrom.x = 50;
        varsTo.x = 0;
        break;
      case 'fade-right':
        varsFrom.x = -50;
        varsTo.x = 0;
        break;
      case 'scale-up':
        varsFrom.scale = 0.8;
        varsTo.scale = 1;
        break;
      default:
        break;
    }

    gsap.fromTo(el, varsFrom, {
      ...varsTo,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        // toggleActions: 'play none none reverse', // uncomment to replay on scroll up
      }
    });
  }, [animation, delay]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
}
