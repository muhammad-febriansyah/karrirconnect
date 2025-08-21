import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = 'contoh: 8.000.000',
  className,
  disabled = false,
  required = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  const formatCurrency = (num: string) => {
    // Remove non-digits
    const digits = num.replace(/\D/g, '');
    
    if (!digits) return '';
    
    // Format with thousand separators
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseCurrency = (formatted: string) => {
    return formatted.replace(/\./g, '');
  };

  useEffect(() => {
    if (value) {
      const numericValue = typeof value === 'number' ? value.toString() : value;
      setDisplayValue(formatCurrency(numericValue));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrency(inputValue);
    const numeric = parseCurrency(formatted);
    
    setDisplayValue(formatted);
    onChange(numeric);
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
        Rp
      </div>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn("pl-8", className)}
        disabled={disabled}
        required={required}
      />
    </div>
  );
}