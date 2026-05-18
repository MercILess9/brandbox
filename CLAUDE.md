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

**Per-project permissions:** Each project has its own settings table (e.g. `b-quest-setting`). Permissions are cached in `sessionStorage` with key `bx_perms_<project>` (e.g. `bx_perms_bquest`). Cleared on index and on every project page load to ensure fresh perms on refresh.

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

Every project page follows this exact order:
```js
async function loadPage() {
    sessionStorage.removeItem('bx_perms_<project>');  // clear cache ก่อนเสมอ
    await initLayout(CONFIG);                          // fetch perms + render header
    guardPage(perm);                                   // guard หลัง initLayout เท่านั้น
    await loadMasterData();                            // filter/dropdown data ครบก่อน render
    await fetchData(true);                             // โหลด list แรก — ต้อง await
}
// IntersectionObserver ต้อง active หลัง loadPage เสร็จเท่านั้น
loadPage().then(() => observer.observe(triggerEl));
```
- `initLayout` เรียก `getMenuPerms` (= `loadPerms`) อยู่แล้ว → perms set ใน sessionStorage ก่อน guard รัน
- **ห้าม guard ก่อน initLayout** — perms ยังไม่โหลด จะ redirect ผิด
- **ห้าม observer.observe ก่อน loadPage เสร็จ** — observer จะ trigger fetchData ก่อน perms/masterData พร้อม ทำให้ 10 card แรกไม่มีปุ่ม Edit
- Auth pages และ index.html ไม่ต้องทำ pattern นี้

## CSS Architecture Rules

- แต่ละ project มีไฟล์ CSS ของตัวเอง เช่น `b-quest.css`
- `:root` variables ทั้งหมดอยู่ใน `<project>.css` เท่านั้น — ห้ามประกาศซ้ำใน HTML
- แต่ละ HTML โหลด `<project>.css` แทน และมีแค่ style เฉพาะหน้านั้น
- โหลดลำดับ: supabase → sweetalert2 → config.js → system.js → `<project>.js` → `<project>.css`

## Performance Rules

- List pages use **infinite scroll**: 10–15 items per page via `IntersectionObserver`
- Filter/search must work across **all data** (not just current page) — fetch complete datasets for filter options separately
- Master data (work list, profiles, etc.) loaded once per page via `Promise.all`
- Modal helper data (profiles, capacity) cached per page load with `_loaded` flag — re-fetched on page refresh, not on every modal open

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
3. Create `<project-name>.js` — config object, `loadPerms()`, `canProject(perm)`, `canProjectEditRole(role)` (follow `b-quest.js`)
4. Create `<project-name>.css` — `:root` variables + shared styles (follow `b-quest.css`)
5. Create HTML pages, each loading: supabase → sweetalert2 → config.js → system.js → `<project-name>.js` → `<project-name>.css`
6. Create a settings table in Supabase: `<project>-setting` with columns: codename (PK), role columns, task columns (new/edit/delete), admin columns (assign/setting)
7. sessionStorage key: `bx_perms_<project>` — system.js clears all `bx_perms_*` keys on index automatically

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
