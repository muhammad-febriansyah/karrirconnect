import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function GradientText({ 
  children, 
  className = "",
  gradient = "from-[#2347F9] via-[#4F65FF] to-[#7B8CFF]"
}: GradientTextProps) {
  return (
    <span 
      className={cn(
        `bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-bold`,
        className
      )}
    >
      {children}
    </span>
  );
}