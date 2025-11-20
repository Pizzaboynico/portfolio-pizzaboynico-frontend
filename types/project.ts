import { SanityImageSource } from "next-sanity-image";

/**
 * Definisce la struttura dei dati di un singolo progetto 
 * recuperato da Sanity.
 */
export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  // L'immagine principale, usiamo il tipo specifico di next-sanity-image
  mainImage: SanityImageSource; 
  description?: string;
}