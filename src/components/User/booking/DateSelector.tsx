import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { CardTitle } from '@/components/ui/card';
import CardContent from '@mui/material/CardContent';
import { DateSlot } from '@/types/interfaces/vendor';
import { format } from 'date-fns';
interface DateSelectorProps {
  availableDates: DateSlot[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ availableDates, selectedDate, onDateSelect }) => {
  const availableDateObjects = availableDates.map((d) => new Date(d.date));
  const handleDateSelect = (date: Date | null) => {
    if (date) onDateSelect(format(date, 'yyyy-MM-dd'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Date</CardTitle>
      </CardHeader>
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={selectedDate ? new Date(selectedDate) : null}
            onChange={handleDateSelect}
            shouldDisableDate={(date) =>
              !availableDateObjects.some(
                (availableDate) => format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              ) || date < new Date(new Date().setHours(0, 0, 0, 0))
            }
            slotProps={{ textField: { variant: 'outlined' } }}
          />
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
};

export default DateSelector;