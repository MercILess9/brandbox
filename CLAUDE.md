# Brandbox — Brandstrom X Portal

## Stack
- Static HTML + Vanilla JS (no framework)
- Supabase (auth + database)
- Vercel (`cleanUrls: true`)
- Domain: `bx.brandboxplatform.com` (Google Cloud)

## Project Structure

```
system/
  config.js         — Supabase credentials, SITE_URL, LOGO_URL
  system.js         — Auth guard, layout init, header inject, shared utils
  header.html       — Fixed header template (injected via JS)
auth/
  auth.js           — Login / Signup / Forgot / Reset password functions
  *.html            — Auth pages
index.html          — Portal home (project cards grid)
b-quest/
  b-quest.js        — Config, permission loader, God mode logic
  b-quest-modal.js  — Task create/edit modal (IIFE: BQuestApp)
  b-quest-list.html
  b-quest-assignment.html
  b-quest-settings.html
vercel.json
```

## Database Schema (Supabase)

| Table | Key Columns |
|---|---|
| `profiles` | id (uuid), codename, employee_id, nick_name, full_name, email, department, level, created_at |
| `b-quest-list` | id, account_name, opportunity_name, task_name, detail, link, publish_date, designer, designer_weight, designer_type, designer_deadline, designer_assign, designer_status, creative, creative_weight, creative_type, creative_deadline, creative_assign, creative_status, owner, create_date, last_update |
| `b-quest-work` | role, work, weight |
| `b_quest_capacity` | role, max_capacity |
| `b-quest-setting` | codename (PK), ae, creative, designer, new, edit, delete, assign, setting |

## Auth & Permission System

**Auth guard:** `initLayout()` → `initAuthGuard()` called on every page. Redirects to `/auth/login.html` if no session.

**User profile:** Stored in `sessionStorage` as `bx_user` after login.

**God mode:** `profiles.level === 'god'` → bypasses all permission checks, never shown in member lists (always filter `.neq('level', 'god')`). God user is not listed in any project's member/setting table.

**Per-project permissions:** Each project has its own settings table (e.g. `b-quest-setting`). Permissions are cached in `sessionStorage` (key: `bx_bquest_perms`) and cleared when user returns to index.

**Permission columns in b-quest-setting:**
- ROLE: `ae`, `creative`, `designer`
- TASK: `new`, `edit`, `delete`
- ADMIN: `assign`, `setting`

## JS Architecture Rules

- **Shared JS** → separate `.js` file (used across multiple pages of same project)
- **Page-specific JS** → inline `<script>` at bottom of that HTML file
- **System-level JS** → `system/system.js` and `system/config.js` (loaded on every page)
- Each project has its own config object (e.g. `B_QUEST_CONFIG`) in its `.js` file

## Page Init Pattern

Every page calls `initLayout(config)` as the last script:
```js
initLayout({
    projectName: "B-QUEST",
    menus: [...],
    getMenuPerms: loadBquestPerms
});
```
Auth pages and index.html pass empty/minimal config — no header is rendered for them.

## Performance Rules

- List pages use **infinite scroll**: 10–15 items per page via `IntersectionObserver`
- Filter/search must work across **all data** (not just current page) — fetch complete datasets for filter options separately
- Master data (work list, profiles, etc.) loaded once per page via `Promise.all`

## Brand & UI

- **Brand lime:** `#bdc432` (also `rgb(189, 196, 50)`)
- **Brand dark:** `#1e293b` (headers, buttons) or `#111111` (portal)
- **Background:** `#f8fafc`
- **Font:** Outfit (portal/auth), Inter + Sarabun (project pages)
- **UI style:** Clean, modern, minimal — no clutter. Bootstrap 5 + Bootstrap Icons via CDN
- **Notifications:** SweetAlert2 via `notify()` wrapper in system.js

## User Display

Users are always shown as **codename** (nickname). Format reference: `codename : nickname (employee_id)`

## Adding a New Project

1. Add a card in `index.html` (app-grid section)
2. Create a new folder `/<project-name>/`
3. Create `<project-name>.js` with project config + permission loader (follow `b-quest.js` pattern)
4. Create HTML pages, each loading: supabase → sweetalert2 → config.js → system.js → `<project-name>.js`
5. Create a settings table in Supabase for project-level permissions

## Projects Status

| Project | Status |
|---|---|
| B-QUEST | Live |
| DASHBOARD | Coming Soon |
| B-ACCOUNT | Coming Soon |
| FINANCE | Coming Soon |

## Planned Features (Future)

- Email notifications
- Per-project dashboard with settings access
