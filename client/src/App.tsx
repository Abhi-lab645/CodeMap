import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { AITutor } from "@/components/ai-tutor";
import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import Projects from "@/pages/projects";
import Dashboard from "@/pages/dashboard";
import Theory from "@/pages/theory";
import Workspace from "@/pages/workspace";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/auth" component={Auth} />
        <Route path="/projects" component={Projects} />
        <Route path="/dashboard/:projectId">
          {(params) => (
            <ProtectedRoute>
              <Dashboard {...params} />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/theory/:projectId/:miniProjectId">
          {(params) => (
            <ProtectedRoute>
              <Theory {...params} />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/workspace/:projectId/:miniProjectId">
          {(params) => (
            <ProtectedRoute>
              <Workspace {...params} />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/profile">
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
      <AITutor />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
