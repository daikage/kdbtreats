import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SplitText({ text, as: Component = 'div', className = '', delay = 0 }) {
  const containerRef = useRef(null);
  
  // Custom simple split text logic since we are not using the paid GSAP SplitText plugin
  const words = text.split(' ').map(word => {
    // Check if word contains the accent wrapper marker we want to use (e.g. *word*)
    const isAccent = word.startsWith('*') && word.endsWith('*');
    const cleanWord = isAccent ? word.slice(1, -1) : word;
    
    return {
      word: cleanWord,
      isAccent,
      chars: cleanWord.split('')
    };
  });

  useEffect(() => {
    const chars = containerRef.current.querySelectorAll('.char');
    
    gsap.fromTo(chars,
      {
        opacity: 0,
        y: 80,
        rotationX: -40,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.02,
        ease: 'back.out(1.7)',
        delay: delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        }
      }
    );
  }, [delay]);

  return (
    <Component ref={containerRef} className={className} style={{ perspective: '1000px' }}>
      {words.map((wObj, wIndex) => (
        <span key={wIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.25em' }}>
          {wObj.chars.map((char, cIndex) => (
            <span
              key={`${wIndex}-${cIndex}`}
              className={`char ${wObj.isAccent ? 'accent' : ''}`}
              style={{ display: 'inline-block', transformOrigin: '50% 100%' }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Component>
  );
}
