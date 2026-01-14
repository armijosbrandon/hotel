/* ---------------FUNCIONES-------------- */
/* funcion para obtener el numero de reserva actual cargado en memoria */
function obtenerNumeroReserva() {
  let contador = localStorage.getItem("contadorReservas");
  /* si no existe empieza en 7 */
  if (!contador) {
    contador = 7; // empieza desde 7
  } else {
    /* si ya existe entonces solo lo iguala a su valor actual */
    contador = Number(contador);
  }
  return contador;
}

/*------------------ funciones para obtener datos de factura del formulario de reservas */
function obtenerHabitacionesTexto(datos) {
  const tipos = [];

  if (datos.estandar > 0) tipos.push(`${datos.estandar} Estándar`);
  if (datos.superior > 0) tipos.push(`${datos.superior} Superior`);
  if (datos.familiar > 0) tipos.push(`${datos.familiar} Familiar`);
  if (datos.vip > 0) tipos.push(`${datos.vip} VIP`);

  return tipos.join(", "); /* unimos con , */
}

function obtenerHuespedesTexto(datos) {
  return `${datos.adultos} adultos, ${datos.numNiños} niños, ${datos.numBebes} bebés`;
}

function obtenerServiciosTexto(servicios) {
  return servicios.length ? servicios.join(", ") : "Ninguno";
}

/* ------------------------funciones para obtener datos de una reserva y generar factura*/
function obtenerDatosReserva(articulo) {
  const datos = {}; /* objeto vacio */

  // Buscamos todos los dt y dd dentro del articulo (incluyendo el acordeon)
  const dtList = articulo.querySelectorAll("dt");
  const ddList = articulo.querySelectorAll("dd");

  dtList.forEach((dt, i) => {
    /* por cada dt con su indice correspondiente */
    const key = dt.textContent.trim(); /* obtenemos el dt como clave */
    const value = ddList[i].textContent.trim(); /* obtenemos el dd correspondiente como valor */

    /* AÑADIENDO PARES CLAVE VALOR SEGÚN LA ETIQUETA */
    if (key.includes("Fecha de entrada")) datos.fechaEntrada = value;
    if (key.includes("Fecha de salida")) datos.fechaSalida = value;
    if (key.includes("Huéspedes")) datos.huespedes = value;
    if (key.includes("Tipo de habitación")) datos.habitaciones = value;
    if (key.includes("Servicios adicionales")) datos.servicios = value;
    if (key.includes("Precio estimado")) datos.total = value;
    if (key.includes("Estado")) datos.estado = value;
  });

  return datos;
}

/* ------------------funcion para crear reserva de forma dinamica */
function renderReserva(datos, contenedor, numeroReserva) {
  /* ETIQUETA */
  const article = document.createElement("article");
  article.className = "col-12 col-md-4";
  article.dataset.reservaId = numeroReserva;

  /* codigo html html */
  article.innerHTML = `
    <div class="card card-animada border-success mb-3">
      <div class="card-header bg-transparent border-success">
        Reserva #${numeroReserva}
      </div>

      <div class="card-body text-success">
        <h5 class="card-title">Datos de reserva</h5>

        <dl class="list-group list-group-flush">
          <dt class="list-group-item">Fecha de entrada:</dt>
          <dd class="list-group-item">
            <time datetime="${datos.fechaEntrada}">${new Date(datos.fechaEntrada).toLocaleString()}</time>
          </dd>

          <dt class="list-group-item">Fecha de salida:</dt>
          <dd class="list-group-item">
            <time datetime="${datos.fechaSalida}">${new Date(datos.fechaSalida).toLocaleString()}</time>
          </dd>

          <dt class="list-group-item">Huéspedes:</dt>
          <dd class="list-group-item">${obtenerHuespedesTexto(datos)}</dd>

          <dt class="list-group-item">Tipo de habitación:</dt>
          <dd class="list-group-item">${obtenerHabitacionesTexto(datos)}</dd>
        </dl>

        <div class="accordion mt-3">
          <div class="accordion-item">
            <h4 class="accordion-header">
              <button class="accordion-button collapsed" type="button"
                data-bs-toggle="collapse" data-bs-target="#reservaExtras">
                Más detalles
              </button>
            </h4>

            <div id="reservaExtras" class="accordion-collapse collapse">
              <div class="bg-body p-0">
                <dl class="list-group list-group-flush mb-0">
                  <dt class="list-group-item">Servicios adicionales:</dt>
                  <dd class="list-group-item">${obtenerServiciosTexto(datos.servicios)}</dd>

                  <dt class="list-group-item">Precio estimado:</dt>
                  <dd class="list-group-item">$${datos.total}</dd>

                  <dt class="list-group-item">Estado:</dt>
                  <dd class="list-group-item">Pendiente</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer bg-transparent border-success">
        <div class="row gx-2">
          <div class="col-12 col-md-4 mb-2">
            <button class="btn btn-danger w-100 btn-cancelar">Cancelar</button>
          </div>
          <div class="col-12 col-md-4 mb-2">
            <button class="btn btn-warning w-100">Modificar</button>
          </div>
          <div class="col-12 col-md-4">
            <button class="btn btn-info w-100 btn-factura">Ver factura</button>
          </div>
        </div>
      </div>
    </div>
  `;

  contenedor.appendChild(article);
}

