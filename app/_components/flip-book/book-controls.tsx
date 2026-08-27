import type { Direction } from "./types";

type NavigationProps = {
  isTurning: boolean;
  nextDisabled: boolean;
  onNavigate: (direction: Direction) => void;
  previousDisabled: boolean;
};

export function PageHotspots({
  isTurning,
  nextDisabled,
  onNavigate,
  previousDisabled,
}: NavigationProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Previous page"
        disabled={previousDisabled || isTurning}
        onClick={() => onNavigate(-1)}
        className="absolute inset-y-0 left-0 z-30 w-1/2 cursor-pointer bg-transparent disabled:cursor-default"
      >
        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-0 size-[84px] rounded-tr-[84px] transition-opacity duration-200 ${
            previousDisabled
              ? "opacity-0"
              : "bg-[radial-gradient(circle_at_0%_100%,rgba(255,255,255,0.35),rgba(255,255,255,0))] opacity-60 hover:opacity-100"
          }`}
        />
      </button>
      <button
        type="button"
        aria-label="Next page"
        disabled={nextDisabled || isTurning}
        onClick={() => onNavigate(1)}
        className="absolute inset-y-0 right-0 z-30 w-1/2 cursor-pointer bg-transparent disabled:cursor-default"
      >
        <span
          aria-hidden="true"
          className={`absolute bottom-0 right-0 size-[84px] rounded-tl-[84px] transition-opacity duration-200 ${
            nextDisabled
              ? "opacity-0"
              : "bg-[radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.35),rgba(255,255,255,0))] opacity-60 hover:opacity-100"
          }`}
        />
      </button>
    </>
  );
}

type BookControlsProps = NavigationProps & {
  label: string;
};

export function BookControls({
  isTurning,
  label,
  nextDisabled,
  onNavigate,
  previousDisabled,
}: BookControlsProps) {
  const baseButton =
    "h-[31px] w-[84px] rounded-[10px] text-[13px] leading-none text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <nav
      aria-label="Book controls"
      className="relative flex h-[51px] w-full shrink-0 items-center justify-between rounded-[var(--book-page-radius)] bg-[var(--book-controls-background)] px-3 py-[10px] text-white"
    >
      <button
        type="button"
        aria-label="Previous"
        disabled={previousDisabled || isTurning}
        onClick={() => onNavigate(-1)}
        className={`${baseButton} ${
          previousDisabled ? "bg-white/20" : "cursor-pointer bg-black"
        } disabled:cursor-default`}
      >
        Previous
      </button>
      <div className="pointer-events-none absolute inset-x-0 text-center text-[13px] leading-[15px]">
        {label}
      </div>
      <button
        type="button"
        aria-label="Next"
        disabled={nextDisabled || isTurning}
        onClick={() => onNavigate(1)}
        className={`${baseButton} ${
          nextDisabled ? "bg-white/20" : "cursor-pointer bg-black"
        } disabled:cursor-default`}
      >
        Next
      </button>
    </nav>
  );
}
