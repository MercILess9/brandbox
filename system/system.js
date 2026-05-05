// ==========================================
// 1. GLOBAL CONFIG & CLIENT
// ==========================================
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ปรับให้ไม่มี .html เพื่อให้ตรงกับค่าที่ได้จาก getCurrentPage()
const publicPages = ["login", "register", "forgot-password"];

// ==========================================
// 2. GLOBAL UTILITIES
// ==========================================
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

/**
 * จัดการ Path ให้ถูกต้องไม่ว่าจะอยู่ที่ Folder ไหน
 */
function getCorrectPath(target) {
    const root = window.location.origin;
    // ตัดเครื่องหมาย / นำหน้าออกถ้ามี เพื่อไม่ให้เกิด double slash
    const cleanTarget = target.startsWith('/') ? target.slice(1) : target;

    // Mapping พิเศษสำหรับหน้าหลักและหน้า Auth
    if (cleanTarget === "login.html" || cleanTarget === "auth/login.html") {
        return `${root}/auth/login.html`;
    }
    if (cleanTarget === "index.html" || cleanTarget === "") {
        return `${root}/index.html`;
    }
    
    // สำหรับไฟล์ในระบบ เช่น /system/header.html
    return `${root}/${cleanTarget}`;
}

/**
 * ดึงชื่อหน้าปัจจุบันโดยไม่มีนามสกุล และรองรับหน้า Root
 */
function getCurrentPage() {
    const path = window.location.pathname;
    // ถ้าอยู่ที่หน้าแรกสุด ให้ถือว่าเป็น index
    if (path === "/" || path === "") return "index";

    // ดึงส่วนสุดท้ายของ URL และตัด .html ออก
    const page = path.split("/").pop();
    return page.replace(".html", "");
}

function safeRedirect(to) {
    const url = getCorrectPath(to);
    // ป้องกันการโหลดซ้ำหน้าเดิม (Prevent Infinite Loop)
    if (window.location.href !== url) {
        window.location.href = url;
    }
}

// ==========================================
// 3. UI LOADER
// ==========================================
const UILoader = {
    async loadModal(fileName) {
        console.log("📦 loadModal:", fileName);
        try {
            // ใช้ Path ตรงจาก Root เสมอ
            const url = `${window.location.origin}/b-quest/${fileName}`;
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
};

// ==========================================
// 4. SYSTEM ENGINE (Core)
// ==========================================
const System = {
    injectAssets() {
        if (!document.querySelector('meta[name="viewport"]')) {
            const meta = document.createElement('meta');
            meta.name = "viewport";
            meta.content = "width=device-width, initial-scale=1.0";
            document.head.appendChild(meta);
        }

        const links = [
            "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap",
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
            "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        ];

        links.forEach(url => {
            if (!document.querySelector(`link[href="${url}"]`)) {
                const l = document.createElement('link');
                l.rel = 'stylesheet';
                l.href = url;
                document.head.appendChild(l);
            }
        });
    },

    async initLayout(config) {
        this.injectAssets();

        try {
            // ดึง Header จาก Folder system โดยใช้ Path สัมบูรณ์
            const resp = await fetch('/system/header.html');
            if (!resp.ok) throw new Error("Header not found");
            const html = await resp.text();

            const header = document.createElement('header');
            header.className = "sticky-top shadow-sm";
            header.innerHTML = html;
            document.body.prepend(header);

            if (document.getElementById("project-title")) {
                document.getElementById("project-title").innerText = config.projectName || "SYSTEM";
            }

            const menuBar = document.getElementById("sys-menu-bar");
            const curr = getCurrentPage();

            if (menuBar && config.menus) {
                menuBar.innerHTML = "";
                config.menus.forEach(m => {
                    const a = document.createElement('a');
                    a.href = m.link;
                    // เช็ค active โดยดูว่าชื่อหน้าปัจจุบันตรงกับ link ไหม
                    const isActive = m.link.includes(curr);
                    a.className = `sys-menu-link ${isActive ? 'active' : ''}`;
                    a.innerText = m.name;
                    menuBar.appendChild(a);
                });
            }

            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                const profile = await this.getProfile(session.user.id);
                // เก็บ Profile ลง localStorage เพื่อให้หน้าอื่นดึงไปใช้ได้ง่าย
                if (profile) localStorage.setItem('bq_user_profile', JSON.stringify(profile));

                const el = document.getElementById("user-display");
                if (el) {
                    el.innerText = profile?.nick_name || profile?.full_name || session.user.email.split('@')[0];
                }
            }

        } catch (e) {
            console.error("Init Layout Fail:", e);
        }
    },

    async getProfile(userId) {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        return error ? null : data;
    },

    async logout() {
        await supabaseClient.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        safeRedirect("auth/login.html");
    },

    notify(title, type = "success") {
        Swal.fire({
            title,
            icon: type,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: "top-end"
        });
    }
};

// ==========================================
// 5. AUTH GUARD
// ==========================================
async function initAuthGuard() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const page = getCurrentPage();
    const isPublic = publicPages.includes(page);

    console.log(`🛡️ Guard: Page [${page}] | Public [${isPublic}] | Session [${!!session}]`);

    // 1. ถ้าอยู่หน้าแรก (index) แต่ไม่ได้ login -> ไปหน้า login
    if (page === "index" && !session) {
        console.log("🔒 Access denied: Index requires login.");
        return safeRedirect("auth/login.html");
    }

    // 2. ถ้าเข้าหน้าปกติ (Private) แต่ไม่ได้ login -> ไปหน้า login
    if (!isPublic && !session) {
        console.log("🔒 Access denied: This page requires login.");
        return safeRedirect("auth/login.html");
    }

    // 3. ถ้า Login แล้ว แต่ดันมาหน้า Public (เช่น login, register) -> ไปหน้า index
    if (isPublic && session) {
        console.log("🔓 Already logged in: Redirecting to Index.");
        return safeRedirect("index.html");
    }

    // ฟังเหตุการณ์ Sign Out แบบ Real-time
    supabaseClient.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
            safeRedirect("auth/login.html");
        }
    });
}

// รันระบบตรวจสอบสิทธิ์ทันที
initAuthGuard();