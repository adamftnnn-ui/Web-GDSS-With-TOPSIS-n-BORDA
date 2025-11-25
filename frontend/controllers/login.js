let state = { accessToken: null };

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");
    const submitBtn = loginForm.querySelector("button");
    const normalBtnHTML = submitBtn.innerHTML; 

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

        // START LOADING
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-70", "cursor-not-allowed");
        submitBtn.innerHTML = `
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                </path>
            </svg>
            <span>Loading...</span>
        `;

        try {
            const res = await fetch("https://web-gdss.vercel.app/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                errorMessage.textContent = data.message || "Login gagal";

                // STOP LOADING
                submitBtn.disabled = false;
                submitBtn.innerHTML = normalBtnHTML;
                submitBtn.classList.remove("opacity-70", "cursor-not-allowed");

                return; // Tetap stay di login page
            }

            if (data.accessToken) {
                state.accessToken = data.accessToken;
                localStorage.setItem('accessToken', data.accessToken);

                // SUCCESS → redirect
                window.location.href = "dashboard.html";
            } else {
                errorMessage.textContent = "Login gagal: token tidak diterima";
            }
        } catch (err) {
            errorMessage.textContent = "Terjadi kesalahan: " + err.message;
        }

        // STOP LOADING (jika error)
        submitBtn.disabled = false;
        submitBtn.innerHTML = normalBtnHTML;
        submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
    });
});
