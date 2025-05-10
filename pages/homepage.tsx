"use client";
import { Button } from "@/components/ui/button";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import {
     Loader,
     Sparkles,
     Copy,
     Check,
     History,
     Lock,
     Crown,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
     generatePitch,
     fetchLatestPitch,
} from "@/app/actions/generatepitch.actions";
import { useRouter } from "next/navigation";

interface FormData {
     prospectName: string;
     jobTitle: string;
     companyName: string;
     description: string;
     painPoint: string;
     customPrompt: string;
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

const initialFormState: FormData = {
     prospectName: "",
     jobTitle: "",
     companyName: "",
     description: "",
     painPoint: "",
     customPrompt: "",
};

// Constants
const FREE_PITCH_LIMIT = 5;

export default function HomePage() {
     const [formData, setFormData] = useState<FormData>(initialFormState);
     const [loading, setLoading] = useState(false);
     const [currentPitch, setCurrentPitch] = useState("");
     const [latestPitch, setLatestPitch] = useState<Pitch | null>(null);
     const [copied, setCopied] = useState(false);
     const [isPro, setIsPro] = useState(false);
     const [pitchCount, setPitchCount] = useState(0);
     const [showCustomPrompt, setShowCustomPrompt] = useState(false);
     const router = useRouter();

     useEffect(() => {
          // Fetch latest pitch on component mount
          const loadLatestPitch = async () => {
               const result = await fetchLatestPitch();
               if (result.success) {
                    if (result.pitch) {
                         setLatestPitch(result.pitch);
                         setCurrentPitch(result.pitch.generated_pitch);
                    }
                    // Set Pro status
                    setIsPro(!!result.isPro);
                    // Set pitch count
                    setPitchCount(result.pitchCount || 0);
               }
          };
          loadLatestPitch();
     }, []);

     const handleChange = (
          e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
     ) => {
          const { name, value } = e.target;
          setFormData((prev) => ({
               ...prev,
               [name]: value,
          }));
     };

     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          // Check if user has reached limit and is not Pro
          if (!isPro && pitchCount >= FREE_PITCH_LIMIT) {
               toast.error(
                    `You've reached your limit of ${FREE_PITCH_LIMIT} pitches. Upgrade to Pro for unlimited pitches.`,
                    {
                         style: {
                              background: "hsl(var(--background))",
                              color: "hsl(var(--foreground))",
                              border: "1px solid hsl(var(--border))",
                         },
                         duration: 5000,
                    }
               );
               return;
          }

          setLoading(true);

          // Clear the current pitch and set loading state
          setCurrentPitch("");

          try {
               const result = await generatePitch({
                    prospectName: formData.prospectName,
                    jobTitle: formData.jobTitle,
                    company: formData.companyName,
                    description: formData.description,
                    painPoint: formData.painPoint,
                    customPrompt:
                         isPro && showCustomPrompt
                              ? formData.customPrompt
                              : undefined,
               });

               if (result.success && result.pitch) {
                    // Update the current pitch immediately
                    setCurrentPitch(result.pitch);

                    // Update pitch count and pro status if returned
                    if (result.pitchCount !== undefined) {
                         setPitchCount(result.pitchCount);
                    }
                    if (result.isPro !== undefined) {
                         setIsPro(result.isPro);
                    }

                    toast.success("Pitch generated successfully!", {
                         style: {
                              background: "hsl(var(--background))",
                              color: "hsl(var(--foreground))",
                              border: "1px solid hsl(var(--border))",
                         },
                         icon: <Sparkles className="w-4 h-4 text-blue-500" />,
                    });
                    setFormData(initialFormState);

                    // Fetch the latest pitch after generating a new one
                    const latestResult = await fetchLatestPitch();
                    if (latestResult.success && latestResult.pitch) {
                         setLatestPitch(latestResult.pitch);
                    }
               } else {
                    toast.error(result.message || "Failed to generate pitch", {
                         style: {
                              background: "hsl(var(--background))",
                              color: "hsl(var(--foreground))",
                              border: "1px solid hsl(var(--border))",
                         },
                    });
               }
          } catch (error) {
               console.error("Error:", error);
               toast.error("An error occurred while generating the pitch", {
                    style: {
                         background: "hsl(var(--background))",
                         color: "hsl(var(--foreground))",
                         border: "1px solid hsl(var(--border))",
                    },
               });
          } finally {
               setLoading(false);
          }
     };

     const handleCopy = async () => {
          const textToCopy = currentPitch || latestPitch?.generated_pitch || "";

          try {
               await navigator.clipboard.writeText(textToCopy);
               setCopied(true);
               toast.success("Pitch copied to clipboard!", {
                    style: {
                         background: "hsl(var(--background))",
                         color: "hsl(var(--foreground))",
                         border: "1px solid hsl(var(--border))",
                    },
               });
               setTimeout(() => setCopied(false), 2000);
          } catch (err) {
               toast.error("Failed to copy pitch", {
                    style: {
                         background: "hsl(var(--background))",
                         color: "hsl(var(--foreground))",
                         border: "1px solid hsl(var(--border))",
                    },
               });
          }
     };

