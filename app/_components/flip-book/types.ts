export type Direction = -1 | 1;

export type PageAsset = {
  alt: string;
  src: string;
};

export type BookDefinition = {
  ariaLabel: string;
  cover: PageAsset;
  pages: readonly PageAsset[];
};

export type Spread = {
  label: string;
  left: PageAsset | null;
  right: PageAsset | null;
};

export type Turn = {
  direction: Direction;
  from: number;
  to: number;
};
