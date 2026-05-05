/**
 * B-STROM SYSTEM CORE ENGINE (2026)
 * [FIXED: notify is defined & Master Helpers]
 */

let supabaseClient;

// 1. Initial Supabase Client
if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

/**
 * 🚩 GLOBAL HELPER: แจ้งเตือน (SweetAlert2)
 * ใส่ไว้ที่นี่เพื่อให้ auth.js และหน้าอื่นๆ เรียกใช้ได้ทันที
 */
function notify(title, text, icon = 'success') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            timer: 2000,
            showConfirmButton: false,
            confirmButtonColor: 'rgb(45, 71, 57)'
        });
    } else {
        // กรณี SweetAlert ยังไม่โหลด ให้ใช้ alert พื้นฐานแทน
        alert(title + ": " + text);
    }
}

/**
 * 🚩 GLOBAL HELPER: จัดการรูปแบบวันที่
 * เปลี่ยนจาก 2026-05-05 เป็น 05 พ.ค. 69
 */
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

/**
 * [Main Function] เริ่มต้นระบบทั้งหมด
 */
async function initLayout(config = {}) {
    // 1. ฉีด Assets (Bootstrap, Icons)
    injectAssets();

    if (!supabaseClient) {
        console.error("❌ Supabase Client not initialized");
        document.body.classList.add('auth-ready');
        return;
    }

    // 2. ตรวจสอบสิทธิ์ (Auth Guard)
    await initAuthGuard();

    const path = window.location.pathname.toLowerCase();
    const isAuthPage = path.includes('/auth/');
    const isIndex = path === '/' || path.endsWith('/index.html') || path.endsWith('/');

    // 3. ถ้าเป็นหน้า Auth หรือ Index ไม่ต้องโหลด Header ระบบ
    if (isAuthPage || isIndex) {
        document.body.classList.add('auth-ready');
        return;
    }

    // 4. หน้าทำงานอื่นๆ (B-Quest, etc.) ให้โหลด UI ระบบ
    await renderSystemUI(config);
}

/**
 * [Auth Guard] ระบบเฝ้าประตู
 */
async function initAuthGuard() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const path = window.location.pathname.toLowerCase();
    const isAuthPage = path.includes('/auth/');

    // ถ้าไม่มี Session และ "ไม่ได้" อยู่หน้า Auth -> ไปหน้า Login
    if (!session && !isAuthPage) {
        window.location.replace("/auth/login.html");
        return;
    }
    // ถ้ามี Session แล้ว และ "ดัน" อยู่หน้า Auth -> ไปหน้า Index
    if (session && isAuthPage) {
        window.location.replace("/index.html");
        return;
    }
}

/**
 * [UI Rendering] ดึงโครงสร้างจาก header.html มาใช้งาน
 */
async function renderSystemUI(config) {
    try {
        const response = await fetch('/system/header.html'); 
        if (!response.ok) throw new Error("Header template not found");
        const headerHTML = await response.text();

        // ฉีด HTML เข้าไปที่ส่วนบนสุดของ Body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // ตั้งชื่อโปรเจกต์
        const projectTitle = document.getElementById('project-title');
        if (projectTitle) projectTitle.innerText = config.projectName || 'SYSTEM';

        // จัดการเมนูสีเขียว
        const menuBar = document.getElementById('sys-menu-bar');
        if (config.menus && menuBar) {
            menuBar.innerHTML = '';
            config.menus.forEach(menu => {
                const isActive = window.location.pathname.includes(menu.link) ? 'active' : '';
                menuBar.insertAdjacentHTML('beforeend', `<a href="${menu.link}" class="sys-menu-link ${isActive}">${menu.name}</a>`);
            });
        }

        // ดึงชื่อ User มาแสดง
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            const display = document.getElementById('user-display');
            if (display) display.innerText = user.user_metadata.full_name || user.email;
        }

        // ปลดล็อกหน้าขาว (Fade-in)
        document.body.classList.add('auth-ready');
    } catch (err) {
        console.error("❌ UI Fail:", err);
        document.body.classList.add('auth-ready');
    }
}

/**
 * [Assets Injection] ฉีด CSS และ JS ที่จำเป็น
 */
function injectAssets() {
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

    // ฉีด Bootstrap JS Bundle เพื่อให้ Dropdown/Collapse ทำงาน
    if (!document.querySelector('script[src*="bootstrap.bundle"]')) {
        const s = document.createElement('script');
        s.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
        document.head.appendChild(s);
    }
}

/**
 * [Helpers] ออกจากระบบ
 */
async function logout() {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    window.location.replace("/auth/login.html");
}