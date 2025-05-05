
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  employeeId?: string;
};

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app this would come from an API
const MOCK_USERS = [
  {
    id: 1,
    name: 'Manvendra',
    email: 'manvendra@gmail.com',
    password: '20221cse0787',
    role: 'Developer',
    department: 'Engineering',
    employeeId: '20221cse0787'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'Designer',
    department: 'Product'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('timesheet_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const isAuthenticated = Boolean(currentUser);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = MOCK_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (user) {
      // Remove password before storing
      const { password, ...safeUserData } = user;
      setCurrentUser(safeUserData);
      localStorage.setItem('timesheet_user', JSON.stringify(safeUserData));
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`
      });
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('timesheet_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
