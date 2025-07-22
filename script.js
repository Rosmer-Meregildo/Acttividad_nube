// script.js
let puntaje = 0;
let indice = 0;
let preguntas = [];

const preguntaTexto = document.getElementById("pregunta-texto"); //
const opcionesDiv = document.getElementById("opciones"); //
const resultadoDiv = document.getElementById("resultado"); //
const btnSiguiente = document.getElementById("btn-siguiente"); //

const API_URL = "https://zbi1a7ygqe.execute-api.sa-east-1.amazonaws.com/prod/pregunta"; //

// 👉 Cargar preguntas desde la API
fetch(API_URL) // <--- ¡CORREGIDO! Llama directamente a la URL que devuelve el array de preguntas.
    .then((res) => {
        // Asegúrate de que la respuesta sea un JSON válido y el estado sea OK
        if (!res.ok) {
            // Lanza un error si la respuesta HTTP no es exitosa (ej. 404, 500)
            throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
        }
        return res.json();
    })
    .then((data) => {
        console.log("Preguntas recibidas:", data);
        // Ahora, 'data' DEBE ser un array de preguntas como lo envía la Lambda modificada.
        if (!Array.isArray(data) || data.length === 0) { //
            throw new Error("No se recibieron preguntas válidas o el array está vacío.");
        }
        preguntas = data; // ¡Asignamos el array directamente!
        mostrarPregunta(preguntas[indice]); //
    })
    .catch((err) => {
        console.error("Error cargando preguntas:", err); //
        preguntaTexto.textContent = "Error al cargar preguntas. Intenta más tarde."; //
        opcionesDiv.innerHTML = ""; // Limpia las opciones
        resultadoDiv.textContent = ""; // Limpia el resultado
        btnSiguiente.style.display = "none"; //
    });

function mostrarPregunta(pregunta) { //
    preguntaTexto.textContent = pregunta.texto; //
    opcionesDiv.innerHTML = ""; //

    const fila1 = document.createElement("div"); //
    fila1.className = "fila-opciones"; //
    const fila2 = document.createElement("div"); //
    fila2.className = "fila-opciones"; //

    pregunta.opciones.forEach((opcion, i) => { //
        const btn = document.createElement("button"); //
        btn.className = "opcion"; //
        btn.textContent = `${String.fromCharCode(65 + i)}. ${opcion}`; //
        btn.onclick = () => verificarRespuesta(i); //
        if (i < 2) fila1.appendChild(btn); //
        else fila2.appendChild(btn); //
    });

    opcionesDiv.appendChild(fila1); //
    opcionesDiv.appendChild(fila2); //

    resultadoDiv.textContent = ""; //
    btnSiguiente.style.display = "none"; //
    btnSiguiente.disabled = false; //
}

function verificarRespuesta(indiceSeleccionado) { //
    const pregunta = preguntas[indice]; //
    const botones = document.querySelectorAll(".opcion"); //
    botones.forEach((btn, i) => { //
        // Asegurarse de que 'respuestaCorrecta' existe en la pregunta
        if (pregunta.hasOwnProperty('respuestaCorrecta') && i === pregunta.respuestaCorrecta) {
            btn.classList.add("correcta"); //
        } else if (i === indiceSeleccionado) {
            btn.classList.add("incorrecta"); //
        }
        btn.disabled = true; //
    });

    if (pregunta.hasOwnProperty('respuestaCorrecta') && indiceSeleccionado === pregunta.respuestaCorrecta) {
        puntaje++; //
        resultadoDiv.textContent = "✅ ¡Correcto!"; //
    } else {
        resultadoDiv.textContent = "❌ Incorrecto."; //
    }

    btnSiguiente.style.display = "inline-block"; //
    btnSiguiente.disabled = false; //
}

btnSiguiente.onclick = () => { //
    btnSiguiente.disabled = true; //
    indice++; //
    if (indice < preguntas.length) { //
        mostrarPregunta(preguntas[indice]); //
    } else {
        mostrarFinal(); //
    }
};

function mostrarFinal() { //
    preguntaTexto.textContent = "¡Juego terminado!"; //
    opcionesDiv.innerHTML = ""; //
    resultadoDiv.innerHTML = `<p>Tu puntaje final es ${puntaje} de ${preguntas.length}.</p>`; //

    const mensaje = document.createElement("div"); //
    mensaje.className = "mensaje-final"; //

    if (puntaje < preguntas.length / 2) { //
        mensaje.textContent = "SIGUE INTENTANDO"; //
        mensaje.style.color = "#e53935"; //
    } else if (puntaje === Math.floor(preguntas.length / 2)) { //
        mensaje.textContent = "POR LOS PELOS"; //
        mensaje.style.color = "#ff9800"; //
    } else if (puntaje < preguntas.length - 1) { //
        mensaje.textContent = "ESTÁS BIEN"; //
        mensaje.style.color = "#66bb6a"; //
    } else if (puntaje === preguntas.length - 1) { //
        mensaje.textContent = "EXCELENTE"; //
        mensaje.style.color = "#43a047"; //
    } else {
        mensaje.textContent = "ERES EL MEJOR"; //
        mensaje.style.color = "#2e7d32"; //
        mensaje.style.fontSize = "2rem"; //
    }

    resultadoDiv.appendChild(mensaje); //
    btnSiguiente.style.display = "none"; //
}
