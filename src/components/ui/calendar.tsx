'use client'

import React, { useState } from 'react';
import { format, isValid, parse } from 'date-fns';

interface CalendarProps {
    mode?: 'single' | 'range';
    selected?: Date | [Date, Date] | null;
    onSelect?: (value: Date | [Date, Date] | null) => void;
    initialFocus?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

export function Calendar({ mode = 'single', selected, onSelect, initialFocus, minDate, maxDate }: CalendarProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const dateFormat = 'dd/MM/yyyy';
    
    // Initialize input value when selected changes
    React.useEffect(() => {
        if (selected) {
            if (mode === 'single' && selected instanceof Date) {
                setInputValue(format(selected, dateFormat));
            } else if (mode === 'range' && Array.isArray(selected) && selected.length > 0) {
                setInputValue(format(selected[0], dateFormat));
            }
        } else {
            setInputValue('');
        }
    }, [selected, mode]);
    
    // Handle input change - only update the text value, don't save
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    };
    
    // Handle form submission (when Enter is pressed)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Try to parse and save the date
        try {
            const parsedDate = parse(inputValue, dateFormat, new Date());
            if (isValid(parsedDate) && onSelect) {
                if (mode === 'single') {
                    onSelect(parsedDate);
                } else if (mode === 'range') {
                    if (selected && Array.isArray(selected) && selected[0] && !selected[1]) {
                        // If new date is before the first date, swap them
                        if (parsedDate < selected[0]) {
                            onSelect([parsedDate, selected[0]]);
                        } else {
                            onSelect([selected[0], parsedDate]);
                        }
                    } else {
                        // Start a new range
                        onSelect([parsedDate, parsedDate]);
                    }
                }
            }
        } catch (error) {
            console.error('Error parsing date on submit:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-2 bg-white">
            <input
                type="text"
                placeholder={dateFormat}
                value={inputValue}
                onChange={handleInputChange}
                className="text-sm p-2 border rounded-md w-full"
                autoFocus={initialFocus}
            />
            <div className="text-xs text-gray-500 mt-1">Press Enter to save</div>
        </form>
    );
} 