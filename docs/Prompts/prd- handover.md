AI Session Handover Protocol

TL;DR

The conversation shifted from evaluating detailed design system/style reference documents (including Convex and Workable) to recognizing that the project's bottleneck is not design extraction but product definition. The decision was made to pause further design analysis and instead write a proper Product Requirements Document (PRD), which will become the foundation for rewriting the project's README and AGENTS.md.


---

01. Core Mission

Immediate goal: Write a comprehensive PRD for the project.

Larger context: The project has accumulated implementation ideas and style references without a single authoritative specification. A PRD will become the source of truth before documentation or implementation continues.

Success looks like: A complete PRD that clearly defines the product vision, goals, users, workflows, architecture, scope, constraints, and roadmap so that README, AGENTS.md, and implementation can all derive from it.



---

02. Framework & Rules

The PRD becomes the canonical source of truth.

README should be derived from the PRD, not written independently.

AGENTS.md should describe implementation behavior based on the PRD.

Design references are inputs, not deliverables.

Avoid premature implementation before product definition.

Prefer explicit specifications over assumptions.

Build documentation from the top down:

1. PRD


2. README


3. AGENTS.md


4. Implementation





---

03. Subject Areas

Topic	Why It Matters

Design Systems	Multiple detailed style references were reviewed as examples of high-quality design documentation.
Product Documentation	The conversation concluded that documentation is more important than collecting additional design systems.
PRD	Identified as the project's highest priority.
README	Planned to be rewritten after the PRD exists.
AGENTS.md	Planned to be rewritten after the PRD defines the product behavior.



---

04. Communication Preferences

Tone: Direct, technical, honest.

Detail Level: Comprehensive.

Format: Structured Markdown.

Emphasis: Practical documentation over theory.

Restrictions:

Avoid vague praise.

Prefer critical evaluation.

Prioritize useful outputs over discussion.

Focus on creating reusable project documentation.




---

05. User Context

Role/Expertise: Technical builder with a strong focus on product architecture, documentation, and AI-assisted development.

Current Priorities:

Create a proper PRD.

Rewrite project documentation.

Establish a clear foundation before implementation.


Constraints:

Existing documentation is insufficient.

Multiple design references exist but are secondary to defining the product.


Relevant Background:

The user values detailed specifications.

They expect critical evaluation rather than generic positive feedback.

They expressed frustration with responses that did not clearly prioritize or compare alternatives.




---

06. Conversation Timeline

Starting point: Discussion around detailed website style reference documents.

Key turning points:

Shared an extensive Convex style reference.

Shared an extensive Workable style reference.

Questioned why every style reference was being treated as equally good instead of receiving meaningful comparison.

Expressed concern that continued analysis of design files would not move the project forward.

Decided that writing the PRD is a higher priority.

Requested to begin the PRD.


Current status: Ready to write the project's PRD.

Open questions:

Product scope.

Primary user persona.

Feature set.

Technical architecture.

Success metrics.




---

07. External References

Convex Style Reference

Example of an engineering-focused design system and documentation format.


Workable Style Reference

Example of an editorial SaaS design language and documentation format.



These references are considered inspiration rather than immediate implementation targets.


---

08. Artifacts Generated

Artifact	Format	Status	Intended Use

Convex Style Reference	Markdown	Existing	Design inspiration
Workable Style Reference	Markdown	Existing	Design inspiration
Decision to prioritize PRD	Conversation	Final	Project direction



---

09. Key Decisions

Decision	Rationale

Stop focusing on additional design references	Product definition is the current bottleneck.
Write a PRD first	It will become the foundation for every other document.
Rewrite README after the PRD	Documentation should derive from product requirements.
Rewrite AGENTS.md after the PRD	Agent behavior should be based on an established product specification.



---

10. Immediate Next Steps

Priority 1: Write a comprehensive Product Requirements Document (PRD) covering product vision, users, problem statement, goals, features, architecture, workflows, requirements, constraints, roadmap, and success metrics. This establishes the project's source of truth.

Priority 2: Rewrite the repository README based entirely on the completed PRD. The README should become a concise developer-facing summary rather than an exploratory document.

Dependencies: The PRD must be completed before rewriting any downstream documentation.

Blockers: The conversation does not yet include detailed information about the product itself (vision, target users, features, architecture, etc.), so these details must be gathered or inferred before drafting the PRD.


---

11. Unresolved Items

Question	Why Unresolved	Considerations

What is the exact product?	Not yet discussed.	Defines every section of the PRD.
Who are the primary users?	Not yet discussed.	Needed for UX, priorities, and scope.
What features belong in MVP?	Not yet discussed.	Required to establish scope.
What is the system architecture?	Not yet discussed.	Needed for technical planning and AGENTS.md.
What are the project's success metrics?	Not yet discussed.	Needed for product validation and roadmap planning.



---

12. Next AI Activation Prompt

Continue this session by helping me write a complete Product Requirements Document (PRD) for this project.

The PRD should become the single source of truth for the repository.

Write it in professional Markdown with sections including:

- Executive Summary
- Vision
- Problem Statement
- Goals
- Non-Goals
- User Personas
- User Stories
- Core Features
- Functional Requirements
- Non-Functional Requirements
- Information Architecture
- User Flows
- System Architecture
- Data Model
- API/Agent Responsibilities
- Design Principles
- Technical Constraints
- Success Metrics
- MVP Scope
- Future Roadmap
- Risks
- Open Questions

Do not start writing README or AGENTS.md yet.

If information is missing, ask targeted questions one section at a time instead of making assumptions. The PRD should be detailed enough that the README and AGENTS.md can later be generated directly from it.