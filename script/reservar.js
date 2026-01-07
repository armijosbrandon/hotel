/*------------- botones de reservar de habitacion */
const btnEstandar = document.getElementById("btn-estandar");
const btnSuperior = document.getElementById("btn-superior");
const btnFamiliar = document.getElementById("btn-familiar");
const btnVip = document.getElementById("btn-vip");

/* -------------formulario y elementos */
const form = document.getElementById("formulario-reserva");
/* Numero habitaciones */
const numEstandar = form.numEstandar;
const numSuperior = form.numSuperior;
const numFamiliar = form.numFamiliar;
const numVip = form.numVip;

/* huespedes */
const numAdultos = form.numAdultos;
const numNiños = form.numNiños;
const numBebes = form.numBebes;

/* fechas */
const entrada = form.entrada;
const salida = form.salida;

/* precio */
const precioEstimado = document.getElementById("precio-estimado");

/* notificacion */
const notificacion = document.getElementById("notificacion");

/* ---------UTILES----- */
const capacidad = {
  estandar: 2,
  superior: 2,
  familiar: 4,
  vip: 2,
};

/* ---------FUNCIONES */
/* funcion para aumentar el num de habitaciones de un input */
function aumentarInput(input) {
  input.value = Number(input.value) + 1;
}

/* funcion para comprobar que se haiga seleccionado una fecha de entrada mayor a la de salida */
function comprobarFecha() {
  const fechaEntrada = new Date(entrada.value);
  const fechaSalida = new Date(salida.value);

  if (fechaEntrada >= fechaSalida) {
    mostrarError("La fecha de salida debe ser posterior a la de entrada.");
    return false;
  }

  return true;
}

/* funcion para comprobar que se haiga seleccionado por lo menos una habitacion */
function comprobarNumHabitaciones() {
  if (numEstandar.value == 0 && numSuperior.value == 0 && numFamiliar.value == 0 && numVip.value == 0) {
    mostrarError("Debe reservar por lo menos una habitación.");
    return false;
  }
  return true;
}

/* funcion para comprobar que el numero de huespedes no exceda la capacidad de las habitaciones*/
function comprobarNumHuespedes() {
  const capacidadTotal =
    Number(numEstandar.value) * capacidad.estandar + Number(numSuperior.value) * capacidad.superior + Number(numFamiliar.value) * capacidad.familiar + Number(numVip.value) * capacidad.vip;

  const totalHuespedes = Number(numAdultos.value) + Number(numNiños.value); // bebés no cuentan
  if (totalHuespedes > capacidadTotal) {
    mostrarError("La cantidad de huéspedes supera la capacidad de las habitaciones seleccionadas");
    return false;
  }
  return true;
}

/* Obtener label de servicios activos */
function obtenerServicios() {
  const serviciosSeleccionados = [];

  form.querySelectorAll('input[name="servicios[]"]:checked').forEach((cb) => { /* seleccionamos todos los imputs con nombre servicios que esten marcados */
    const label = form.querySelector(`label[for="${cb.id}"]`); /* label con mismo for=id que el check box */
    serviciosSeleccionados.push(label.textContent.trim()); /* añadimos sin espacios al final o al inicio */
  });

  return serviciosSeleccionados;
}

/* calculamos el num total de noches */
function calcularNoches() {
  if (!entrada.value || !salida.value) return 0;
  const fechaEntrada = new Date(entrada.value);
  const fechaSalida = new Date(salida.value);
  const msPorDia = 1000 * 60 * 60 * 24; /* calculamos los milisegundos por dia */
  if (fechaEntrada >= fechaSalida) return 0;
  const noches = Math.ceil((fechaSalida - fechaEntrada) / msPorDia); /* en jscript la resta de dos date me da en milisegundos, por eso dividimos para sacar dias, match.ceil lo redondea hacia arriba */
  return noches;
}

/* Calcular precio total */
function obtenerTotalFinal() {
  const noches = calcularNoches();

  const precio = {
    estandar: 80,
    superior: 120,
    familiar: 160,
    vip: 220,
  };

  const totalHabitaciones = Number(numEstandar.value) * precio.estandar + Number(numSuperior.value) * precio.superior + Number(numFamiliar.value) * precio.familiar + Number(numVip.value) * precio.vip;

  return totalHabitaciones * noches;
}

/* escribir el total en el documento */
function calcularPrecioEstimado() {
  const noches = calcularNoches();
  const totalFinal = obtenerTotalFinal();

  precioEstimado.textContent = `Precio estimado: $${totalFinal} (${noches} noches)`;
}

/* Mostrar error */
function mostrarError(mensaje) {
  notificacion.innerHTML = `<div class="alert alert-warning fade show">
    ${mensaje}
    </div>`;
  setTimeout(function () {
    notificacion.innerHTML = "";
  }, 5000);
}

/* funcion para enviar datos entre paginas */
function mandarDatos() {
  const datosReserva = {
    fechaEntrada: entrada.value,
    fechaSalida: salida.value,
    estandar: numEstandar.value,
    superior: numSuperior.value,
    familiar: numFamiliar.value,
    adultos: numAdultos.value,
    numNiños: numNiños.value,
    numBebes: numBebes.value,
    vip: numVip.value,
    servicios: obtenerServicios(),
    total: obtenerTotalFinal(),
  };

  // guardar en sessionStorage, e borra al salir de la pagina
  sessionStorage.setItem("reserva", JSON.stringify(datosReserva)); /* almaceno  un objeto convertido a string con la clasve reserva */

  // redirigir
  window.location.href = "MisReservas.html"; /* redirige y corta el flujo del javascript actual */
}
/* ----------EVENTOS */
/* aumentar nput de habitacion */
btnEstandar.addEventListener("click", () => {
  aumentarInput(numEstandar);
  calcularPrecioEstimado();
});

btnSuperior.addEventListener("click", () => {
  aumentarInput(numSuperior);
  calcularPrecioEstimado();
});

btnFamiliar.addEventListener("click", () => {
  aumentarInput(numFamiliar);
  calcularPrecioEstimado();
});

btnVip.addEventListener("click", () => {
  aumentarInput(numVip);
  calcularPrecioEstimado();
});

/* reservar */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!comprobarFecha()) return;
  if (!comprobarNumHabitaciones()) return;
  if (!comprobarNumHuespedes()) return;
  mandarDatos();
});

/* calcular en tiempo real */
numEstandar.addEventListener("input", calcularPrecioEstimado);
numSuperior.addEventListener("input", calcularPrecioEstimado);
numFamiliar.addEventListener("input", calcularPrecioEstimado);
numVip.addEventListener("input", calcularPrecioEstimado);
entrada.addEventListener("change", calcularPrecioEstimado);
salida.addEventListener("change", calcularPrecioEstimado);
