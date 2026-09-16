let contador = document.getElementById("contador")
let boton = document.querySelector(".boton")

let cont = 0

function contar() {
    contador.innerHTML = ++cont;
}