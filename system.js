// ==========================================
// B-QUEST SYSTEM ENGINE (FIXED VERSION)
// ==========================================

// 1. Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Current page helper
function getCurrentPage() {
    let page = window.location.pathname.split("/").pop();
    if (!page || page === "") page = "index.html";
    return page;
}

// 3. AUTH GUARD (SAFE VERSION)
function initAuthGuard() {
    const publicPages = ["login.html", "register.html"];
    const currentPage = getCurrentPage();

    supabaseClient.auth.onAuthStateChange((event, session) => {

        // ❌ ไม่มี session
        if (!session && !publicPages.includes(currentPage)) {
            window.location.href = "login.html";
        }

        // ✔ มี session แต่เข้า login/register
        if (session && publicPages.includes(currentPage)) {
            window.location.href = "index.html";
        }
    });

    // สำรองเช็คตอนโหลดครั้งแรก (กัน delay state)
    supabaseClient.auth.getSession().then(({ data: { session } }) => {

        if (!session && !publicPages.includes(currentPage)) {
            window.location.href = "login.html";
        }

        if (session && publicPages.includes(currentPage)) {
            window.location.href = "index.html";
        }
    });
}

// 4. UTILITIES
const BQuest = {

    async logout() {
        await supabaseClient.auth.signOut();
        window.location.href = "login.html";
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

// 5. INIT (สำคัญ: ไม่ block login page แล้ว)
initAuthGuard();