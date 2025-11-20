// types/Project.ts

// RIMOZIONE DELLA RIGA PROBLEMATICA: import { SanityImageSource } from "next-sanity-image"; 

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
  // Sostituito il tipo problematico con 'any' per sbloccare la risoluzione dei tipi.
  mainImage: any; 
  
  description?: string;
}