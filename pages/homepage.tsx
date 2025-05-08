"use client";
import { Button } from "@/components/ui/button";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Loader, Sparkles, Copy, Check, History, Lock } from "lucide-react";
import { toast } from "sonner";
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
}

const initialFormState: FormData = {
     prospectName: "",
     jobTitle: "",
     companyName: "",
     description: "",
     painPoint: "",
     customPrompt: "",
};

export default function HomePage() {
     const [formData, setFormData] = useState<FormData>(initialFormState);
     const [loading, setLoading] = useState(false);
     const [generatedPitch, setGeneratedPitch] = useState("");
     const [subjectLine, setSubjectLine] = useState("");
     const [latestPitch, setLatestPitch] = useState<Pitch | null>(null);
     const [copied, setCopied] = useState(false);
     const [isPro, setIsPro] = useState(false);
     const [showCustomPrompt, setShowCustomPrompt] = useState(false);
     const router = useRouter();

     useEffect(() => {
          const handlePitchChunk = (event: CustomEvent) => {
               setGeneratedPitch((prev) => prev + event.detail);
          };

          window.addEventListener(
               "pitch-chunk",
               handlePitchChunk as EventListener
          );

          // Fetch latest pitch on component mount
          const loadLatestPitch = async () => {
               const result = await fetchLatestPitch();
               if (result.success && result.pitch) {
                    setLatestPitch(result.pitch);
               }
          };
          loadLatestPitch();

          // For demo purposes - set isPro based on localStorage or other auth method
          // In production, this would come from your auth/subscription service
          const checkProStatus = () => {
               // Replace with actual pro status check logic
               // Example: Check user subscription status from API or localStorage
               const userIsPro = localStorage.getItem("userIsPro") === "true";
               setIsPro(userIsPro);
          };
          checkProStatus();

          return () => {
               window.removeEventListener(
                    "pitch-chunk",
                    handlePitchChunk as EventListener
               );
          };
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

     const toggleCustomPrompt = () => {
          if (isPro) {
               setShowCustomPrompt(!showCustomPrompt);
          } else {
               toast.error("Custom prompts are only available for Pro users", {
                    style: {
                         background: "hsl(var(--background))",
                         color: "hsl(var(--foreground))",
                         border: "1px solid hsl(var(--border))",
                    },
               });
          }
     };

     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setLoading(true);
          setGeneratedPitch("");
          setSubjectLine(
               `Subject: Quick question about ${formData.companyName}\n\n`
          );

          try {
               const result = await generatePitch({
                    prospectName: formData.prospectName,
                    jobTitle: formData.jobTitle,
                    company: formData.companyName,
                    description: formData.description,
                    painPoint: formData.painPoint,
                    customPrompt: isPro ? formData.customPrompt : "",
               });

               if (result.success) {
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
          const textToCopy = loading
               ? subjectLine + generatedPitch
               : latestPitch?.generated_pitch || "";

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

     // For demo purposes only - toggle pro status
     const toggleProStatus = () => {
          const newStatus = !isPro;
          localStorage.setItem("userIsPro", newStatus.toString());
          setIsPro(newStatus);
          if (!newStatus) {
               setShowCustomPrompt(false);
          }
          toast.success(`Pro status ${newStatus ? "enabled" : "disabled"}`, {
               style: {
                    background: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                    border: "1px solid hsl(var(--border))",
               },
          });
     };

     return (
          <div className="fixed inset-0 ml-[240px] flex">
               {/* Left Section - Generate Pitch */}
               <div className="w-1/2 h-full p-6 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl font-semibold">
                              Generate Pitch
                         </h2>
                         <div className="flex gap-2">
                              {/* Demo toggle for pro status - remove in production */}
                              <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={toggleProStatus}
                                   className="flex items-center gap-1 text-xs py-1"
                              >
                                   {isPro ? "Disable Pro" : "Enable Pro"}
                              </Button>
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
                              
                              {/* Custom Prompt Toggle Button */}
                              <div className="flex items-center justify-between">
                                   <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={toggleCustomPrompt}
                                        className="flex items-center gap-1 text-xs py-1"
                                   >
                                        {!isPro && <Lock className="w-3 h-3" />}
                                        {showCustomPrompt ? "Hide Custom Prompt" : "Use Custom Prompt"}
                                        {!isPro && <span className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded-full">Pro</span>}
                                   </Button>
                              </div>
                              
                              {/* Custom Prompt Field */}
                              {showCustomPrompt && (
                                   <div className="rounded-lg border border-blue-200 dark:border-blue-900 p-4 bg-blue-50 dark:bg-blue-950/30">
                                        <label className="block text-sm font-medium mb-2 text-blue-700 dark:text-blue-400">
                                             Custom Prompt Template
                                        </label>
                                        <textarea
                                             name="customPrompt"
                                             value={formData.customPrompt}
                                             onChange={handleChange}
                                             disabled={loading || !isPro}
                                             placeholder="Enter your custom prompt template. Use variables like {{prospect_name}}, {{job_title}}, {{company}}, {{pain_point}}, and {{description}}."
                                             className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-200 dark:border-blue-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all min-h-[100px] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                             Use variables: {`{{prospect_name}}, {{job_title}}, {{company}}, {{pain_point}}, {{description}}`}
                                        </p>
                                   </div>
                              )}
                         </div>
                         <Button
                              type="submit"
                              className="w-full"
                              disabled={loading}
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
                         {(loading || latestPitch) && (
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
                              <>
                                   {subjectLine}
                                   {generatedPitch}
                              </>
                         ) : latestPitch ? (
                              latestPitch.generated_pitch
                         ) : (
                              "No pitch generated yet. Fill out the form and click 'Generate Pitch' to create one."
                         )}
                    </div>
               </div>
          </div>
     );
}