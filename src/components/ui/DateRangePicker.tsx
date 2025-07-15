import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRangePicker as MUDateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { format } from "date-fns";

interface DateRangePickerProps {
  value?: { from: Date | null; to: Date | null };
  onChange: (range: { from: Date | null; to: Date | null } | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-40 justify-start text-left font-normal"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
              </>
            ) : (
              format(value.from, "LLL dd, y")
            )
          ) : (
            <span>date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MUDateRangePicker
            value={[value?.from || null, value?.to || null]}
            onChange={(newValue) => {
              onChange({ from: newValue[0], to: newValue[1] });
              if (newValue[1]) setOpen(false);
            }}
            slotProps={{
              textField: { variant: "outlined" },
              actionBar: { actions: [] },
            }}
            className="w-full"
          />
        </LocalizationProvider>
      </PopoverContent>
    </Popover>
  );
}