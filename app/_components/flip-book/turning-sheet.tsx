import * as m from "motion/react-m";
import { PageSurface } from "./page-surface";
import type { Direction, PageAsset } from "./types";

export const TURN_DURATION = 0.56;

type TurningSheetProps = {
  back: PageAsset | null;
  className: string;
  direction: Direction;
  front: PageAsset | null;
  onComplete: () => void;
};

export function TurningSheet({
  back,
  className,
  direction,
  front,
  onComplete,
}: TurningSheetProps) {
  const turnsForward = direction === 1;
  const surfaceClassName =
    "rounded-[var(--book-page-radius)] [backface-visibility:hidden] shadow-[var(--book-turn-shadow)]";

  return (
    <m.div
      className={`absolute z-20 [transform-style:preserve-3d] ${className}`}
      style={{
        transformOrigin: turnsForward ? "left center" : "right center",
      }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: turnsForward ? -180 : 180 }}
      transition={{
        duration: TURN_DURATION,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      onAnimationComplete={onComplete}
    >
      <PageSurface asset={front} className={surfaceClassName} />
      <PageSurface
        asset={back}
        className={`${surfaceClassName} [transform:rotateY(180deg)]`}
      />
    </m.div>
  );
}
