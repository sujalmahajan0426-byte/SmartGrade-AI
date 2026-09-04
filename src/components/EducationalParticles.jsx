import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Professional floating geometric particles — small colored circles
 * that drift slowly upward. No emoji. Clean SaaS aesthetic.
 */
const COLORS = [
    'bg-blue-400', 'bg-indigo-400', 'bg-purple-400',
    'bg-pink-400', 'bg-teal-400', 'bg-emerald-400',
    'bg-cyan-400', 'bg-violet-400', 'bg-fuchsia-400',
];

export default function EducationalParticles() {
    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => {
            const color = COLORS[i % COLORS.length];
            const size = Math.random() * 8 + 4;  // 4px – 12px
            const xStart = Math.random() * 100;
            const yStart = 100 + Math.random() * 20;      // start below viewport
            const yEnd = -10 - Math.random() * 20;         // end above viewport
            const duration = Math.random() * 30 + 25;      // 25s–55s (very slow)
            const delay = Math.random() * -40;              // stagger start times
            const xDrift = (Math.random() - 0.5) * 15;     // slight horizontal sway

            return { id: i, color, size, xStart, yStart, yEnd, duration, delay, xDrift };
        });
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={`absolute rounded-full ${p.color}`}
                    style={{ width: p.size, height: p.size }}
                    initial={{
                        left: `${p.xStart}%`,
                        top: `${p.yStart}%`,
                        opacity: 0,
                    }}
                    animate={{
                        top: [`${p.yStart}%`, `${p.yEnd}%`],
                        left: [`${p.xStart}%`, `${p.xStart + p.xDrift}%`],
                        opacity: [0, 0.35, 0.35, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}
