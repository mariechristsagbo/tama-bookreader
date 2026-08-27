"use client";

import { useEffect, useState } from "react";
import { PageImage } from "../book-sources/page-image";
import type { PdfPageAsset } from "../book-sources/types";
import { getPdfPageUrl } from "./pdf-page-cache";

type PdfPageProps = {
  asset: PdfPageAsset;
};

export function PdfPage({ asset }: PdfPageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    getPdfPageUrl(asset)
      .then((pageUrl) => {
        if (isActive) setSrc(pageUrl);
      })
      .catch(() => {
        if (isActive) setHasError(true);
      });

    return () => {
      isActive = false;
    };
  }, [asset]);

  if (hasError) {
    return (
      <div className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-black/55">
        This page could not be rendered.
      </div>
    );
  }

  return src ? (
    <PageImage src={src} alt={asset.alt} fit="contain" />
  ) : (
    <div
      role="status"
      aria-label={`Rendering ${asset.alt}`}
      className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,#f2f0e9_25%,#ffffff_45%,#f2f0e9_65%)] bg-[length:250%_100%]"
    />
  );
}
