const IMAGENES = ["star", "heart", "sun", "moon", "cloud", "tree", "flower", "wave", "mountain"];

// nodos dom. elementos html para modificar durante el juego
const tablero = document.getElementById("tablero");
const tiempo = document.getElementById("tiempo");
const elIntentos = document.getElementById("intentos");
const elParejas = document.getElementById("parejas");
const btnJugar = document.querySelector(".btn-jugar");
const btnReiniciar = document.querySelector(".btn-reiniciar");
const infoVictoria = document.getElementById("info-victoria");
const resumenVictoria = document.getElementById("resumen-victoria");
const btnJugarOtra = document.querySelector(".btn-jugar-otra");

// estado del juego
let cartaVolteada = null;
let bloqueado = false;
let intentos = 0;
let parejasEncontradas = 0;
let segundos = 0;
let idIntervalo = null;

// EventListener en el tablero en vez de cada carta
tablero.addEventListener("click", (event) => {
    const carta = event.target.closest(".carta");

    if (!carta) return;
    voltearCarta(carta);
});

function barajar(array) {
    const copia = [...array]; // copia independiente
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function construirTablero() {
    tablero.textContent = "";
    const parejas = barajar([...IMAGENES, ...IMAGENES]);

    for (const nombre of parejas) {
        tablero.appendChild(crearCarta(nombre));
    }
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
    imagen.alt = nombre;

    frente.appendChild(imagen);
    interior.append(dorso, frente);
    carta.appendChild(interior);

    return carta;
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

function comprobarPareja(primera, segunda) {
    intentos++;
    actualizarContadores();

    const esPareja = primera.dataset.nombre === segunda.dataset.nombre;

    if (esPareja) {
        primera.classList.add("encontrada");
        segunda.classList.add("encontrada");
        cartaVolteada = null;
        parejasEncontradas++;
        actualizarContadores();

        if (parejasEncontradas === IMAGENES.length) {
            ganarPartida();
        }
        return;
    }

    bloqueado = true;
    setTimeout(() => {
        primera.classList.remove("volteada");
        segunda.classList.remove("volteada");
        cartaVolteada = null;
        bloqueado = false;
    }, 800);
}

function actualizarContadores() {
    elIntentos.textContent = `Intentos: ${intentos}`;
    elParejas.textContent = `Parejas: ${parejasEncontradas} / ${IMAGENES.length}`;
}

function formatearTiempo(total) {
    const minutos = Math.floor(total / 60).toString().padStart(2, "0");
    const segs = (total % 60).toString().padStart(2, "0");

    return `${minutos}:${segs}`;
}

function iniciarTemporizador() {
    clearInterval(idIntervalo);

    const actualizarTiempo = () => {
        tiempo.textContent = `Tiempo: ${formatearTiempo(segundos)}`;
    }

    segundos = 0;
    actualizarTiempo();

    idIntervalo = setInterval(() => {
        segundos++;
        actualizarTiempo();
    }, 1000);
}

function ganarPartida() {
    clearInterval(idIntervalo);
    resumenVictoria.textContent = `Lo lograste en ${formatearTiempo(segundos)} con ${intentos} intentos.`;
    infoVictoria.classList.remove("oculto");
}

function jugar() {
    intentos = 0;
    parejasEncontradas = 0;
    cartaVolteada = null;
    bloqueado = false;

    actualizarContadores();
    infoVictoria.classList.add("oculto");
    construirTablero();
    iniciarTemporizador();
}

function teclaSecreta(evento) {
    if (evento.key.toLowerCase() === "m") {
        document.body.classList.toggle("modo-oscuro");
    }
}

btnJugar.addEventListener("click", jugar);
btnReiniciar.addEventListener("click", jugar);
btnJugarOtra.addEventListener("click", jugar);
document.addEventListener("keydown", teclaSecreta);

actualizarContadores();
construirTablero();
