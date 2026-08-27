import type { PDFDocumentProxy } from "pdfjs-dist";
import type { PdfPageAsset, ReaderPageAsset } from "../book-sources/types";
import type { BookDefinition } from "../flip-book/types";

export const MAX_PDF_SIZE = 50 * 1024 * 1024;

function getDocumentTitle(fileName: string) {
  return fileName.replace(/\.pdf$/i, "") || "PDF document";
}

function createPageAsset(
  document: PDFDocumentProxy,
  pageNumber: number,
  title: string,
): PdfPageAsset {
  return {
    alt: `${title}, page ${pageNumber}`,
    document,
    id: `${title}-pdf-page-${pageNumber}`,
    kind: "pdf",
    pageNumber,
  };
}

export async function loadPdfBook(file: File) {
  const pdfjs = await import("pdfjs-dist");

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  });
  const document = await loadingTask.promise;
  const title = getDocumentTitle(file.name);
  const allPages = Array.from({ length: document.numPages }, (_, index) =>
    createPageAsset(document, index + 1, title),
  );

  const book: BookDefinition<ReaderPageAsset> = {
    ariaLabel: `${title} PDF flip book`,
    cover: allPages[0],
    id: `${file.name}-${file.size}-${file.lastModified}`,
    pageNumbering: {
      offset: 1,
      total: document.numPages,
    },
    pages: allPages.slice(1),
    title,
  };

  return { book, document };
}
