import { ATOMIC_HABITS_BOOK } from "./_components/flip-book/book-data";
import { FlipBook } from "./_components/flip-book/flip-book";

export default function Home() {
  return <FlipBook book={ATOMIC_HABITS_BOOK} />;
}
