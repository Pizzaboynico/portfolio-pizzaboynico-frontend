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

  // Ottieni props immagine da Sanity
  const imageProps = useNextSanityImage(client, image);

  if (!imageProps) return null;

  return (
    <Image
      {...imageProps}
      alt={alt}
      className={className}
      sizes={sizes}
      placeholder={imageProps.blurDataURL ? "blur" : "empty"}
    />
  );
}