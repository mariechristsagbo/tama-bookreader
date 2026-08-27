import type {
  PageDescriptor,
  PageRenderer,
} from "./types";

type PageSurfaceProps<Page extends PageDescriptor> = {
  asset: Page | null;
  className?: string;
  priority?: boolean;
  renderPage: PageRenderer<Page>;
};

export function PageSurface<Page extends PageDescriptor>({
  asset,
  className = "",
  priority = false,
  renderPage: PageContent,
}: PageSurfaceProps<Page>) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[var(--book-page-surface)] ${className}`}
    >
      {asset ? (
        <PageContent key={asset.id} asset={asset} priority={priority} />
      ) : null}
    </div>
  );
}
