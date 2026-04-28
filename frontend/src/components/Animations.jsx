import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export function FloatingCardWrapper({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-200, 200], [10, -10]);
  const rotateY = useTransform(x, [-200, 200], [-10, 10]);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, transformStyle: "preserve-3d", transformPerspective: 1000 }}
      animate={{ y: [0, -15, 0] }}
      transition={{ y: { duration: 4 + Math.random(), repeat: Infinity, ease: "easeInOut" } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MagneticButton({ children, className, ...props }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.button
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: (e.clientX - rect.left - rect.width / 2) * 0.2, y: (e.clientY - rect.top - rect.height / 2) * 0.2 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y, scale: (pos.x !== 0 || pos.y !== 0) ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className} {...props}
    >
      {children}
    </motion.button>
  );
}

export function BackgroundEffects() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [particles] = useState(() =>
    Array.from({ length: 45 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 6 + 2,
      parallaxX: (Math.random() - 0.5) * 0.15,
      parallaxY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.5 + 0.1,
    }))
  );

  useEffect(() => {
    const handleMouseMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 15s infinite alternate ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }
      `}} />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80 mix-blend-multiply">
        <div className="absolute w-[800px] h-[800px] bg-rose-400/40 blur-[120px] rounded-full animate-blob top-[-100px] left-[-100px]" />
        <div className="absolute w-[600px] h-[600px] bg-violet-500/40 blur-[120px] rounded-full animate-blob animation-delay-2000 bottom-[-100px] right-[-100px]" />
        <div className="absolute w-[500px] h-[500px] bg-yellow-300/40 blur-[120px] rounded-full animate-blob animation-delay-4000 top-[40%] left-[30%]" />
        <div className="absolute w-[700px] h-[700px] bg-cyan-400/30 blur-[120px] rounded-full animate-blob animation-delay-6000 top-[10%] right-[20%]" />
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500"
            style={{
              width: p.size,
              height: p.size,
              left: p.left + '%',
              top: p.top + '%',
              opacity: p.opacity,
            }}
            animate={{
              x: pos.x * p.parallaxX,
              y: pos.y * p.parallaxY,
            }}
            transition={{ type: "spring", stiffness: 40, damping: 20, mass: 0.5 }}
          />
        ))}
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <motion.div
          animate={{ x: pos.x - 200, y: pos.y - 200 }}
          transition={{ type: "spring", mass: 0.1, stiffness: 200, damping: 20 }}
          className="absolute w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full"
        />
      </div>
    </>
  );
}
