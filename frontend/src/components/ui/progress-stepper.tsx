import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStepperProps {
  status: string;
  className?: string;
}

const steps = [
  { id: "PENDING_OFFER", label: "Teklif Bekleniyor" },
  { id: "OFFER_READY", label: "Teklif Hazır" },
  { id: "PAYMENT_PENDING", label: "Ödeme Bekleniyor" },
  { id: "COMPLETED", label: "Tamamlandı" },
];

export function ProgressStepper({ status, className }: ProgressStepperProps) {
  // Map status to step index
  const getCurrentStepIndex = (status: string) => {
    if (status === "PAYMENT_REVIEW") return 2; // Treat review as payment pending step
    if (status === "CANCELLED") return -1;
    return steps.findIndex((s) => s.id === status);
  };

  const currentStepIndex = getCurrentStepIndex(status);

  if (status === "CANCELLED") {
    return (
      <div className={cn("w-full p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-center font-medium", className)}>
        Bu talep iptal edilmiştir.
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex justify-between">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full" />
        <div 
            className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-300",
                  isCurrent && "ring-4 ring-green-100"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isCompleted ? "text-green-600" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
