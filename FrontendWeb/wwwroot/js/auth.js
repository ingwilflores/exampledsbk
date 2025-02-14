const API_URL = "https://localhost:7161/api";

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error("Usuario o contraseña incorrectos.");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);

        window.location.href = "/Home/Productos"; // Redirigir a la página de productos
    } catch (error) {
        document.getElementById("loginError").textContent = error.message;
    }
});
