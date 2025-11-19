"use client";

import Image, { type ImageProps } from "next/image";
import { getImage } from "next-sanity-image";
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

  // Otteniamo dati immagine da Sanity
  const imageData = getImage(client, image);

  if (!imageData) return null;

  const {
    src,
    width,
    height,
    loader,
    blurDataURL,
  } = imageData;

  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      loader={loader}
      blurDataURL={blurDataURL}
      placeholder={blurDataURL ? "blur" : "empty"}
      sizes={sizes}
      className={className}
    />
  );
}