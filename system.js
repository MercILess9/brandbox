// ==========================================
// B-QUEST SYSTEM ENGINE (CLEAN VERSION)
// ==========================================

// 1. Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Pages config (มีแค่นี้พอ)
const publicPages = [
    "login.html",
    "register.html",
    "forgot-password.html"
];

// 3. Get current page helper
function getCurrentPage() {
    let page = window.location.pathname.split("/").pop();
    if (!page || page === "") page = "index.html";
    return page;
}

// 4. Safe redirect (กัน loop)
function redirect(to) {
    const current = getCurrentPage();
    if (current !== to) {
        window.location.href = to;
    }
}

// 5. AUTH GUARD (SIMPLE + SCALABLE)
async function initAuthGuard() {
    const currentPage = getCurrentPage();

    // ดึง session ครั้งแรก (กัน timing issue)
    const { data: { session } } = await supabaseClient.auth.getSession();

    // ❌ ไม่มี session + อยู่หน้า protected
    if (!session && !publicPages.includes(currentPage)) {
        redirect("login.html");
        return;
    }

    // ✔ มี session + อยู่หน้า public → เด้งไปหน้า main
    if (session && publicPages.includes(currentPage)) {
        redirect("index.html");
        return;
    }

    // 🔄 realtime auth change (logout / expire / login)
    supabaseClient.auth.onAuthStateChange((event, session) => {
        const page = getCurrentPage();

        if (!session && !publicPages.includes(page)) {
            redirect("login.html");
        }

        if (session && publicPages.includes(page)) {
            redirect("index.html");
        }
    });
}

// 6. SYSTEM UTILITIES
const BQuest = {

    async logout() {
        await supabaseClient.auth.signOut();
        redirect("login.html");
    },

    async getProfile(userId) {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) return null;
        return data;
    },

    setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
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

// 7. INIT
initAuthGuard();