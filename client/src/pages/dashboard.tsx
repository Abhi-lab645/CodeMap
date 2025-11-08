import { useLocation, useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProgressRing } from "@/components/progress-ring";
import { MiniProjectCard } from "@/components/mini-project-card";
import { Code2, ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { BigProject, MiniProject, UserProgress } from "@shared/schema";
import { useAuth } from "@/lib/auth-context";

export default function Dashboard() {
  const [, params] = useRoute("/dashboard/:projectId");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const projectId = params?.projectId;

  const { data: project, isLoading: projectLoading } = useQuery<BigProject>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const { data: miniProjects, isLoading: miniProjectsLoading } = useQuery<MiniProject[]>({
    queryKey: ["/api/projects", projectId, "mini-projects"],
    enabled: !!projectId,
  });

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/progress", projectId],
    enabled: !!projectId && !!user,
  });

  const completedCount = progress?.completedMiniIds?.length || 0;
  const totalCount = project?.totalMiniProjects || 1;
  const completionPercentage = (completedCount / totalCount) * 100;

  const getMiniProjectStatus = (miniId: number) => {
    if (!progress) return "locked";
    
    const completedIds = progress.completedMiniIds.map(id => parseInt(id));
    if (completedIds.includes(miniId)) return "completed";
    
    if (progress.currentMiniId === miniId) return "in-progress";
    
    if (miniId === 1 || completedIds.includes(miniId - 1)) return "available";
    
    return "locked";
  };

  const handleMiniProjectClick = (miniProject: MiniProject) => {
    const status = getMiniProjectStatus(miniProject.miniId);
    if (status !== "locked") {
      navigate(`/theory/${projectId}/${miniProject.id}`);
    }
  };

  if (projectLoading || miniProjectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Project not found</p>
          <Link href="/projects">
            <Button>Browse Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
              <Code2 className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">CodeMap</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" data-testid="button-profile">
                Profile
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12 max-w-7xl">
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4" data-testid="text-project-title">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {project.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold">
                  {project.language}
                </div>
                <div className="px-4 py-2 rounded-lg bg-muted">
                  {project.difficulty}
                </div>
              </div>
            </div>

            <div className="lg:text-center">
              <ProgressRing progress={completionPercentage} />
              <p className="mt-4 text-muted-foreground">
                {completedCount} of {totalCount} completed
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Learning Path</h2>
          <div className="space-y-4">
            {miniProjects?.map((miniProject) => (
              <MiniProjectCard
                key={miniProject.id}
                miniId={miniProject.miniId}
                title={miniProject.title}
                concepts={miniProject.concepts}
                status={getMiniProjectStatus(miniProject.miniId)}
                onClick={() => handleMiniProjectClick(miniProject)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
