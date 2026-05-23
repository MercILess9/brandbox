
async function handleLogin(email, password) {
    try {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Authenticating...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;
        notify("Success", "Welcome back!", "success");
        
        setTimeout(() => {
            window.location.href = "/index.html";
        }, 1000);

    } catch (error) {
        console.error('Login Error:', error.message);
        notify("Failed", error.message, "error");
    }
}

async function handleSignup(email, password, metadata) {
    try {
        Swal.fire({ title: 'Creating Account...', imageUrl: LOGO_URL, imageHeight: 40, imageAlt: 'Brandbox', allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() });

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: window.location.origin + '/auth/login.html', 
                data: metadata 
            }
        });

        if (error) throw error;

        Swal.fire({
            icon: "success",
            title: "Registration Complete!",
            text: "Please check your email for confirmation."
        }).then(() => {
            window.location.href = "login.html";
        });

    } catch (err) {
        const msg = err.message?.toLowerCase() || '';
        const friendly = msg.includes('already registered') || msg.includes('already been registered')
            ? 'This email is already registered. Please sign in instead.'
            : err.message;
        Swal.fire("Failed", friendly, "error");
    }
}


async function handleForgotPassword(email) {
    try {
        Swal.fire({ title: 'Processing...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/auth/reset-password.html',
        });

        if (error) throw error;

        Swal.fire({
            icon: "success",
            title: "Link Sent!",
            text: "Please check your email to reset password.",
            confirmButtonColor: "rgb(45, 71, 57)"
        });

    } catch (err) {
        Swal.fire("Error", err.message, "error");
    }
}

// 4. ฟังก์ชันอัปเดตรหัสผ่านใหม่ (สำหรับใช้ในหน้า forgot-password.html ตอนเป็นโหมด Reset)
async function handleUpdatePassword(newPassword) {
    try {
        Swal.fire({ title: 'Updating...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        const { error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        Swal.fire("Success!", "Password updated successfully.", "success").then(() => {
            window.location.href = "login.html";
        });

    } catch (err) {
        const msg = err.message?.toLowerCase() || '';
        const friendly = msg.includes('same password') || msg.includes('different from') || msg.includes('different password')
            ? 'New password must be different from your current password.'
            : err.message;
        Swal.fire("Error", friendly, "error");
    }
}

