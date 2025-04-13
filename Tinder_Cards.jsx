import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import "./Tinder_Cards.css";

const cardData = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2370&auto=format&fit=crop",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=2235&auto=format&fit=crop",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2342&auto=format&fit=crop",
  },
];

function Card({ id, url, setCards, cards }) {
  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;
  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setCards((prev) => prev.filter((card) => card.id !== id));
    }
  };

  return (
    <motion.img
      src={url}
      alt="maid card"
      className="h-96 w-72 origin-bottom rounded-lg object-cover shadow-lg"
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
      animate={{ scale: isFront ? 1 : 0.98 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    />
  );
}

function TinderCards() {
  const [cards, setCards] = useState(cardData);

  return (
    <div
  className="tinderCards__cardContainer"
  style={{
    display: 'grid',
    height: '500px',
    width: '100%',
    placeItems: 'center',
    backgroundColor: '#f3f3f3', // substitute for bg-neutral-100
  }}>
      {cards.map((card) => (
        <Card key={card.id} {...card} setCards={setCards} cards={cards} />
      ))}
    </div>
  );
}

export default TinderCards;
