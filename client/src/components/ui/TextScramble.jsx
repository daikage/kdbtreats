import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function TextScramble({ text, className = '' }) {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    const originalText = text;
    let frame = 0;
    const queue = [];
    
    // Build queue
    for (let i = 0; i < originalText.length; i++) {
      const from = originalText[i] || '';
      const to = originalText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end, char: '' });
    }

    let animationFrame;

    const update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0, n = queue.length; i < n; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARS[Math.floor(Math.random() * CHARS.length)];
            queue[i].char = char;
          }
          output += `<span class="scramble-char">${char}</span>`;
        } else {
          output += from;
        }
      }
      el.innerHTML = output;
      if (complete === queue.length) {
        cancelAnimationFrame(animationFrame);
      } else {
        animationFrame = requestAnimationFrame(update);
        frame++;
      }
    };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        frame = 0;
        update();
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [text]);

  return (
    <span ref={textRef} className={className}>
      {text}
    </span>
  );
}
