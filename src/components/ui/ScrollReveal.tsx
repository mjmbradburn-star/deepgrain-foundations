import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  as?: "div" | "section" | "article";
}

export const ScrollReveal = ({
  children,
  delay = 0,
  distance = 24,
  duration = 0.7,
  threshold = 0.15,
  className,
  as = "div",
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration, delay: delay / 1000, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};
