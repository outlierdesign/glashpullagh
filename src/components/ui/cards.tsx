import React from 'react';
import { cn } from '@/lib/utils';

export interface CardItem {
  id: string | number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export interface HoverRevealCardsProps {
  items: CardItem[];
  className?: string;
  cardClassName?: string;
}

const HoverRevealCards: React.FC<HoverRevealCardsProps> = ({
  items,
  className,
  cardClassName,
}) => {
  return (
    <div
      role="list"
      className={cn(
        'group grid w-full max-w-6xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-4',
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="listitem"
          aria-label={`${item.title}, ${item.subtitle}`}
          tabIndex={0}
          className={cn(
            'relative h-80 cursor-pointer overflow-hidden rounded-xl bg-cover bg-center shadow-lg transition-all duration-500 ease-in-out border-2 border-transparent',
            'group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px]',
            'hover:!scale-105 hover:!opacity-100 hover:!blur-none hover:!border-[#3B4E34] hover:!shadow-[0_0_30px_rgba(59,78,52,0.4)]',
            'focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none focus-visible:!border-[#3B4E34]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4E34] focus-visible:ring-offset-2 ring-offset-background',
            cardClassName
          )}
          style={{ backgroundImage: `url(${item.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/70" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <p className="text-sm font-light uppercase tracking-widest opacity-80">
              {item.subtitle}
            </p>
            <h3 className="mt-1 text-2xl font-semibold">{item.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HoverRevealCards;
