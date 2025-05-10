import { handleCheckoutSessionCompleted } from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
     const payload = await req.text();

     const sig = req.headers.get("stripe-signature");

     let event;

     const endpointsecret = process.env.STRIPE_WEBHOOK_SECRET!;

     try {
          event = stripe.webhooks.constructEvent(payload, sig!, endpointsecret);

          switch (event.type) {
               case "checkout.session.completed":
                    console.log("customer session completed.");
                    const sessionId = event.data.object.id;
                    console.log(sessionId);

                    const session = await stripe.checkout.sessions.retrieve(
                         sessionId,
                         {
                              expand: ["line_items"],
                         }
                    );

                    await handleCheckoutSessionCompleted({session})
                    break;
               case "customer.subscription.deleted":
                    console.log("Customer subscription deleted.");
                    const subscription = event.data.object;
                    console.log(subscription);
                    break;
               default:
                    console.log(`Unhandled event type ${event.type}`);
          }
     } catch (err) {
          return NextResponse.json(
               { error: "Failed to trigger webhook", err },
               { status: 400 }
          );
     }

     return NextResponse.json({
          status: "success",
     });
};
