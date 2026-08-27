import * as m from "motion/react-m";
import { getPage, getSpread } from "./book-model";
import { PageSurface } from "./page-surface";
import { TURN_DURATION, TurningSheet } from "./turning-sheet";
import type { BookDefinition, Turn } from "./types";

type TurnLayerProps = {
  book: BookDefinition;
  isMobile: boolean;
  onComplete: () => void;
  turn: Turn;
};

export function TurnLayer({
  book,
  isMobile,
  onComplete,
  turn,
}: TurnLayerProps) {
  if (isMobile) {
    return (
      <TurningSheet
        className="inset-0"
        direction={turn.direction}
        front={turn.from === 0 ? book.cover : getPage(book, turn.from)}
        back={turn.to === 0 ? book.cover : getPage(book, turn.to)}
        onComplete={onComplete}
      />
    );
  }

  const fromSpread = getSpread(book, turn.from);
  const toSpread = getSpread(book, turn.to);
  const turnsForward = turn.direction === 1;
  const front = turnsForward ? fromSpread.right : fromSpread.left;
  const back = turnsForward ? toSpread.left : toSpread.right;
  const opposite = turnsForward ? fromSpread.left : fromSpread.right;

  return (
    <>
      <m.div
        className={`absolute inset-y-0 z-[15] w-1/2 ${
          turnsForward ? "left-0" : "left-1/2"
        }`}
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{
          duration: TURN_DURATION,
          ease: "linear",
          times: [0, 0.49, 0.51],
        }}
      >
        {opposite ? (
          <PageSurface
            asset={opposite}
            className={
              turnsForward
                ? "rounded-l-[var(--book-page-radius)]"
                : "rounded-r-[var(--book-page-radius)]"
            }
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--book-background)]" />
        )}
      </m.div>

      <TurningSheet
        className={`inset-y-0 w-1/2 ${
          turnsForward ? "left-1/2" : "left-0"
        }`}
        direction={turn.direction}
        front={front}
        back={back}
        onComplete={onComplete}
      />
    </>
  );
}
