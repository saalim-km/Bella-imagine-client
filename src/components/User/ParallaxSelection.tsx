
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  overflow?: boolean;
  className?: string;
  speed?: number;  // Range from -1 to 1, with negative values moving opposite to scroll
}

const ParallaxSection = ({
  children,
  overflow = false,
  className = "",
  speed = 0.2,
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, speed * 100 * -1]
  );

  return (
    <motion.div
      ref={ref}
      className={`relative ${overflow ? "" : "overflow-hidden"} ${className}`}
    >
      <motion.div style={{ y }}>{children}</motion.div>
    </motion.div>
  );
};

export default ParallaxSection;
