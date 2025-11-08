import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AITutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI programming tutor powered by GPT-4. Ask me anything about coding, debugging, or the concepts you're learning!",
    },
  ]);
  const [input, setInput] = useState("");
  const [location] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract context from current URL
  // Expected URL patterns:
  // /theory/:projectId/:miniProjectId -> [empty, 'theory', projectId, miniProjectId]
  // /workspace/:projectId/:miniProjectId -> [empty, 'workspace', projectId, miniProjectId]
  const getContext = () => {
    const pathParts = location.split("/").filter(Boolean); // Remove empty strings
    if (pathParts[0] === "theory" || pathParts[0] === "workspace") {
      return {
        bigProjectId: pathParts[1] || undefined,
        miniProjectId: pathParts[2] || undefined,
      };
    }
    return undefined;
  };

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => {
      const context = getContext();
      return apiRequest("POST", "/api/tutor", { message, context });
    },
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    sendMessageMutation.mutate(input);
    setInput("");
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-xl z-50"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-ai-tutor-toggle"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-8 w-96 h-[500px] shadow-2xl z-40 backdrop-blur-lg bg-card/95 border-2">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Tutor
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by GPT-4 • Context-aware help
            </p>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[calc(500px-80px)]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                      data-testid={`text-message-${idx}`}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              code: ({ node, className, children, ...props }: any) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match;
                                return isInline ? (
                                  <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto my-2">
                                    <code className={`text-xs font-mono ${className || ''}`} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                );
                              },
                              p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc pl-4 my-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-4 my-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="ml-2">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                ))}
                {sendMessageMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask CodeMap Tutor anything..."
                  disabled={sendMessageMutation.isPending}
                  data-testid="input-ai-tutor"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={sendMessageMutation.isPending || !input.trim()}
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
