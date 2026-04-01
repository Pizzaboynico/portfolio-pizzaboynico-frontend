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
    
    // Ora ci aspettiamo un array di { items } dal Carrello Drawer
    const body = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrello vuoto" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://www.pizzaboynico.it";

    // Mappiamo gli item del frontend nel formato richiesto da Stripe per i line_items
    const stripeLineItems = items.map((item: any) => {
      
      // Costruiamo una stringa di descrizione per far vedere varianti e personalizzazioni
      const specs = [];
      if (item.size) specs.push(`Taglia: ${item.size}`);
      if (item.customization?.cuore) specs.push(`Cuore: ${item.customization.cuore}`);
      if (item.customization?.destro) specs.push(`Destra: ${item.customization.destro}`);
      if (item.customization?.retro) specs.push(`Retro: ${item.customization.retro}`);
      
      const description = specs.length > 0 ? specs.join(" | ") : "Standard";

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            description: description,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe lavora in centesimi
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
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
      cancel_url: `${origin}/shop?canceled=true`,
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
