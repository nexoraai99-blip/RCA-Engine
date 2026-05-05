import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Search,
  Terminal,
  Sparkles,
  AlertCircle,
  Activity,
} from "lucide-react";
import { mockData, findLinkedJiraId, type IncidentRecord } from "@/data/mockData";
import { SystemTrace, type TraceLine } from "@/components/SystemTrace";
import { IncidentCards } from "@/components/IncidentCards";
import { RcaReport } from "@/components/RcaReport";

type Phase = "idle" | "tracing" | "ready" | "synthesizing" | "report" | "error";

const Index = () => {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [record, setRecord] = useState<IncidentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const traceLines: TraceLine[] = useMemo(() => {
    if (!record) return [];
    const linked = findLinkedJiraId(record.zendesk.comments.join(" ")) ?? "—";
    return [
      { text: `Resolving Zendesk ticket → ${record.zendesk.ticket_id}`, level: "info", delay: 250 },
      { text: "Establishing read-only session · scope=support.read", level: "muted", delay: 350 },
      { text: "Applying PII scrubber · regex=email,name", level: "warn", delay: 350 },
      { text: "Ticket payload normalized", level: "ok", delay: 300 },
      { text: "Scanning agent comments for cross-system references…", level: "info", delay: 400 },
      { text: `Linked issue detected → ${linked}`, level: "ok", delay: 350 },
      { text: `Querying Jira · component=${record.jira.component}`, level: "info", delay: 400 },
      { text: "Resolution metadata fetched", level: "ok", delay: 300 },
      { text: "Correlation complete · ready for RCA synthesis", level: "ok", delay: 350 },
    ];
  }, [record]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const id = query.trim().toUpperCase();
    if (!id) return;
    const match = mockData.find((r) => r.zendesk.ticket_id.toUpperCase() === id);
    if (!match) {
      setError(`No ticket found for "${id}". Try ZD-101 or ZD-202.`);
      setPhase("error");
      setRecord(null);
      return;
    }
    setError(null);
    setRecord(match);
    setPhase("tracing");
  };

  const samples = mockData.map((r) => r.zendesk.ticket_id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">RCA Engine</div>
              <div className="text-[11px] text-muted-foreground leading-tight">
                Privacy-First Incident Post-Mortem
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 border-success/40 text-success">
              <ShieldCheck className="h-3.5 w-3.5" /> PII Scrubber: Active
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Mock Knowledge Base
            </Badge>
          </div>
        </div>
      </header>

      <main className="container py-8 lg:py-12 space-y-8">
        {/* Hero / Command Center */}
        <section className="relative overflow-hidden rounded-xl border border-border bg-card">
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          <div className="relative p-6 sm:p-10">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border border-primary/20">
                <Terminal className="h-3 w-3 mr-1" /> Command Center
              </Badge>
              <Badge variant="outline" className="gap-1 sm:hidden">
                <ShieldCheck className="h-3 w-3" /> PII Scrubber
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight max-w-2xl">
              Trace a customer ticket to its engineering fix —
              <span className="text-accent"> auto-generate the post-mortem.</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-2xl">
              Enter a Zendesk ID. The engine correlates linked Jira issues, redacts
              personal data, and drafts a publication-ready RCA report.
            </p>

            <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Zendesk Ticket ID (e.g., ZD-101)"
                  aria-label="Zendesk Ticket ID"
                  className="pl-9 h-11 font-mono-terminal text-sm bg-background"
                />
              </div>
              <Button type="submit" size="lg" className="h-11 gap-2">
                <Activity className="h-4 w-4" /> Run System Trace
              </Button>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Try:</span>
              {samples.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="font-mono-terminal px-2 py-0.5 rounded border border-border bg-muted/50 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            {phase === "error" && error && (
              <div className="mt-5 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 text-destructive px-3 py-2 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </section>

        {/* Trace */}
        {phase !== "idle" && phase !== "error" && record && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                System Trace
              </h2>
              <span className="font-mono-terminal text-[11px] text-muted-foreground">
                scenario · {record.scenario}
              </span>
            </div>
            <SystemTrace
              key={record.zendesk.ticket_id}
              active={true}
              lines={traceLines}
              onComplete={() => setPhase((p) => (p === "tracing" ? "ready" : p))}
            />
          </section>
        )}

        {/* Comparison */}
        {(phase === "ready" || phase === "synthesizing" || phase === "report") && record && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Comparison View
              </h2>
              <Badge variant="outline" className="gap-1 text-success border-success/30">
                <ShieldCheck className="h-3 w-3" /> Redacted
              </Badge>
            </div>
            <IncidentCards record={record} />

            {phase === "ready" && (
              <div className="flex justify-center pt-2">
                <Button
                  size="lg"
                  onClick={() => {
                    setPhase("synthesizing");
                    setTimeout(() => setPhase("report"), 1800);
                  }}
                  className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate RCA Post-Mortem
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Synthesizing loader */}
        {phase === "synthesizing" && record && (
          <section className="space-y-3 animate-fade-in">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Synthesizing Report
            </h2>
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-9 w-9 rounded-md bg-accent/10 text-accent flex items-center justify-center">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Drafting post-mortem…</div>
                  <div className="text-xs text-muted-foreground font-mono-terminal">
                    correlating · scrubbing · formatting markdown
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted relative">
                  <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  {["Summary", "Root Cause", "Action Items"].map((s, i) => (
                    <div
                      key={s}
                      className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs font-mono-terminal text-muted-foreground flex items-center gap-2"
                      style={{ animation: `fade-in 0.4s ease-out ${i * 0.25}s both` }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      generating · {s.toLowerCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Report */}
        {phase === "report" && record && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              AI RCA Report
            </h2>
            <RcaReport record={record} />
          </section>
        )}
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© RCA Engine · Internal IT Operations Tool</span>
          <span className="font-mono-terminal">
            v0.1.0 · mock-kb · pii-scrubber=on
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
