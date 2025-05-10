import Stripe from "stripe";

export async function handleCheckoutSessionCompleted({
     session,
}: {
     session: Stripe.Checkout.Session;
}) {
     console.log("Checkout session completed.", session);
}


async function createOrUpdateUser(){
    try {
        
    } catch (error) {
        console.log('Error creating or updating user.' , error)
    }
}