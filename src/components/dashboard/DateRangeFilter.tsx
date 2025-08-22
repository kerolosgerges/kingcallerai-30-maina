
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker"; // Correct! Use react-day-picker's DateRange

interface DateRangeFilterProps {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  onApply?: (range: DateRange | undefined) => void;
}

export function DateRangeFilter({ range, onChange, onApply }: DateRangeFilterProps) {
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(range);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setTempRange(range);
  }, [range]);

  const getRangeLabel = () => {
    if (range?.from && range.to) {
      return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`;
    } else if (range?.from) {
      return `${format(range.from, "PPP")} - End`;
    }
    return "Select date range";
  };

  const handleApply = () => {
    onChange(tempRange);
    onApply?.(tempRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(range);
    setIsOpen(false);
  };

  return (
    <div className="flex justify-end mb-6 w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
            {getRangeLabel()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-0">
            <Calendar
              mode="range"
              selected={tempRange}
              onSelect={setTempRange}
              className="p-3 pointer-events-auto"
              initialFocus
              numberOfMonths={2}
            />
            <div className="flex justify-end gap-2 p-3 border-t">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
