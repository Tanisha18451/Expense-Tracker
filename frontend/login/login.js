// ✅ Handle Login Form
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "" || password === "") {
    alert("Please fill all fields!");
    return;
  }

  try {
    // 🔹 Send data to backend
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }), // ✅ match backend
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(errorText || "Login failed!");
      return;
    }

    const data = await response.json();

    if (data.message === "Login successful") {
      // Save username for greeting in dashboard
      localStorage.setItem("username", data.username);
      alert("Login successful!");
      window.location.href = "../dashboard/dashboard.html"; // redirect to dashboard
    } else {
      alert(data.message || "Invalid username or password!");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Error connecting to server. Please try again later.");
  }
});
