let state = { accessToken: null };

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email) {
            errorMessage.textContent = "Email wajib diisi";
            return;
        }
        if (!password) {
            errorMessage.textContent = "Password wajib diisi";
            return;
        }

        try {
            const res = await fetch("https://web-gdss.vercel.app/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json(); // <- pastikan 'data' didefinisikan disini

            if (!res.ok) {
                errorMessage.textContent = data.message || "Login gagal";
                return;
            }

            if (data.accessToken) {
                state.accessToken = data.accessToken;
                localStorage.setItem('accessToken', data.accessToken);
                window.location.href = "dashboard.html";
            } else {
                errorMessage.textContent = "Login gagal: token tidak diterima";
            }
        } catch (err) {
            errorMessage.textContent = "Terjadi kesalahan: " + err.message;
        }
    });
});
