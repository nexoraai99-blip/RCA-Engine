# RCA Engine 🚀
**Automated Root Cause Analysis for Modern Support & Engineering Workflows**

The **RCA Engine** is an agentic workflow tool designed to eliminate the manual overhead of incident reporting. By bridging the data gap between **Zendesk** and **Jira**, it autonomously generates professional, data-driven Root Cause Analysis (RCA) reports from a single ticket ID.

---

## 🌟 Key Features
*   **Agentic Data Extraction:** Input a Zendesk Ticket ID to trigger an autonomous search and retrieval of linked Jira issues, comments, and status changes.
*   **Privacy-First Architecture:** Integrated PII-scrubbing layers ensure that sensitive customer data is sanitized before report generation.
*   **SLA & Metrics Tracking:** Automatically calculates response times and identifies communication bottlenecks between teams using custom logic.
*   **Synthetic Data Pipeline:** Includes a custom pipeline for testing edge cases without risking live production data.
*   **Professional Dashboard:** A sleek, responsive UI built for managers to review and export post-mortem reports.

---

## 🛡️ PII Scrubbing & Data Privacy
To ensure compliance with global privacy standards (like GDPR and CCPA), the RCA Engine includes a robust **PII (Personally Identifiable Information) Sanitization Layer**. Before any ticket data is processed, it undergoes:

*   **Regex-Based Masking:** Automatically identifies and masks email addresses, phone numbers, and IP addresses.
*   **Named Entity Recognition (NER):** Detects and redacts human names and physical addresses from ticket comments.
*   **Entropy-Based Filtering:** Identifies potential API keys or passwords accidentally pasted into logs.

> **Privacy Note:** The scrubbing logic is applied locally within the data pipeline. Raw customer data is never sent to external LLMs or synthesis services.

---

## 📊 SLA & Performance Metrics
The engine quantifies the impact of every incident by calculating key performance indicators:

*   **Time to Engineering (TTE):** The delta between the Zendesk ticket creation and the first linked Jira issue creation.
    $$TTE = T_{Jira\_Created} - T_{ZD\_Created}$$

*   **Mean Time to Resolution (MTTR):** The total duration from initial report to the final "Solved" status.
    $$MTTR = T_{ZD\_Solved} - T_{ZD\_Created}$$

*   **Communication Latency:** Measures the average delay between a customer update in Zendesk and a corresponding internal action in Jira.

---

## 🛠️ Tech Stack
*   **Frontend:** React, Tailwind CSS
*   **Workflow Logic:** Agentic AI Framework
*   **Icons:** Lucide React
*   **Deployment:** Optimized for Vercel/Netlify

---
📈 Business Impact
This tool solves the "Communication Black Hole" where support teams lose visibility once a bug is escalated. By automating the feedback loop, the RCA Engine reduces the time spent on manual post-mortems by up to 80%, allowing engineering teams to focus on resolution rather than documentation.

🛠️ Key Technical Challenges Overcome
Asynchronous Mapping: Solved the complexity of one Zendesk ticket mapping to multiple Jira sub-tasks and tracking their individual statuses.

Synthetic Data Generation: Developed a custom MockService that generates realistic, non-sensitive data for demonstration purposes, allowing the engine to be showcased without exposing live production environments.
---

## 📁 Project Structure
```text
├── src
│   ├── components      # UI components (Dashboards, Report Cards)
│   ├── hooks           # Custom React hooks for data fetching
│   ├── lib             # PII scrubbing and utility functions
│   └── services        # Mock API / Synthetic data pipelines
├── public              # Static assets
└── docs                # Sample generated RCA reports
