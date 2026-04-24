'use client';

import * as React from 'react';

type ExpandingCard = {
  index: string;
  title: string;
  heading: string;
  description: string;
};

type ExpandingCardsSectionProps = {
  ariaLabel: string;
  cards: ExpandingCard[];
};

export function ExpandingCardsSection({ ariaLabel, cards }: ExpandingCardsSectionProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div className="expanding-cards-showcase" aria-label={ariaLabel}>
      {cards.map((card, index) => {
        const active = activeIndex === index;

        return (
          <button
            key={`${card.index}-${card.title}`}
            type="button"
            className="expanding-feature-card group"
            data-active={active ? 'true' : 'false'}
            onClick={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onMouseEnter={() => setActiveIndex(index)}
            style={
              {
                '--feature-card-index': index,
              } as React.CSSProperties
            }
            aria-pressed={active}
          >
            <span className="expanding-feature-card__glow" aria-hidden="true" />
            <span className="expanding-feature-card__index">{card.index}</span>
            <span className="expanding-feature-card__content">
              <span className="expanding-feature-card__eyebrow">{card.title}</span>
              <span className="expanding-feature-card__heading">
                {card.heading}
              </span>
              <span className="expanding-feature-card__description">{card.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
