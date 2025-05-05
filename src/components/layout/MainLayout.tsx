import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Clock, ChevronDown, BarChart2, 
  Calendar, Users, Settings, LogOut, User 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-timesheet-blue" />
            <h1 className="text-xl font-bold text-timesheet-blue">Timesheet Manager</h1>
          </div>
          
          <div className="flex items-center">
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 py-2 px-3 rounded-full hover:bg-gray-100 transition-colors">
                  <div className="h-8 w-8 bg-timesheet-blue rounded-full flex items-center justify-center text-white font-medium">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="font-medium">{currentUser.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <nav className="p-4 space-y-1">
            <div className="py-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Main
              </div>
              <a 
                href="/" 
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Calendar className="h-5 w-5 mr-3 text-timesheet-teal" />
                <span>Timesheet Manager</span>
              </a>
              <a 
                href="/dashboard" 
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <BarChart2 className="h-5 w-5 mr-3 text-timesheet-teal" />
                <span>Dashboard</span>
              </a>
              <a 
                href="/team" 
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Users className="h-5 w-5 mr-3 text-timesheet-teal" />
                <span>Team</span>
              </a>
              <a 
                href="/profile" 
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <User className="h-5 w-5 mr-3 text-timesheet-teal" />
                <span>Profile</span>
              </a>
            </div>

            <div className="py-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Projects
              </div>
              <div className="space-y-1 pl-2">
                <div className="flex items-center px-3 py-1.5 text-sm">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  <span>Website Redesign</span>
                </div>
                <div className="flex items-center px-3 py-1.5 text-sm">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Mobile App Dev</span>
                </div>
                <div className="flex items-center px-3 py-1.5 text-sm">
                  <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
                  <span>Marketing Campaign</span>
                </div>
                <div className="flex items-center px-3 py-1.5 text-sm">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                  <span>Internal Tools</span>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
