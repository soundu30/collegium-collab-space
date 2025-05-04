
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Forums from "./pages/Forums";
import ForumTopic from "./pages/ForumTopic";
import Resources from "./pages/Resources";
import Events from "./pages/Events";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Context
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Separate component to use Router hooks
const AuthProviderWithRouter = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  
  return (
    <AuthProvider onNavigate={(path) => navigate(path)}>
      {children}
    </AuthProvider>
  );
};

// Routes component wrapped with auth provider
const AppRoutes = () => (
  <AuthProviderWithRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forums" element={<Forums />} />
      <Route path="/forums/:id" element={<ForumTopic />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/events" element={<Events />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AuthProviderWithRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
