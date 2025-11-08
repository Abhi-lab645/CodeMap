import { useRoute, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Code2, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { MiniProject, BigProject } from "@shared/schema";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";

export default function Theory() {
  const [, params] = useRoute("/theory/:projectId/:miniProjectId");
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  const projectId = params?.projectId;
  const miniProjectId = params?.miniProjectId;

  const { data: project } = useQuery<BigProject>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const { data: miniProject } = useQuery<MiniProject>({
    queryKey: ["/api/mini-projects", miniProjectId],
    enabled: !!miniProjectId,
  });

  const handleProceed = () => {
    navigate(`/workspace/${projectId}/${miniProjectId}`);
  };

  if (!miniProject || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/${projectId}`}>
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">
                Mini Project #{miniProject.miniId}
              </span>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-8 py-12 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/projects" className="hover:text-foreground">Projects</Link>
            <span>/</span>
            <Link href={`/dashboard/${projectId}`} className="hover:text-foreground">{project.title}</Link>
            <span>/</span>
            <span>Mini Project #{miniProject.miniId}</span>
          </div>

          <h1 className="text-4xl font-bold mb-4" data-testid="text-theory-title">
            {miniProject.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {miniProject.concepts.map((concept, idx) => (
              <Badge key={idx} variant="secondary" data-testid={`badge-concept-${idx}`}>
                {concept}
              </Badge>
            ))}
          </div>
        </div>

        <Card className="mb-8 bg-muted/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">Theory</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-line">
                {miniProject.theory}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8 mb-12">
          <h2 className="text-2xl font-semibold">Code Examples</h2>

          {miniProject.examples.map((example, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <h3 className="font-semibold">Example {idx + 1}</h3>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-lg overflow-hidden" data-testid={`example-editor-${idx}`}>
                  <Editor
                    height="250px"
                    language={project.language.toLowerCase()}
                    value={example}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: "on",
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleProceed}
            className="gap-2"
            data-testid="button-proceed"
          >
            Proceed to Mini Project
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
