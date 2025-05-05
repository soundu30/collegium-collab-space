
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type Profile = {
  id: string;
  name: string;
  email: string;
  college: string;
  major: string;
  interests: string[];
  avatar_url?: string;
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  navigateToPath: (path: string) => void;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Navigation method that can be called from inside auth context
  const navigateToPath = (path: string) => {
    onNavigate(path);
  };

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as Profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // First check for an existing session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Fetch profile data after authentication
          const profileData = await fetchProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id);
          if (profileData) {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Login function with Supabase
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data.user) {
        toast.success('Login successful!');
        navigateToPath('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function with Supabase
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            college: userData.college,
            major: userData.major,
          }
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data.user) {
        toast.success('Registration successful!');
        navigateToPath('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update profile function
  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update profile');
        throw error;
      }

      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          ...profileData
        });
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  
  // Logout function with Supabase
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigateToPath('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };
  
  const value = {
    user,
    profile,
    session,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    navigateToPath,
    updateProfile
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
