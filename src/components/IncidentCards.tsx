import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Headphones, Wrench, Clock, Tag } from "lucide-react";
import type { IncidentRecord } from "@/data/mockData";
import { scrubPII } from "@/data/mockData";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const priorityVariant = (p: string) => {
  const v = p.toLowerCase();
  if (v === "urgent") return "bg-destructive text-destructive-foreground";
  if (v === "high") return "bg-warning text-warning-foreground";
  return "bg-secondary text-secondary-foreground";
};

export const IncidentCards = ({ record }: { record: IncidentRecord }) => {
  const { zendesk, jira } = record;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-accent/10 text-accent flex items-center justify-center">
                <Headphones className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Zendesk · Symptom
                </CardTitle>
                <div className="text-base font-mono-terminal font-semibold">
                  {zendesk.ticket_id}
                </div>
              </div>
            </div>
            <Badge className={priorityVariant(zendesk.priority)}>
              {zendesk.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Subject
            </div>
            <div className="font-medium">{zendesk.subject}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Customer description
            </div>
            <p className="text-foreground/90 leading-relaxed">
              {scrubPII(zendesk.description)}
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Agent comments
            </div>
            <ul className="space-y-1">
              {zendesk.comments.map((c, i) => (
                <li
                  key={i}
                  className="font-mono-terminal text-xs bg-muted/60 rounded px-2 py-1.5 border border-border"
                >
                  {scrubPII(c)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <Clock className="h-3.5 w-3.5" /> Opened {fmt(zendesk.created_at)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Wrench className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Jira · Technical Fix
                </CardTitle>
                <div className="text-base font-mono-terminal font-semibold">
                  {jira.issue_id}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="gap-1">
              <Tag className="h-3 w-3" /> {jira.component}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Summary
            </div>
            <div className="font-medium">{jira.summary}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Root cause
            </div>
            <p className="text-foreground/90 leading-relaxed">
              {jira.description}
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Resolution
            </div>
            <p className="font-mono-terminal text-xs bg-muted/60 rounded px-2 py-1.5 border border-border">
              {jira.resolution}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <Clock className="h-3.5 w-3.5" /> Resolved {fmt(jira.resolved_at)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
