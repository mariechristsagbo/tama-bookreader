import type { BookDefinition, Direction, Spread } from "./types";

export function getPage(book: BookDefinition, page: number) {
  return page > 0 && page <= book.pages.length
    ? book.pages[page - 1]
    : null;
}

function getSpreadStart(page: number) {
  return page % 2 === 0 ? page - 1 : page;
}

function getLastSpreadStart(totalPages: number) {
  if (totalPages === 0) return 0;
  return totalPages % 2 === 0 ? totalPages - 1 : totalPages;
}

export function getSpread(book: BookDefinition, page: number): Spread {
  if (page === 0) {
    return { label: "Cover", left: null, right: book.cover };
  }

  const firstPage = getSpreadStart(page);

  return {
    label: `Page ${firstPage} of ${book.pages.length}`,
    left: getPage(book, firstPage),
    right: getPage(book, firstPage + 1),
  };
}

export function getTargetPage(
  book: BookDefinition,
  currentPage: number,
  direction: Direction,
  isMobile: boolean,
) {
  const totalPages = book.pages.length;

  if (isMobile) {
    return Math.min(totalPages, Math.max(0, currentPage + direction));
  }

  const lastSpreadStart = getLastSpreadStart(totalPages);

  if (direction === 1) {
    if (currentPage === 0) return totalPages === 0 ? 0 : 1;
    return Math.min(lastSpreadStart, getSpreadStart(currentPage) + 2);
  }

  if (currentPage <= 1) return 0;
  return Math.max(1, getSpreadStart(currentPage) - 2);
}

export function getBookStatus(
  book: BookDefinition,
  currentPage: number,
  isMobile: boolean,
) {
  const totalPages = book.pages.length;
  const spread = getSpread(book, currentPage);

  return {
    label:
      isMobile && currentPage > 0
        ? `Page ${currentPage} of ${totalPages}`
        : spread.label,
    previousDisabled: currentPage === 0,
    nextDisabled:
      totalPages === 0 ||
      (isMobile
        ? currentPage >= totalPages
        : currentPage >= getLastSpreadStart(totalPages)),
  };
}
