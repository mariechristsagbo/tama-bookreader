"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getPdfPageUrl } from "./pdf-page-cache";
import type { PdfPageAsset } from "./types";

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
    <Image
      src={src}
      alt={asset.alt}
      fill
      sizes="(max-width: 809px) calc(100vw - 32px), 540px"
      className="object-contain"
      unoptimized
    />
  ) : (
    <div
      role="status"
      aria-label={`Rendering ${asset.alt}`}
      className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,#f2f0e9_25%,#ffffff_45%,#f2f0e9_65%)] bg-[length:250%_100%]"
    />
  );
}
