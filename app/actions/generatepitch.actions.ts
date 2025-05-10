"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import sql from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { checkProStatus, countUserPitches } from "./user.actions";

// Constants
const FREE_PITCH_LIMIT = 5; // Maximum number of pitches for free users

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
): Promise<{ success: boolean; message?: string; pitch?: string; isPro?: boolean; pitchCount?: number }> {
     try {
          // Get user ID from Clerk
          const session = await auth();
          if (!session?.userId) {
               return {
                    success: false,
                    message: "Authentication required",
               };
          }

          // Check if user is Pro
          const proStatus = await checkProStatus();
          const isPro = proStatus.success && proStatus.isPro;
          
          // Check pitch count for non-Pro users
          if (!isPro) {
               const pitchCount = await countUserPitches();
               if (pitchCount.success && pitchCount.count >= FREE_PITCH_LIMIT) {
                    return {
                         success: false,
                         message: `Free users can only generate ${FREE_PITCH_LIMIT} pitches. Please upgrade to Pro for unlimited pitches.`,
                         isPro: false,
                         pitchCount: pitchCount.count
                    };
               }
          }

          // Validate input
          const validatedData = formSchema.parse(formData);

          // Initialize Gemini
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

          // Use custom prompt if provided and user is Pro
          let prompt;
          if (isPro && validatedData.customPrompt) {
               prompt = validatedData.customPrompt;
          } else {
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

          // Generate content
          const result = await model.generateContent(prompt);
          const fullPitch = result.response.text();

          const subjectLine = `Subject: Quick question about ${validatedData.company}\n\n`;
          const completePitch = subjectLine + fullPitch;

          // Store in database
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
                    ${isPro},
                    ${proStatus.success ? proStatus.stripe_id : null}
               )
          `;

          // Update pitch count for non-Pro users
          const updatedPitchCount = isPro ? null : (await countUserPitches()).count;

          // Return success
          return {
               success: true,
               pitch: completePitch,
               isPro,
               pitchCount: updatedPitchCount || 0
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

interface Pitch {
     id: number;
     prospect_name: string;
     prospect_title: string;
     prospect_company: string;
     pain_point: string;
     your_offer: string;
     generated_pitch: string;
     created_at: string;
     is_pro: boolean;
     stripe_id?: string;
}

// 3. Fetch Pitches
export async function fetchPitches(): Promise<{
     success: boolean;
     message?: string;
     pitches?: Pitch[];
     isPro?: boolean;
}> {
     try {
          const session = await auth();
          if (!session?.userId) {
               return {
                    success: false,
                    message: "Authentication required",
               };
          }

          // Check if user is Pro
          const proStatus = await checkProStatus();

          const result = await sql`
               SELECT 
                    id,
                    prospect_name,
                    prospect_title,
                    prospect_company,
                    pain_point,
                    your_offer,
                    generated_pitch,
                    created_at,
                    is_pro,
                    stripe_id
               FROM pitches 
               WHERE user_id = ${session.userId}
               ORDER BY created_at DESC
          `;

          const pitches = result as unknown as Pitch[];

          return {
               success: true,
               pitches,
               isPro: proStatus.success && proStatus.isPro
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
     isPro?: boolean;
     pitchCount?: number;
}> {
     try {
          const session = await auth();
          if (!session?.userId) {
               return {
                    success: false,
                    message: "Authentication required",
               };
          }

          // Check if user is Pro
          const proStatus = await checkProStatus();
          
          // Get pitch count
          const pitchCount = await countUserPitches();

          const result = await sql`
               SELECT 
                    id,
                    prospect_name,
                    prospect_title,
                    prospect_company,
                    pain_point,
                    your_offer,
                    generated_pitch,
                    created_at,
                    is_pro,
                    stripe_id
               FROM pitches 
               WHERE user_id = ${session.userId}
               ORDER BY created_at DESC
               LIMIT 1
          `;

          if (result.length === 0) {
               return {
                    success: true,
                    pitch: undefined,
                    isPro: proStatus.success && proStatus.isPro,
                    pitchCount: pitchCount.success ? pitchCount.count : 0
               };
          }

          const pitch = result[0] as unknown as Pitch;

          return {
               success: true,
               pitch,
               isPro: proStatus.success && proStatus.isPro,
               pitchCount: pitchCount.success ? pitchCount.count : 0
          };
     } catch (error) {
          console.error("Error fetching latest pitch:", error);
          return {
               success: false,
               message: "Failed to fetch latest pitch",
          };
     }
}