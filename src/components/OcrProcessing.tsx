import React, { useEffect, useState } from "react";
import { Loader2, ScanSearch, CheckCircle2, FileSearch } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { cn } from "@/lib/utils";

interface OcrProcessingProps {
  isProcessing: boolean;
  progress: number;
  className?: string;
}

const OcrProcessing: React.FC<OcrProcessingProps> = ({
  isProcessing,
  progress,
  className,
}) => {
  const [statusText, setStatusText] = useState("Initializing OCR engine...");

  useEffect(() => {
    if (progress < 20) {
      setStatusText("Initializing OCR engine...");
    } else if (progress < 40) {
      setStatusText("Preprocessing document...");
    } else if (progress < 60) {
      setStatusText("Analyzing text layout...");
    } else if (progress < 80) {
      setStatusText("Extracting information...");
    } else if (progress < 100) {
      setStatusText("Validating extracted data...");
    } else {
      setStatusText("Processing complete!");
    }
  }, [progress]);

  if (!isProcessing) return null;

  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-500 animate-fade-in",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-university-100/40 rounded-full animate-pulse-slow"></div>
          <ScanSearch className="h-12 w-12 text-university-600 z-10" />
          <div className="absolute top-0 right-0 animate-spin-slow">
            <Loader2 className="h-6 w-6 text-university-800" />
          </div>

          {progress === 100 && (
            <div className="absolute -bottom-1 -right-1 bg-green-100 rounded-full p-1 animate-bounce-subtle">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          )}

          <svg className="absolute inset-0 w-24 h-24 -rotate-90">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="62.8"
              strokeDashoffset={62.8 - (62.8 * progress) / 100}
              className="text-university-500 transition-all duration-300"
              style={{ transformOrigin: "center", transform: "scale(2)" }}
            />
          </svg>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {progress === 100
              ? "Document Analysis Complete!"
              : "Scanning your document..."}
          </h3>
          <p className="text-sm text-gray-600 animate-pulse-slow">
            {statusText}
          </p>
        </div>

        <div className="w-full max-w-md">
          <Progress value={progress} className="h-2 bg-gray-200" />
          <div className="flex justify-between mt-1">
            <div className="flex items-center">
              <FileSearch className="h-3 w-3 text-university-700 mr-1" />
              <span className="text-xs text-gray-500">OCR Processing</span>
            </div>
            <p className="text-right text-xs font-medium text-university-700">
              {progress}%
            </p>
          </div>
        </div>

        <div className="w-full max-w-md pt-4 border-t border-gray-200/50">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div
              className={cn(
                "px-2 py-1 rounded text-xs",
                progress >= 30
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              Document Loaded
            </div>
            <div
              className={cn(
                "px-2 py-1 rounded text-xs",
                progress >= 60
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              Text Extracted
            </div>
            <div
              className={cn(
                "px-2 py-1 rounded text-xs",
                progress >= 90
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              Data Processed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OcrProcessing;