     return (
          <div className="fixed inset-0 ml-[240px] flex">
               {/* Left Section - Generate Pitch */}
               <div className="w-1/2 h-full p-6 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl font-semibold">
                              Generate Pitch
                         </h2>
                         <div className="flex gap-2 items-center">
                              {isPro && (
                                   <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-2 py-1 rounded-full text-xs">
                                        <Crown className="w-3 h-3" />
                                        <span>PRO</span>
                                   </div>
                              )}
                              {!isPro && (
                                   <div className="flex items-center gap-1 text-xs">
                                        <span className="text-gray-500">
                                             {pitchCount}/{FREE_PITCH_LIMIT}{" "}
                                             Pitches
                                        </span>
                                        <Link href="/upgrade">
                                             <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="flex items-center gap-1 text-xs py-1 border-amber-500 text-amber-500 hover:bg-amber-500/10"
                                             >
                                                  <Crown className="w-3 h-3" />
                                                  Upgrade
                                             </Button>
                                        </Link>
                                   </div>
                              )}
                              <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => router.push("/history")}
                                   className="flex items-center gap-1 text-xs py-1"
                              >
                                   <History className="w-3 h-3" />
                                   History
                              </Button>
                         </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <div className="space-y-4">
                              <input
                                   type="text"
                                   name="prospectName"
                                   placeholder="Enter prospect name"
                                   value={formData.prospectName}
                                   onChange={handleChange}
                                   disabled={loading}
                                   className="w-full px-4 py-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <input
                                   type="text"
                                   name="jobTitle"
                                   value={formData.jobTitle}
                                   onChange={handleChange}
                                   placeholder="Enter job title"
                                   disabled={loading}
                                   className="w-full px-4 py-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <input
                                   type="text"
                                   name="companyName"
                                   value={formData.companyName}
                                   onChange={handleChange}
                                   placeholder="Enter company name"
                                   disabled={loading}
                                   className="w-full px-4 py-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <textarea
                                   name="description"
                                   placeholder="Describe what you provide"
                                   value={formData.description}
                                   onChange={handleChange}
                                   disabled={loading}
                                   className="w-full px-4 py-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all min-h-[100px] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <textarea
                                   name="painPoint"
                                   placeholder="Enter the pain point or problem you're solving"
                                   value={formData.painPoint}
                                   onChange={handleChange}
                                   disabled={loading}
                                   className="w-full px-4 py-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all min-h-[100px] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                              />

                              {/* Custom Prompt section - only for Pro users */}
                              {isPro && (
                                   <div className="mt-2">
                                        <Button
                                             type="button"
                                             variant="outline"
                                             size="sm"
                                             onClick={() =>
                                                  setShowCustomPrompt(
                                                       !showCustomPrompt
                                                  )
                                             }
                                             className="mb-2 text-xs flex items-center gap-1"
                                        >
                                             {showCustomPrompt
                                                  ? "Hide"
                                                  : "Show"}{" "}
                                             Custom Prompt
                                             <Crown className="w-3 h-3 text-amber-500" />
                                        </Button>

                                        {showCustomPrompt && (
                                             <textarea
                                                  name="customPrompt"
                                                  placeholder="Pro Feature: Enter your custom prompt instructions here"
                                                  value={formData.customPrompt}
                                                  onChange={handleChange}
                                                  disabled={loading}
                                                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all min-h-[100px] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                             />
                                        )}
                                   </div>
                              )}
                         </div>

                         {/* Pitch limit warning for free users */}
                         {!isPro && pitchCount >= FREE_PITCH_LIMIT && (
                              <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
                                   You've reached your limit of{" "}
                                   {FREE_PITCH_LIMIT} pitches.
                                   <Link
                                        href="/upgrade"
                                        className="ml-2 font-medium underline"
                                   >
                                        Upgrade to Pro
                                   </Link>{" "}
                                   for unlimited pitches.
                              </div>
                         )}

                         <Button
                              type="submit"
                              className="w-full"
                              disabled={
                                   loading ||
                                   (!isPro && pitchCount >= FREE_PITCH_LIMIT)
                              }
                         >
                              {loading ? (
                                   <Loader className="animate-spin w-6 h-6" />
                              ) : (
                                   "Generate Pitch"
                              )}
                         </Button>
                    </form>
               </div>
               {/* Right Section - Generated Pitch */}
               <div className="w-1/2 h-full p-6">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl font-semibold">
                              Generated Pitch
                         </h2>
                         {(currentPitch || latestPitch) && (
                              <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={handleCopy}
                                   className="flex items-center gap-1 text-xs py-1"
                              >
                                   {copied ? (
                                        <Check className="w-3 h-3" />
                                   ) : (
                                        <Copy className="w-3 h-3" />
                                   )}
                                   {copied ? "Copied!" : "Copy"}
                              </Button>
                         )}
                    </div>
                    <div className="h-full rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 whitespace-pre-wrap overflow-y-auto">
                         {loading ? (
                              <div className="flex items-center justify-center h-full">
                                   <Loader className="animate-spin w-8 h-8" />
                              </div>
                         ) : currentPitch ? (
                              currentPitch
                         ) : latestPitch ? (
                              latestPitch.generated_pitch
                         ) : (
                              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                   <div className="mb-4">
                                        <Sparkles className="w-8 h-8" />
                                   </div>
                                   <p>No pitch generated yet.</p>
                                   <p>
                                        Fill out the form and click 'Generate
                                        Pitch' to create one.
                                   </p>
                                   {!isPro && (
                                        <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-lg max-w-md">
                                             <p className="font-medium flex items-center gap-1 justify-center mb-2">
                                                  <Crown className="w-4 h-4" />
                                                  Pro Features:
                                             </p>
                                             <ul className="text-sm text-left list-disc pl-4 space-y-1">
                                                  <li>Unlimited pitches</li>
                                                  <li>Custom prompts</li>
                                                  <li>Priority support</li>
                                             </ul>
                                             <Link href="/upgrade">
                                                  <Button
                                                       variant="outline"
                                                       size="sm"
                                                       className="mt-3 w-full border-amber-500 text-amber-500 hover:bg-amber-500/10"
                                                  >
                                                       Upgrade to Pro
                                                  </Button>
                                             </Link>
                                        </div>
                                   )}
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}
