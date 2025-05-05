
import React, { useState } from 'react';
import { format, addDays, isSameMonth, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTimesheet, TimeEntry } from '@/context/TimesheetContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import TimeEntryForm from './TimeEntryForm';
import TimeEntryItem from './TimeEntryItem';

const WeeklyTimesheet = () => {
  const { 
    currentWeekStart, 
    setCurrentWeekStart, 
    getEntriesForDate,
    getTotalHoursForWeek,
  } = useTimesheet();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  // Generate array of the 7 days of the current week
  const weekDays = [...Array(7)].map((_, i) => addDays(currentWeekStart, i));
  
  const previousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };
  
  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };
  
  const totalWeeklyHours = getTotalHoursForWeek();
  
  return (
    <div className="bg-white rounded-lg shadow-sm animate-fade-in">
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Weekly Timesheet</h2>
          <div className="text-sm text-gray-500 mt-1">
            {format(currentWeekStart, 'MMMM d')} - {format(addDays(currentWeekStart, 6), 'MMMM d, yyyy')}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Select Week</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentWeekStart}
                onSelect={(date) => date && setCurrentWeekStart(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={previousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="font-medium text-center py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map((day, i) => {
            const dayEntries = getEntriesForDate(day);
            const totalDayHours = dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
            const isWeekend = i >= 5; // Saturday or Sunday
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={i} 
                className={`time-cell ${dayEntries.length > 0 ? 'time-cell-filled' : ''} 
                  ${isWeekend ? 'bg-gray-50' : ''} 
                  ${isToday ? 'border-blue-400 border-2' : ''}`}
                onClick={() => {
                  setSelectedDate(day);
                  setIsAddingEntry(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm ${!isSameMonth(day, new Date()) ? 'text-gray-400' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {totalDayHours > 0 && (
                    <span className="text-xs font-medium bg-timesheet-blue text-white px-1.5 rounded">
                      {totalDayHours}h
                    </span>
                  )}
                </div>
                
                <div className="mt-2 space-y-1 overflow-hidden">
                  {dayEntries.map((entry) => (
                    <TimeEntryItem key={entry.id} entry={entry} onEdit={() => {}} />
                  ))}
                  
                  {dayEntries.length === 0 && !isWeekend && (
                    <div className="flex justify-center mt-3">
                      <span className="text-xs text-gray-400 italic">No entries</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium">Total hours this week:</span> {totalWeeklyHours}h
            <span className="text-sm text-gray-500 ml-2">
              ({Math.min(100, Math.round(totalWeeklyHours / 40 * 100))}% of 40h target)
            </span>
          </div>
          
          <Button onClick={() => {
            setSelectedDate(new Date());
            setIsAddingEntry(true);
          }}>
            Add Time Entry
          </Button>
        </div>
      </div>
      
      {isAddingEntry && selectedDate && (
        <TimeEntryForm 
          date={selectedDate}
          onClose={() => setIsAddingEntry(false)}
        />
      )}
    </div>
  );
};

export default WeeklyTimesheet;
