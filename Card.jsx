import React, { forwardRef } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";

const Card = forwardRef(({ id, url, setCards, cards }, ref) => {
  const x = useMotionValue(0);
  const rotateBase = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;
  const offset = isFront ? 0 : id % 2 ? 6 : -6;
  const rotate = useTransform(rotateBase, (r) => `${r + offset}deg`);

  const controls = useAnimation();

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setCards((prev) => prev.filter((card) => card.id !== id));
    }
  };

  return (
    <motion.img
      ref={(node) => {
        if (ref) ref(node ? controls : null);
      }}
      src={url}
      alt="maid card"
      className="card"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        rotate,
        opacity,
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
      }}
      animate={controls}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    />
  );
});

export default Card;
