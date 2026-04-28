// ==========================================
// B-QUEST SYSTEM ENGINE (system.js)
// ==========================================

// 1. Initialize Supabase Client
// ไฟล์นี้จะเรียกใช้ SUPABASE_URL และ SUPABASE_KEY จาก config.js
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * 2. AUTH GUARD (ยามเฝ้าประตู)
 * ฟังก์ชันนี้จะเช็คว่า User ล็อกอินหรือยัง ถ้ายังจะดีดกลับหน้า Login ทันที
 * ยกเว้นหน้าที่ระบุไว้ใน publicPages
 */
async function checkSystemAuth() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    const publicPages = ['login.html', 'register.html'];
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';

    // เคสที่ 1: ไม่มีบัตร แต่จะเข้าหน้า Private -> ไล่ไป Login
    if (!session && !publicPages.includes(currentPage)) {
        window.location.href = "login.html";
    }
    
    // เคสที่ 2: มีบัตรแล้ว แต่อยากเข้าหน้า Login/Register -> ไล่ไปหน้าแรก (Index)
    if (session && publicPages.includes(currentPage)) {
        window.location.href = "index.html"; 
    }

    return session;
}

/**
 * 3. SYSTEM UTILITIES (ไม้ตายส่วนกลาง)
 * รวมคำสั่งที่พี่ต้องใช้บ่อยๆ ไว้ใน Object เดียว เรียกใช้ง่ายๆ
 */
const BQuest = {
    // ระบบ Logout
    async logout() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error("Logout Error:", error.message);
        }
        window.location.href = "login.html";
    },

    // ดึงข้อมูล Profile จากตาราง profiles มาโชว์
    async getProfile(userId) {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error("Fetch Profile Error:", error);
            return null;
        }
        return data;
    },

    // ฟังก์ชันช่วยยัดข้อมูลลง Element (ช่วยลดการเขียน document.getElementById บ่อยๆ)
    setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    },

    // แจ้งเตือนสวยๆ (ใช้ SweetAlert2)
    notify(title, type = 'success') {
        Swal.fire({
            title: title,
            icon: type,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }
};

// --- รันระบบยามทันทีเมื่อโหลดไฟล์ ---
checkSystemAuth();