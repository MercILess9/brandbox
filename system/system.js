/**
 * B-STROM SYSTEM CORE ENGINE (2026)
 * "The Security Guard & The UI Architect"
 */

// 1. เตรียมตัวแปร Global
let supabaseClient;

/**
 * [Main Function] เริ่มต้นระบบทั้งหมด
 * @param {Object} config - { projectName: "...", menus: [{name: '...', link: '...'}] }
 */
async function initLayout(config = {}) {
    // 🚩 กู้ภัยหน้าขาว: เช็คว่าตัวแปรจาก config.js โหลดมาหรือยัง
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_KEY === 'undefined') {
        console.error("❌ Error: config.js missing or variables undefined!");
        document.body.classList.add('auth-ready'); 
        return;
    }

    // 🚩 เริ่มเดินเครื่อง Supabase Client ทันที
    if (!supabaseClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    // ฉีด Assets พื้นฐาน (CSS/JS/Viewport)
    injectAssets();
    
    // ตรวจสอบสิทธิ์การเข้าถึง (Auth Guard)
    await initAuthGuard();

    // เช็คว่าเป็นหน้าแรก (Index) หรือไม่
    const path = window.location.pathname;
    const isIndex = path.endsWith('/') || path.includes('index.html');

    if (isIndex) {
        console.log("🚀 Portal Mode: Skipping Header fetch");
        document.body.classList.add('auth-ready');
        return;
    }

    // สำหรับหน้าทำงานอื่นๆ -> ไปดึงไฟล์ header.html มาโชว์
    await renderSystemUI(config);
}

/**
 * [Auth Guard] ระบบเฝ้าประตู
 */
async function initAuthGuard() {
    if (!supabaseClient) return;

    const { data: { session } } = await supabaseClient.auth.getSession();
    const path = window.location.pathname;
    
    // รายชื่อหน้าในโฟลเดอร์ /auth/ ที่ไม่ต้องไล่ไป Login
    const isAuthPage = path.includes('login.html') || 
                       path.includes('signup.html') || 
                       path.includes('forgot-password.html');

    // กรณี 1: ยังไม่ได้ Login และไม่ใช่หน้า Auth -> ดีดไป Login
    if (!session && !isAuthPage) {
        window.location.href = "/auth/login.html";
        return;
    }

    // กรณี 2: Login แล้วแต่จะไปหน้า Login -> ดีดกลับเข้าหน้า Index
    if (session && isAuthPage) {
        window.location.href = "/index.html";
        return;
    }

    // ตรวจสอบการ Logout จาก Tab อื่นๆ
    supabaseClient.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') window.location.href = "/auth/login.html";
    });
}

/**
 * [UI Rendering] ดึงโครงสร้างจาก header.html มาใช้งาน
 */
async function renderSystemUI(config) {
    try {
        // 1. ไปดึงไฟล์ header.html (ใช้ Relative Path เพื่อความปลอดภัย)
        const response = await fetch('system/header.html'); 
        if (!response.ok) throw new Error("Could not find header.html");
        
        const headerHTML = await response.text();

        // 2. ฉีด HTML เข้าไปใน Body บนสุด
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // 3. ปรับแต่งข้อมูล Project Name
        const projectTitle = document.getElementById('project-title');
        if (projectTitle) projectTitle.innerText = config.projectName || 'SYSTEM';

        // 4. จัดการลูปเมนูในแถบสีเขียว (sys-menubar)
        const menuBar = document.getElementById('sys-menu-bar');
        if (config.menus && menuBar) {
            config.menus.forEach(menu => {
                const isActive = window.location.pathname.includes(menu.link) ? 'active' : '';
                const linkHTML = `<a href="${menu.link}" class="sys-menu-link ${isActive}">${menu.name}</a>`;
                menuBar.insertAdjacentHTML('beforeend', linkHTML);
            });
        }

        // 5. ดึงชื่อ User มาโชว์
        const { data: { user } } = await supabaseClient.auth.getUser();
        const display = document.getElementById('user-display');
        if (display && user) {
            display.innerText = user.user_metadata.full_name || user.email;
        }

        // ปลดล็อกหน้าขาว
        document.body.classList.add('auth-ready');

    } catch (err) {
        console.error("❌ UI Render Error:", err);
        // ถึงจะพังก็ต้องปลดล็อกหน้าขาวให้ User เห็นหน้าเว็บ
        document.body.classList.add('auth-ready');
    }
}

/**
 * [Assets Injection] ฉีดของจำเป็นเข้า <head>
 */
function injectAssets() {
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport"; meta.content = "width=device-width, initial-scale=1.0";
        document.head.appendChild(meta);
    }

    const links = [
        "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
    ];

    links.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
            const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = url;
            document.head.appendChild(l);
        }
    });

    // ตรวจสอบการโหลด SweetAlert2
    if (typeof Swal === 'undefined' && !document.querySelector('script[src*="sweetalert2"]')) {
        const s = document.createElement('script');
        s.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        document.head.appendChild(s);
    }
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