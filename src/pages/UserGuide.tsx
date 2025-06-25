import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LogIn, 
  MessageCircle, 
  Users, 
  Monitor, 
  BookOpen,
  BarChart3,
  Gavel,
  UserPlus,
  Send,
  Eye,
  Vote,
  DollarSign
} from "lucide-react";

export function UserGuide() {
  const steps = [
    {
      icon: LogIn,
      title: "Getting Started",
      description: "Sign in using your Replit account",
      details: [
        "Click 'Get Started' on the landing page",
        "You'll be redirected to Replit for secure authentication",
        "After signing in, you'll see your personalized dashboard"
      ]
    },
    {
      icon: Users,
      title: "Finding Friends",
      description: "Connect with people across India",
      details: [
        "Go to the Friends section in the sidebar",
        "Search for users by email or username",
        "Send friend requests to connect",
        "Accept incoming friend requests to build your network"
      ]
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Instant messaging with your friends",
      details: [
        "Click Chat in the sidebar to see your conversations",
        "Start a new chat by selecting a friend",
        "Type messages and see typing indicators",
        "Send text, images, or files instantly"
      ]
    },
    {
      icon: BookOpen,
      title: "Sharing Stories",
      description: "Post content that disappears in 24 hours",
      details: [
        "Navigate to Stories section",
        "Click 'Create Story' to share what's happening",
        "Add text, images, or both to your story",
        "Stories automatically expire after 24 hours"
      ]
    },
    {
      icon: BarChart3,
      title: "Creating Polls",
      description: "Get opinions from your community",
      details: [
        "Go to Polls section and click 'Create Poll'",
        "Add your question and multiple choice options",
        "Set expiration time (optional)",
        "Share with friends and see live voting results"
      ]
    },
    {
      icon: Gavel,
      title: "Live Auctions",
      description: "Buy and sell items through bidding",
      details: [
        "Visit Auctions to see active listings",
        "Create new auction by adding item details",
        "Set starting price and auction duration",
        "Place bids on items you want to buy"
      ]
    },
    {
      icon: Monitor,
      title: "Screen Sharing",
      description: "Share your screen for presentations",
      details: [
        "Go to Screen Share section",
        "Create a new session with a title",
        "Share the room code with participants",
        "Start sharing your screen for collaboration"
      ]
    }
  ];

  const features = [
    {
      icon: UserPlus,
      title: "Friend Network",
      description: "Build connections across India with secure friend requests"
    },
    {
      icon: Send,
      title: "Instant Messaging",
      description: "Real-time chat with typing indicators and message delivery"
    },
    {
      icon: Eye,
      title: "Online Status",
      description: "See when your friends are online and available to chat"
    },
    {
      icon: Vote,
      title: "Live Voting",
      description: "Participate in polls with real-time result updates"
    },
    {
      icon: DollarSign,
      title: "Real-time Bidding",
      description: "Auction items with live price updates and notifications"
    },
    {
      icon: Monitor,
      title: "Screen Collaboration",
      description: "Share screens for presentations and remote collaboration"
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">
          How to Use SocialSphere
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your complete guide to connecting, sharing, and collaborating with friends across India
        </p>
      </div>

      {/* Quick Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features at a Glance</CardTitle>
          <CardDescription>
            Everything you can do with SocialSphere
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <feature.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step-by-step Guide */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Step-by-Step Guide</h2>
        
        <div className="grid gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {index + 1}. {step.title}
                    </CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <Card className="gradient-bg text-white">
        <CardHeader>
          <CardTitle className="text-white">Pro Tips for Better Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Privacy & Security</h4>
              <ul className="space-y-1 opacity-90">
                <li>• Your data is secure with Replit authentication</li>
                <li>• Only friends can see your online status</li>
                <li>• Stories automatically expire for privacy</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Best Practices</h4>
              <ul className="space-y-1 opacity-90">
                <li>• Keep your profile updated with a photo</li>
                <li>• Use descriptive titles for polls and auctions</li>
                <li>• Share screen session codes only with trusted users</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started CTA */}
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-4">Ready to Start Connecting?</h3>
        <p className="text-muted-foreground mb-6">
          Join thousands of users already building their social network on SocialSphere
        </p>
        <Button size="lg" className="gradient-bg">
          Start Using SocialSphere
        </Button>
      </div>
    </div>
  );
}