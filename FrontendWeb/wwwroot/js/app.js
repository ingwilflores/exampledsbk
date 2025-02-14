const API_URL = "https://localhost:7161/api"; // Cambia el puerto si es necesario

// 🔹 Verificar si hay un token almacenado y mostrar la interfaz adecuada
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (token) {
        mostrarContenidoProtegido();
    } else {
        mostrarLogin();
    }
});

// 🔹 Función para iniciar sesión y obtener el token JWT
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Evitar que el formulario recargue la página automáticamente

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            console.log("Intentando iniciar sesión con:", username, password);

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
                console.log("Token guardado correctamente:", data.token);

                mostrarContenidoProtegido();
            } catch (error) {
                document.getElementById("loginError").textContent = error.message;
                console.error("Error en el login:", error);
            }
        });
    } else {
        console.error("No se encontró el formulario de login en el DOM.");
    }
});


// 🔹 Función para mostrar la sección de productos después del login
function mostrarContenidoProtegido() {
    const loginContainer = document.getElementById("loginContainer");
    const contentContainer = document.getElementById("contentContainer");

    if (!loginContainer || !contentContainer) {
        console.error("Error: No se encontraron los elementos en el DOM.");
        return;
    }

    loginContainer.style.display = "none";
    contentContainer.style.display = "block";
    obtenerProductos();
}

// 🔹 Función para mostrar el formulario de login si el usuario no está autenticado
function mostrarLogin() {
    const loginContainer = document.getElementById("loginContainer");
    const contentContainer = document.getElementById("contentContainer");

    if (!loginContainer || !contentContainer) {
        console.error("Error: No se encontraron los elementos en el DOM.");
        return;
    }

    loginContainer.style.display = "block";
    contentContainer.style.display = "none";
}

// 🔹 Función para obtener productos protegidos
async function obtenerProductos() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Debes iniciar sesión primero.");
        mostrarLogin();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                alert("Sesión expirada o no autorizada.");
                cerrarSesion();
            } else {
                throw new Error("Error al obtener productos.");
            }
            return;
        }

        const productos = await response.json();
        console.log("Productos obtenidos:", productos);
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        alert("Error al obtener productos.");
    }
}

// 🔹 Función para mostrar los productos en la tabla
function mostrarProductos(productos) {
    const tabla = document.getElementById("productosTabla");
    tabla.innerHTML = "";

    productos.forEach(producto => {
        tabla.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>`;
    });
}

// 🔹 Función para agregar un nuevo producto
document.getElementById("productForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const producto = {
        nombre: document.getElementById("nombre").value,
        precio: parseFloat(document.getElementById("precio").value),
        stock: parseInt(document.getElementById("stock").value)
    };

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            throw new Error("Error al agregar producto.");
        }

        obtenerProductos();
        document.getElementById("productForm").reset();
    } catch (error) {
        console.error("Error al agregar producto:", error);
        alert(error.message);
    }
});

// 🔹 Función para eliminar un producto
async function eliminarProducto(id) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Error al eliminar producto.");
        }

        obtenerProductos();
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert(error.message);
    }
}

// 🔹 Función para editar un producto
function editarProducto(id, nombre, precio, stock) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("precio").value = precio;
    document.getElementById("stock").value = stock;

    document.getElementById("productForm").onsubmit = async function (event) {
        event.preventDefault();

        const productoActualizado = {
            id,
            nombre: document.getElementById("nombre").value,
            precio: parseFloat(document.getElementById("precio").value),
            stock: parseInt(document.getElementById("stock").value)
        };

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(productoActualizado)
            });

            if (!response.ok) {
                throw new Error("Error al actualizar producto.");
            }

            obtenerProductos();
            document.getElementById("productForm").reset();
            document.getElementById("productForm").onsubmit = agregarProducto;
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            alert(error.message);
        }
    };
}

// 🔹 Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("token");
    mostrarLogin();
}
