

let supabaseClient;

// 1. Initial Supabase
if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

function formatDate(dateStr) {
    if (!dateStr || dateStr === '-' || dateStr === '') return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr; 
        return d.toLocaleDateString('th-TH', { 
            day: '2-digit', month: 'short', year: '2-digit' 
        });
    } catch (e) { return '-'; }
}


async function initLayout(config = {}) {
    if (!supabaseClient) {
        document.body.classList.add('auth-ready');
        return;
    }

    injectAssets();
    
    // ตรวจสอบสิทธิ์ (ถ้ายังไม่ล็อกอินจะเด้งไปหน้า login)
    await initAuthGuard();

    const path = window.location.pathname.toLowerCase();
    
    // 🚩 เช็คว่าเป็นหน้าในกลุ่ม Login/Signup/Forgot หรือไม่
    const isAuthPage = path.includes('/auth/');
    
    // 🚩 เช็คว่าเป็นหน้า Portal (Index) หรือไม่
    const isIndex = path === '/' || path.endsWith('/index.html') || path.endsWith('/');

    // 🚩 ถ้าเป็นหน้า Auth หรือหน้า Index -> ไม่ต้องโชว์ Header ระบบ
    if (isAuthPage || isIndex) {
        console.log("🙈 Auth or Index page detected: Skipping System Header");
        document.body.classList.add('auth-ready'); // ปลดล็อกหน้าขาวทันที
        return;
    }

    // สำหรับหน้าทำงานอื่นๆ (B-Quest, Finance, etc.) ค่อยดึง Header มาฉีด
    await renderSystemUI(config);
}


async function initAuthGuard() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const path = window.location.pathname.toLowerCase();
    const isAuthPage = path.includes('/auth/');

    // ถ้าไม่มีบัตรผ่าน และไม่ได้อยู่หน้าทำบัตร (Auth) -> ดีดไป Login
    if (!session && !isAuthPage) {
        window.location.replace("/auth/login.html");
        return;
    }

    // ถ้ามีบัตรผ่านแล้ว แต่ยังจะวนเวียนหน้าทำบัตร (Auth) -> ดีดไป Index
    if (session && isAuthPage) {
        window.location.replace("/index.html");
        return;
    }

    supabaseClient.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') window.location.replace("/auth/login.html");
    });
}


async function renderSystemUI(config) {
    try {
        const response = await fetch('/system/header.html'); 
        if (!response.ok) throw new Error("Header not found");
        const headerHTML = await response.text();

        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        const projectTitle = document.getElementById('project-title');
        if (projectTitle) projectTitle.innerText = config.projectName;

        // วาดเมนูสีเขียว
        const menuBar = document.getElementById('sys-menu-bar');
        if (config.menus && menuBar) {
            config.menus.forEach(menu => {
                const isActive = window.location.pathname.includes(menu.link) ? 'active' : '';
                menuBar.insertAdjacentHTML('beforeend', `<a href="${menu.link}" class="sys-menu-link ${isActive}">${menu.name}</a>`);
            });
        }

        // ดึงชื่อ User
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            const display = document.getElementById('user-display');
            if (display) display.innerText = user.user_metadata.full_name || user.email;
        }
        document.body.classList.add('auth-ready');

    } catch (err) {
        console.error("❌ Render UI Fail:", err);
        document.body.classList.add('auth-ready');
    }
}


function injectAssets() {
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport"; meta.content = "width=device-width, initial-scale=1.0";
        document.head.appendChild(meta);
    }
    const links = ["https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap", "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"];
    links.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
            const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = url;
            document.head.appendChild(l);
        }
    });
}

function notify(title, text, icon = 'success') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({ title, text, icon, timer: 2000, showConfirmButton: false });
    } else {
        alert(text);
    }
}

async function logout() {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    window.location.replace("/auth/login.html");
}