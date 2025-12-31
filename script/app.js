const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active"); //si existe la clase .active, la eliminamos(false), si no, la añadimos(true)

  menuToggle.setAttribute("aria-expanded", isOpen); //cambia el atributto del boton a abierto para accesibilidad

  // Cambiar icono
  menuToggle.textContent = isOpen ? "✕" : "☰";
  
  document.body.classList.toggle("menu-open", isOpen);
});
