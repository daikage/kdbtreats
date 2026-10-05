import React from 'react';

export default function Marquee({ children, className = '' }) {
  return (
    <div className={`testimonials__track ${className}`}>
      {/* Duplicate children to ensure seamless infinite scroll */}
      {children}
      {children}
      {children}
    </div>
  );
}
