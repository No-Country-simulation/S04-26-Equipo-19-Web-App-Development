# S04-26-Equipo-19-Web-App-Development
# OpsCore - Incident Management System

OpsCore is an incident management system designed to digitize and improve operational processes inside industrial plants.

The platform allows operators to report failures, accidents, or quality deviations from any device, while supervisors and managers can track resolution progress, assign responsibilities, measure response times, and analyze recurring root causes.

This project is part of a No Country simulation focused on building a real-world prototype for an operations consulting scenario.

---

## Problem

Industrial incidents are often reported using paper forms, WhatsApp messages, or informal communication channels.

This creates several operational issues:

- Lack of traceability
- No centralized incident history
- Difficulty measuring response and resolution times
- Repeated root causes without structured analysis
- Poor visibility for supervisors and plant managers
- Delays in communication between operators, supervisors, and technicians

OpsCore aims to solve these problems by providing a centralized, mobile-friendly, and data-driven incident management platform.

---

## Objective

Build a prototype that allows an industrial plant to:

- Report incidents from any device
- Track incidents through different resolution stages
- Assign responsible technicians
- Register applied solutions
- Measure operational response times
- Classify root causes by type and area
- Detect recurring issues to reduce critical incidents over time

---

## Main Users

### Operator

Reports an incident directly from the production line using a mobile-optimized form.

### Supervisor

Receives incident reports, monitors open cases, assigns responsibilities, and tracks progress.

### Technician

Resolves assigned incidents and records the applied solution.

### Plant Manager

Analyzes incident patterns, response metrics, and recurring root causes to improve operational efficiency.

---

## Core Workflow

1. An operator detects a machine failure, accident, or quality deviation.
2. The operator opens the reporting form from a mobile device.
3. The operator completes the incident type, area, and brief description.
4. The incident is submitted and registered in the system.
5. A supervisor receives the alert.
6. The supervisor assigns a responsible technician.
7. The technician resolves the incident and records the applied solution.
8. The system calculates the resolution time.
9. The plant manager reviews weekly metrics and recurring root causes.

---

## Expected Features

### Incident Reporting

- Mobile-friendly incident form
- Incident type selection
- Area or sector selection
- Brief description field
- Incident submission confirmation

### Incident Management Dashboard

- List of reported incidents
- Status tracking:
  - Open
  - In Progress
  - Closed
- Incident detail view
- Assignment of responsible users
- Filtering by status, type, area, and date

### Root Cause Analysis

- Root cause classification
- Incident grouping by area
- Incident grouping by type
- Recurring issue detection
- Weekly analysis view

### Metrics

- Average response time
- Average resolution time
- Resolution rate by period
- Number of incidents by status
- Number of incidents by type
- Critical incident frequency

---

## MVP Scope

The first version of OpsCore will focus on validating the main operational flow:

- Create an incident report
- Display incidents in a dashboard
- Update incident status
- Assign a responsible technician
- Close an incident with a resolution note
- Display basic metrics and root cause categories

The goal is to deliver a functional prototype that demonstrates the value of digitizing incident management in an industrial environment.

---

## Project Structure

```txt
opscore/
│
├── frontend/
│   └── README.md
│
├── backend/
│   └── README.md
│
├── docs/
│   ├── project-overview.md
│   ├── user-stories.md
│   └── api-contract.md
│
├── README.md
└── .gitignore
```

---

## Suggested Tech Stack

The final technology stack will be defined by the team.

Possible stack:

### Frontend

- React
- JavaScript or TypeScript
- CSS / Tailwind / SCSS
- Responsive design

### Backend

- Node.js
- Express
- REST API
- Authentication and role management

### Database

- MongoDB / PostgreSQL / Firebase

### Tools

- Git
- GitHub
- GitHub Projects
- Figma
- Postman
- Notion / Trello / Jira

---

## User Roles

| Role | Main Responsibility |
|---|---|
| Operator | Report incidents from the production line |
| Supervisor | Review, assign, and monitor incidents |
| Technician | Resolve assigned incidents |
| Plant Manager | Analyze metrics and recurring root causes |

---

## Incident Status Flow

```txt
Reported → Open → In Progress → Resolved → Closed
```

Possible additional states:

```txt
Rejected
Pending Review
Reopened
```

---

## Impact

OpsCore is expected to improve operational efficiency by:

- Reducing information loss
- Improving incident traceability
- Accelerating response times
- Helping teams identify recurring problems
- Supporting data-driven decisions
- Reducing the frequency of critical incidents

---

## Deliverable

Expected delivery: **Prototype**

The final prototype should demonstrate the full incident lifecycle, from mobile reporting to dashboard tracking and root cause analysis.

---

## Team Collaboration

Recommended workflow:

1. Create issues for each feature or task.
2. Work using feature branches.
3. Open pull requests before merging changes.
4. Review code before merging into the main branch.
5. Keep documentation updated as the project evolves.

### Branch Naming

```txt
feature/incident-form
feature/dashboard
feature/root-cause-analysis
fix/status-filter
docs/update-readme
```

### Commit Examples

```txt
feat: add mobile incident report form
feat: create incident dashboard layout
fix: update incident status logic
docs: add project overview
refactor: improve folder structure
```

---

## Current Status

Project initialized.

Current phase:

```txt
Week 1 of 5 - Planning, repository setup and initial structure
```

---

## About No Country

This project is being developed as part of a No Country simulation, where multidisciplinary teams collaborate to build real-world digital products in a professional environment.
