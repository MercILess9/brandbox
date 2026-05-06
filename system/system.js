
let supabaseClient;

// 1. Initial Supabase Client
if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}


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

async function renderSystemUI(config) {
    const response = await fetch('/system/header.html?v=' + Date.now());
    const headerHTML = await response.text();
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // 1. ดึงชื่อโปรเจกต์จาก Config (เช่น "B-QUEST")
    if (config.projectName) {
        document.getElementById('project-title').innerText = config.projectName;
    }

    // 2. ดึงรายการเมนูจาก Config มาสร้าง (List, Assignment)
    // ใน system.js ส่วนของ renderSystemUI
    const menuBar = document.getElementById('sys-nav-inject'); // 🚩 เปลี่ยน ID ตัวรับเป็นอันนี้
    if (config.menus && menuBar) {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        menuBar.innerHTML = config.menus.map(menu => {
            const isActive = (currentPath === menu.link) ? 'active' : '';
            return `<a href="${menu.link}" class="sys-menu-link ${isActive}">${menu.name}</a>`;
        }).join('');
    }
}

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

    if (!document.querySelector('script[src*="bootstrap.bundle"]')) {
        const s = document.createElement('script');
        s.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
        document.head.appendChild(s);
    }

    if (!document.querySelector('#sys-core-layout')) {
        const s = document.createElement('style');
        s.id = 'sys-core-layout';
        s.innerText = `
            body { 
                padding-top: 105px !important; 
            }
            .flt-wrapper { 
                top: 105px !important; 
            }
        `;
        document.head.appendChild(s);
    }
}

// ฟังก์ชัน Logout แบบกดแล้วออกเลย ไม่ต้องถาม
async function handleLogout() {
    try {
        // 1. สั่ง Sign Out จาก Supabase ทันที
        await supabaseClient.auth.signOut();

        // 2. ล้างข้อมูลทุกอย่างใน Browser
        localStorage.clear();
        sessionStorage.clear();

        // 3. ดีดกลับไปหน้า Login
        window.location.replace('auth/login.html');
    } catch (err) {
        console.error("Logout Error:", err);
        // ถ้ามีปัญหาจริงๆ ค่อยเด้ง alert บอก
        alert("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
}