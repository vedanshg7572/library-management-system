import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse position — sharp dot follows instantly
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);

  // Spring-smoothed position — large orb lags behind (lerp feel)
  const orbX = useSpring(dotX, { stiffness: 75, damping: 18, mass: 0.6 });
  const orbY = useSpring(dotY, { stiffness: 75, damping: 18, mass: 0.6 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Attach hover listeners to interactive elements
    const attachHoverListeners = () => {
      document.querySelectorAll('a, button, input, textarea, select, label, [role="button"]').forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    // Small delay to let React render all DOM elements first
    const timer = setTimeout(attachHoverListeners, 600);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dotX, dotY]);

  // Dynamic orb size
  const orbSize = isClicking ? 30 : isHovering ? 60 : 44;

  return (
    <>
      {/* ── Large glowing orb — lags behind cursor ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: orbX,
          y: orbY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 99998,
          borderRadius: '50%',
          mixBlendMode: 'screen',
        }}
        animate={{
          width: orbSize,
          height: orbSize,
          opacity: isVisible ? 1 : 0,
          background: isHovering
            ? 'radial-gradient(circle, rgba(216,180,254,0.6) 0%, rgba(139,92,246,0.35) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(167,139,250,0.5) 0%, rgba(99,102,241,0.25) 45%, transparent 70%)',
          filter: `blur(${isHovering ? 7 : 5}px)`,
          boxShadow: isHovering
            ? '0 0 35px 14px rgba(139,92,246,0.4), 0 0 70px 28px rgba(99,102,241,0.18)'
            : '0 0 22px 9px rgba(139,92,246,0.28), 0 0 44px 18px rgba(99,102,241,0.12)',
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      />

      {/* ── Outer ring — appears on hover ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: orbX,
          y: orbY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 99997,
          borderRadius: '50%',
          border: '1px solid rgba(167,139,250,0.5)',
        }}
        animate={{
          width: isHovering ? 80 : 0,
          height: isHovering ? 80 : 0,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />

      {/* ── Small sharp dot — follows instantly ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 100000,
          borderRadius: '50%',
        }}
        animate={{
          width: isClicking ? 3 : 5,
          height: isClicking ? 3 : 5,
          opacity: isVisible ? 1 : 0,
          backgroundColor: '#ffffff',
          boxShadow: isHovering
            ? '0 0 10px 4px rgba(216,180,254,1)'
            : '0 0 7px 2px rgba(167,139,250,0.9)',
          scale: isClicking ? 0.6 : 1,
        }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
      />
    </>
  );
};

export default CustomCursor;
