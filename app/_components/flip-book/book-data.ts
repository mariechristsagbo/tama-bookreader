import type { BookDefinition, PageAsset } from "./types";

const TOTAL_PAGES = 28;

const REAL_PAGES: Readonly<Record<number, string>> = {
  1: "/book/page-01.png",
  2: "/book/page-02.png",
  3: "/book/page-03.png",
};

function makePlaceholderPage(page: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgb(245, 245, 245)"/><stop offset="100%" stop-color="#ffffff"/></linearGradient>
<pattern id="grain" width="80" height="80" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(0,0,0,0.06)"/><circle cx="35" cy="42" r="1" fill="rgba(0,0,0,0.04)"/><circle cx="66" cy="20" r="1" fill="rgba(0,0,0,0.05)"/></pattern>
</defs>
<rect width="1200" height="1600" fill="url(#g)"/><rect width="1200" height="1600" fill="url(#grain)" opacity="0.7"/>
<rect x="100" y="120" width="1000" height="1360" rx="20" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="4"/>
<line x1="180" y1="260" x2="1020" y2="260" stroke="rgba(0,0,0,0.09)" stroke-width="8"/>
<line x1="180" y1="340" x2="920" y2="340" stroke="rgba(0,0,0,0.08)" stroke-width="6"/>
<line x1="180" y1="420" x2="980" y2="420" stroke="rgba(0,0,0,0.07)" stroke-width="6"/>
<text x="600" y="860" text-anchor="middle" font-family="serif" font-size="92" fill="rgba(20,20,20,0.38)">Page ${page}</text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const pages: readonly PageAsset[] = Array.from(
  { length: TOTAL_PAGES },
  (_, index) => {
    const page = index + 1;

    return {
      alt: `Atomic Habits page ${page}`,
      kind: "image" as const,
      src: REAL_PAGES[page] ?? makePlaceholderPage(page),
    };
  },
);

export const ATOMIC_HABITS_BOOK: BookDefinition = {
  ariaLabel: "Atomic Habits flip book",
  cover: {
    alt: "Atomic Habits book cover",
    kind: "image",
    src: "/book/cover.png",
  },
  id: "atomic-habits",
  pages,
  title: "Atomic Habits",
};
