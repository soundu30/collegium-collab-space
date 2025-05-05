
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import { Spinner } from './ui/spinner';

interface LayoutProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  requiresAuth = false,
  title
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if authentication is required but user is not authenticated
  React.useEffect(() => {
    if (requiresAuth && !isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [requiresAuth, isAuthenticated, isLoading, navigate]);
  
  // If authentication check is in progress, show loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }
  
  // If authentication is required and user is not authenticated, show nothing
  if (requiresAuth && !isAuthenticated) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-6">
        {title && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-collegium-primary">{title}</h1>
          </div>
        )}
        {children}
      </main>
      <footer className="py-6 border-t bg-gray-50">
        <div className="container text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Collegium - College Collaboration Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
