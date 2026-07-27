

You are still inventing UI instead of using the existing design system.

The current Workspace implementation is visually incorrect.

Problems visible now:

Tabs are plain text with no styling.

Buttons do not match the design language.

Icons are missing or inconsistent.

Spacing and alignment are incorrect.

The interface looks like a temporary developer placeholder rather than BGD UI.


Do NOT design new controls.

Reuse the existing design system.

Design references

Study the interaction and layout patterns from:

docs/bgd-ui-prd/model-behaviour.html


Use the existing button, tab and toolbar styles from the design assets located in:

docs/Masonry-yard/reui

docs/Masonry-yard/Watermelon


Do not recreate these components manually if equivalents already exist.


---

Workspace Viewer

The Workspace viewer should visually match the behaviour defined in model-behaviour.html.

When a workspace opens, immediately display a proper toolbar containing:

Preview

Code

Design.md


These must look like actual BGD UI controls.

Not plain text.

Not browser-default buttons.

Use the existing button, segmented control, pill, tab or toolbar components already available in the repository or design system.


---

Icons

Do not leave buttons without icons if the design system already provides them.

Reuse existing icons from the repository.

Examples include:

Preview / Eye

Code / Brackets

Design.md / File Text

Copy

Copy All

Expand

Collapse


Use the project's existing icon library.

Do not introduce another icon set.


---

Layout

Match the behaviour document.

The toolbar should:

align correctly

have proper spacing

wrap gracefully on mobile

remain usable on desktop

follow existing padding and radius tokens

use existing colours and typography


Do not hardcode arbitrary sizes.

Use the existing design tokens and component primitives.


---

Code reuse

Do not build another viewer.

There must only be one implementation of:

Preview

Code

Design.md


The Workspace should reuse the same viewer already used elsewhere.

No duplicate components.

No placeholder implementations.

No messages telling users to "go to the Components page."


---

Acceptance criteria

Toolbar matches the design language from model-behaviour.html.

Buttons use existing BGD UI components.

Existing icons are reused.

Mobile spacing is clean.

Tabs are properly styled and readable.

Preview, Code and Design.md all function from the Workspace.

No placeholder text.

No duplicated viewer implementation.

Build passes with no runtime errors.