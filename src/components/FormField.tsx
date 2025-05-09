import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Info, CheckCircle, Edit2, Lock, Save } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoFilled?: boolean;
  className?: string;
  readOnly?: boolean;
}

const FormField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoFilled = false,
  className,
  readOnly = false,
}: FormFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wasAutoFilled, setWasAutoFilled] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Track if field was autofilled to maintain animation
  useEffect(() => {
    if (autoFilled) {
      setWasAutoFilled(true);
      // Reset the "new" state to trigger animation again
      setIsNew(false);
      setTimeout(() => setIsNew(true), 50);
    }
  }, [autoFilled]);

  const toggleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(!isEditing);
  };

  return (
    <div
      className={cn(
        "mb-4 transition-all duration-300",
        autoFilled && "slide-in-bottom",
        className
      )}
    >
      <div className="flex items-center mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {wasAutoFilled && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2 cursor-help">
                  <Info
                    className={cn(
                      "h-4 w-4 transition-colors duration-300",
                      autoFilled
                        ? "text-university-600 animate-pulse"
                        : "text-university-400"
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Auto-filled by OCR — Please verify and edit if needed.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {value && !isFocused && (
          <div className="ml-auto">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
          </div>
        )}
      </div>

      <div
        className={cn(
          "relative",
          autoFilled && wasAutoFilled && isNew && "animated-border"
        )}
      >
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly && !isEditing}
          className={cn(
            "glass-input w-full transition-all duration-300",
            isFocused && "ring-2 ring-university-500 shadow-lg",
            autoFilled && wasAutoFilled && isNew && "highlight-field",
            isHovered && !isFocused && "shadow-md",
            readOnly && !isEditing && "bg-gray-100/70 cursor-not-allowed",
            isEditing &&
              "bg-white border-university-400 ring-1 ring-university-400 animate-pulse-slow"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />

        {autoFilled && wasAutoFilled && isNew && (
          <div className="absolute inset-0 bg-university-200/25 rounded-lg pointer-events-none animate-highlight"></div>
        )}

        <button
          onClick={toggleEdit}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-200",
            isEditing
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500",
            "hover:bg-university-100 hover:text-university-600 transform hover:scale-110"
          )}
          title={isEditing ? "Save changes" : "Edit field"}
        >
          {readOnly && !isEditing ? (
            <Lock className="h-3.5 w-3.5" />
          ) : isEditing ? (
            <Save className="h-3.5 w-3.5" />
          ) : (
            <Edit2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default FormField;
