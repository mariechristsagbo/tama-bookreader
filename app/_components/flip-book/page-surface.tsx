import Image from "next/image";
import { PdfPage } from "./pdf-page";
import type { PageAsset } from "./types";

type PageSurfaceProps = {
  asset: PageAsset | null;
  className?: string;
  priority?: boolean;
};

export function PageSurface({
  asset,
  className = "",
  priority = false,
}: PageSurfaceProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[var(--book-page-surface)] ${className}`}
    >
      {asset?.kind === "image" ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          priority={priority}
          sizes="(max-width: 809px) calc(100vw - 32px), 540px"
          className="object-cover"
          unoptimized
        />
      ) : asset?.kind === "pdf" ? (
        <PdfPage asset={asset} />
      ) : null}
    </div>
  );
}
