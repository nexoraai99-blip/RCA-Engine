import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";

export interface TraceLine {
  text: string;
  level?: "info" | "ok" | "warn" | "muted";
  delay?: number;
}

interface Props {
  active: boolean;
  lines: TraceLine[];
  onComplete?: () => void;
}

export const SystemTrace = ({ active, lines, onComplete }: Props) => {
  const [shown, setShown] = useState<TraceLine[]>([]);
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setShown([]);
      setProgress(0);
      completedRef.current = false;
      return;
    }
    let cancelled = false;
    let i = 0;
    const total = lines.length;

    const run = async () => {
      for (const line of lines) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, line.delay ?? 350));
        if (cancelled) return;
        setShown((s) => [...s, line]);
        i += 1;
        setProgress(Math.round((i / total) * 100));
      }
      if (!cancelled && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [shown]);

  const colorFor = (lvl?: TraceLine["level"]) => {
    switch (lvl) {
      case "ok":
        return "text-terminal-accent";
      case "warn":
        return "text-terminal-warning";
      case "muted":
        return "text-terminal-muted";
      default:
        return "text-terminal-info";
    }
  };

  const ts = (i: number) => {
    const d = new Date(Date.now() + i * 73);
    return d.toISOString().split("T")[1]?.slice(0, 12) ?? "";
  };

  return (
    <div className="rounded-lg border border-border bg-terminal-bg overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
          <span className="ml-3 font-mono-terminal text-xs text-terminal-muted">
            rca-engine · system-trace
          </span>
        </div>
        <span className="font-mono-terminal text-[10px] text-terminal-muted">
          {progress}%
        </span>
      </div>

      <div
        ref={ref}
        className="font-mono-terminal text-xs p-4 h-56 overflow-y-auto text-terminal-fg"
      >
        {shown.map((l, i) => (
          <div key={i} className="flex gap-3 leading-6">
            <span className="text-terminal-muted shrink-0">{ts(i)}</span>
            <span className={colorFor(l.level)}>
              {l.level === "ok" ? "✓ " : l.level === "warn" ? "! " : "› "}
              {l.text}
            </span>
          </div>
        ))}
        {active && progress < 100 && (
          <div className="flex gap-3 leading-6 text-terminal-muted">
            <span>{ts(shown.length)}</span>
            <span className="terminal-cursor">›</span>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-white/5 bg-black/20">
        <Progress value={progress} className="h-1" />
      </div>
    </div>
  );
};
