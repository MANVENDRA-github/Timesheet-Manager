
import React, { useState } from 'react';
import { useTimesheet } from '@/context/TimesheetContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { startOfWeek, endOfWeek, format, parseISO, differenceInDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DashboardSummary = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const { entries, projects, getProjectById } = useTimesheet();
  
  // Get current week stats
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  const weekEntries = entries.filter(entry => {
    const entryDate = parseISO(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });
  
  const totalHours = weekEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const targetHours = 40; // 40 hours per week
  const percentComplete = Math.min(100, Math.round((totalHours / targetHours) * 100));
  
  // Calculate days passed in week (for burndown)
  const daysPassed = Math.min(5, differenceInDays(today, weekStart) + 1); // Cap at 5 for work days
  const expectedHours = (targetHours / 5) * daysPassed;
  const hoursVariance = totalHours - expectedHours;
  
  // Project breakdown
  const projectHours = projects.map(project => {
    const hours = weekEntries
      .filter(entry => entry.projectId === project.id)
      .reduce((sum, entry) => sum + entry.hours, 0);
    
    return {
      id: project.id,
      name: project.name,
      hours,
      color: project.color === 'project-tag-1' ? '#3b82f6' :
             project.color === 'project-tag-2' ? '#10b981' :
             project.color === 'project-tag-3' ? '#8b5cf6' :
             '#f59e0b'
    };
  }).sort((a, b) => b.hours - a.hours);
  
  // Daily breakdown for chart
  const dailyData = [...Array(7)].map((_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    
    const dayEntries = entries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return entryDate.getDate() === day.getDate() && 
             entryDate.getMonth() === day.getMonth() && 
             entryDate.getFullYear() === day.getFullYear();
    });
    
    return {
      name: format(day, 'EEE'),
      hours: dayEntries.reduce((sum, entry) => sum + entry.hours, 0),
      date: format(day, 'MMM dd')
    };
  });
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Weekly Hours</CardTitle>
            <div className="text-sm text-muted-foreground">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value} hours`, 'Hours']}
                    labelFormatter={(label) => {
                      const day = dailyData.find(d => d.name === label);
                      return day ? day.date : label;
                    }}
                  />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    {dailyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index < 5 ? '#1e40af' : '#94a3b8'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Weekly Target</span>
                <span className="text-sm font-medium">{totalHours}/{targetHours}h</span>
              </div>
              <Progress value={percentComplete} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {percentComplete}% of weekly goal complete
              </p>
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium">Status</h4>
              <div className={`text-sm ${hoursVariance >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {hoursVariance >= 0 ? (
                  <span>On track (+{hoursVariance.toFixed(1)}h ahead)</span>
                ) : (
                  <span>Behind by {Math.abs(hoursVariance).toFixed(1)}h</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectHours.map(project => (
              <div key={project.id} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">{project.name}</span>
                  <span className="text-sm font-medium">{project.hours}h</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{
                      width: `${Math.min(100, (project.hours / totalHours) * 100)}%`,
                      backgroundColor: project.color
                    }}
                  />
                </div>
              </div>
            ))}
            
            {projectHours.every(p => p.hours === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No hours logged this week</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
