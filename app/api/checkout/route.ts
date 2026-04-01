import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inizializzeremo Stripe dentro la funzione POST
// per evitare che mandi in errore la build se la variabile non è settata 


export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error("Stripe secret key non configurata");
    }
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16" as any,
    });
    const body = await req.json();
    const { productId, title, price, imageUrl, slug } = body;

    // Calcolo in centesimi richiesto da Stripe per EUR
    const unitAmount = Math.round(price * 100);

    // Header per localizzare l'origine della richiesta e far ritornare l'utente al sito
    const origin = req.headers.get("origin") || "https://www.pizzaboynico.it";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: title,
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Richiediamo l'indirizzo di spedizione (visto che sono prodotti fisici)
      shipping_address_collection: {
        allowed_countries: ["IT", "FR", "DE", "ES", "CH", "GB", "US"], // Aggiungi altri codici ISO se serve
      },
      // Ottimo richiedere il numero di telefono per i corrieri
      phone_number_collection: {
        enabled: true,
      },
      // Torna al form con successo
      success_url: `${origin}/shop?success=true`,
      // Torna alla pagina del prodotto se cancella
      cancel_url: `${origin}/shop/${slug}?canceled=true`,
      metadata: {
        productId,
        slug,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
