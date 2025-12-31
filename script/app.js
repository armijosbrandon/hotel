//funcion que puede usar await para esperar resultados de operaciones, permite fetch
async function cargarHTML(selector, url) {  //recibe una id o identificador y la url del archivo que cargar
  /* ----------Insertar Codigo Html de archivo externo */
  const respuesta = await fetch(url); fetch(url) //solicita el archivo HTML desde el servidor y espera a que llegue.
  const html = await respuesta.text(); //le el contenido de la respuesta como texto plano ("html")
  document.querySelector(selector).innerHTML = html; //busco el elemento en el DOM de mi documento y le inserto el HTML cargado remplazando lo que tenga

  //Activar clase 'active' automáticamente
  //--window.location.pathname: obtengo el nombre del archivo de la pagina actual, ejemplo "/index.html"
  //--split separa el string /index en un array usando "/" como separador, obteniendo ""(por no haber nada antes del /) y "index"(despues del /), pop obtiene el ultimo elemento del array
  const paginaActual = window.location.pathname.split("/").pop(); //obtengo la pagina actual, en este caso index.html
  document.querySelectorAll(selector + " a").forEach((link) => {//busco todos los enlaces "a" dentro del selector dado, por cada link hago:
    if (link.getAttribute("href") === paginaActual) { //si el href del enlace es igual a la pagina actual le agrego la clase active
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  //---------Menu toggle (para dispositivos moviles)
  const menuToggle = document.querySelector(`${selector} #menuToggle`); //busca el boton de menu dentro del selector dado por parametro , `${selector}` es una plantilla de string que permite insertar variables dentro de un string 
  const navMenu = document.querySelector(`${selector} #navMenu`);

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active"); //si existe la clase .active, la eliminamos(false), si no, la añadimos(true)

    menuToggle.setAttribute("aria-expanded", isOpen); //cambia el atributo del boton abierto para accesibilidad

    // Cambiar icono
    menuToggle.textContent = isOpen ? "✕" : "☰";

    document.body.classList.toggle("menu-open", isOpen);
  });
}

//Llamadas a la funcion para cargar los archivos HTML en los selectores correspondientes
cargarHTML("#info-header-hero", "info-header-hero.html");
cargarHTML("#footer", "footer.html");
