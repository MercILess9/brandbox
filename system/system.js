
let supabaseClient;

if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// 🚩 ฟังก์ชันจัดการวันที่ (คืนชีพตามที่เคยตกลงกันไว้)
function formatDate(dateStr) {
    if (!dateStr || dateStr === '-' || dateStr === '') return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr; 
        return d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' });
    } catch (e) { return '-'; }
}

async function initLayout(config = {}) {
    injectAssets();
    if (!supabaseClient) {
        document.body.classList.add('auth-ready');
        return;
    }

    await initAuthGuard();

    const path = window.location.pathname.toLowerCase();
    const isAuthPage = path.includes('/auth/');
    const isIndex = path === '/' || path.endsWith('/index.html') || path.endsWith('/');

    if (isAuthPage || isIndex) {
        document.body.classList.add('auth-ready');
        return;
    }

    await renderSystemUI(config);
}

async function initAuthGuard() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const path = window.location.pathname.toLowerCase();
    const isAuthPage = path.includes('/auth/');

    if (!session && !isAuthPage) {
        window.location.replace("/auth/login.html");
        return;
    }
    if (session && isAuthPage) {
        window.location.replace("/index.html");
        return;
    }
}

async function renderSystemUI(config) {
    try {
        const response = await fetch('/system/header.html'); 
        if (!response.ok) throw new Error("Header not found");
        const headerHTML = await response.text();

        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        const projectTitle = document.getElementById('project-title');
        if (projectTitle) projectTitle.innerText = config.projectName || 'SYSTEM';

        const menuBar = document.getElementById('sys-menu-bar');
        if (config.menus && menuBar) {
            menuBar.innerHTML = '';
            config.menus.forEach(menu => {
                const isActive = window.location.pathname.includes(menu.link) ? 'active' : '';
                menuBar.insertAdjacentHTML('beforeend', `<a href="${menu.link}" class="sys-menu-link ${isActive}">${menu.name}</a>`);
            });
        }

        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            const display = document.getElementById('user-display');
            if (display) display.innerText = user.user_metadata.full_name || user.email;
        }

        document.body.classList.add('auth-ready');
    } catch (err) {
        console.error("❌ UI Fail:", err);
        document.body.classList.add('auth-ready');
    }
}

function injectAssets() {
    // โหลดเฉพาะของที่จำเป็นจริงๆ สำหรับ Icons และ Bootstrap Functions
    const links = [
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
    ];
    links.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
            const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = url;
            document.head.appendChild(l);
        }
    });

    // ต้องมีตัวนี้ เพื่อให้ Dropdown และ Collapse ใน Card ของพี่ทำงานได้
    if (!document.querySelector('script[src*="bootstrap.bundle"]')) {
        const s = document.createElement('script');
        s.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
        document.head.appendChild(s);
    }
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.replace("/auth/login.html");
}