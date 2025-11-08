import { useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Code2, ArrowLeft, Check, Lightbulb, Terminal } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { MiniProject, BigProject } from "@shared/schema";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export default function Workspace() {
  const [, params] = useRoute("/workspace/:projectId/:miniProjectId");
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  const { toast } = useToast();
  const projectId = params?.projectId;
  const miniProjectId = params?.miniProjectId;

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [taskOpen, setTaskOpen] = useState(true);

  const { data: project } = useQuery<BigProject>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const { data: miniProject } = useQuery<MiniProject>({
    queryKey: ["/api/mini-projects", miniProjectId],
    enabled: !!miniProjectId,
    select: (data) => {
      if (data && !code) {
        setCode(data.codeTemplate);
      }
      return data;
    },
  });

  const completeMutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/progress/complete", {
        bigProjectId: projectId,
        miniProjectId: miniProjectId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Mini Project Completed!",
        description: "Great job! Moving to next challenge.",
      });
      navigate(`/dashboard/${projectId}`);
    },
  });

  const handleRunCode = () => {
    setOutput("Code execution simulated. Output:\n" + (miniProject?.expectedOutput || "Success!"));
  };

  if (!miniProject || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/${projectId}`}>
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                #{miniProject.miniId}
              </div>
              <h1 className="text-lg font-semibold" data-testid="text-workspace-title">
                {miniProject.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isPending}
              data-testid="button-mark-complete"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-[3] flex flex-col border-r">
          <Collapsible open={taskOpen} onOpenChange={setTaskOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-4 border-b hover-elevate cursor-pointer">
                <h2 className="font-semibold">Task Description</h2>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    taskOpen ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 bg-muted/50">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{miniProject.taskDescription}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {miniProject.concepts.map((concept, idx) => (
                    <Badge key={idx} variant="secondary">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex-1 overflow-hidden" data-testid="code-editor">
            <Editor
              height="100%"
              language={project.language.toLowerCase()}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={theme === "dark" ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>

        <div className="flex-[2] flex flex-col">
          <Tabs defaultValue="output" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="output" data-testid="tab-output">
                <Terminal className="w-4 h-4 mr-2" />
                Output
              </TabsTrigger>
              <TabsTrigger value="hints" data-testid="tab-hints">
                <Lightbulb className="w-4 h-4 mr-2" />
                Hints
              </TabsTrigger>
            </TabsList>

            <TabsContent value="output" className="flex-1 p-4 m-0 overflow-auto">
              <div className="mb-4">
                <Button onClick={handleRunCode} data-testid="button-run-code">
                  Run Code
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <pre className="font-mono text-sm whitespace-pre-wrap" data-testid="text-output">
                    {output || "Click 'Run Code' to see output"}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hints" className="flex-1 p-4 m-0 overflow-auto">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <p className="text-sm whitespace-pre-line" data-testid="text-hint">
                      {miniProject.hint}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
