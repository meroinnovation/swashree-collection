import Image from "next/image";

type SmartImageProps = {
  src?: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
};

const FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="100%" height="100%" fill="#f5efe6"/><text x="50%" y="50%" font-family="Georgia" font-size="28" fill="#c4a87c" text-anchor="middle">Swashree</text></svg>`
  );

export function SmartImage({
  src,
  alt,
  className,
  fill = true,
  sizes,
  priority,
}: SmartImageProps) {
  if (!src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={FALLBACK} alt={alt} className={`${className} object-cover`} draggable={false} />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes ?? "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"}
      className={className}
      priority={priority}
    />
  );
}