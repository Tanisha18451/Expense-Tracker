document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!username || !email || !password || !confirmPassword) {
        alert("⚠️ Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("❌ Passwords do not match!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.text();

        if (response.ok) {
            alert("✅ Signup successful! Please login now.");
            window.location.href = "../login/login.html";
        } else {
            alert(`❌ Signup failed: ${result}`);
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("⚠️ Could not connect to server. Please try again later.");
    }
});
