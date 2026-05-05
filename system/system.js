// ==========================================
// 1. GLOBAL CONFIG & CLIENT
// ==========================================
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const publicPages = ["login.html", "register.html", "forgot-password.html"];

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
    const url = getCorrectPath(to);
    if (window.location.href !== url) window.location.href = url;
}

// ==========================================
// 3. UI LOADER (🔥 แยกออกมา)
// ==========================================
const UILoader = {
    async loadModal(fileName) {
        console.log("📦 loadModal:", fileName);

        try {
            const url = `${window.location.origin}/b-quest/${fileName}`;
            console.log("📡 Fetch:", url);

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
            const resp = await fetch(getCorrectPath('header.html'));
            const html = await resp.text();

            const header = document.createElement('header');
            header.className = "sticky-top shadow-sm";
            header.innerHTML = html;

            document.body.prepend(header);

            if (document.getElementById("project-title")) {
                document.getElementById("project-title").innerText = config.projectName;
            }

            const menuBar = document.getElementById("sys-menu-bar");
            const curr = getCurrentPage();

            if (menuBar && config.menus) {
                menuBar.innerHTML = "";

                config.menus.forEach(m => {
                    const a = document.createElement('a');
                    a.href = m.link;
                    a.className = `sys-menu-link ${curr === m.link ? 'active' : ''}`;
                    a.innerText = m.name;
                    menuBar.appendChild(a);
                });
            }

            const { data: { session } } = await supabaseClient.auth.getSession();

            if (session) {
                const profile = await this.getProfile(session.user.id);
                const el = document.getElementById("user-display");

                if (el) {
                    el.innerText =
                        profile?.nick_name ||
                        profile?.full_name ||
                        session.user.email.split('@')[0];
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

    if (page === "index.html") {
        session ? safeRedirect("index.html") : safeRedirect("login.html");
        return;
    }

    if (!session && !isPublic) safeRedirect("login.html");
    else if (session && isPublic) safeRedirect("index.html");

    supabaseClient.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') safeRedirect("login.html");
        else if (event === 'SIGNED_IN' && publicPages.includes(getCurrentPage()))
            safeRedirect("index.html");
    });
}

initAuthGuard();