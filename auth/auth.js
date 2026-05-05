/**
 * B-STROM AUTHENTICATION LOGIC
 * จัดการเรื่อง Login, Signup และ Password Reset
 */

/**
 * 1. ฟังก์ชันเข้าสู่ระบบ (Login)
 */
async function handleLogin(email, password) {
    try {
        // แสดง Loading นิดนึงให้ดูโปร
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'กำลังตรวจสอบ...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        // ถ้าสำเร็จ
        notify("สำเร็จ", "กำลังเข้าสู่ระบบ...", "success");
        
        // ดีดไปหน้าหลัก (Timeout นิดนึงให้ User เห็นแจ้งเตือน)
        setTimeout(() => {
            window.location.href = "/index.html";
        }, 1500);

        return data;

    } catch (error) {
        console.error('Login Error:', error.message);
        notify("เข้าสู่ระบบไม่สำเร็จ", error.message, "error");
        return null;
    }
}

/**
 * 2. ฟังก์ชันสมัครสมาชิก (Signup)
 */
async function handleSignup(email, password, fullName) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    role: 'staff' // กำหนด Role เริ่มต้น
                }
            }
        });

        if (error) throw error;

        notify("สมัครสมาชิกสำเร็จ", "กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน", "success");
        return data;

    } catch (error) {
        notify("สมัครไม่สำเร็จ", error.message, "error");
        return null;
    }
}

/**
 * 3. ฟังก์ชันลืมรหัสผ่าน (Forgot Password)
 */
async function handleForgotPassword(email) {
    try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/auth/reset-password.html',
        });

        if (error) throw error;

        notify("ส่งอีเมลแล้ว", "กรุณาเช็คอีเมลเพื่อตั้งรหัสผ่านใหม่", "info");
    } catch (error) {
        notify("เกิดข้อผิดพลาด", error.message, "error");
    }
}