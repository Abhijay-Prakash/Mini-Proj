// script.js
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // Toggle between login and signup forms
    loginBtn.addEventListener("click", () => {
        loginForm.style.display = "block";
        signupForm.style.display = "none";
        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");
    });

    signupBtn.addEventListener("click", () => {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");
    });

    // Default view
    loginForm.style.display = "block";
    signupForm.style.display = "none";

    // Handle login form submission
    const loginFormElement = document.getElementById("loginFormElement");
    const loginError = document.createElement("div");
    loginError.className = "alert alert-danger mt-3";
    loginError.style.display = "none";
    loginFormElement.appendChild(loginError);

    loginFormElement.addEventListener("submit", async (e) => {
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

    // Handle signup form submission
    const signupFormElement = document.querySelector("#signupForm form");
    const signupError = document.createElement("div");
    signupError.className = "alert alert-danger mt-3";
    signupError.style.display = "none";
    signupFormElement.appendChild(signupError);

    signupFormElement.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;

        try {
            const response = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fullName, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Signup Success:", data);
                alert("Signup successful! Please log in.");
                signupBtn.click(); // Redirect to the login form
            } else {
                signupError.style.display = "block";
                signupError.textContent = "Failed to signup. Please try again.";
            }
        } catch (error) {
            console.error("Error during signup:", error);
            signupError.style.display = "block";
            signupError.textContent = "Something went wrong. Please try again.";
        }
    });
});
