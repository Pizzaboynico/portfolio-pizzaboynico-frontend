"use client";

import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import { client } from "@/lib/sanity.client";

interface SanityImageProps {
  image: any;
  alt: string;
  className?: string;
  sizes?: string;
}

export default function SanityImage({
  image,
  alt,
  className,
  sizes = "100vw",
}: SanityImageProps) {
  if (!image) return null;

  const imageProps = useNextSanityImage(client, image);

  // se fallisce mettiamo un fallback (così non crasha MAI)
  if (!imageProps || !imageProps.src) {
    return (
      <Image
        src="/fallback.png"
        width={800}
        height={600}
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <Image
      src={imageProps.src}
      width={imageProps.width}
      height={imageProps.height}
      alt={alt}
      className={className}
      sizes={sizes}
      blurDataURL={imageProps.blurDataURL}
      placeholder={imageProps.blurDataURL ? "blur" : "empty"}
    />
  );
}