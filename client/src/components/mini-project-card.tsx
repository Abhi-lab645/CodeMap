import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, Circle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type MiniProjectCardProps = {
  miniId: number;
  title: string;
  concepts: string[];
  status: "locked" | "available" | "in-progress" | "completed";
  onClick?: () => void;
};

export function MiniProjectCard({
  miniId,
  title,
  concepts,
  status,
  onClick,
}: MiniProjectCardProps) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isInProgress = status === "in-progress";

  const StatusIcon = isCompleted
    ? CheckCircle2
    : isInProgress
    ? Play
    : isLocked
    ? Lock
    : Circle;

  return (
    <Card
      className={cn(
        "hover-elevate active-elevate-2 cursor-pointer transition-all",
        isLocked && "opacity-50 cursor-not-allowed grayscale",
        isInProgress && "border-2 border-primary",
        isCompleted && "bg-green-500/5 border-green-500/20"
      )}
      onClick={() => !isLocked && onClick?.()}
      data-testid={`card-mini-project-${miniId}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm",
              isCompleted
                ? "bg-green-500 text-white"
                : isInProgress
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            #{miniId}
          </div>
          <div>
            <h3 className="font-semibold text-base" data-testid={`text-title-${miniId}`}>
              {title}
            </h3>
          </div>
        </div>
        <StatusIcon
          className={cn(
            "w-5 h-5",
            isCompleted && "text-green-500",
            isInProgress && "text-primary animate-pulse"
          )}
          data-testid={`icon-status-${miniId}`}
        />
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {concepts.slice(0, 3).map((concept, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {concept}
            </Badge>
          ))}
          {concepts.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{concepts.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
