/**
 * B-STROM SYSTEM CORE ENGINE (2026)
 * [FIXED: Redirect Loop Version]
 */

let supabaseClient;

// 1. Initial Supabase ทันทีที่โหลดไฟล์
if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

/**
 * [Main Function]
 */
async function initLayout(config = {}) {
    if (!supabaseClient) {
        document.body.classList.add('auth-ready');
        return;
    }

    injectAssets();
    
    // รอเช็ค Auth ให้จบก่อนค่อยทำอย่างอื่น
    await initAuthGuard();

    const path = window.location.pathname.toLowerCase();
    // เช็คว่าเป็นหน้าแรกหรือไม่ (รองรับทั้ง / , /index.html)
    const isIndex = path === '/' || path.endsWith('/index.html') || path.endsWith('/');

    if (isIndex) {
        document.body.classList.add('auth-ready');
        return;
    }

    // หน้าอื่นๆ ที่ไม่ใช่ Index ให้ดึง Header
    await renderSystemUI(config);
}

/**
 * [Auth Guard] ระบบเฝ้าประตู (จุดแก้บั๊ก Loop)
 */
async function initAuthGuard() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const path = window.location.pathname.toLowerCase();
    
    // เช็คว่าปัจจุบันอยู่ในโฟลเดอร์ /auth/ หรือไม่
    // วิธีนี้แม่นยำกว่าการเช็คชื่อไฟล์ เพราะครอบคลุมทุกหน้าที่เกี่ยวกับการล็อกอิน
    const isAuthPage = path.includes('/auth/');

    // --- LOGIC การเด้งหน้า ---
    
    // 1. ถ้าไม่มี Session และ "ไม่ได้" อยู่หน้า Auth -> ต้องไปหน้า Login
    if (!session && !isAuthPage) {
        console.log("🔒 No session, redirecting to login...");
        window.location.replace("/auth/login.html"); //ใช้ replace เพื่อไม่ให้เก็บ history การเด้ง
        return;
    }

    // 2. ถ้ามี Session แล้ว และ "ดัน" อยู่หน้า Auth -> ต้องไปหน้า Index
    if (session && isAuthPage) {
        console.log("✅ Already logged in, redirecting to home...");
        window.location.replace("/index.html");
        return;
    }

    // ฟังการเปลี่ยนแปลงสถานะ (เช่น กด Logout จาก Tab อื่น)
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            window.location.replace("/auth/login.html");
        }
    });
}

/**
 * [UI Rendering]
 */
async function renderSystemUI(config) {
    try {
        // ดึง header.html มาฉีด
        const response = await fetch('/system/header.html'); 
        if (!response.ok) throw new Error("Header not found");
        const headerHTML = await response.text();
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // ใส่ชื่อโปรเจกต์
        const projectTitle = document.getElementById('project-title');
        if (projectTitle) projectTitle.innerText = config.projectName || 'SYSTEM';

        // วาดเมนู
        const menuBar = document.getElementById('sys-menu-bar');
        if (config.menus && menuBar) {
            config.menus.forEach(menu => {
                const isActive = window.location.pathname.includes(menu.link) ? 'active' : '';
                menuBar.insertAdjacentHTML('beforeend', `<a href="${menu.link}" class="sys-menu-link ${isActive}">${menu.name}</a>`);
            });
        }

        // โชว์ชื่อ User
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            const display = document.getElementById('user-display');
            if (display) display.innerText = user.user_metadata.full_name || user.email;
        }

        document.body.classList.add('auth-ready');
    } catch (err) {
        console.error(err);
        document.body.classList.add('auth-ready');
    }
}

/**
 * [Assets Injection]
 */
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
    await supabaseClient.auth.signOut();
    window.location.replace("/auth/login.html");
}