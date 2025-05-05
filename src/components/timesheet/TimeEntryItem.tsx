
import React, { useState } from 'react';
import { Clock, Edit2, Trash2 } from 'lucide-react';
import { TimeEntry, useTimesheet } from '@/context/TimesheetContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { parseISO } from 'date-fns';
import TimeEntryForm from './TimeEntryForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface TimeEntryItemProps {
  entry: TimeEntry;
  onEdit?: () => void;
}

const TimeEntryItem: React.FC<TimeEntryItemProps> = ({ entry }) => {
  const { getProjectById, deleteEntry } = useTimesheet();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const project = getProjectById(entry.projectId);
  
  return (
    <>
      <div className="flex items-start justify-between group">
        <div className="flex-1 min-w-0">
          <span className={`project-tag ${project?.color || 'project-tag-1'}`}>
            {project?.name || 'Unknown Project'}
          </span>
          <div className="mt-1 text-xs flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {entry.hours}h
          </div>
          {entry.notes && (
            <div className="text-xs text-gray-500 mt-0.5 truncate">
              {entry.notes}
            </div>
          )}
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => setIsConfirmingDelete(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isEditing && (
        <TimeEntryForm
          date={parseISO(entry.date)}
          entryId={entry.id}
          onClose={() => setIsEditing(false)}
        />
      )}
      
      <AlertDialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this time entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                deleteEntry(entry.id);
                setIsConfirmingDelete(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TimeEntryItem;
