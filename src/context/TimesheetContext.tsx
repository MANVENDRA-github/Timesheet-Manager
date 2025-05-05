
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { startOfWeek, addDays, format, parseISO, isSameDay } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export type TimeEntry = {
  id: string;
  date: string;
  hours: number;
  projectId: number;
  notes: string;
};

export type Project = {
  id: number;
  name: string;
  color: 'project-tag-1' | 'project-tag-2' | 'project-tag-3' | 'project-tag-4';
  client: string;
};

interface TimesheetContextType {
  entries: TimeEntry[];
  projects: Project[];
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
  addEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<TimeEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesForDate: (date: Date) => TimeEntry[];
  getTotalHoursForWeek: () => number;
  getProjectById: (id: number) => Project | undefined;
}

// Initial mock data
const MOCK_PROJECTS: Project[] = [
  { id: 1, name: 'Website Redesign', color: 'project-tag-1', client: 'Acme Corp' },
  { id: 2, name: 'Mobile App Dev', color: 'project-tag-2', client: 'TechStart' },
  { id: 3, name: 'Marketing Campaign', color: 'project-tag-3', client: 'Brand Co' },
  { id: 4, name: 'Internal Tools', color: 'project-tag-4', client: 'Our Company' }
];

const TimesheetContext = createContext<TimesheetContextType | undefined>(undefined);

export const TimesheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<TimeEntry[]>(() => {
    const savedEntries = localStorage.getItem('timesheet_entries');
    return savedEntries ? JSON.parse(savedEntries) : generateMockEntries();
  });
  
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    return startOfWeek(new Date(), { weekStartsOn: 1 }); // Week starts on Monday
  });

  // Save entries to localStorage when they change
  useEffect(() => {
    localStorage.setItem('timesheet_entries', JSON.stringify(entries));
  }, [entries]);

  // Generate some mock entries for demo purposes
  function generateMockEntries(): TimeEntry[] {
    const mockEntries: TimeEntry[] = [];
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    
    // Create sample entries for the week
    for (let i = 0; i < 5; i++) { // Monday through Friday
      const date = addDays(weekStart, i);
      
      // Add 1-2 entries per day
      mockEntries.push({
        id: `mock-${i}-1`,
        date: format(date, 'yyyy-MM-dd'),
        hours: Math.floor(Math.random() * 4) + 4, // 4-8 hours
        projectId: Math.floor(Math.random() * 4) + 1, // Random project 1-4
        notes: 'Sample work entry'
      });
      
      // Add second entry for some days
      if (Math.random() > 0.5) {
        mockEntries.push({
          id: `mock-${i}-2`,
          date: format(date, 'yyyy-MM-dd'),
          hours: Math.floor(Math.random() * 2) + 1, // 1-3 hours
          projectId: Math.floor(Math.random() * 4) + 1, // Random project 1-4
          notes: 'Additional work'
        });
      }
    }
    
    return mockEntries;
  }

  const addEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: `entry-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    
    setEntries(prev => [...prev, newEntry]);
    toast({
      title: "Time entry added",
      description: `Added ${entry.hours} hours to ${format(parseISO(entry.date), 'MMM dd')}`
    });
  };

  const updateEntry = (id: string, updatedFields: Partial<TimeEntry>) => {
    setEntries(prev => 
      prev.map(entry => entry.id === id ? { ...entry, ...updatedFields } : entry)
    );
    toast({
      description: "Time entry updated"
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      description: "Time entry deleted"
    });
  };

  const getEntriesForDate = (date: Date) => {
    return entries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return isSameDay(entryDate, date);
    });
  };

  const getTotalHoursForWeek = () => {
    return entries.reduce((total, entry) => {
      const entryDate = parseISO(entry.date);
      const weekEnd = addDays(currentWeekStart, 6);
      
      if (entryDate >= currentWeekStart && entryDate <= weekEnd) {
        return total + entry.hours;
      }
      return total;
    }, 0);
  };

  const getProjectById = (id: number) => {
    return projects.find(project => project.id === id);
  };

  return (
    <TimesheetContext.Provider 
      value={{
        entries,
        projects,
        currentWeekStart,
        setCurrentWeekStart,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntriesForDate,
        getTotalHoursForWeek,
        getProjectById
      }}
    >
      {children}
    </TimesheetContext.Provider>
  );
};

export const useTimesheet = () => {
  const context = useContext(TimesheetContext);
  if (context === undefined) {
    throw new Error('useTimesheet must be used within a TimesheetProvider');
  }
  return context;
};
