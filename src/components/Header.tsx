
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User, LogOut, MessageSquare, Calendar, BookOpen, File, Home } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { isAuthenticated, user, profile, logout } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <Home className="w-4 h-4 mr-2" /> },
    { path: '/forums', name: 'Forums', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { path: '/resources', name: 'Resources', icon: <File className="w-4 h-4 mr-2" /> },
    { path: '/events', name: 'Events', icon: <Calendar className="w-4 h-4 mr-2" /> },
    { path: '/messages', name: 'Messages', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
  ];

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-6">
            <span className="text-xl font-bold text-collegium-primary">Collegium</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium flex items-center transition-colors rounded-md
                ${location.pathname === item.path
                  ? 'bg-collegium-light text-collegium-primary'
                  : 'text-gray-600 hover:text-collegium-primary hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
                      <AvatarFallback>{profile?.name ? getInitials(profile.name) : 'US'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="p-2 text-sm font-medium border-b">
                    <div>{profile?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden ml-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="py-4">
                    <div className="text-lg font-bold mb-6 text-collegium-primary">Collegium</div>
                    <nav className="flex flex-col space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`px-3 py-2 flex items-center rounded-md text-sm font-medium
                          ${location.pathname === item.path
                            ? 'bg-collegium-light text-collegium-primary'
                            : 'text-gray-600 hover:text-collegium-primary hover:bg-gray-100'
                          }`}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}
                      <Link
                        to="/profile"
                        className="px-3 py-2 flex items-center rounded-md text-sm font-medium
                          text-gray-600 hover:text-collegium-primary hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="px-3 py-2 flex items-center rounded-md text-sm font-medium
                          text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
