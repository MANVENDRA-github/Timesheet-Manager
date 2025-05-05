
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Team = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Updated team members list
  const teamMembers = [
    { 
      id: 1, 
      name: 'abc', 
      role: 'Developer', 
      department: 'Engineering',
      hoursThisWeek: 36,
      avatar: null
    },
    { 
      id: 2, 
      name: 'xyz', 
      role: 'Designer', 
      department: 'Product',
      hoursThisWeek: 42,
      avatar: null
    },
    { 
      id: 3, 
      name: 'manvendra', 
      role: 'Project Manager', 
      department: 'Product',
      hoursThisWeek: 39,
      avatar: null
    }
  ];

  if (!isAuthenticated) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            View your team's time tracking information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-200">
              {teamMembers.map(member => (
                <div key={member.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-timesheet-blue text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}, {member.department}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">{member.hoursThisWeek}h</div>
                    <div className="text-sm text-gray-500">This week</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Team;
