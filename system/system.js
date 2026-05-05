/**
 * B-STROM SYSTEM CORE ENGINE (2026)
 * "The Security Guard & The Architect"
 */

// 1. ตรวจสอบว่า B_CONFIG โหลดมาหรือยัง (ต้องวาง config.js ก่อน system.js)
if (typeof B_CONFIG === 'undefined') {
    console.error("❌ Error: config.js not found. Please load config.js before system.js");
}

// 2. สร้าง Supabase Client ไว้เป็น Global
const supabaseClient = supabase.createClient(B_CONFIG.URL, B_CONFIG.KEY);

/**
 * [Main Function] เริ่มต้นระบบทั้งหมด
 * @param {Object} config - { projectName: "...", menus: [...] }
 */
async function initLayout(config = {}) {
    // ฉีด Assets พื้นฐาน (CSS/JS/Viewport)
    injectAssets();
    
    // ตรวจสอบสิทธิ์การเข้าถึง (Auth Guard)
    await initAuthGuard();

    // ตรวจสอบว่าเป็นหน้า Portal (Index) หรือไม่
    const path = window.location.pathname;
    const isIndex = path.endsWith('/') || path.includes('index.html');

    if (isIndex) {
        console.log("🚀 Portal Mode: Skipping System UI");
        // แสดงเนื้อหาทันทีสำหรับหน้า Index
        document.body.classList.add('auth-ready');
        return;
    }

    // สำหรับหน้าทำงานอื่นๆ (เช่น B-Quest) ให้สร้าง Navbar/Sidebar
    // ใช้ DOMContentLoaded เพื่อให้มั่นใจว่า Body พร้อมสำหรับการฉีด HTML
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => renderSystemUI(config));
    } else {
        renderSystemUI(config);
    }
}

/**
 * [Auth Guard] ระบบเฝ้าประตู
 */
async function initAuthGuard() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const path = window.location.pathname;
    
    // รายชื่อหน้าในโฟลเดอร์ /auth/ ที่ไม่ต้องเช็ค Login
    const isAuthPage = path.includes('login.html') || 
                       path.includes('signup.html') || 
                       path.includes('forgot-password.html') ||
                       path.includes('reset-pass.html');

    // กรณี 1: ไม่มี Session และไม่ได้อยู่หน้า Auth -> ดีดไป Login
    if (!session && !isAuthPage) {
        window.location.href = "/auth/login.html";
        return;
    }

    // กรณี 2: มี Session แล้วแต่ดันทะลึ่งจะเข้าหน้า Login/Signup -> ดีดไป Index
    if (session && isAuthPage) {
        window.location.href = "/index.html";
        return;
    }

    // ฟังเสียงการ Logout จาก Tab อื่นๆ หรือจากระบบ
    supabaseClient.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
            window.location.href = "/auth/login.html";
        }
    });
}

/**
 * [Assets Injection] ฉีดของจำเป็นเข้า <head>
 */
function injectAssets() {
    // 1. Meta Viewport (สำหรับ Mobile Friendly)
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0";
        document.head.appendChild(meta);
    }

    // 2. CSS/Fonts (ถ้ายังไม่มีในหน้า)
    const links = [
        "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
    ];

    links.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
            const l = document.createElement('link');
            l.rel = 'stylesheet'; l.href = url;
            document.head.appendChild(l);
        }
    });

    // 3. Scripts (Swal/Bootstrap)
    const scripts = [
        "https://cdn.jsdelivr.net/npm/sweetalert2@11",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    ];

    scripts.forEach(url => {
        const isSwal = url.includes('sweetalert2') && typeof Swal !== 'undefined';
        if (!document.querySelector(`script[src="${url}"]`) && !isSwal) {
            const s = document.createElement('script');
            s.src = url;
            document.head.appendChild(s);
        }
    });
}

/**
 * [UI Rendering] สร้าง Navbar และ Sidebar
 */
function renderSystemUI(config) {
    // Navbar
    const navHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold" href="/index.html">
                    <span style="color: #bdc432">B</span>-${config.projectName || 'STROM'}
                </a>
                <div class="d-flex align-items-center">
                    <span class="text-light me-3 d-none d-sm-block" id="user-display">Loading...</span>
                    <button class="btn btn-outline-light btn-sm" onclick="logout()">Logout</button>
                </div>
            </div>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    document.body.style.paddingTop = "70px";

    // ดึงชื่อ User มาโชว์ (ถ้ามี)
    supabaseClient.auth.getUser().then(({data}) => {
        const display = document.getElementById('user-display');
        if (display && data.user) {
            display.innerText = data.user.user_metadata.full_name || data.user.email;
        }
    });

    // Sidebar (ถ้าต้องการเพิ่มภายหลัง)
    if (config.menus && config.menus.length > 0) {
        console.log("🛠 Sidebar rendering logic goes here");
    }

    document.body.classList.add('auth-ready');
}

/**
 * [Helpers] ฟังก์ชันอำนวยความสะดวกเรียกใช้ได้ทุกหน้า
 */
function notify(title, text, icon = 'success') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({ title, text, icon, timer: 2000, showConfirmButton: false });
    } else {
        alert(text);
    }
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "/auth/login.html";
}