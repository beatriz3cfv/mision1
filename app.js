const IMAGENES = ["star", "heart", "sun", "moon", "cloud", "tree", "flower", "wave", "mountain"];

// nodos dom. elementos html para modificar durante el juego
const tablero = document.getElementById("tablero");
const tiempo = document.getElementById("tiempo");
const mensaje = document.getElementById("mensaje");
const btnJugar = document.querySelector(".btn-jugar");

// estado del juego
let cartaVolteada = null;
let bloqueado = false;
let parejasEncontradas = 0;
let segundos = 0;
let idIntervalo = null;

function barajar(array) {
    const copia = [...array]; // copia independiente
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function crearCarta(nombre) {
    const carta = document.createElement("div");
    carta.className = "carta";
    carta.dataset.nombre = nombre;

    const interior = document.createElement("div");
    interior.className = "carta-interior";

    const dorso = document.createElement("div");
    dorso.className = "carta-cara carta-dorso";
    dorso.textContent = "?";

    const frente = document.createElement("div");
    frente.className = "carta-cara carta-frente";

    const imagen = document.createElement("img");
    imagen.src = `images/${nombre}.svg`;
    
    frente.appendChild(imagen);
    interior.append(dorso, frente);
    carta.appendChild(interior);

    carta.addEventListener("click", () => voltearCarta(carta));
    return carta;
}

function construirTablero() {
    tablero.textContent = "";
    const parejas = barajar([...IMAGENES, ...IMAGENES]);

    for (const nombre of parejas) {
        tablero.appendChild(crearCarta(nombre));
    }
}

function voltearCarta(carta) {
    if (bloqueado) return;
    if (carta.classList.contains("volteada") || carta.classList.contains("encontrada")) return;

    carta.classList.add("volteada");

    if (!cartaVolteada) {
        cartaVolteada = carta;
        return;
    }

    comprobarPareja(cartaVolteada, carta);
}