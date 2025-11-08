import { Card, CardContent } from "@/components/ui/card";
import { Award, Trophy, Star, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Trophy,
  Star,
  Target,
  Zap,
};

type BadgeCardProps = {
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
};

export function BadgeCard({
  name,
  description,
  icon,
  earned,
  earnedAt,
}: BadgeCardProps) {
  const IconComponent = badgeIcons[icon] || Award;

  return (
    <Card
      className={cn(
        "text-center transition-all",
        earned
          ? "border-2 border-primary bg-primary/5 hover:scale-105"
          : "opacity-50 grayscale"
      )}
      data-testid={`card-badge-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardContent className="pt-8 pb-6 px-6">
        <div
          className={cn(
            "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4",
            earned
              ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
              : "bg-muted text-muted-foreground"
          )}
        >
          <IconComponent className="w-8 h-8" />
        </div>
        <h3 className="font-semibold mb-1" data-testid={`text-badge-name-${name.toLowerCase().replace(/\s+/g, "-")}`}>
          {name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
        {earned && earnedAt && (
          <p className="text-xs text-primary font-medium">
            Earned {new Date(earnedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
