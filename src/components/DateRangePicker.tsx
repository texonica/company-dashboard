'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';

interface DateRangePickerProps {
  onChange: (range: { startDate: string; endDate: string }) => void;
  startDate?: string;
  endDate?: string;
}

export default function DateRangePicker({ onChange, startDate = '', endDate = '' }: DateRangePickerProps) {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  const handleApply = () => {
    onChange({ startDate: start, endDate: end });
  };

  return (
    <Card className="w-auto">
      <CardContent className="p-4">
        <div className="flex space-x-2 items-center">
          <div className="flex flex-col">
            <label htmlFor="start-date" className="text-sm font-medium">Start Date</label>
            <Input 
              type="date" 
              id="start-date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-date" className="text-sm font-medium">End Date</label>
            <Input 
              type="date" 
              id="end-date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="pt-6">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 