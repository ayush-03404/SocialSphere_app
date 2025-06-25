import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Users, 
  BarChart3, 
  Gavel, 
  Monitor, 
  BookOpen,
  Plus,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export function Home() {
  const { user } = useAuth();

  const { data: friends } = useQuery({
    queryKey: ["/api/friends"],
  });

  const { data: stories } = useQuery({
    queryKey: ["/api/stories"],
  });

  const { data: polls } = useQuery({
    queryKey: ["/api/polls"],
  });

  const { data: auctions } = useQuery({
    queryKey: ["/api/auctions"],
  });

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Start Chat",
      description: "Message your friends",
      href: "/chat",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Find Friends",
      description: "Connect with people",
      href: "/friends",
      color: "bg-green-500"
    },
    {
      icon: BookOpen,
      title: "Share Story",
      description: "What's happening?",
      href: "/stories",
      color: "bg-purple-500"
    },
    {
      icon: BarChart3,
      title: "Create Poll",
      description: "Get opinions",
      href: "/polls",
      color: "bg-orange-500"
    },
    {
      icon: Gavel,
      title: "New Auction",
      description: "Sell something",
      href: "/auctions",
      color: "bg-red-500"
    },
    {
      icon: Monitor,
      title: "Screen Share",
      description: "Share your screen",
      href: "/screen-share",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="gradient-bg text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName || "Friend"}! 👋
        </h1>
        <p className="opacity-90">
          Ready to connect and share with your network?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{friends?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Friends</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{stories?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Active Stories</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{polls?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Live Polls</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Gavel className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{auctions?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Live Auctions</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Jump into any activity with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-transform"
                >
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Stories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Recent Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stories && stories.length > 0 ? (
              <div className="space-y-3">
                {stories.slice(0, 3).map((story: any) => (
                  <div key={story.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">{story.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No stories yet</p>
                <Link href="/stories">
                  <Button variant="link" className="mt-2">Create your first story</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trending Polls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Trending Polls
            </CardTitle>
          </CardHeader>
          <CardContent>
            {polls && polls.length > 0 ? (
              <div className="space-y-3">
                {polls.slice(0, 3).map((poll: any) => (
                  <div key={poll.id} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">{poll.question}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{poll.options.length} options</span>
                      <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No polls yet</p>
                <Link href="/polls">
                  <Button variant="link" className="mt-2">Create your first poll</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}