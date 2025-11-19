"use client";

import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import { client } from "../lib/sanity.client";

interface Props {
  image: any;
  alt: string;
  className?: string;
  sizes?: string;
}

export default function SanityImage({ image, alt, className, sizes }: Props) {
  const imageProps = useNextSanityImage(client, image);

  if (!imageProps) return null;

  return (
    <Image
      {...imageProps}
      alt={alt}
      className={className}
      sizes={sizes || "100vw"}
      placeholder="blur"
      blurDataURL={imageProps.src + "&blur=20"}
    />
  );
}