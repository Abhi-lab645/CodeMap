import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Code2, Layers, TrendingUp, Users, Zap, BookOpen } from "lucide-react";
import { SiPython, SiJavascript, SiCplusplus, SiReact } from "react-icons/si";
import heroImage from "@assets/generated_images/Students_coding_collaboration_hero_17472bec.png";
import { useAuth } from "@/lib/auth-context";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-8">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">CodeMap</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/projects" className="text-sm font-medium hover:text-primary transition-colors">
              Explore Projects
            </Link>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/profile">
                <Button data-testid="button-profile">Profile</Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button data-testid="button-login">Login / Signup</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[SiPython, SiJavascript, SiCplusplus, SiReact].map((Icon, idx) => (
            <Icon
              key={idx}
              className="absolute w-12 h-12 text-white/10 animate-float"
              style={{
                left: `${20 + idx * 25}%`,
                top: `${30 + idx * 10}%`,
                animationDelay: `${idx * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-3xl p-12 border border-white/20 shadow-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Learn Programming by Building
                <span className="block text-primary mt-2">Real Projects</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Master coding through hundreds of interconnected mini-projects.
                One step at a time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={isAuthenticated ? "/projects" : "/auth"}>
                  <Button
                    size="lg"
                    className="text-lg px-8"
                    data-testid="button-start-learning"
                  >
                    Start Learning
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20"
                    data-testid="button-browse-projects"
                  >
                    Browse Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8" id="about">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why CodeMap?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: "Structured Learning Path",
                description:
                  "Break down complex projects into 300-500 digestible mini-projects",
              },
              {
                icon: BookOpen,
                title: "Theory + Practice",
                description:
                  "Learn concepts with examples before applying them in code",
              },
              {
                icon: TrendingUp,
                title: "Track Progress",
                description:
                  "Visual progress tracking and achievement badges keep you motivated",
              },
              {
                icon: Zap,
                title: "Live Code Editor",
                description:
                  "Write and test code directly in your browser with instant feedback",
              },
              {
                icon: Users,
                title: "AI Tutor Support",
                description:
                  "Get help anytime with our AI-powered coding assistant",
              },
              {
                icon: Code2,
                title: "Real-World Projects",
                description:
                  "Build complete applications like e-commerce sites, chatbots, and more",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-all hover:scale-105"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of learners building real projects one mini-project at a time
          </p>
          <Link href={isAuthenticated ? "/projects" : "/auth"}>
            <Button size="lg" className="text-lg px-12" data-testid="button-get-started">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-12 px-8 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 CodeMap. Learn by building.</p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
