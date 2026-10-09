import { useRef, useState, useCallback } from 'react';
import type { MouseEvent, FC, ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export const TiltCard: FC<TiltCardProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    // Only tilt on hover if it's a pointer device (mouse)
    if (window.matchMedia('(hover: none)').matches) return;
    
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15, // Reduced glare opacity for higher-end feel
    });
    setIsHovering(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
    setIsHovering(false);
  }, []);

  return (
    <div 
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        className="w-full h-full transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isHovering 
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)` 
            : `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {children}
        {/* Glare effect */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-[400ms] ease-out rounded-[inherit] ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
            mixBlendMode: 'overlay',
            transform: 'translateZ(1px)' // Keeps glare on top cleanly in 3D space
          }}
        />
      </div>
    </div>
  );
};
