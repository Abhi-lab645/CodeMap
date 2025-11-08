import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { BadgeCard } from "@/components/badge-card";
import { Code2, LogOut, Award, TrendingUp, Target, Zap, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import type { UserProgress, Badge, UserBadge, User } from "@shared/schema";

export default function Profile() {
  const [, navigate] = useLocation();
  const { user: authUser, logout } = useAuth();

  const { data: user } = useQuery<Omit<User, 'password'>>({
    queryKey: ["/api/auth/me"],
    enabled: !!authUser,
  });

  const { data: allProgress } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress"],
    enabled: !!authUser,
  });

  const { data: badges } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
  });

  const { data: userBadges } = useQuery<UserBadge[]>({
    queryKey: ["/api/user-badges"],
    enabled: !!authUser,
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalCompleted = allProgress?.reduce(
    (sum, p) => sum + p.completedMiniIds.length,
    0
  ) || 0;

  const earnedBadgeIds = new Set(userBadges?.map((ub) => ub.badgeId) || []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-8">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">CodeMap</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost">Projects</Button>
            </Link>
            <ThemeToggle />
            <Button variant="ghost" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-user-name">
            {user?.name}
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-user-email">
            {user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total XP
              </CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-xp">
                {user?.totalXp || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Experience points
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-2 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Streak
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-current-streak">
                {user?.currentStreak || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Days in a row
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-completed-count">
                {totalCompleted}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Mini projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Projects
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-projects-started">
                {allProgress?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                In progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Badges
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-badges-earned">
                {userBadges?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Unlocked
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Your Projects</h2>
          {allProgress && allProgress.length > 0 ? (
            <div className="space-y-4">
              {allProgress.map((progress) => {
                const percentage =
                  (progress.completedMiniIds.length /
                    (progress.currentMiniId || 1)) *
                  100;
                return (
                  <Card key={progress.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Project Progress</CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {progress.completedMiniIds.length} completed
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={percentage} className="mb-2" />
                      <Link href={`/dashboard/${progress.bigProjectId}`}>
                        <Button variant="ghost" size="sm" className="mt-2">
                          Continue Learning
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't started any projects yet
              </p>
              <Link href="/projects">
                <Button>Browse Projects</Button>
              </Link>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Badges & Achievements</h2>
          {badges && badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {badges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  icon={badge.icon}
                  earned={earnedBadgeIds.has(badge.id)}
                  earnedAt={
                    userBadges?.find((ub) => ub.badgeId === badge.id)?.earnedAt
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No badges available yet</p>
          )}
        </div>
      </main>
    </div>
  );
}
