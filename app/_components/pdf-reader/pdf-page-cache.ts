import type { PDFDocumentProxy } from "pdfjs-dist";
import type { PdfPageAsset } from "../book-sources/types";

const PDF_PAGE_WIDTH = 1400;
const pageCaches = new WeakMap<PDFDocumentProxy, Map<number, Promise<string>>>();

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("The PDF page could not be converted to an image."));
      },
      "image/webp",
      0.9,
    );
  });
}

async function renderPdfPage(asset: PdfPageAsset) {
  const page = await asset.document.getPage(asset.pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({
    scale: PDF_PAGE_WIDTH / baseViewport.width,
  });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: false });

  if (!context) {
    throw new Error("Canvas rendering is unavailable in this browser.");
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await page.render({
    canvas,
    canvasContext: context,
    viewport,
  }).promise;

  const blob = await canvasToBlob(canvas);
  page.cleanup();

  return URL.createObjectURL(blob);
}

export function getPdfPageUrl(asset: PdfPageAsset) {
  let documentCache = pageCaches.get(asset.document);

  if (!documentCache) {
    documentCache = new Map();
    pageCaches.set(asset.document, documentCache);
  }

  const cachedPage = documentCache.get(asset.pageNumber);
  if (cachedPage) return cachedPage;

  const pagePromise = renderPdfPage(asset).catch((error) => {
    documentCache.delete(asset.pageNumber);
    throw error;
  });

  documentCache.set(asset.pageNumber, pagePromise);
  return pagePromise;
}

export function releasePdfDocument(document: PDFDocumentProxy) {
  const documentCache = pageCaches.get(document);

  if (documentCache) {
    void Promise.allSettled(documentCache.values()).then((results) => {
      for (const result of results) {
        if (result.status === "fulfilled") URL.revokeObjectURL(result.value);
      }
    });
    pageCaches.delete(document);
  }

  void document.loadingTask.destroy();
}
