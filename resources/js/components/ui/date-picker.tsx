import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, isSameMonth, isSameDay, isBefore, parseISO, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface DatePickerProps {
  id?: string;
  value?: string; // Format: yyyy-MM-dd
  onChange: (value: string) => void;
  minDate?: Date;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function DatePicker({ id, value, onChange, minDate, placeholder = 'Pilih tanggal', className, error }: DatePickerProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const selected = value ? parseISO(value) : undefined;
  const [currentMonth, setCurrentMonth] = React.useState<Date>(selected || new Date());

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
  const days: Date[] = [];
  for (let d = start; !isBefore(end, d); d = addDays(d, 1)) days.push(d);

  const isDisabled = (day: Date) => {
    if (!minDate) return false;
    return isBefore(startOfDay(day), startOfDay(minDate));
  };

  const display = selected ? format(selected, 'dd MMM yyyy') : '';

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div className="relative">
        <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          id={id}
          readOnly
          role="combobox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          value={display}
          placeholder={placeholder}
          className={cn('pl-9 pr-9 h-11', error ? 'border-red-400' : '')}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Hapus tanggal"
            className="absolute right-2 top-2.5 inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-[18rem] rounded-md border border-gray-200 bg-white shadow-md">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <button
              type="button"
              className="p-1 rounded hover:bg-gray-50"
              onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</div>
            <button
              type="button"
              className="p-1 rounded hover:bg-gray-50"
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="px-3 pb-3">
            <div className="grid grid-cols-7 gap-1 text-[11px] text-gray-500 py-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const inMonth = isSameMonth(day, currentMonth);
                const selectedDay = selected && isSameDay(day, selected);
                const disabled = isDisabled(day);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => {
                      if (disabled) return;
                      onChange(format(day, 'yyyy-MM-dd'));
                      setOpen(false);
                    }}
                    disabled={disabled}
                    className={cn(
                      'h-8 w-8 rounded text-sm flex items-center justify-center transition',
                      !inMonth && 'text-gray-300',
                      inMonth && 'text-gray-700',
                      selectedDay && 'bg-blue-600 text-white',
                      !selectedDay && !disabled && 'hover:bg-gray-100',
                      disabled && 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;

