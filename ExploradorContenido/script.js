const quoteContent = document.getElementById("quote-content");
const dogContent = document.getElementById("dog-content");
const catContent = document.getElementById("cat-content");
const factContent = document.getElementById("fact-content");

async function obtenerCita() {
  await consultarSeccion("quote", async () => {
    const response = await fetch("https://dummyjson.com/quotes/random");
    if (!response.ok) throw new Error("No se pudo obtener la cita.");
    const data = await response.json();

    quoteContent.replaceChildren();
    const quote = document.createElement("p");
    quote.className = "quote-text";
    quote.textContent = `“${data.quote}”`;

    const author = document.createElement("p");
    author.className = "quote-author";
    author.textContent = `— ${data.author}`;

    quoteContent.append(quote, author);
  });
}

async function obtenerPerro() {
  await consultarSeccion("dog", async () => {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    if (!response.ok) throw new Error("No se pudo obtener la imagen del perro.");
    const data = await response.json();

    mostrarImagen(dogContent, data.message, "Imagen aleatoria de un perro");
  });
}

async function obtenerGato() {
  await consultarSeccion("cat", async () => {
    const response = await fetch("https://cataas.com/cat?json=true");
    if (!response.ok) throw new Error("No se pudo obtener la imagen del gato.");
    const data = await response.json();

    // CATAAS entrega un objeto JSON con un identificador de imagen (_id).
    const imageUrl = data.url || `https://cataas.com/cat/${data._id}`;
    mostrarImagen(catContent, imageUrl, "Imagen aleatoria de un gato");
  });
}

async function obtenerDatoCurioso() {
  await consultarSeccion("fact", async () => {
    const response = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
    if (!response.ok) throw new Error("No se pudo obtener el dato curioso.");
    const data = await response.json();

    const paragraph = document.createElement("p");
    paragraph.textContent = data.text;
    factContent.replaceChildren(paragraph);
  });
}

// Gestiona carga, botón, errores y recuperación de cada tarjeta por separado.
async function consultarSeccion(nombre, solicitud) {
  const button = document.getElementById(`${nombre}-button`);
  const content = document.getElementById(`${nombre}-content`);
  const status = document.getElementById(`${nombre}-status`);

  button.disabled = true;
  status.textContent = "Cargando…";
  content.replaceChildren();

  try {
    await solicitud();
    status.textContent = "";
  } catch (error) {
    content.textContent = "No se pudo cargar el contenido. Intenta nuevamente.";
    status.textContent = `Error: ${error.message}`;
  } finally {
    button.disabled = false;
  }
}

function mostrarImagen(contenedor, url, textoAlternativo) {
  const image = document.createElement("img");
  image.className = "animal-image";
  image.src = url;
  image.alt = textoAlternativo;
  image.onerror = () => {
    image.remove();
    contenedor.textContent = "La imagen no se pudo cargar. Intenta nuevamente.";
  };
  contenedor.replaceChildren(image);
}

// Botones: cada uno actualiza exclusivamente su tarjeta.
document.getElementById("quote-button").addEventListener("click", obtenerCita);
document.getElementById("dog-button").addEventListener("click", obtenerPerro);
document.getElementById("cat-button").addEventListener("click", obtenerGato);
document.getElementById("fact-button").addEventListener("click", obtenerDatoCurioso);

// Cargar las cuatro secciones al abrir la página.
obtenerCita();
obtenerPerro();
obtenerGato();
obtenerDatoCurioso();