/* funcion para generar facturas de forma dinamica */
function renderFactura(datos, contenedor, numeroReserva) {
  contenedor.innerHTML = ""; /* vaciamos */
  const article = document.createElement("article");
  article.className = "col-12 col-md-8 mx-auto";

  article.innerHTML = `
    <div class="card border-success mb-4">
      <div class="card-header bg-transparent border-success">
        <h4 class="mb-0 text-primary">Comprobante de Reserva #${numeroReserva}</h4>
      </div>

      <div class="card-body">
        <div class="mb-4">
          <h5 class="text-secondary">Aurora Hotel</h5>
          <address class="mb-0">
            Quito, Ecuador<br>
            Retamas 117 y Pablo Casals<br>
            Tel: <a href="tel:+34600000000">+34 600 000 000</a><br>
            Email: <a href="mailto:contacto@aurorahotel.com">contacto@aurorahotel.com</a>
          </address>
        </div>
        <hr>
        <div class="mb-4">
          <h5 class="text-secondary">Datos de la reserva</h5>
          <dl class="list-group list-group-flush">
            <dt class="list-group-item">Fecha de entrada</dt>
            <dd class="list-group-item">${datos.fechaEntrada}</dd>

            <dt class="list-group-item">Fecha de salida</dt>
            <dd class="list-group-item">${datos.fechaSalida}</dd>

            <dt class="list-group-item">Número de huéspedes</dt>
            <dd class="list-group-item">${datos.huespedes}</dd>

            <dt class="list-group-item">Tipo de habitación</dt>
            <dd class="list-group-item">${datos.habitaciones}</dd>

            <dt class="list-group-item">Servicios adicionales</dt>
            <dd class="list-group-item">${datos.servicios}</dd>
          </dl>
        </div>
        <hr>
        <div>
          <h5 class="text-secondary">Detalle de precios</h5>
          <ul class="list-group list-group-flush mb-3">
            <li class="list-group-item d-flex justify-content-between">
              <span>Total estimado</span>
              <span>${datos.total}</span>
            </li>
          </ul>
          <p class="mb-0">
            <strong>Estado de la reserva:</strong>
            <span class="text-success">${datos.estado || "Pendiente"}</span>
          </p>
        </div>
      </div>
      <div class="card-footer bg-transparent border-success text-end">
        <small class="text-muted">Este comprobante es válido como referencia de reserva.</small>
      </div>
    </div>
  `;

  contenedor.appendChild(article);
}

