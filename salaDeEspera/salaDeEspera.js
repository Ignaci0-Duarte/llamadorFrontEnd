// Establecer conexión WebSocket con el servidor
const ws = new WebSocket("ws://llamador-consultorio.vercel.app");

// Manejar eventos al abrir la conexión WebSocket
ws.addEventListener("open", function (event) {
  console.log("Conexión WebSocket establecida.");
});

// Manejar eventos de error en la conexión WebSocket
ws.addEventListener("error", function (error) {
  console.error("Error en la conexión WebSocket:", error);
});

// Manejar mensajes recibidos del servidor
ws.addEventListener("message", function (event) {
  console.log("Mensaje recibido del servidor:", event.data);

  // Verificar si event.data es un Blob
  if (event.data instanceof Blob) {
    // Crear un FileReader para leer el contenido del Blob
    const reader = new FileReader();
    reader.onload = function () {
      const data = JSON.parse(reader.result);
      actualizarPacientes(data);
      reproducirVoz(data.nombreActual, data.nombreSiguiente, data.consultorio);
      mostrarConsultorio(data.consultorio); // Llamar a la función mostrarConsultorio
      reproducirAlertaSonido(); // Reproducir alerta de sonido
    };
    reader.onerror = function (error) {
      console.error("Error al leer el contenido del Blob:", error);
    };

    // Leer el contenido del Blob
    reader.readAsText(event.data);
  } else {
    // Si event.data no es un Blob, asumimos que ya es texto JSON
    const data = JSON.parse(event.data);
    actualizarPacientes(data);
    reproducirVoz(data.nombreActual, data.nombreSiguiente, data.consultorio);
    mostrarConsultorio(data.consultorio); // Llamar a la función mostrarConsultorio
    reproducirAlertaSonido(); // Reproducir alerta de sonido
  }
});

// Función para reproducir el sonido de alerta
function reproducirAlertaSonido() {
  const alertaSonido = document.getElementById("alertaSonido");
  alertaSonido.play();
}

// Función para actualizar los nombres de los pacientes en la vista
function actualizarPacientes(data) {
  console.log("Datos recibidos:", data);

  const nombrePacienteActual = document.getElementById("nombrePaciente");
  const nombreSiguientePaciente = document.getElementById("nombreSiguiente");

  nombrePacienteActual.textContent = data.nombreActual;
  nombreSiguientePaciente.textContent = data.nombreSiguiente;
}

// Función para reproducir la voz anunciando el paciente actual y siguiente en fila
function reproducirVoz(nombreActual, nombreSiguiente, consultorio) {
  const textoVoz = `Ingrese al ${consultorio} ${nombreActual}. siguiente paciente ${nombreSiguiente}.`;
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(textoVoz);

  // Reproducir la voz después de 1 segundo
  setTimeout(function () {
    synth.speak(utterance);
  }, 1500);
}

// Función para reproducir el sonido de alerta al cargar la página
window.onload = function () {
  reproducirAlertaSonido();
};

// Función para reproducir el sonido de alerta
function reproducirAlertaSonido() {
  const alertaSonido = document.getElementById("alertaSonido");
  alertaSonido.play();
}

// Función para mostrar el consultorio en la vista
function mostrarConsultorio(consultorio) {
  const consultorioElement = document.getElementById("nombreConsultorio");
  consultorioElement.textContent = consultorio;
}
