import { ChevronLeft, ChevronRight } from "lucide-react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Badge } from '@mui/material';
import { cn } from "@/lib/utils";

export type CalendarProps = {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  shouldDisableDate?: (date: Date) => boolean;
  mode?: "single" | "range";
};

function CustomDay(props: PickersDayProps) {
  const { day, selected, ...other } = props;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={selected ? '✔' : undefined}
      color="primary"
    >
      <PickersDay {...other} day={day} />
    </Badge>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  value,
  onChange,
  shouldDisableDate,
  mode = "single",
  ...props
}: CalendarProps) {
  // Current date for disabling past dates (July 15, 2025, 11:30 PM IST)
  const today = new Date('2025-07-15T23:30:00+05:30');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        value={value}
        onChange={onChange}
        shouldDisableDate={(date) => shouldDisableDate ? shouldDisableDate(date) : date < today}
        slots={{
          day: CustomDay,
          leftArrowIcon: () => <ChevronLeft className={cn("h-4 w-4")} />,
          rightArrowIcon: () => <ChevronRight className={cn("h-4 w-4")} />,
        }}
        slotProps={{
          toolbar: { hidden: true },
          actionBar: { actions: [] },
          day: {
            sx: {
              '&.MuiPickersDay-root': {
                ...(mode === "range" && {
                  '&.Mui-selected': {
                    borderRadius: value ? '50%' : '0',
                    ...(value && {
                      '&:first-of-type': { borderTopLeftRadius: '50%', borderBottomLeftRadius: '50%' },
                      '&:last-of-type': { borderTopRightRadius: '50%', borderBottomRightRadius: '50%' },
                    }),
                  },
                }),
                ...((typeof classNames?.day === "object" && classNames?.day !== null) ? classNames.day : {}),
              },
            },
          },
        }}
        className={cn("p-3 border rounded-md", className)}
        {...props}
      />
    </LocalizationProvider>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };