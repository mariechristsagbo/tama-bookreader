import type { PDFDocumentProxy } from "pdfjs-dist";

export type Direction = -1 | 1;

export type ImagePageAsset = {
  alt: string;
  kind: "image";
  src: string;
};

export type PdfPageAsset = {
  alt: string;
  document: PDFDocumentProxy;
  kind: "pdf";
  pageNumber: number;
};

export type PageAsset = ImagePageAsset | PdfPageAsset;

export type BookDefinition = {
  ariaLabel: string;
  cover: PageAsset;
  id: string;
  pageNumbering?: {
    offset: number;
    total: number;
  };
  pages: readonly PageAsset[];
  title: string;
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
