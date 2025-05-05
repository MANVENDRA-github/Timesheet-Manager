
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimesheet } from '@/context/TimesheetContext';

interface TimeEntryFormProps {
  date: Date;
  entryId?: string;
  onClose: () => void;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ date, entryId, onClose }) => {
  const { projects, addEntry, entries, updateEntry } = useTimesheet();
  
  // Find existing entry if we are editing
  const existingEntry = entryId 
    ? entries.find(entry => entry.id === entryId) 
    : undefined;
  
  const [formData, setFormData] = useState({
    hours: existingEntry?.hours || 8,
    projectId: existingEntry?.projectId || projects[0].id,
    notes: existingEntry?.notes || '',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (existingEntry) {
      updateEntry(existingEntry.id, {
        ...formData
      });
    } else {
      addEntry({
        date: format(date, 'yyyy-MM-dd'),
        hours: formData.hours,
        projectId: formData.projectId,
        notes: formData.notes,
      });
    }
    onClose();
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingEntry ? 'Edit Time Entry' : 'Add Time Entry'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date"
              value={format(date, 'EEEE, MMMM d, yyyy')} 
              disabled 
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="hours">Hours</Label>
            <Input
              id="hours"
              type="number"
              min="0.5"
              step="0.5"
              max="24"
              value={formData.hours}
              onChange={(e) => setFormData({...formData, hours: parseFloat(e.target.value) || 0})}
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="project">Project</Label>
            <Select 
              value={formData.projectId.toString()} 
              onValueChange={(value) => setFormData({...formData, projectId: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="What did you work on?"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {existingEntry ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeEntryForm;
