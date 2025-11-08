import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, Layers } from "lucide-react";
import { SiPython, SiJavascript, SiCplusplus, SiReact, SiNodedotjs } from "react-icons/si";
import type { BigProject } from "@shared/schema";

const languageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Python: SiPython,
  JavaScript: SiJavascript,
  "C++": SiCplusplus,
  React: SiReact,
  "Node.js": SiNodedotjs,
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  Intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  Advanced: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

type ProjectCardProps = {
  project: BigProject;
  onStart?: (projectId: string) => void;
};

export function ProjectCard({ project, onStart }: ProjectCardProps) {
  const LanguageIcon = languageIcons[project.language] || Code2;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm bg-card/50 border-2">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <LanguageIcon className="w-8 h-8" />
          </div>
          <Badge
            variant="outline"
            className={difficultyColors[project.difficulty]}
            data-testid={`badge-difficulty-${project.id}`}
          >
            {project.difficulty}
          </Badge>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2" data-testid={`text-project-title-${project.id}`}>
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="w-4 h-4" />
          <span data-testid={`text-mini-count-${project.id}`}>
            {project.totalMiniProjects} Mini Projects
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onStart?.(project.id)}
          className="w-full"
          data-testid={`button-start-${project.id}`}
        >
          Start Learning
        </Button>
      </CardFooter>
    </Card>
  );
}
