import React, { useRef, useState } from 'react';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({ children, className = '', noHoverEffect = false }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || noHoverEffect) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl border border-white/10 bg-surface/50 overflow-hidden transition-all duration-300 ${!noHoverEffect ? 'hover:scale-[1.02] hover:border-white/20' : ''} ${className}`}
    >
      {/* Flashlight Gradient Overlay */}
      {!noHoverEffect && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default Card;