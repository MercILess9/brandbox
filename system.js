const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const publicPages = ["login.html", "register.html", "forgot-password.html"];

function getCorrectPath(target) {
    const root = window.location.origin;
    if (target === "login.html") return `${root}/login/login.html`;
    if (target === "index.html") return `${root}/b-quest/b-quest-list.html`;
    return `${root}/${target}`;
}

function getCurrentPage() {
    return window.location.pathname.split("/").pop() || "index.html";
}

function safeRedirect(to) {
    const targetUrl = getCorrectPath(to);
    if (window.location.href !== targetUrl) {
        window.location.href = targetUrl;
    }
}

async function initAuthGuard() {
    const currentPage = getCurrentPage();
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session && !publicPages.includes(currentPage) && currentPage !== "index.html") {
        safeRedirect("login.html");
    } else if (session && publicPages.includes(currentPage)) {
        safeRedirect("index.html");
    }

    supabaseClient.auth.onAuthStateChange((event, session) => {
        const page = getCurrentPage();
        if (!session && !publicPages.includes(page) && page !== "index.html") {
            safeRedirect("login.html");
        } else if (session && publicPages.includes(page)) {
            safeRedirect("index.html");
        }
    });
}

const BQuest = {
    async logout() {
        await supabaseClient.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        safeRedirect("login.html");
    },

    async getProfile(userId) {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        return error ? null : data;
    }
};

initAuthGuard();