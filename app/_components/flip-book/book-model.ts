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

function getPageLabel(book: BookDefinition, page: number) {
  return page + (book.pageNumbering?.offset ?? 0);
}

function getTotalPageLabel(book: BookDefinition) {
  return book.pageNumbering?.total ?? book.pages.length;
}

export function getSpread(book: BookDefinition, page: number): Spread {
  if (page === 0) {
    return { label: "Cover", left: null, right: book.cover };
  }

  const firstPage = getSpreadStart(page);

  return {
    label: `Page ${getPageLabel(book, firstPage)} of ${getTotalPageLabel(book)}`,
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
        ? `Page ${getPageLabel(book, currentPage)} of ${getTotalPageLabel(book)}`
        : spread.label,
    previousDisabled: currentPage === 0,
    nextDisabled:
      totalPages === 0 ||
      (isMobile
        ? currentPage >= totalPages
        : currentPage >= getLastSpreadStart(totalPages)),
  };
}
