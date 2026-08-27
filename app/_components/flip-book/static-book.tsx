import { getPage, getSpread } from "./book-model";
import { PageSurface } from "./page-surface";
import type {
  BookDefinition,
  PageDescriptor,
  PageRenderer,
} from "./types";

type StaticBookProps<Page extends PageDescriptor> = {
  book: BookDefinition<Page>;
  currentPage: number;
  isMobile: boolean;
  renderPage: PageRenderer<Page>;
};

export function StaticBook<Page extends PageDescriptor>({
  book,
  currentPage,
  isMobile,
  renderPage,
}: StaticBookProps<Page>) {
  if (isMobile) {
    const asset = currentPage === 0 ? book.cover : getPage(book, currentPage);

    return (
      <div className="absolute inset-0 rounded-[var(--book-page-radius)] shadow-[var(--book-page-shadow)]">
        <PageSurface
          asset={asset}
          className="rounded-[var(--book-page-radius)]"
          priority
          renderPage={renderPage}
        />
      </div>
    );
  }

  const spread = getSpread(book, currentPage);

  return (
    <>
      {spread.left ? (
        <div className="absolute inset-y-0 left-0 w-1/2 shadow-[var(--book-page-shadow)]">
          <PageSurface
            asset={spread.left}
            className="rounded-l-[var(--book-page-radius)]"
            priority
            renderPage={renderPage}
          />
        </div>
      ) : null}
      {spread.right ? (
        <div className="absolute inset-y-0 left-1/2 w-1/2 shadow-[var(--book-page-shadow)]">
          <PageSurface
            asset={spread.right}
            className="rounded-r-[var(--book-page-radius)]"
            priority
            renderPage={renderPage}
          />
        </div>
      ) : null}
      {currentPage > 0 ? (
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-black/10 shadow-[0_0_12px_rgba(0,0,0,0.3)]" />
      ) : null}
    </>
  );
}
