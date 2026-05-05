export interface IncidentRecord {
  scenario: string;
  zendesk: {
    ticket_id: string;
    created_at: string;
    subject: string;
    description: string;
    priority: string;
    comments: string[];
  };
  jira: {
    issue_id: string;
    resolved_at: string;
    summary: string;
    description: string;
    resolution: string;
    component: string;
  };
}

export const mockData: IncidentRecord[] = [
  {
    scenario: "Integration Sync Error",
    zendesk: {
      ticket_id: "ZD-101",
      created_at: "2026-05-01T09:00:00Z",
      subject: "Account shows 'Free' after upgrading to 'Pro'",
      description:
        "I paid for the Pro plan. My card was charged, but my dashboard still says 'Free'. Urgent! Contact me at jane.doe@example.com.",
      priority: "High",
      comments: ["Agent: Verified in Stripe. Linked to JIRA-771."],
    },
    jira: {
      issue_id: "JIRA-771",
      resolved_at: "2026-05-01T11:30:00Z",
      summary: "Stripe Webhook Listener: 500 Error",
      description:
        "Database migration renamed 'customer_id' to 'account_id'. Webhook failed.",
      resolution: "Updated service class to reference 'account_id'.",
      component: "Payments-API",
    },
  },
  {
    scenario: "SharePoint Permission Issue",
    zendesk: {
      ticket_id: "ZD-202",
      created_at: "2026-05-03T14:00:00Z",
      subject: "Missing Confidential folder",
      description:
        "HR Director here (hr.director@corp.io). I cannot see the Employee_Records folder in SharePoint.",
      priority: "Urgent",
      comments: ["Agent: Permissions look correct in Entra ID. Raising JIRA-402."],
    },
    jira: {
      issue_id: "JIRA-402",
      resolved_at: "2026-05-03T16:15:00Z",
      summary: "SharePoint Site Inheritance Broken",
      description:
        "Unique Permissions were enabled by mistake, removing the HR-Admin group.",
      resolution: "Re-added HR-Admin group and re-enabled inheritance.",
      component: "Infrastructure",
    },
  },
];

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const NAME_HINT_RE = /\b(?:Mr|Mrs|Ms|Dr)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g;

export function scrubPII(text: string): string {
  return text
    .replace(EMAIL_RE, "[REDACTED_EMAIL]")
    .replace(NAME_HINT_RE, "[REDACTED_NAME]");
}

export function findLinkedJiraId(text: string): string | null {
  const m = text.match(/JIRA-\d+/);
  return m ? m[0] : null;
}
