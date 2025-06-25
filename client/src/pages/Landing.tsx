import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  Users, 
  Monitor, 
  BarChart3, 
  Gavel, 
  BookOpen,
  Zap,
  Globe,
  Shield
} from "lucide-react";

export function Landing() {
  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Instant messaging with friends and groups across India"
    },
    {
      icon: Users,
      title: "Friend Network",
      description: "Send friend requests and build your social network"
    },
    {
      icon: Monitor,
      title: "Screen Sharing",
      description: "Share your screen for presentations and collaboration"
    },
    {
      icon: BookOpen,
      title: "Stories",
      description: "Share temporary stories that disappear after 24 hours"
    },
    {
      icon: BarChart3,
      title: "Polls & Surveys",
      description: "Create and participate in community polls"
    },
    {
      icon: Gavel,
      title: "Auctions",
      description: "Buy and sell items through live bidding"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time communication with minimal latency"
    },
    {
      icon: Globe,
      title: "Pan-India Access",
      description: "Connect with friends anywhere in India"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"></div>
            <h1 className="text-2xl font-bold gradient-text">SocialSphere</h1>
          </div>
          <Button onClick={() => window.location.href = "/api/login"} className="gradient-bg">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Connect. Share. Collaborate.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            SocialSphere brings people together across India with real-time chat, screen sharing, 
            interactive polls, auctions, and more - all in one unified platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = "/api/login"}
              className="gradient-bg text-lg px-8 py-6"
            >
              Join SocialSphere
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stay connected and engaged with your community
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl mx-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose SocialSphere?</h2>
          <p className="text-lg text-muted-foreground">
            Built for the modern Indian social experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users already connecting on SocialSphere
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = "/api/login"}
            className="gradient-bg text-lg px-8 py-6"
          >
            Sign In to Continue
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2025 SocialSphere. Built for connecting people across India.</p>
        </div>
      </footer>
    </div>
  );
}