const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const publicPages = ["login.html", "register.html", "forgot-password.html"];

function getCorrectPath(target) {
    const root = window.location.origin;
    if (target === "login.html") return `${root}/login/login.html`;
    if (target === "index.html") return `${root}/b-quest/b-quest-list.html`;
    return `${root}/${target}`;
}

function getCurrentPage() {
    // ปรับให้รองรับ Vercel ที่บางทีไม่มี .html
    let page = window.location.pathname.split("/").pop() || "index.html";
    if (!page.includes(".")) page += ".html"; 
    return page;
}

function safeRedirect(to) {
    const targetUrl = getCorrectPath(to);
    // เช็กจาก URL เต็มๆ เพื่อหยุด Loop
    if (window.location.href !== targetUrl) {
        window.location.href = targetUrl;
    }
}

async function initAuthGuard() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const page = getCurrentPage();
    const isPublic = publicPages.includes(page);

    // ❌ ไม่มี session + อยู่หน้าทำงาน -> ไป Login
    if (!session && !isPublic && page !== "index.html") {
        safeRedirect("login.html");
    } 
    // ✔ มี session + อยู่หน้า Login -> ไปหน้า Dashboard
    else if (session && isPublic) {
        safeRedirect("index.html");
    }

    // ดักฟังการเปลี่ยนสถานะ (เช่น Logout)
    supabaseClient.auth.onAuthStateChange((event, session) => {
        const currPage = getCurrentPage();
        if (event === 'SIGNED_OUT') {
            safeRedirect("login.html");
        } else if (event === 'SIGNED_IN' && publicPages.includes(currPage)) {
            safeRedirect("index.html");
        }
    });
}

const BQuest = {
    async logout() {
        await supabaseClient.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        // ไม่ต้องสั่ง redirect ตรงนี้ เดี๋ยว onAuthStateChange จัดการให้เอง
    },
    async getProfile(userId) {
        const { data, error } = await supabaseClient.from("profiles").select("*").eq("id", userId).single();
        return error ? null : data;
    }
};

initAuthGuard();