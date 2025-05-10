"use server";

import sql from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Function to check if a user is a Pro member
export async function checkProStatus(): Promise<{
     isPro: boolean;
     success: boolean;
     message?: string;
     stripe_id?: string;
}> {
     try {
          const session = await auth();
          if (!session?.userId) {
               return {
                    isPro: false,
                    success: false,
                    message: "Authentication required",
               };
          }

          // Query the database to check if the user is a Pro member
          const result = await sql`
      SELECT is_pro, stripe_id
      FROM pitches
      WHERE user_id = ${session.userId}
      ORDER BY created_at DESC
      LIMIT 1
    `;

          // If user has no record yet, they're not a Pro
          if (result.length === 0) {
               return {
                    isPro: false,
                    success: true,
               };
          }

          const userStatus = result[0];

          return {
               isPro: !!userStatus.is_pro, // Convert to boolean
               success: true,
               stripe_id: userStatus.stripe_id,
          };
     } catch (error) {
          console.error("Error checking Pro status:", error);
          return {
               isPro: false,
               success: false,
               message: "Failed to check Pro status",
          };
     }
}

// Function to count the number of pitches a user has generated
export async function countUserPitches(): Promise<{
     count: number;
     success: boolean;
     message?: string;
}> {
     try {
          const session = await auth();
          if (!session?.userId) {
               return {
                    count: 0,
                    success: false,
                    message: "Authentication required",
               };
          }

          // Count pitches for this user
          const result = await sql`
      SELECT COUNT(*) as pitch_count
      FROM pitches
      WHERE user_id = ${session.userId}
    `;

          return {
               count: parseInt(result[0].pitch_count) || 0,
               success: true,
          };
     } catch (error) {
          console.error("Error counting pitches:", error);
          return {
               count: 0,
               success: false,
               message: "Failed to count pitches",
          };
     }
}

// Function to update a user's Pro status
export async function updateProStatus(
     isPro: boolean,
     stripeId?: string
): Promise<{
     success: boolean;
     message?: string;
}> {
     try {
          const session = await auth();
          if (!session?.userId) {
               return {
                    success: false,
                    message: "Authentication required",
               };
          }

          // Update the Pro status for all of this user's records
          await sql`
      UPDATE pitches
      SET is_pro = ${isPro}, stripe_id = ${stripeId || null}
      WHERE user_id = ${session.userId}
    `;

          return {
               success: true,
          };
     } catch (error) {
          console.error("Error updating Pro status:", error);
          return {
               success: false,
               message: "Failed to update Pro status",
          };
     }
}
