"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import sql from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// 1. Define Zod schema with refined validation
const formSchema = z.object({
     prospectName: z.string().min(1, "Prospect name is required.").max(100),
     jobTitle: z.string().min(1, "Job title is required.").max(100),
     company: z.string().min(1, "Company name is required.").max(100),
     painPoint: z.string().min(1, "Pain point is required.").max(500),
     description: z
          .string()
          .min(1, "Description of what you provide is required.")
          .max(500),
     customPrompt: z.string().optional(),
     stripe_id: z.string().optional(),
});

export type PitchFormData = z.infer<typeof formSchema>;

// 2. AI Pitch Generator
export async function generatePitch(
     formData: PitchFormData
): Promise<{ success: boolean; message?: string; pitch?: string }> {
     try {
          // Get user ID from Clerk
          const session = await auth();
          if (!session?.userId) {
               return {
                    success: false,
                    message: "Authentication required",
               };
          }

          // Validate input
          const validatedData = formSchema.parse(formData);

          // Check if user is Pro (in a real app, you would query this from your subscription system)
          const isPro = await checkIfUserIsPro(session.userId);

          // Initialize Gemini
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

          // Use custom prompt if provided and user is Pro, otherwise use default prompt
          let prompt;

          if (
               isPro &&
               validatedData.customPrompt &&
               validatedData.customPrompt.trim().length > 0
          ) {
               // Replace template variables in custom prompt
               prompt = validatedData.customPrompt
                    .replace(/{{prospect_name}}/g, validatedData.prospectName)
                    .replace(/{{job_title}}/g, validatedData.jobTitle)
                    .replace(/{{company}}/g, validatedData.company)
                    .replace(/{{pain_point}}/g, validatedData.painPoint)
                    .replace(/{{description}}/g, validatedData.description);
          } else {
               // Default prompt
               prompt = `
      Write a 120-250 word professional cold email with:
      - Recipient: ${validatedData.prospectName}, ${validatedData.jobTitle} at ${validatedData.company}
      - What you provide: ${validatedData.description}
      - Pain Point/Problem: ${validatedData.painPoint}
      - Tone: Direct but polite
      - Structure:
        1. Personalized opener (reference their role/company)
        2. Clear value proposition based on what you provide and how it solves their pain point
        3. Specific call-to-action question
      Avoid:
      - Generic phrases ("I hope you're doing well")
      - Overly salesy language
      - Long paragraphs
    `;
          }

          // Generate content with streaming
          const result = await model.generateContentStream(prompt);
          let fullPitch = "";

          // Stream the response
          for await (const chunk of result.stream) {
               const chunkText = chunk.text();
               fullPitch += chunkText;
               // Emit the chunk through SSE
               if (typeof window !== "undefined") {
                    const event = new CustomEvent("pitch-chunk", {
                         detail: chunkText,
                    });
                    window.dispatchEvent(event);
               }
          }

          const subjectLine = `Subject: Quick question about ${validatedData.company}\n\n`;
          const completePitch = subjectLine + fullPitch;

          // Store in database with custom prompt if applicable
          await sql`
               INSERT INTO pitches (
                    user_id,
                    prospect_name,
                    prospect_title,
                    prospect_company,
                    pain_point,
                    your_offer,
                    generated_pitch,
                    is_pro,
                    stripe_id
               ) VALUES (
                    ${session.userId},
                    ${validatedData.prospectName},
                    ${validatedData.jobTitle},
                    ${validatedData.company},
                    ${validatedData.painPoint},
                    ${validatedData.description},
                    ${completePitch},
                    ${isPro ? true : false},
                    ${isPro ? validatedData.stripe_id || null : null}
               )
          `;

          // Return success
          return {
               success: true,
               pitch: completePitch,
          };
     } catch (error) {
          // Handle specific errors
          if (error instanceof z.ZodError) {
               return {
                    success: false,
                    message: error.errors.map((e) => e.message).join(", "),
               };
          }

          if (error instanceof Error) {
               console.error("Error:", error.message);
               return {
                    success: false,
                    message: "An error occurred. Please try later.",
               };
          }

          return {
               success: false,
               message: "An unknown error occurred",
          };
     }
}

// Check if a user has Pro status
async function checkIfUserIsPro(userId: string): Promise<boolean> {
     try {
          // In a real application, you would query your subscription service/database
          // This is a placeholder implementation
          const result = await sql`
               SELECT is_pro FROM users WHERE id = ${userId} LIMIT 1
          `;

          // If user record exists and has pro status
          if (result && result.length > 0) {
               return result[0].is_pro === true;
          }

          return false; // Default to free tier if no record found
     } catch (error) {
          console.error("Error checking pro status:", error);
          return false; // Default to free tier on error
     }
}

interface Pitch {
     id: number;
     prospect_name: string;
     prospect_title: string;
     prospect_company: string;
     pain_point: string;
     your_offer: string;
     generated_pitch: string;
     custom_prompt?: string;
     created_at: string;
}

// 3. Fetch Pitches
export async function fetchPitches(): Promise<{
     success: boolean;
     message?: string;
     pitches?: Pitch[];
}> {
     try {
          const session = await auth();
          if (!session?.userId) {
               return {
                    success: false,
                    message: "Authentication required",
               };
          }

          const result = await sql`
               SELECT 
                    id,
                    prospect_name,
                    prospect_title,
                    prospect_company,
                    pain_point,
                    your_offer,
                    generated_pitch,
                    custom_prompt,
                    created_at
               FROM pitches 
               WHERE user_id = ${session.userId}
               ORDER BY created_at DESC
          `;

          const pitches = result as unknown as Pitch[];

          return {
               success: true,
               pitches,
          };
     } catch (error) {
          console.error("Error fetching pitches:", error);
          return {
               success: false,
               message: "Failed to fetch pitches",
          };
     }
}

// 4. Fetch Latest Pitch
export async function fetchLatestPitch(): Promise<{
     success: boolean;
     message?: string;
     pitch?: Pitch;
}> {
     try {
          const session = await auth();
          if (!session?.userId) {
               return {
                    success: false,
                    message: "Authentication required",
               };
          }

          const result = await sql`
               SELECT 
                    id,
                    prospect_name,
                    prospect_title,
                    prospect_company,
                    pain_point,
                    your_offer,
                    generated_pitch,
                    custom_prompt,
                    created_at
               FROM pitches 
               WHERE user_id = ${session.userId}
               ORDER BY created_at DESC
               LIMIT 1
          `;

          if (result.length === 0) {
               return {
                    success: true,
                    pitch: undefined,
               };
          }

          const pitch = result[0] as unknown as Pitch;

          return {
               success: true,
               pitch,
          };
     } catch (error) {
          console.error("Error fetching latest pitch:", error);
          return {
               success: false,
               message: "Failed to fetch latest pitch",
          };
     }
}
