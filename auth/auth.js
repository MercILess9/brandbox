
// ── BX Loader HTML (ใช้เฉพาะ loading popup เท่านั้น) ──────────────────────
function bxLoader(label) {
    return `
        <svg width="0" height="0" style="position:absolute">
            <defs>
                <linearGradient id="bx-grad" x1="0" x2="1">
                    <stop offset="0%"   stop-color="#b8d137" stop-opacity="0"/>
                    <stop offset="100%" stop-color="#b8d137" stop-opacity="1"/>
                </linearGradient>
            </defs>
        </svg>
        <style>
            .bx-loader { position:relative; width:100px; height:100px; margin:8px auto 16px; }
            .bx-loader__arc { position:absolute; inset:0; width:100%; height:100%; animation:bx-rotate 1s linear infinite; }
            .bx-loader__arc circle { fill:none; stroke:url(#bx-grad); stroke-width:7; stroke-linecap:round; stroke-dasharray:200; stroke-dashoffset:60; }
            .bx-loader__logo { position:absolute; inset:0; width:56px; height:56px; object-fit:contain; margin:auto; top:0; left:0; right:0; bottom:0; }
            @keyframes bx-rotate { to { transform: rotate(360deg); } }
            .bx-label { font-size:1rem; font-weight:700; color:#1e293b; margin-top:4px; }
        </style>
        <div class="bx-loader" role="status" aria-label="Loading">
            <svg class="bx-loader__arc" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46"/>
            </svg>
            <img class="bx-loader__logo" src="${LOGO_URL}" alt=""/>
        </div>
        <div class="bx-label">${label}</div>
    `;
}

// ── Auth Functions ──────────────────────────────────────────────────────────

async function handleLogin(email, password) {
    try {
        if (typeof Swal !== 'undefined') {
            Swal.fire({ html: bxLoader('Authenticating...'), showConfirmButton: false, allowOutsideClick: false });
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
        Swal.fire({ html: bxLoader('Creating Account...'), showConfirmButton: false, allowOutsideClick: false });

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
        Swal.fire({ html: bxLoader('Processing...'), showConfirmButton: false, allowOutsideClick: false });

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

async function handleUpdatePassword(newPassword) {
    try {
        Swal.fire({ html: bxLoader('Updating...'), showConfirmButton: false, allowOutsideClick: false });

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
