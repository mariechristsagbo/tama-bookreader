import type { ComponentType } from "react";

export type Direction = -1 | 1;

export type PageDescriptor = {
  alt: string;
  id: string;
};

export type PageRendererProps<Page extends PageDescriptor> = {
  asset: Page;
  priority: boolean;
};

export type PageRenderer<Page extends PageDescriptor> = ComponentType<
  PageRendererProps<Page>
>;

export type BookDefinition<Page extends PageDescriptor = PageDescriptor> = {
  ariaLabel: string;
  cover: Page;
  id: string;
  pageNumbering?: {
    offset: number;
    total: number;
  };
  pages: readonly Page[];
  title: string;
};

export type Spread<Page extends PageDescriptor = PageDescriptor> = {
  label: string;
  left: Page | null;
  right: Page | null;
};

export type Turn = {
  direction: Direction;
  from: number;
  to: number;
};
