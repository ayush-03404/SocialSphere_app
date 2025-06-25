import { Switch, Route } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toast } from "@/components/Toast";
import { Navigation } from "@/components/Navigation";
import { Landing } from "@/pages/Landing";
import { Home } from "@/pages/Home";
import { UserGuide } from "@/pages/UserGuide";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SocialSphere...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <div className="flex">
            <Navigation />
            <main className="flex-1 ml-64 min-h-screen bg-background">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/guide" component={UserGuide} />
                <Route path="/chat" component={() => <div>Chat Page (Coming Soon)</div>} />
                <Route path="/friends" component={() => <div>Friends Page (Coming Soon)</div>} />
                <Route path="/stories" component={() => <div>Stories Page (Coming Soon)</div>} />
                <Route path="/polls" component={() => <div>Polls Page (Coming Soon)</div>} />
                <Route path="/auctions" component={() => <div>Auctions Page (Coming Soon)</div>} />
                <Route path="/screen-share" component={() => <div>Screen Share Page (Coming Soon)</div>} />
                <Route component={() => <div className="p-6 text-center">404 - Page Not Found</div>} />
              </Switch>
            </main>
          </div>
        </>
      )}
    </Switch>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router />
      <Toast />
    </ThemeProvider>
  );
}