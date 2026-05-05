// ==========================================
// 1. INITIALIZATION & CONFIG
// ==========================================

// ตรวจสอบ Supabase (ต้องโหลด Lib ใน HTML ก่อนไฟล์นี้)
let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error("❌ Critical: Supabase Library not found! Please check your HTML head.");
}

// รายชื่อหน้าสาธารณะ (ไม่ต้อง Login)
const PUBLIC_PAGES = ["login", "register", "forgot-password"];

// รายชื่อ God Mode (Email ที่เข้าได้ทุกที่โดยไม่ต้องมีชื่อใน Database Setting)
const GOD_USERS = ["oat@brand-strom.com", "admin@brand-strom.com"];

// ==========================================
// 2. UTILITIES & PATHS
// ==========================================

function getCurrentPage() {
    const path = window.location.pathname;
    if (path === "/" || path === "" || path.endsWith("/index") || path.endsWith("/index.html")) {
        return "index";
    }
    const page = path.split("/").pop();
    return page.replace(".html", "");
}

function getCorrectPath(target) {
    const root = window.location.origin;
    const cleanTarget = target.startsWith('/') ? target.slice(1) : target;

    if (cleanTarget === "login.html" || cleanTarget === "auth/login.html") {
        return `${root}/auth/login.html`;
    }
    if (cleanTarget === "index.html" || cleanTarget === "index") {
        return `${root}/index.html`;
    }
    return `${root}/${cleanTarget}`;
}

function safeRedirect(to) {
    const url = getCorrectPath(to);
    if (window.location.href !== url) {
        window.location.href = url;
    }
}

function formatDate(dateStr) {
    if (!dateStr || dateStr === '-' || dateStr === 'null') return '-';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        return `${d}-${m}-${date.getFullYear()}`;
    } catch (e) { return dateStr; }
}

// ==========================================
// 3. CORE SYSTEM FUNCTIONS (แยกออกมาแล้ว)
// ==========================================

/**
 * ฉีด Assets พื้นฐานที่ทุกหน้าต้องใช้
 */
function injectAssets() {
    const links = [
        "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
    ];

    const scripts = [
        "https://cdn.jsdelivr.net/npm/sweetalert2@11",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    ];

    links.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
            const l = document.createElement('link');
            l.rel = 'stylesheet'; l.href = url;
            document.head.appendChild(l);
        }
    });

    scripts.forEach(url => {
        if (!document.querySelector(`script[src="${url}"]`)) {
            const s = document.createElement('script');
            s.src = url;
            document.head.appendChild(s);
        }
    });
}

/**
 * สร้าง Layout (Header/Menu) และจัดการ Profile
 */
async function initLayout(config = {}) {
    injectAssets();

    try {
        // ดึง Header จากระบบกลาง
        const resp = await fetch('/system/header.html');
        if (!resp.ok) throw new Error("Header not found");
        const html = await resp.text();

        const header = document.createElement('header');
        header.className = "sticky-top shadow-sm";
        header.innerHTML = html;
        document.body.prepend(header);

        // ตั้งชื่อโปรเจกต์บน Header
        if (document.getElementById("project-title")) {
            document.getElementById("project-title").innerText = config.projectName || "BRANDSTROM X";
        }

        // จัดการเมนู
        const menuBar = document.getElementById("sys-menu-bar");
        const curr = getCurrentPage();
        if (menuBar && config.menus) {
            menuBar.innerHTML = "";
            config.menus.forEach(m => {
                const a = document.createElement('a');
                a.href = m.link;
                const isActive = m.link.includes(curr);
                a.className = `sys-menu-link ${isActive ? 'active' : ''}`;
                a.innerText = m.name;
                menuBar.appendChild(a);
            });
        }

        // จัดการข้อมูล User
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            const profile = await getProfile(session.user.id);
            if (profile) {
                // เก็บ Profile ลงลิ้นชักกลาง
                localStorage.setItem('bq_user_profile', JSON.stringify(profile));
                
                const el = document.getElementById("user-display");
                if (el) el.innerText = profile.nick_name || profile.full_name || session.user.email.split('@')[0];
            }
        }

    } catch (e) {
        console.error("Init Layout Fail:", e);
    }
}

async function getProfile(userId) {
    const { data, error } = await supabaseClient.from("profiles").select("*").eq("id", userId).single();
    return error ? null : data;
}

async function logout() {
    await supabaseClient.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    safeRedirect("/auth/login.html");
}

function notify(title, type = "success") {
    // ต้องรอให้ SweetAlert โหลดเสร็จก่อน (กรณีเรียกใช้ทันทีที่หน้าโหลด)
    if (typeof Swal !== 'undefined') {
        Swal.fire({ title, icon: type, timer: 2000, showConfirmButton: false, toast: true, position: "top-end" });
    } else {
        alert(title);
    }
}

// ==========================================
// 4. MODAL LOADER
// ==========================================

async function loadModal(projectName, fileName) {
    try {
        const url = `/${projectName}/${fileName}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const html = await resp.text();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
    } catch (e) {
        console.error("❌ Load Modal Fail:", e);
    }
}

// ==========================================
// 5. AUTH GUARD (Security)
// ==========================================

async function initAuthGuard() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const page = getCurrentPage();
    const isPublic = PUBLIC_PAGES.includes(page);

    console.log(`🛡️ Guard: [${page}] | Public: [${isPublic}] | Session: [${!!session}]`);

    // God Mode Check (ถ้าเป็นเมล God ให้ข้ามทุกอย่าง)
    const isGod = session && GOD_USERS.includes(session.user.email);
    if (isGod) console.log("⚡ God Mode Activated");

    // 1. ถ้าอยู่หน้า Index (หรือหน้าแรก) แต่ไม่ได้ Login
    if (page === "index" && !session) {
        return safeRedirect("/auth/login.html");
    }

    // 2. ถ้าเข้าหน้า Private แต่ไม่ได้ Login
    if (!isPublic && !session) {
        return safeRedirect("/auth/login.html");
    }

    // 3. ถ้า Login แล้ว แต่จะไปหน้า Login/Register
    if (isPublic && session) {
        return safeRedirect("/index.html");
    }

    supabaseClient.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') safeRedirect("/auth/login.html");
    });
}

// เริ่มต้นระบบตรวจสอบสิทธิ์ทันที
initAuthGuard();