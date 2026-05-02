// ==========================================
// B-QUEST SYSTEM ENGINE (MODULAR VERSION)
// ==========================================

// 1. Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. รายชื่อหน้าเว็บที่เข้าได้โดยไม่ต้อง Login
const publicPages = ["login.html", "register.html", "forgot-password.html"];

// --- INTERNAL HELPERS ---

function getCorrectPath(target) {
    const root = window.location.origin;
    if (target === "login.html") return `${root}/login/login.html`;
    if (target === "index.html") return `${root}/b-quest/b-quest-list.html`;
    return `${root}/${target}`;
}

function getCurrentPage() {
    let page = window.location.pathname.split("/").pop() || "index.html";
    if (!page.includes(".")) page += ".html"; 
    return page;
}

function safeRedirect(to) {
    const targetUrl = getCorrectPath(to);
    if (window.location.href !== targetUrl) {
        window.location.href = targetUrl;
    }
}

// --- B-QUEST CORE UTILITIES ---

const BQuest = {
    // ฉีด Assets (CSS/Meta) เข้าไปใน Head อัตโนมัติ
    injectAssets() {
        if (!document.querySelector('meta[name="viewport"]')) {
            const meta = document.createElement('meta');
            meta.name = "viewport"; meta.content = "width=device-width, initial-scale=1.0";
            document.head.appendChild(meta);
        }

        const assets = [
            { type: 'css', url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap" },
            { type: 'css', url: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" },
            { type: 'css', url: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" }
        ];

        assets.forEach(as => {
            if (!document.querySelector(`link[href="${as.url}"]`)) {
                const el = document.createElement('link');
                el.rel = 'stylesheet'; el.href = as.url;
                document.head.appendChild(el);
            }
        });
    },

    // ระบบจัดการ Layout (Header / Menu / User)
    async initLayout(config) {
        this.injectAssets(); // โหลด CSS พื้นฐาน

        try {
            // 1. ดึง Header กลางมาแปะ
            const resp = await fetch(getCorrectPath('header.html'));
            const html = await resp.text();
            const header = document.createElement('header');
            header.className = "sticky-top shadow-sm";
            header.innerHTML = html;
            document.body.prepend(header);

            // 2. ตั้งชื่อโปรเจกต์ (B-QUEST / B-ACCOUNT)
            const titleEl = document.getElementById("project-title");
            if (titleEl) titleEl.innerText = config.projectName;

            // 3. พ่นเมนูสีเขียว
            const menuBar = document.getElementById("sys-menu-bar");
            const currentPage = getCurrentPage();
            if (menuBar && config.menus) {
                menuBar.innerHTML = "";
                config.menus.forEach(m => {
                    const a = document.createElement('a');
                    a.href = m.link;
                    // เช็ก Active จากชื่อไฟล์
                    const isActive = currentPage === m.link;
                    a.className = `sys-menu-link ${isActive ? 'active' : ''}`;
                    a.innerText = m.name;
                    menuBar.appendChild(a);
                });
            }

            // 4. แสดงชื่อ User
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                const profile = await this.getProfile(session.user.id);
                const displayEl = document.getElementById("user-display");
                if (displayEl) {
                    displayEl.innerText = profile?.nick_name || profile?.full_name || session.user.email.split('@')[0];
                }
            }
        } catch (e) {
            console.error("Layout Init Fail:", e);
        }
    },

    async logout() {
        await supabaseClient.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        // safeRedirect จะถูกเรียกโดยอัตโนมัติจาก onAuthStateChange
    },

    async getProfile(userId) {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        return error ? null : data;
    },

    notify(title, type = "success") {
        Swal.fire({
            title, icon: type, timer: 2000,
            showConfirmButton: false, toast: true, position: "top-end"
        });
    }
};

// --- AUTH GUARD LOGIC ---

async function initAuthGuard() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const page = getCurrentPage();
    const isPublic = publicPages.includes(page);

    // ป้องกันหน้า index.html ที่ root (Traffic Control)
    if (page === "index.html") {
        session ? safeRedirect("index.html") : safeRedirect("login.html");
        return;
    }

    if (!session && !isPublic) {
        safeRedirect("login.html");
    } else if (session && isPublic) {
        safeRedirect("index.html");
    }

    // เฝ้าดูการเปลี่ยนแปลง (Login/Logout)
    supabaseClient.auth.onAuthStateChange((event, session) => {
        const currPage = getCurrentPage();
        if (event === 'SIGNED_OUT') {
            safeRedirect("login.html");
        } else if (event === 'SIGNED_IN' && publicPages.includes(currPage)) {
            safeRedirect("index.html");
        }
    });
}

// รันระบบ Guard ทันที
initAuthGuard();