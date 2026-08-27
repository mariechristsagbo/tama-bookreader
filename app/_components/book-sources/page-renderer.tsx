import { PdfPage } from "../pdf-reader/pdf-page";
import { PageImage } from "./page-image";
import type { ReaderPageAsset } from "./types";

type ReaderPageProps = {
  asset: ReaderPageAsset;
  priority: boolean;
};

export function ReaderPage({ asset, priority }: ReaderPageProps) {
  if (asset.kind === "pdf") return <PdfPage asset={asset} />;

  return <PageImage src={asset.src} alt={asset.alt} priority={priority} />;
}
