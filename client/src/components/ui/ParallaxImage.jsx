import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxImage({ src, alt, className = '', speed = 0.5 }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    // Calculate Y offset based on speed
    const yOffset = speed * 100;

    gsap.fromTo(image, 
      { y: -yOffset },
      {
        y: yOffset,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom', // Start when container enters bottom of screen
          end: 'bottom top',   // End when container leaves top of screen
          scrub: true,
        }
      }
    );
  }, [speed]);

  return (
    <div ref={containerRef} className={`parallax-container ${className}`} style={{ overflow: 'hidden', position: 'relative' }}>
      <img 
        ref={imageRef} 
        src={src} 
        alt={alt} 
        style={{ 
          width: '100%', 
          height: `${100 + (Math.abs(speed) * 100)}%`, // Make image taller than container to allow parallax
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0
        }} 
      />
    </div>
  );
}
