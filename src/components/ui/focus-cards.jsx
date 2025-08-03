"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const Card = React.memo(({ card, index, hovered, setHovered }) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-tr-[44px] rounded-bl-[44px] relative bg-gray-100 dark:bg-gray-900 overflow-hidden h-48 md:h-56  w-full transition-all duration-300 ease-out",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
    )}
  >
    <Link
      href={{
        pathname: `/cycles/${card?.id}`,
        query: { title: card?.title },
      }}
    >
      <img
        src={card.cycleImage}
        alt={card.title}
        className="w-full h-full object-fill absolute inset-0"
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/40 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-50" : "opacity-0"
        )}
      >
        <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
          {card.title}
        </div>
      </div>
    </Link>
  </div>
));

Card.displayName = "Card";

export function FocusCards({ cards }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
