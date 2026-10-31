import { useState, useEffect, useRef } from 'react';
import { indianCasinoGames } from '@/data/home-page/IndianCasino';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const IndianCasino = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Update button states
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateButtons = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;

      setCanScrollLeft(container.scrollLeft > 2);
      setCanScrollRight(container.scrollLeft < maxScroll - 2);
    };

    container.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();

    return () => {
      container.removeEventListener('scroll', updateButtons);
      window.removeEventListener('resize', updateButtons);
    };
  }, []);

  // Automatic scrolling
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = window.setInterval(() => {
      const firstCard = container.firstElementChild as HTMLElement | null;
      if (!firstCard) return;

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 2) return;

      const gap = parseFloat(window.getComputedStyle(container).columnGap) || 0;

      const distance = firstCard.getBoundingClientRect().width + gap;

      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      } else {
        container.scrollBy({
          left: distance,
          behavior: 'smooth',
        });
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  // Manual scrolling: one card at a time
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.firstElementChild as HTMLElement | null;
    if (!firstCard) return;

    const gap = parseFloat(window.getComputedStyle(container).columnGap) || 0;

    const distance = firstCard.getBoundingClientRect().width + gap;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === 'left') {
      if (container.scrollLeft <= 2) return;

      container.scrollBy({
        left: -distance,
        behavior: 'smooth',
      });
    } else {
      if (container.scrollLeft >= maxScroll - 2) {
        container.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      } else {
        container.scrollBy({
          left: distance,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <section className="w-full min-w-0 px-4 pb-4">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="italic px-2 text-xl tracking-tight sm:text-2xl font-bold">INDIAN CASINO</h1>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous games"
            disabled={!canScrollLeft}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-cyan-700 transition hover:brightness-110"
          >
            <IoChevronBack size={24} />
          </button>

          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Next games"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-cyan-700 transition hover:brightness-110"
          >
            <IoChevronForward size={24} />
          </button>
        </div>
      </div>

      <div className="relative mb-3 h-[3px] w-full bg-white/30">
        <div className="absolute left-0 top-0 h-[4px] w-16 rounded-full bg-white" />
      </div>

      {/* Game Cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {indianCasinoGames.map((game) => (
          <div
            key={game.id}
            className="group relative flex-none overflow-hidden rounded-2xl bg-gray-900"
          >
            <img
              src={game.image}
              alt="Indian Casino Image"
              loading="lazy"
              className="h-[200px] object-cover transition duration-300 group-hover:scale-105"
            />

          </div>
        ))}
      </div>
    </section>
  );
};

export default IndianCasino;
