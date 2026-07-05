# Website Testing Guide

## Goal

This guide explains how to test the full Larvis Writer website from start to finish:

- open the site
- create a project
- move through each writing step
- save progress across pages
- reach a final version

## Before You Start

Make sure the project is ready locally.

Required:

- database configured
- migrations run
- frontend assets available

Recommended commands:

```bash
php artisan migrate
npm run build
```

If you are working in development, `npm run dev` is also fine instead of a production build.

Local site:

- `http://larvis-agent.test`

## What You Are Testing

The website is a connected writing workflow built around one shared project.

Main steps:

1. Workspace
2. Analyze Content
3. Draft Writer
4. Content Tools
5. Revision Chat
6. Final Pass

The key thing to verify is that each page uses the same project and that progress is not lost when moving between pages.

## Test 1: Open The Website

1. Visit `/`
2. Confirm the homepage loads without errors
3. Confirm you can see:
   - the main writer workspace message
   - the project creation form
   - the writing step cards
   - recent projects area

What to verify:

- navigation is visible
- the active page is highlighted
- copy reads clearly and feels user-friendly
- no broken layout on desktop or mobile

## Test 2: Create A Project

On the workspace page:

1. Enter a project title
   - Example: `Q3 Launch Campaign`
2. Enter a brief or source draft
   - Example: a product launch brief, blog draft, or landing page idea
3. Fill the optional fields:
   - content type
   - audience
   - tone
   - goal
4. Click `Create project`

What to verify:

- page redirects back to the workspace with a project selected
- the current project panel appears
- the project title is shown correctly
- the project status starts correctly
- the project appears in recent projects

## Test 3: Analyze Content

From the workspace:

1. Click `Analyze content`
2. Confirm the project panel is visible at the top
3. Confirm the textarea is prefilled from the project brief or current draft
4. Click `Analyze`

What to verify:

- the response shows:
  - suggested title
  - category
  - summary
  - tags
- the result looks relevant to the source text
- no validation or server errors appear

Extra check:

1. Go back to the workspace
2. Reopen the same project

Verify:

- the project still exists
- analysis status has advanced
- the project has kept its context

## Test 4: Generate A Draft

From the project flow:

1. Open `Draft Writer`
2. Confirm the prompt field is prefilled from the project brief or current draft
3. Adjust settings if needed:
   - tone
   - length
   - model profile
   - temperature
   - top-p
4. Click `Generate draft`

What to verify:

- draft result appears on the right
- model/settings boxes are shown
- wording is user-friendly
- no broken layout in the 2-column page

Project continuity check:

1. Leave the page
2. Return to the same project

Verify:

- the draft is stored in the project flow
- the next pages can use it

## Test 5: Improve With Content Tools

1. Open `Content Tools`
2. Confirm the draft field is prefilled
3. Select:
   - audience
   - goal
4. Click `Improve draft`

What to verify:

- improved draft appears
- audience and goal are reflected in the result
- the response feels more focused than the previous draft
- the page still shows the shared project panel

## Test 6: Revise In Chat

1. Open `Revision Chat`
2. Confirm the opening message references the current draft when a draft exists
3. Send a revision request
   - Example: `Make this clearer and more confident.`
4. Send a second follow-up
   - Example: `Now shorten it for a landing page hero section.`

What to verify:

- chat messages appear in a scrollable conversation
- assistant replies are added correctly
- the conversation remains visible after multiple messages
- follow-up messages feel context-aware

Persistence check:

1. Refresh the page

Verify:

- the conversation still exists
- the thread remains attached to the same project

## Test 7: Create The Final Version

1. Open `Final Pass`
2. Confirm the prompt is prefilled from the current project context
3. Click `Generate final version`

What to verify:

- response streams into the live preview area
- the status changes while writing
- stop button works if used during generation
- final text remains visible after streaming ends

Project completion check:

1. Return to the workspace
2. Reopen the same project

Verify:

- the project status reflects final progress
- the final version has been saved
- earlier steps did not lose their context

## Complete End-To-End Path

This is the simplest full workflow to test:

1. Open `/`
2. Create a new project
3. Run `Analyze content`
4. Run `Draft Writer`
5. Run `Content Tools`
6. Use `Revision Chat`
7. Finish in `Final Pass`

If all of that works without losing the selected project, the connected workflow is working correctly.

## What “Final Goal” Means

For this website, the final goal is:

- start from a brief or rough draft
- improve it step by step
- keep everything connected inside one project
- finish with a saved final version

You have reached the final goal when:

- a project was created successfully
- analysis worked
- at least one draft was generated
- at least one revision step was completed
- a final version was streamed and saved

## Optional Tests

### Navigation Test

Visit each page directly from the navbar and verify:

- the current page is highlighted
- labels are user-friendly
- no page looks like an internal developer demo

### Guest Flow Test

Without logging in:

1. Create a project
2. Move through several steps
3. Refresh pages

Verify:

- the project remains accessible during the guest session

### Auth Flow Test

1. Register or log in
2. Create a new project
3. Repeat the workflow

Verify:

- signed-in state works
- project flow still works the same way

### Responsive Test

Check the site on:

- desktop
- tablet width
- mobile width

Verify:

- cards stack correctly
- forms remain usable
- navigation remains readable
- no text overlaps or overflows

## Common Problems To Watch For

- project context disappears between pages
- fields are empty when they should be prefilled
- chat does not persist after refresh
- final stream does not save back to the project
- button labels or page headings still sound too technical
- layout breaks on smaller screens

## Quick Success Checklist

- homepage loads
- project can be created
- recent projects work
- analysis works
- draft generation works
- tool-assisted improvement works
- chat revision works
- final streaming works
- project context persists across pages
- copy feels ready for a live website
