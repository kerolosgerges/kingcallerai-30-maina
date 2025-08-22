import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const countries = [
  { value: "US", label: "United States", flag: "🇺🇸", code: "+1" },
  { value: "CA", label: "Canada", flag: "🇨🇦", code: "+1" },
  { value: "GB", label: "United Kingdom", flag: "🇬🇧", code: "+44" },
  { value: "AU", label: "Australia", flag: "🇦🇺", code: "+61" },
  { value: "DE", label: "Germany", flag: "🇩🇪", code: "+49" },
  { value: "FR", label: "France", flag: "🇫🇷", code: "+33" },
  { value: "IT", label: "Italy", flag: "🇮🇹", code: "+39" },
  { value: "ES", label: "Spain", flag: "🇪🇸", code: "+34" },
  { value: "JP", label: "Japan", flag: "🇯🇵", code: "+81" },
  { value: "KR", label: "South Korea", flag: "🇰🇷", code: "+82" },
  { value: "CN", label: "China", flag: "🇨🇳", code: "+86" },
  { value: "IN", label: "India", flag: "🇮🇳", code: "+91" },
  { value: "BR", label: "Brazil", flag: "🇧🇷", code: "+55" },
  { value: "MX", label: "Mexico", flag: "🇲🇽", code: "+52" },
  { value: "RU", label: "Russia", flag: "🇷🇺", code: "+7" },
  { value: "ZA", label: "South Africa", flag: "🇿🇦", code: "+27" },
  { value: "EG", label: "Egypt", flag: "🇪🇬", code: "+20" },
  { value: "NG", label: "Nigeria", flag: "🇳🇬", code: "+234" },
  { value: "SG", label: "Singapore", flag: "🇸🇬", code: "+65" },
  { value: "AE", label: "United Arab Emirates", flag: "🇦🇪", code: "+971" },
];

interface CountrySelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onCountryCodeChange?: (code: string) => void;
  placeholder?: string;
  className?: string;
}

export function CountrySelector({
  value,
  onValueChange,
  onCountryCodeChange,
  placeholder = "Select country...",
  className,
}: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedCountry = countries.find((country) => country.value === value);

  const handleSelect = (countryValue: string) => {
    const country = countries.find((c) => c.value === countryValue);
    onValueChange?.(countryValue);
    onCountryCodeChange?.(country?.code || "");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span>{selectedCountry.label}</span>
              <span className="text-muted-foreground">({selectedCountry.code})</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.value}
                  onSelect={handleSelect}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.label}</span>
                    <span className="text-muted-foreground ml-auto">
                      {country.code}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === country.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}