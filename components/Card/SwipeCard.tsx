"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export type SwipeDirection = "left" | "right";

type SwipeCardProps = {
  children: React.ReactNode;
  className?: string;
  swipeThreshold?: number;
  onCardLeftScreen?: (direction: SwipeDirection) => void;
};

export function SwipeCard({
  children,
  className,
  swipeThreshold = 80,
  onCardLeftScreen,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-10, 0, 10]);
  const [leaving, setLeaving] = useState<null | SwipeDirection>(null);

  return (
    <motion.div
      className={className}
      style={{ x, rotate }}
      drag={leaving ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.08}
      whileDrag={{ scale: 1.01 }}
      animate={
        leaving
          ? { x: leaving === "left" ? -1200 : 1200, rotate: leaving === "left" ? -18 : 18 }
          : { x: 0, rotate: 0 }
      }
      transition={{ type: "spring", stiffness: 520, damping: 42 }}
      onDragEnd={(_, info) => {
        const fastSwipe = Math.abs(info.velocity.x) > 500;
        const farSwipe = Math.abs(info.offset.x) > swipeThreshold;

        if (fastSwipe || farSwipe) {
          setLeaving(info.offset.x < 0 ? "left" : "right");
        } else {
          x.set(0);
        }
      }}
      onAnimationComplete={() => {
        if (!leaving) return;
        onCardLeftScreen?.(leaving);
        setLeaving(null);
        x.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