/* ----------FUCNIONES DE CALCULO PARA TARGETAS DE INFO EXTRA */
function calcularReservasComfirmadas() {
  const numConfirmadas = document.getElementById("num-reservas-confirmadas");
  // Obtener todos los articles de reservas
  const articles = document.querySelectorAll("#contenedor-reservas article");

  // Filtrar solo los que tienen estado "Confirmada"
  const confirmadas = Array.from(articles).filter((article) => {
    // Buscar el dd que contiene el estado
    const estadoDD = article.querySelector(".accordion .list-group-item:last-child");
    return estadoDD && estadoDD.textContent.trim() === "Confirmada";
  });

  numConfirmadas.textContent = confirmadas.length;
  calcularProximoCheckIn(confirmadas);
}

function calcularReservasCompletadas() {
  const numCompletadas = document.getElementById("num-reservas-completadas");
  // Obtener todos los articles de reservas
  const articles = document.querySelectorAll("#contenedor-reservas article");

  // Filtrar solo los que tienen estado "completada"
  const completadas = Array.from(articles).filter((article) => {
    // Buscar el dd que contiene el estado
    const estadoDD = article.querySelector(".accordion .list-group-item:last-child");
    return estadoDD && estadoDD.textContent.trim() === "Completada";
  });

  numCompletadas.textContent = completadas.length;
}

function calcularProximoCheckIn(confirmadas) {
  const proximoCheckIn = document.getElementById("proximo-chech-in");
  let fechaProxima = null;

  confirmadas.forEach((article) => {
    // Obtener la fecha de entrada desde el time
    const timeEntrada = article.querySelector("dl.list-group time"); /* buscamos <time> dentro de <dl class="list-group"> */
    const fecha = new Date(timeEntrada.getAttribute("datetime")); /* valor del atributto datetime de la etiqueta time */

    // Ignoramos fechas pasadas
    if (fecha < new Date()) return;

    if (!fechaProxima || fecha < fechaProxima) {
      fechaProxima = fecha;
    }
  });

  proximoCheckIn.innerHTML = `<time datetime="${fechaProxima.toISOString()}">${fechaProxima.toLocaleString()}</time>`;
}

/* ----------------------EJECUCION--------------- */

document.addEventListener("DOMContentLoaded", () => {
  /* ejecuta una ves cargado el doom */
  const datos = JSON.parse(sessionStorage.getItem("reserva")); //convierto  json el dato reserva que habia mandado en la anterior pagina
  /* CONTENEDOR PRINCIPAL */
  const contenedorReservas = document.getElementById("contenedor-reservas");
  /* cONTENEDOR DE FACTURAS */
  const contenedorFacturas = document.getElementById("contenedor-facturas");

  /* ------------GENERACION DE FACTURAS----- */
  contenedorReservas.addEventListener("click", (e) => {
    /* escucha cualquier clik en el contenedor */
    if (!e.target.classList.contains("btn-factura") && !e.target.classList.contains("btn-cancelar")) return; //e.target= elemento clickeado, no contiene la clase btn-factura, retorna y no hace nada

    const articleReserva = e.target.closest("article"); /* devuelve el primer article padre del boton que se pulso */
    const numeroReserva = articleReserva.dataset.reservaId; /* devuelve el valor que se guarde en un atributo data-reserva-id */
    if (e.target.classList.contains("btn-factura")) {
      const datos = obtenerDatosReserva(articleReserva);
      renderFactura(datos, contenedorFacturas, numeroReserva);
    }

    if (e.target.classList.contains("btn-cancelar")) {
      const confirmacion = confirm("¿Estás seguro de que deseas cancelar la reserva?");
      alert("Reserva cancelada");
      articleReserva.remove();
    }
  });

  /* ------------GENERACION DE RECIVOS----- */
  const numeroReserva = obtenerNumeroReserva(); /* OBTENGO NUMERO DE RESERVA */
  if (datos) {
    /* si se mando algo de la anterior pagina de form se carga una nueva reserva, si no , no */
    renderReserva(datos, contenedorReservas, numeroReserva);
    // guardar el siguiente número para la proxima reserva
    localStorage.setItem("contadorReservas", numeroReserva + 1); /* aumento el contador/ */

    //limpiamos sessionStorage para que no se repita al recargar
    sessionStorage.removeItem("reserva");
  }
      /* cartas con datos utiles */
    calcularReservasComfirmadas();
    calcularReservasCompletadas();
});
