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
  {
    scenario: "Security Audit Failure (Shadow Access)",
    zendesk: {
      ticket_id: "ZD-404",
      created_at: "2026-05-10T10:00:00Z",
      subject: "Security Alert: Unauthorized File Access",
      description:
        "During a routine audit, we noticed that an account belonging to Mark Stevens (m.stevens@legacy.com) modified a file in the 'M&A_Confidential' folder this morning. This is a critical security breach.",
      priority: "Critical",
      comments: ["Agent: Immediate escalation to Security Ops. Tracking via JIRA-SEC-12."],
    },
    jira: {
      issue_id: "JIRA-SEC-12",
      resolved_at: "2026-05-10T11:45:00Z",
      summary: "SSO Bypass: Legacy Local Account discovered",
      description:
        "User Mark Stevens had a local SharePoint account created manually in 2022 that was not synced to Entra ID. When his main SSO account was disabled, this local account remained active.",
      resolution:
        "Deleted local account. Running a script to identify all other non-SSO accounts in SharePoint.",
      component: "IAM-Security",
    },
  },
  {
    scenario: "Global Portal Outage (SSL Expiry)",
    zendesk: {
      ticket_id: "ZD-505",
      created_at: "2026-05-12T00:05:00Z",
      subject: "Main Portal is down - Privacy Error",
      description:
        "None of our employees can log in. Chrome is showing a 'NET::ERR_CERT_DATE_INVALID' error. This is affecting 4,000+ staff at support@globalcorp.com.",
      priority: "Critical",
      comments: ["Agent: Major incident declared. DevOps notified via JIRA-INFRA-99."],
    },
    jira: {
      issue_id: "JIRA-INFRA-99",
      resolved_at: "2026-05-12T01:30:00Z",
      summary: "Production SSL Certificate Renewal Failure",
      description:
        "The wild-card certificate for *.company.com expired at 00:00. The automated renewal bot failed because the DNS validation TXT record was missing.",
      resolution:
        "Manually renewed certificate via DigiCert and updated the Load Balancer. Verified site is back up.",
      component: "Infrastructure-DevOps",
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
  const m = text.match(/JIRA-[A-Z]*\d+|JIRA-\d+/);
  return m ? m[0] : null;
}
