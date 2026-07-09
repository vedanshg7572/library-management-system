import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Link } from "react-router-dom";

/* ════════════════════════════════════════════════════════════
   HERO PARALLAX — Adapted from Aceternity UI for React/Vite
   • Replaced next/image  → <img>
   • Replaced next/link   → react-router-dom Link / <a>
   • Removed TypeScript   → plain JSX
   • Removed "use client" → not needed in Vite
════════════════════════════════════════════════════════════ */

export const HeroParallax = ({ products }) => {
  const firstRow  = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow  = products.slice(10, 15);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX        = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]),  springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX  = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]),    springConfig);
  const opacity  = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),   springConfig);
  const rotateZ  = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]),    springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
      style={{ background: "linear-gradient(180deg, #03001e 0%, #0a0612 40%, #03001e 100%)" }}
    >
      <ParallaxHeader />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ── Internal Header ─────────────────────────────────────── */
export const ParallaxHeader = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/8 mb-6">
        <span className="text-xs font-bold text-amber-300 tracking-widest uppercase">📚 Explore Our Collection</span>
      </div>
      <h2 className="text-3xl md:text-7xl font-black text-white tracking-tighter leading-tight">
        Thousands of Books,<br />
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(120deg, #fbbf24 0%, #f97316 35%, #a78bfa 70%, #60a5fa 100%)" }}
        >
          One Library.
        </span>
      </h2>
      <p className="max-w-2xl text-base md:text-xl mt-6 text-slate-400 font-medium leading-relaxed">
        From timeless classics to modern masterpieces — discover, borrow, and read online.
        Your next favourite book is waiting.
      </p>
      <div className="flex gap-4 mt-8 flex-wrap">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm text-white rounded-2xl shadow-xl"
          style={{ background: "linear-gradient(135deg, #f59e0b, #f97316, #7c3aed)" }}
        >
          🚀 Start Reading Free
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-slate-300 hover:text-white rounded-2xl border border-white/10 hover:border-white/25 transition-all"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          Sign In →
        </Link>
      </div>
    </div>
  );
};

/* ── Product Card ────────────────────────────────────────── */
export const ProductCard = ({ product, translate }) => {
  const [imgError, setImgError] = React.useState(false);

  const isExternal = product.link.startsWith("http");

  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0 rounded-2xl overflow-hidden"
    >
      {isExternal ? (
        <a href={product.link} target="_blank" rel="noopener noreferrer" className="block">
          {!imgError ? (
            <img
              src={product.thumbnail}
              height={600}
              width={600}
              className="object-cover object-center absolute h-full w-full inset-0 transition-transform duration-500 group-hover/product:scale-110"
              alt={product.title}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: product.fallbackGradient || "linear-gradient(135deg, #7c3aed, #4c1d95)" }}
            >
              <div className="text-center text-white p-6">
                <div className="text-5xl mb-3">{product.emoji || "📚"}</div>
                <p className="font-extrabold text-lg">{product.title}</p>
                <p className="text-white/60 text-sm mt-1">{product.subtitle || ""}</p>
              </div>
            </div>
          )}
        </a>
      ) : (
        <Link to={product.link} className="block">
          {!imgError ? (
            <img
              src={product.thumbnail}
              height={600}
              width={600}
              className="object-cover object-center absolute h-full w-full inset-0 transition-transform duration-500 group-hover/product:scale-110"
              alt={product.title}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: product.fallbackGradient || "linear-gradient(135deg, #7c3aed, #4c1d95)" }}
            >
              <div className="text-center text-white p-6">
                <div className="text-5xl mb-3">{product.emoji || "📚"}</div>
                <p className="font-extrabold text-lg">{product.title}</p>
                <p className="text-white/60 text-sm mt-1">{product.subtitle || ""}</p>
              </div>
            </div>
          )}
        </Link>
      )}

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none transition-opacity duration-300 rounded-2xl" />

      {/* Title on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover/product:opacity-100 group-hover/product:translate-y-0 transition-all duration-300">
        <h2 className="text-white font-extrabold text-lg">{product.title}</h2>
        {product.subtitle && <p className="text-white/60 text-sm mt-0.5">{product.subtitle}</p>}
      </div>

      {/* Genre badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold text-white"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
          {product.badge}
        </div>
      )}
    </motion.div>
  );
};

export default HeroParallax;
