# Brandbox — Design & Code Guidelines

## 1. Design System

### Color Tokens

```css
/* Brand */
--brand-lime:        #bdc432   /* primary accent */
--brand-lime-light:  #f4f7a1   /* hover bg, highlight */
--brand-lime-dark:   rgb(45, 71, 57)  /* auth gradient dark end */
--brand-dark:        #1e293b   /* buttons, header bg */
--brand-black:       #111111   /* portal text */

/* UI */
--c-bg:              #f8fafc   /* page background */
--c-border:          #e2e8f0   /* all borders */
--c-text-main:       #1e293b
--c-text-muted:      #94a3b8
--c-slate:           #626e7f   /* secondary text */

/* Role Colors */
--c-des:             #3b82f6   /* Designer — blue */
--c-des-bg:          #eff6ff
--c-des-border:      #dbeafe
--c-cre:             #8b5cf6   /* Creative — purple */
--c-cre-bg:          #f5f3ff
--c-cre-border:      #ede9fe

/* Status */
--c-progress:        #bdc432   /* On Progress */
--c-done:            #94a3b8   /* Done — grey */
```

### Typography

| Context | Font |
|---|---|
| Portal / Auth | `Outfit` (Google Fonts) |
| Project pages | `Inter` + `Sarabun` (Thai support) |

Font size scale ที่ใช้จริง:
- Labels / tags: `0.6–0.72rem`
- Body small: `0.78–0.82rem`
- Body: `0.85–0.9rem`
- Card title: `0.93–1rem`
- Page heading: `1.4rem`
- Portal hero: `2.8rem`

### Border Radius Scale

| Element | Radius |
|---|---|
| Page cards / sections | `20px` |
| Modal, large panels | `18–24px` |
| Buttons, inputs | `10–12px` |
| Pills / badges | `20px` (full round) |
| Small chips / tags | `4–8px` |

### Component Patterns

**Cards**
```css
background: #fff;
border: 1px solid #eef2f7;
border-radius: 20px;
box-shadow: 0 2px 8px -2px rgba(0,0,0,0.05);
transition: box-shadow 0.2s, transform 0.2s;
/* hover */
box-shadow: 0 8px 24px -4px rgba(0,0,0,0.09);
transform: translateY(-1px);
```

**Primary Button (dark + lime)**
```css
background: #1e293b; color: #bdc432;
border-radius: 10px; font-weight: 800;
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
/* hover */
background: #0f172a;
transform: translateY(-2px) scale(1.04);
box-shadow: 0 8px 24px rgba(0,0,0,0.22);
```

**Filter Pills (toggle)**
```css
/* default */
border: 1.5px solid #e2e8f0; border-radius: 20px;
padding: 5px 14px; font-size: 0.75rem; font-weight: 700;
/* active — เปลี่ยน bg ตาม role/state */
```

**FAB (Floating Action Button)**
```css
position: fixed; bottom: 30px; right: 30px;
width: 65px; height: 65px; border-radius: 50%;
background: #1e293b; color: #bdc432;
/* hover */
transform: scale(1.1) rotate(90deg);
```

**Skeleton Loading**
```css
background: #e8eaee; border-radius: 4px;
animation: shimmer 1.4s infinite;
@keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.45} }
```

**Floating Save Bar**
```css
position: fixed; bottom: -120px; /* hidden */
transition: bottom 0.4s cubic-bezier(0.34,1.56,0.64,1);
/* .visible → bottom: 24px */
```

### Interaction Rules

- Hover lift: `translateY(-1px)` สำหรับ cards ทั่วไป, `-2px` สำหรับ buttons
- Transition timing: `0.2s` ทั่วไป, `0.3s–0.4s` สำหรับ spring effects
- ปุ่ม active (กด): `translateY(0) scale(0.97)`, `transition-duration: 0.1s`
- Opacity fade-in ทุกหน้า: `body { opacity: 0 }` → `body.auth-ready { opacity: 1 }`

---

## 2. Workflow

### Development

ไม่มี build step — เปิดไฟล์ผ่าน local server ได้เลย (Live Server extension ใน VS Code)

```
ทำงานบน VS Code → git push → Vercel auto-deploy
```

### Git

- Branch หลัก: `main`
- Commit ตรงๆ ใน main ได้ (small project, solo/small team)
- Vercel deploy อัตโนมัติเมื่อ push to main

### 2 เครื่อง (Mac / PC)

- ทำงานผ่าน git เหมือนกันทั้งสองเครื่อง
- `CLAUDE.md` + `GUIDELINES.md` อยู่ใน repo → sync อัตโนมัติ

