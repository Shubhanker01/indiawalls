'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function AnimatedSection({ children, delay = 0, className = "" }) {
    return (
        <LazyMotion features={domAnimation}>
            <m.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                    duration: 0.7,
                    delay: delay,
                    ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className={className}
            >
                {children}
            </m.div>
        </LazyMotion>
    );
}