// AnimatedDock — Adapted from HextaUI for React + Vite
// Changes: removed TypeScript, "use client", next/link → react-router-dom / <a>
//          motion/react → framer-motion (already installed)

import * as React from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...args) => twMerge(clsx(args));

/* ── DockItem ─────────────────────────────────────────────── */
export const DockItem = ({ mouseX, children, tooltip }) => {
  const ref = useRef(null);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync  = useTransform(distance, [-150, 0, 150], [44, 78, 44]);
  const width      = useSpring(widthSync,  { mass: 0.1, stiffness: 150, damping: 12 });
  const iconScale  = useTransform(width,   [44, 78], [1, 1.45]);
  const iconSpring = useSpring(iconScale,  { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      {showTooltip && tooltip && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-10 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white whitespace-nowrap pointer-events-none z-50"
          style={{
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {tooltip}
          {/* Arrow */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2"
            style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(0,0,0,0.8)' }}
          />
        </motion.div>
      )}

      {/* Icon button */}
      <motion.div
        ref={ref}
        style={{ width }}
        className="aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          style={{ scale: iconSpring }}
          className="flex items-center justify-center w-full h-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ── AnimatedDock ─────────────────────────────────────────── */
export const AnimatedDock = ({ className, items }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
      className={cn("mx-auto flex h-16 items-end gap-3 rounded-2xl px-4 pb-3", className)}
      style={{
        background: 'rgba(10, 8, 30, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {items.map((item, index) => {
        const isExternal = item.link?.startsWith('http');
        const iconEl = (
          <div
            className="w-full h-full flex items-center justify-center rounded-xl text-white"
            style={{
              background: item.active
                ? 'linear-gradient(135deg, rgba(245,158,11,0.4), rgba(124,58,237,0.3))'
                : 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.15))',
              border: item.active ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {item.Icon}
          </div>
        );

        return (
          <DockItem key={index} mouseX={mouseX} tooltip={item.label}>
            {isExternal ? (
              <a
                href={item.link}
                target={item.target || '_blank'}
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-full"
              >
                {iconEl}
              </a>
            ) : (
              <Link to={item.link} className="flex items-center justify-center w-full h-full">
                {iconEl}
              </Link>
            )}
          </DockItem>
        );
      })}
    </motion.div>
  );
};

export default AnimatedDock;