### Supabase

- DB changes ทำผ่าน Supabase Dashboard โดยตรง
- ไม่มี migration files — schema อยู่ที่ Supabase เป็น source of truth
- Table naming: kebab-case (`b-quest-list`, `b-quest-work`) ยกเว้น `b_quest_capacity` (underscore)

### เพิ่ม Project ใหม่

1. เพิ่ม card ใน `index.html`
2. สร้าง folder `/<project>/`
3. สร้าง `<project>.js` — config + permission loader
4. สร้าง HTML pages ตาม pattern เดิม
5. สร้าง settings table ใน Supabase สำหรับ permission

---

## 3. Code Conventions

### File Organization

```
shared across project pages  → <project>.js  (config, perms, shared fns)
shared modal/heavy component → <project>-modal.js
page-specific logic          → inline <script> ใน HTML นั้น
system-wide utilities        → system/system.js
```

### Page Init Pattern

ทุกหน้าเรียก `initLayout()` เป็น entry point สุดท้าย:

```js
// หน้า project
initLayout(B_QUEST_CONFIG);

// หน้า auth / index
initLayout({});
```

### Permission Check Pattern

```js
// โหลด + cache
await loadBquestPerms();

// เช็คสิทธิ์
if (!canBquest('edit')) { ... }

// Guard ทั้งหน้า
guardBquestPage('assign');   // redirect ถ้าไม่มีสิทธิ์

// God bypasses ทุกอย่าง — ตรวจใน loader ไม่ต้องตรวจซ้ำทุกที่
if (user.level === 'god') return { ...allPerms, _god: true };
```

### Supabase Query Pattern

```js
// ดึงข้อมูล
const { data, error } = await supabaseClient
    .from('table-name')
    .select('col1, col2')
    .eq('field', value)
    .order('col', { ascending: false });

// ส่ง error ต่อด้วย throw หรือ console.error — ไม่ silent fail
if (error) throw error;

// Upsert (settings)
await supabaseClient.from('table').upsert([...], { onConflict: 'key_col' });
```

### List / Infinite Scroll Pattern

```js
let currentPage = 0, isFetching = false, hasMore = true;

async function fetchItems() {
    if (isFetching || !hasMore) return;
    isFetching = true;
    const from = currentPage * LIMIT;
    const { data } = await supabaseClient.from('...').range(from, from + LIMIT - 1);
    if (data.length < LIMIT) hasMore = false;
    renderItems(data);   // append ต่อท้าย ไม่ล้าง container
    currentPage++;
    isFetching = false;
}

// Observer
const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !isFetching && hasMore) fetchItems();
}, { rootMargin: '100px' });
observer.observe(document.getElementById('load-more-trigger'));
```

### Filter / Search Pattern

- Filter options (dropdown, assign list ฯลฯ) → **fetch ครบทั้งหมด** แยกต่างหาก (`loadMasterData`)
- ผู้ใช้ filter/search → **reset page + re-fetch** จาก Supabase พร้อม query params
- Search text → ส่งเป็น `.or(columns.map(c => c.ilike.%term%).join(','))` ให้ Supabase filter

```js
function applyFilters() {
    currentPage = 0;
    hasMore = true;
    document.getElementById('container').innerHTML = '';
    fetchItems();
}
```

### IIFE Module Pattern (สำหรับ component ซับซ้อน)

```js
const MyApp = (() => {
    const State = { ... };          // private state
    const Service = { ... };        // async data fetchers
    function privateHelper() { ... }

    return {
        publicMethod() { ... }      // expose เฉพาะที่ต้องการ
    };
})();

window.MyApp = MyApp;
```

### Notification Pattern

```js
// ใช้ wrapper เสมอ ไม่เรียก Swal โดยตรง (ยกเว้นต้องการ custom options)
notify("Title", "Message", "success");   // success | error | warning
```

### HTML XSS Prevention

ทุกครั้งที่ render user data ลง HTML ต้อง escape:
```js
function esc(str) {
    return str ? str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';
}
```
สำหรับ detail text ที่ต้องรองรับ newline: `.replace(/\n/g,'<br>')`

### sessionStorage Keys

| Key | Content |
|---|---|
| `bx_user` | profiles row ของ user ปัจจุบัน |
| `bx_bquest_perms` | permission object ของ B-QUEST |

### Comments

เขียน comment เฉพาะเมื่อ WHY ไม่ชัดเจนจากโค้ด — ไม่อธิบาย WHAT
