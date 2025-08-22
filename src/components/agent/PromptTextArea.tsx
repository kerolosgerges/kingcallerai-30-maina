
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PromptTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  className?: string;
}

export const PromptTextArea = ({ 
  value, 
  onChange, 
  label, 
  placeholder, 
  className = "" 
}: PromptTextAreaProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`min-h-[300px] resize-none text-sm leading-relaxed ${className}`}
      />
    </div>
  );
};
