/* // Establecer conexión WebSocket con el servidor
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
} */

let ws; // Declarar la variable ws fuera de la función para que sea accesible en todo el script
const messageQueue = []; // Cola de mensajes para almacenar los mensajes cuando la conexión WebSocket está cerrada

// Función para establecer la conexión WebSocket con el servidor y manejar la reconexión automática
function connectWebSocket() {
  ws = new WebSocket("wss://llamadorpuntocardio-d37f8860669d.herokuapp.com");

  // Manejar eventos al abrir la conexión WebSocket
  ws.addEventListener("open", function (event) {
    console.log("Conexión WebSocket establecida.");

    // Procesar la cola de mensajes si hay mensajes pendientes
    processMessageQueue();
  });

  // Manejar eventos de error en la conexión WebSocket
  ws.addEventListener("error", function (error) {
    console.error("Error en la conexión WebSocket:", error);
  });

  // Manejar eventos de cierre de conexión
  ws.addEventListener("close", function (event) {
    console.log("Conexión WebSocket cerrada. Intentando reconectar...");
    setTimeout(connectWebSocket, 3000); // Intentar reconectar después de 3 segundos
  });
}

// Función para procesar la cola de mensajes
function processMessageQueue() {
  while (messageQueue.length > 0 && ws.readyState === WebSocket.OPEN) {
    const message = messageQueue.shift();
    ws.send(message);
  }
}

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
      .value.trim()
      .toUpperCase();
    let nombreSiguiente = document
      .getElementById("nombreSiguiente")
      .value.trim()
      .toUpperCase();

    // Verificar que los campos no estén vacíos
    if (nombreActual === "" || nombreSiguiente === "") {
      console.error("Los campos no pueden estar vacíos");
      window.alert("Los campos no pueden estar vacíos");
      return;
    }

    // Crear un objeto con los datos a enviar al servidor, incluyendo el consultorio seleccionado
    const data = {
      nombreActual,
      nombreSiguiente,
      consultorio: consultorioSeleccionado,
    };

    // Agregar el mensaje a la cola de mensajes
    messageQueue.push(JSON.stringify(data));

    // Si la conexión WebSocket está abierta, procesar la cola de mensajes
    if (ws.readyState === WebSocket.OPEN) {
      processMessageQueue();
    }
  });
} else {
  console.error("No se encontró el botón de enviar.");
}

// Llamar a la función connectWebSocket para iniciar la conexión WebSocket al cargar la página
connectWebSocket();
