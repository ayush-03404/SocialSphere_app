import { Link, useLocation } from "wouter";
import { 
  Home, 
  MessageCircle, 
  Users, 
  BarChart3, 
  Gavel, 
  Monitor, 
  BookOpen,
  Moon,
  Sun,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { useThemeContext } from "./ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useThemeContext();
  const { user } = useAuth();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/chat", icon: MessageCircle, label: "Chat" },
    { path: "/friends", icon: Users, label: "Friends" },
    { path: "/stories", icon: BookOpen, label: "Stories" },
    { path: "/polls", icon: BarChart3, label: "Polls" },
    { path: "/auctions", icon: Gavel, label: "Auctions" },
    { path: "/screen-share", icon: Monitor, label: "Screen Share" },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text">SocialSphere</h1>
        <p className="text-sm text-muted-foreground">Connect & Share</p>
      </div>

      {/* User Info */}
      {user && (
        <div className="mb-6 p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.firstName || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">
                  {user.firstName?.[0] || user.email?.[0] || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.email
                }
              </p>
              <div className="flex items-center space-x-2">
                <div className={user.isOnline ? "online-indicator" : "offline-indicator"} />
                <span className="text-xs text-muted-foreground">
                  {user.isOnline ? "Online" : "Away"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="w-full justify-start"
        >
          {theme === "light" ? (
            <Moon className="mr-3 h-4 w-4" />
          ) : (
            <Sun className="mr-3 h-4 w-4" />
          )}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => window.location.href = "/api/logout"}
          className="w-full justify-start text-destructive hover:text-destructive"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  );
}