
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  college: string;
  major: string;
  interests: string[];
  avatar?: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  navigateToPath: (path: string) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  college: string;
  major: string;
  interests: string[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  onNavigate 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('collegium-user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('collegium-user');
      }
    }
  }, []);
  
  // Navigation method that can be called from inside auth context
  const navigateToPath = (path: string) => {
    onNavigate(path);
  };
  
  // Mock login function (in a real app this would connect to an API)
  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // This is just for demo. In a real app, you'd validate credentials on a server
      if (email === 'demo@college.edu' && password === 'password123') {
        const mockUser: User = {
          id: '1',
          name: 'Demo Student',
          email: 'demo@college.edu',
          college: 'Demo University',
          major: 'Computer Science',
          interests: ['Programming', 'AI', 'Web Development'],
          avatar: '/placeholder.svg'
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('collegium-user', JSON.stringify(mockUser));
        toast.success('Login successful!');
        navigateToPath('/dashboard');
      } else {
        // For demo purposes, allow any email with valid format
        if (email.includes('@') && password.length >= 6) {
          const mockUser: User = {
            id: Date.now().toString(),
            name: email.split('@')[0],
            email: email,
            college: 'Sample University',
            major: 'Undeclared',
            interests: [],
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('collegium-user', JSON.stringify(mockUser));
          toast.success('Login successful!');
          navigateToPath('/dashboard');
        } else {
          toast.error('Invalid credentials. Please try again.');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Login failed. Please try again.');
    }
  };
  
  // Mock register function
  const register = async (userData: RegisterData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        college: userData.college,
        major: userData.major,
        interests: userData.interests,
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('collegium-user', JSON.stringify(newUser));
      toast.success('Registration successful!');
      navigateToPath('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      toast.error('Registration failed. Please try again.');
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('collegium-user');
    toast.success('Logged out successfully');
    navigateToPath('/');
  };
  
  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    navigateToPath
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
