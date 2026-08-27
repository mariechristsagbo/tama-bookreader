import type { PDFDocumentProxy } from "pdfjs-dist";
import type { PdfPageAsset } from "../book-sources/types";

const PDF_PAGE_WIDTH = 1400;
const MAX_CACHED_PAGES = 12;

type CacheEntry = {
  promise: Promise<string>;
};

type DocumentCache = Map<number, CacheEntry>;

const pageCaches = new WeakMap<PDFDocumentProxy, DocumentCache>();

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

  try {
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
    return URL.createObjectURL(blob);
  } finally {
    page.cleanup();
  }
}

function revokeWhenReady(entry: CacheEntry) {
  void entry.promise
    .then((url) => URL.revokeObjectURL(url))
    .catch(() => undefined);
}

function trimCache(cache: DocumentCache) {
  while (cache.size > MAX_CACHED_PAGES) {
    const oldestPage = cache.keys().next().value;
    if (oldestPage === undefined) return;

    const entry = cache.get(oldestPage);
    cache.delete(oldestPage);

    if (entry) revokeWhenReady(entry);
  }
}

export function getPdfPageUrl(asset: PdfPageAsset) {
  let documentCache = pageCaches.get(asset.document);

  if (!documentCache) {
    documentCache = new Map();
    pageCaches.set(asset.document, documentCache);
  }

  const cachedPage = documentCache.get(asset.pageNumber);
  if (cachedPage) {
    documentCache.delete(asset.pageNumber);
    documentCache.set(asset.pageNumber, cachedPage);
    return cachedPage.promise;
  }

  const entry: CacheEntry = {
    promise: renderPdfPage(asset),
  };

  documentCache.set(asset.pageNumber, entry);
  trimCache(documentCache);

  void entry.promise.catch(() => {
    if (documentCache.get(asset.pageNumber) === entry) {
      documentCache.delete(asset.pageNumber);
    }
  });

  return entry.promise;
}

export function releasePdfDocument(document: PDFDocumentProxy) {
  const documentCache = pageCaches.get(document);

  if (documentCache) {
    const entries = Array.from(documentCache.values());
    pageCaches.delete(document);

    void Promise.allSettled(entries.map((entry) => entry.promise))
      .then((results) => {
        for (const result of results) {
          if (result.status === "fulfilled") URL.revokeObjectURL(result.value);
        }
      })
      .then(() => document.loadingTask.destroy())
      .catch(() => undefined);
    return;
  }

  void document.loadingTask.destroy().catch(() => undefined);
}
