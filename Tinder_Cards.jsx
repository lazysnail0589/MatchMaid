import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import "./Tinder_Cards.css";
import Card from "./Card";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";


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

function TinderCards() {
  const [cards, setCards] = useState(cardData);
  const [history, setHistory] = useState([]);
  const cardRefs = useRef({});

  const handleSwipe = async (direction) => {
    const currentCard = cards[cards.length - 1];
    if (!currentCard) return;
  
    const el = cardRefs.current[currentCard.id];
    if (!el) return;
  
    let swipe = { x: 0, y: 0 };
    if (direction === "right") swipe.x = 300;
    if (direction === "left") swipe.x = -300;
    if (direction === "up") swipe.y = -300;
  
    el.start({
      x: swipe.x,
      y: swipe.y,
      opacity: 0,
      transition: { duration: 0.4 },
    });
  
    // Save for later if swiped up
    if (direction === "up") {
      try {
        await addDoc(collection(db, "savedMaids"), {
          ...currentCard,
          savedAt: new Date().toISOString(),
        });
        console.log("Saved for later!");
      } catch (error) {
        console.error("Error saving to Firebase:", error);
      }
    }
  
    setTimeout(() => {
      setHistory((prev) => [...prev, currentCard]);
      setCards((prev) => prev.filter((card) => card.id !== currentCard.id));
    }, 300);
  };
  
  

  const handleRewind = () => {
    const last = history[history.length - 1];
    if (!last) return;

    setCards((prev) => [...prev, last]);
    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div
      className="tinderCards__cardContainer"
      style={{
        display: "grid",
        height: "500px",
        width: "100%",
        placeItems: "center",
        backgroundColor: "#f3f3f3",
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          {...card}
          setCards={setCards}
          cards={cards}
          ref={(el) => (cardRefs.current[card.id] = el)}
        />
      ))}

      <div className="actionButtons">
        <button onClick={handleRewind} title="Rewind">⟲</button>
        <button onClick={() => handleSwipe("left")} title="Deny">🚫</button>
        <button onClick={() => handleSwipe("up")} title="Save for later">✔️</button>
        <button onClick={() => handleSwipe("right")} title="Hire">❤️</button>
      </div>
    </div>
  );
}

export default TinderCards;
