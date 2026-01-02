const btnAnterior = document.querySelectorAll(".btn-anterior");
const btnSiguiente = document.querySelectorAll(".btn-siguiente");

const indicadores = [...document.querySelectorAll(".indicador")];

const track = document.getElementById("trak");
let index = 0;
const num_cartas = 4;
function comprobarSiguiente() {
  index++;
  if (index >= num_cartas) {
    index = 0;
  }
}

function comprobarAnterior() {
  index--;
  if (index < 0) {
    index = num_cartas;
    index = num_cartas - 1;
  }
}

function mover() {
  track.classList.add("move");
  track.style.setProperty("--mov", `${index * -100}%`); /* es con cordenada desde el origen, no acumula desde donde esta actualmente*/
  ponerIndicador();
}

function ponerIndicador() {
    indicadores.forEach((indicador,i)=>{
        indicador.classList.toggle("active",i===index)
    });
}


btnSiguiente.forEach((btn) => {
  btn.addEventListener("click", () => {
    comprobarSiguiente();
    mover();
  });
});

btnAnterior.forEach((btn) => {
  btn.addEventListener("click", () => {
    comprobarAnterior();
    mover();
  });
});
