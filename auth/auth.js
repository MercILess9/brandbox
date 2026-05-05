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

// ใน /auth/auth.js (เพิ่ม/ปรับส่วน Signup)
async function handleSignup(email, password, metadata) {
    try {
        Swal.fire({ 
            title: 'Creating Account...', 
            allowOutsideClick: false, 
            didOpen: () => Swal.showLoading() 
        });

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                // ใช้ window.location.origin เพื่อให้ชัวร์ว่า redirect กลับมาถูกที่
                emailRedirectTo: window.location.origin + '/auth/login.html', 
                data: metadata // โยนก้อนข้อมูล Emp ID, Role, etc. เข้าไปตรงนี้
            }
        });

        if (error) throw error;

        Swal.fire({ 
            icon: "success", 
            title: "Registration Complete!", 
            text: "Please check your email for confirmation." 
        }).then(() => { 
            window.location.href = "/auth/login.html"; 
        });

        return data;

    } catch (err) {
        Swal.fire("Failed", err.message, "error");
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