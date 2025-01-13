// script.js
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const authContainer = document.querySelector(".auth-container");

    loginBtn.addEventListener("click", () => {
        authContainer.classList.remove("active");
        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");
    });

    signupBtn.addEventListener("click", () => {
        authContainer.classList.add("active");
        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");
    });
});




document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginFormElement");
    const loginError = document.getElementById("loginError");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();


        const username = document.getElementById("username").value;
        const password = document.getElementById("loginPassword").value;

        try {

            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {

                const data = await response.json();
                console.log("Login Success:", data);
                window.location.href = "../html/home.html";
            } else {

                loginError.style.display = "block";
                loginError.textContent = "Invalid login credentials";
            }
        } catch (error) {
            console.error("Error during login:", error);
            loginError.style.display = "block";
            loginError.textContent = "Something went wrong. Please try again.";
        }
    });
});

