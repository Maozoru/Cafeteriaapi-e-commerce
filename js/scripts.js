const apiURL = "https://api.sampleapis.com/coffee/hot";

// Función para obtener los productos
async function fetchProductos() {
    try {
        const response = await fetch(apiURL);
        const productos = await response.json();
        return productos;
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

// Función para mostrar productos aleatorios en la página principal
async function mostrarProductosAleatorios() {
    const productos = await fetchProductos();
    const randomProductos = [];
    for (let i = 0; i < 5; i++) {
        randomProductos.push(productos[Math.floor(Math.random() * productos.length)]);
    }

    const contenedor = document.getElementById("productos-aleatorios");
    randomProductos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}">
            <h3>${producto.title}</h3>
            <p>${producto.description}</p>
            <button onclick="agregarAlCarrito('${producto.id}', '${producto.title}', '${producto.image}', '${producto.description}')">Agregar al carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(id, nombre, imagen, descripcion) {
    const producto = { id, nombre, imagen, descripcion, cantidad: 1 };

    // Obtener el carrito desde localStorage o crear uno nuevo
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el producto ya está en el carrito
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        // Si el producto ya está, incrementamos la cantidad
        carrito[index].cantidad += 1;
    } else {
        // Si no está, lo agregamos al carrito
        carrito.push(producto);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar el contador del carrito en el ícono
    actualizarCarrito();

    // Mostrar el mensaje "Café en camino"
    mostrarNotificacion();
}

function buscarProducto() {
    const query = document.getElementById('search-bar').value;
    if (query.length > 0) {
        mostrarResultadosBusqueda(query);
    } else {
        // Si no hay texto, mostrar todos los productos
        mostrarProductos();
    }
}

// Función para mostrar la notificación
function mostrarNotificacion() {
    const notificacion = document.getElementById("notificacion");
    notificacion.style.display = "block";
    notificacion.style.animation = "mostrarNotificacion 3s ease-in-out"; // Animación

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.style.display = "none";
    }, 3000); // 3000ms = 3 segundos
}

// Función para actualizar el carrito
function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cantidadCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const iconoCarrito = document.querySelector('.fas.fa-shopping-cart');
    if (iconoCarrito) {
        iconoCarrito.setAttribute('data-count', cantidadCarrito);
    }
}

// Función para mostrar todos los productos en la página del catálogo
async function mostrarProductos() {
    const productos = await fetchProductos();
    const contenedor = document.getElementById("productos-lista");
    productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}">
            <h3>${producto.title}</h3>
            <p>${producto.description}</p>
            <button onclick="agregarAlCarrito('${producto.id}', '${producto.title}', '${producto.image}', '${producto.description}')">Agregar al carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

async function mostrarResultadosBusqueda(query) {
    const productos = await fetchProductos();
    const resultados = productos.filter(producto =>
        producto.title.toLowerCase().includes(query.toLowerCase())
    );

    const contenedor = document.getElementById("productos-lista");
    contenedor.innerHTML = '';  // Limpiar los productos del catálogo actual

    // Si no hay resultados
    if (resultados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
    } else {
        // Mostrar los productos filtrados
        resultados.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img src="${producto.image}" alt="${producto.title}">
                <h3>${producto.title}</h3>
                <p>${producto.description}</p>
                <button onclick="agregarAlCarrito('${producto.id}', '${producto.title}', '${producto.image}', '${producto.description}')">Agregar al carrito</button>
            `;
            contenedor.appendChild(div);
        });
    }
}


// Función para mostrar los productos en el carrito
function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedorCarrito = document.getElementById("productos-carrito");
    contenedorCarrito.innerHTML = ''; // Limpiar el contenedor antes de agregar los productos

    // Si el carrito está vacío, mostrar mensaje
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p>No hay productos en el carrito.</p>';
    } else {
        carrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <button onclick="eliminarDelCarrito('${producto.id}')">Eliminar</button>
            `;
            contenedorCarrito.appendChild(div);
        });
    }
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(producto => producto.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Volver a mostrar el carrito después de eliminar el producto
    mostrarCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    localStorage.removeItem('carrito'); // Elimina el carrito del localStorage
    mostrarCarrito(); // Actualiza la interfaz para reflejar el carrito vacío
}

// Función para procesar la compra
function comprarCarrito() {
    alert("¡Compra realizada con éxito!"); // Muestra un mensaje de éxito
    localStorage.removeItem('carrito'); // Elimina el carrito del localStorage
    mostrarCarrito(); // Actualiza la interfaz para reflejar el carrito vacío
}

// Cargar productos al azar en la página principal
if (document.getElementById("productos-aleatorios")) {
    mostrarProductosAleatorios();
}

// Cargar todos los productos en el catálogo
if (document.getElementById("productos-lista")) {
    mostrarProductos();
}

// Cargar resultados de búsqueda en la página de resultados
if (document.getElementById("resultados") && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("search");
    mostrarResultadosBusqueda(query);
}

// Mostrar el carrito en la página del carrito
if (document.getElementById("productos-carrito")) {
    mostrarCarrito();
}

// Cargar el carrito al cargar la página
window.onload = () => {
    actualizarCarrito();
};
