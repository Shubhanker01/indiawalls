'use client';

import { motion } from 'framer-motion';

export default function AnimatedSection({ children, delay = 0, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.7,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98], // Custom smooth cubic-bezier
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}