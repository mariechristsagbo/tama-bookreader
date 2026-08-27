"use client";

import { useState, useSyncExternalStore } from "react";
import {
  domAnimation,
  LazyMotion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import { getBookStatus, getTargetPage } from "./book-model";
import { BookControls, PageHotspots } from "./book-controls";
import {
  getMobileSnapshot,
  getServerMobileSnapshot,
  subscribeToMobileQuery,
} from "./mobile-store";
import { StaticBook } from "./static-book";
import { TurnLayer } from "./turn-layer";
import type { BookDefinition, Direction, Turn } from "./types";

type FlipBookProps = {
  book: BookDefinition;
};

export function FlipBook({ book }: FlipBookProps) {
  const isMobile = useSyncExternalStore(
    subscribeToMobileQuery,
    getMobileSnapshot,
    getServerMobileSnapshot,
  );
  const shouldReduceMotion = useReducedMotion();
  const [currentPage, setCurrentPage] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const { label, nextDisabled, previousDisabled } = getBookStatus(
    book,
    currentPage,
    isMobile,
  );

  const navigate = (direction: Direction) => {
    if (turn) return;

    const target = getTargetPage(book, currentPage, direction, isMobile);
    if (target === currentPage) return;

    if (shouldReduceMotion) {
      setCurrentPage(target);
      return;
    }

    setTurn({ direction, from: currentPage, to: target });
    setCurrentPage(target);
  };

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <main className="min-h-dvh w-full overflow-clip bg-[var(--book-background)] px-4 py-5 min-[810px]:px-12 min-[810px]:py-12">
          <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-[10px]">
            <section
              aria-label={book.ariaLabel}
              className="relative isolate aspect-[2/3] w-full overflow-hidden rounded-[var(--book-stage-radius)] [perspective:2200px] min-[810px]:aspect-[4/3]"
            >
              <StaticBook
                book={book}
                currentPage={currentPage}
                isMobile={isMobile}
              />
              {turn ? (
                <TurnLayer
                  book={book}
                  isMobile={isMobile}
                  turn={turn}
                  onComplete={() => setTurn(null)}
                />
              ) : null}
              <PageHotspots
                isTurning={turn !== null}
                previousDisabled={previousDisabled}
                nextDisabled={nextDisabled}
                onNavigate={navigate}
              />
            </section>

            <BookControls
              isTurning={turn !== null}
              label={label}
              previousDisabled={previousDisabled}
              nextDisabled={nextDisabled}
              onNavigate={navigate}
            />
          </div>
        </main>
      </LazyMotion>
    </MotionConfig>
  );
}
