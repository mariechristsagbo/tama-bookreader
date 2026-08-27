import { ATOMIC_HABITS_BOOK } from "./_components/flip-book/book-data";
import { PdfBookReader } from "./_components/pdf-reader/pdf-book-reader";

export default function Home() {
  return <PdfBookReader initialBook={ATOMIC_HABITS_BOOK} />;
}
