"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { ReaderPage } from "../book-sources/page-renderer";
import type { ReaderPageAsset } from "../book-sources/types";
import { FlipBook } from "../flip-book/flip-book";
import type { BookDefinition } from "../flip-book/types";
import { loadPdfBook, MAX_PDF_SIZE } from "./pdf-loader";
import { releasePdfDocument } from "./pdf-page-cache";

type PdfBookReaderProps = {
  initialBook: BookDefinition<ReaderPageAsset>;
};

function validatePdf(file: File) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Choose a valid PDF file.";
  }

  if (file.size > MAX_PDF_SIZE) {
    return "The PDF must be smaller than 50 MB.";
  }

  return null;
}

export function PdfBookReader({ initialBook }: PdfBookReaderProps) {
  const activeDocument = useRef<PDFDocumentProxy | null>(null);
  const latestRequest = useRef(0);
  const [book, setBook] = useState(initialBook);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      latestRequest.current += 1;
      if (activeDocument.current) releasePdfDocument(activeDocument.current);
    };
  }, []);

  const openPdf = async (file: File) => {
    const validationError = validatePdf(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);
    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;

    try {
      const result = await loadPdfBook(file);

      if (requestId !== latestRequest.current) {
        releasePdfDocument(result.document);
        return;
      }

      const previousDocument = activeDocument.current;

      activeDocument.current = result.document;
      setBook(result.book);

      if (previousDocument) releasePdfDocument(previousDocument);
    } catch {
      if (requestId === latestRequest.current) {
        setError("This PDF could not be opened. It may be damaged or password protected.");
      }
    } finally {
      if (requestId === latestRequest.current) setIsLoading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file) void openPdf(file);
  };

  const pageCount = book.pageNumbering?.total ?? book.pages.length + 1;

  return (
    <main className="min-h-dvh w-full overflow-clip bg-[var(--book-background)] px-4 py-5 min-[810px]:px-12 min-[810px]:py-12">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-[10px]">
        <header className="flex min-h-[58px] items-center justify-between gap-4 rounded-[var(--book-page-radius)] bg-[var(--book-controls-background)] px-4 py-3 text-white">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{book.title}</p>
            <p className="mt-0.5 text-xs text-white/55">
              {pageCount} {pageCount === 1 ? "page" : "pages"} · 2D/3D reader
            </p>
          </div>

          <label className="shrink-0 cursor-pointer rounded-[10px] bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-white/85 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white">
            {isLoading ? "Opening…" : "Open PDF"}
            <input
              type="file"
              accept="application/pdf,.pdf"
              disabled={isLoading}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </header>

        {error ? (
          <p role="alert" className="rounded-[10px] bg-red-950 px-4 py-3 text-sm text-white">
            {error}
          </p>
        ) : null}

        <FlipBook key={book.id} book={book} renderPage={ReaderPage} />
      </div>
    </main>
  );
}
