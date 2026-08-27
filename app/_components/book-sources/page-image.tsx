import Image from "next/image";

const PAGE_IMAGE_SIZES =
  "(max-width: 809px) calc(100vw - 32px), 540px";

type PageImageProps = {
  alt: string;
  fit?: "contain" | "cover";
  priority?: boolean;
  src: string;
};

export function PageImage({
  alt,
  fit = "cover",
  priority = false,
  src,
}: PageImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={PAGE_IMAGE_SIZES}
      className={fit === "contain" ? "object-contain" : "object-cover"}
      unoptimized
    />
  );
}
