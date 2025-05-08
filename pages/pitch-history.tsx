"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader, ArrowLeft, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { fetchPitches } from "@/app/actions/generatepitch.actions";
import { useRouter } from "next/navigation";

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

export default function PitchHistory() {
     const [pitches, setPitches] = useState<Pitch[]>([]);
     const [loading, setLoading] = useState(true);
     const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
     const [copied, setCopied] = useState(false);
     const router = useRouter();

     useEffect(() => {
          loadPitches();
     }, []);

     const loadPitches = async () => {
          try {
               const result = await fetchPitches();
               if (result.success && result.pitches) {
                    setPitches(result.pitches);
               } else {
                    toast.error(result.message || "Failed to load pitches");
               }
          } catch (error) {
               toast.error("An error occurred while loading pitches");
          } finally {
               setLoading(false);
          }
     };

     const handleCopy = async (pitch: string) => {
          try {
               await navigator.clipboard.writeText(pitch);
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
               toast.error("Failed to copy pitch");
          }
     };

     if (loading) {
          return (
               <div className="fixed inset-0 ml-[240px] flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin" />
               </div>
          );
     }

     return (
          <div className="fixed inset-0 ml-[240px] flex">
               {/* Left Section - Pitch List */}
               <div className="w-1/3 h-full p-6 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
                    <div className="flex items-center gap-4 mb-6">
                         <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push("/")}
                              className="flex items-center gap-2"
                         >
                              <ArrowLeft className="w-4 h-4" />
                              Back
                         </Button>
                         <h2 className="text-2xl font-semibold">
                              Pitch History
                         </h2>
                    </div>
                    <div className="space-y-4">
                         {pitches.map((pitch) => (
                              <button
                                   key={pitch.id}
                                   onClick={() => setSelectedPitch(pitch)}
                                   className={`w-full text-left p-4 rounded-lg border transition-all ${
                                        selectedPitch?.id === pitch.id
                                             ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                                             : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                                   }`}
                              >
                                   <div className="flex justify-between items-start mb-2">
                                        <div>
                                             <h3 className="font-medium">
                                                  {pitch.prospect_name}
                                             </h3>
                                             <p className="text-sm text-neutral-500">
                                                  {pitch.prospect_title} at{" "}
                                                  {pitch.prospect_company}
                                             </p>
                                        </div>
                                        <span className="text-xs text-neutral-500">
                                             {new Date(
                                                  pitch.created_at
                                             ).toLocaleDateString()}
                                        </span>
                                   </div>
                                   <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                        {pitch.pain_point}
                                   </p>
                              </button>
                         ))}
                    </div>
               </div>

               {/* Right Section - Selected Pitch */}
               <div className="w-2/3 h-full p-6">
                    {selectedPitch ? (
                         <div className="h-full flex flex-col">
                              <div className="flex justify-between items-center mb-6">
                                   <h2 className="text-2xl font-semibold">
                                        Generated Pitch
                                   </h2>
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                             handleCopy(
                                                  selectedPitch.generated_pitch
                                             )
                                        }
                                        className="flex items-center gap-2"
                                   >
                                        {copied ? (
                                             <Check className="w-4 h-4" />
                                        ) : (
                                             <Copy className="w-4 h-4" />
                                        )}
                                        {copied ? "Copied!" : "Copy"}
                                   </Button>
                              </div>
                              <div className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 whitespace-pre-wrap overflow-y-auto">
                                   {selectedPitch.generated_pitch}
                              </div>
                         </div>
                    ) : (
                         <div className="h-full flex items-center justify-center text-neutral-500">
                              Select a pitch to view its details
                         </div>
                    )}
               </div>
          </div>
     );
}
