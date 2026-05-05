
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

// ใน /auth/auth.js
async function handleForgotPassword(email) {
    try {
        Swal.fire({ 
            title: 'Processing...', 
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading() 
        });

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            // ส่งกลับไปที่หน้าตั้งรหัสผ่านใหม่
            redirectTo: window.location.origin + '/auth/forgot-password.html', 
        });

        if (error) throw error;

        Swal.fire({
            icon: "success",
            title: "Link Sent!",
            text: "Please check your email to reset password.",
            confirmButtonColor: "rgb(45, 71, 57)"
        });

    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: err.message
        });
    }
}