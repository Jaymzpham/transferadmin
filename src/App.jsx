import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import PlayerProfile from "./pages/PlayerProfile";
import ClubProfile from "./pages/ClubProfile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EditProfile from "./pages/EditProfile";
import EditAgentProfile from "./pages/EditAgentProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/club/:id" element={<ClubProfile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/edit-agent-profile" element={<EditAgentProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
