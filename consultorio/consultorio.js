// Establecer conexión WebSocket con el servidor
const ws = new WebSocket(
  "wss://llamadorpuntocardio-d37f8860669d.herokuapp.com"
);

// Manejar eventos al abrir la conexión WebSocket
ws.addEventListener("open", function (event) {
  console.log("Conexión WebSocket establecida.");
});

// Manejar eventos de error en la conexión WebSocket
ws.addEventListener("error", function (error) {
  console.log("Error en la conexión WebSocket:", error);
});

// Manejar el envío de datos del formulario al hacer clic en el botón "Enviar"
const btnEnviar = document.querySelector(".btn-enviar");
if (btnEnviar) {
  btnEnviar.addEventListener("click", function (event) {
    event.preventDefault();

    // Obtener el valor del consultorio seleccionado
    const consultorioSeleccionado = document
      .querySelector('input[name="consultorio"]:checked')
      .value.toUpperCase();

    // Obtener los valores de los campos de texto y convertirlos a mayúsculas
    let nombreActual = document
      .getElementById("nombreActual")
      .value.toUpperCase();
    let nombreSiguiente = document
      .getElementById("nombreSiguiente")
      .value.toUpperCase();

    // Verificar que los campos no estén vacíos
    if (nombreActual.trim() === "" || nombreSiguiente.trim() === "") {
      console.error("Los campos no pueden estar vacíos.");
      return;
    }

    // Crear un objeto con los datos a enviar al servidor, incluyendo el consultorio seleccionado
    const data = {
      nombreActual,
      nombreSiguiente,
      consultorio: consultorioSeleccionado,
    };

    // Enviar los datos al servidor en formato JSON
    ws.send(JSON.stringify(data));

    // Actualizar los campos de texto después de enviar los datos
    document.getElementById("nombreActual").value = nombreSiguiente;
    document.getElementById("nombreSiguiente").value = "";
  });
} else {
  console.error("No se encontró el botón de enviar.");
}
