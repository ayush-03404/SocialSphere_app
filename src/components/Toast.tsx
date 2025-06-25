import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { Button } from "./ui/button";

export function Toast() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg max-w-sm animate-fade-in ${
            toast.variant === "destructive"
              ? "bg-destructive text-destructive-foreground"
              : "bg-card text-card-foreground border"
          }`}
        >
          <div className="flex-1">
            {toast.title && (
              <div className="font-semibold text-sm">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 ml-2"
            onClick={() => dismiss(toast.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}