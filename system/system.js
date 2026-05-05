
let supabaseClient;

/**
 * [Main Function] เริ่มต้นระบบทั้งหมด
 * @param {Object} config - { projectName: "...", menus: [...] }
 */
async function initLayout(config = {}) {
    // 🚩 กู้ภัยหน้าขาว: เช็คว่าตัวแปรจาก config.js โหลดมาครบไหม
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_KEY === 'undefined') {
        console.error("❌ Error: config.js not found or variables missing!");
        // ถ้าพัง ให้ฝืนแสดงหน้าจอ (ปลดล็อก opacity: 0) เพื่อให้เห็น Error บน Console
        document.body.classList.add('auth-ready'); 
        return;
    }

    if (!supabaseClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    // ฉีด Assets พื้นฐาน (CSS/JS/Viewport)
    injectAssets();
    
    // ตรวจสอบสิทธิ์การเข้าถึง (Auth Guard)
    await initAuthGuard();

    // ตรวจสอบว่าเป็นหน้า Portal (Index) หรือไม่
    const path = window.location.pathname;
    const isIndex = path.endsWith('/') || path.includes('index.html');

    if (isIndex) {
        console.log("🚀 Portal Mode: Skipping System UI");
        // แสดงเนื้อหาทันทีสำหรับหน้า Index (ปลดล็อกหน้าขาว)
        document.body.classList.add('auth-ready');
        return;
    }

    // สำหรับหน้าทำงานอื่นๆ (เช่น B-Quest) ให้สร้าง Navbar/Sidebar
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
    if (!supabaseClient) return;

    const { data: { session } } = await supabaseClient.auth.getSession();
    const path = window.location.pathname;
    
    // รายชื่อหน้าในโฟลเดอร์ /auth/ ที่ "รปภ." ไม่ต้องไล่ไป Login
    const isAuthPage = path.includes('login.html') || 
                       path.includes('signup.html') || 
                       path.includes('forgot-password.html');

    // กรณี 1: ยังไม่ได้ Login และพยายามเข้าหน้าทำงาน -> ดีดไป Login
    if (!session && !isAuthPage) {
        window.location.href = "/auth/login.html";
        return;
    }

    // กรณี 2: Login แล้ว แต่จะกลับไปหน้า Login/Signup -> ดีดไป Index
    if (session && isAuthPage) {
        window.location.href = "/index.html";
        return;
    }

    // ตรวจสอบการ Logout จาก Tab อื่นๆ
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
    // 1. Meta Viewport (สำหรับมือถือ)
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0";
        document.head.appendChild(meta);
    }

    // 2. CSS/Fonts
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

    // 3. Scripts (SweetAlert2)
    if (typeof Swal === 'undefined' && !document.querySelector('script[src*="sweetalert2"]')) {
        const s = document.createElement('script');
        s.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        document.head.appendChild(s);
    }
}

/**
 * [UI Rendering] สร้าง Navbar (เฉพาะหน้าทำงาน ไม่รันใน Index)
 */
function renderSystemUI(config) {
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

    // ดึงชื่อ User มาโชว์
    supabaseClient.auth.getUser().then(({data}) => {
        const display = document.getElementById('user-display');
        if (display && data.user) {
            display.innerText = data.user.user_metadata.full_name || data.user.email;
        }
    });

    // แสดงหน้าจอเมื่อทุกอย่างพร้อม
    document.body.classList.add('auth-ready');
}

/**
 * [Helpers]
 */
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
    window.location.href = "/auth/login.html";
}