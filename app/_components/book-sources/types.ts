import type { PDFDocumentProxy } from "pdfjs-dist";
import type { PageDescriptor } from "../flip-book/types";

export type ImagePageAsset = PageDescriptor & {
  kind: "image";
  src: string;
};

export type PdfPageAsset = PageDescriptor & {
  document: PDFDocumentProxy;
  kind: "pdf";
  pageNumber: number;
};

export type ReaderPageAsset = ImagePageAsset | PdfPageAsset;
