
// ==========================================
// CONFIGURACIÓN DE LA INVITACIÓN
// ==========================================

const configuracion = {

  nombre: "Ilcia Gomez",

  // Sábado 21 de noviembre de 2026
  // Hora Perú: 8:30 p. m.
  fechaEvento: "2026-11-21T20:30:00-05:00",

  // Coloca aquí el WhatsApp que recibirá
  // las confirmaciones.
  // Ejemplo de formato: 519XXXXXXXX
  whatsapp: "+51939783098"

};


// ==========================================
// CONTADOR REGRESIVO
// ==========================================

const fechaDestino = new Date(
  configuracion.fechaEvento
).getTime();

const diasElemento = document.getElementById("days");
const horasElemento = document.getElementById("hours");
const minutosElemento = document.getElementById("minutes");
const segundosElemento = document.getElementById("seconds");

function actualizarContador() {

  const ahora = Date.now();

  const diferencia = Math.max(
    0,
    fechaDestino - ahora
  );

  const dias = Math.floor(
    diferencia / (1000 * 60 * 60 * 24)
  );

  const horas = Math.floor(
    (diferencia / (1000 * 60 * 60)) % 24
  );

  const minutos = Math.floor(
    (diferencia / (1000 * 60)) % 60
  );

  const segundos = Math.floor(
    (diferencia / 1000) % 60
  );

  diasElemento.textContent = String(dias).padStart(2, "0");

  horasElemento.textContent = String(horas).padStart(2, "0");

  minutosElemento.textContent = String(minutos).padStart(2, "0");

  segundosElemento.textContent = String(segundos).padStart(2, "0");

  const mensaje = document.getElementById(
    "countdown-message"
  );

  if (diferencia <= 0) {
    mensaje.hidden = false;
  } else {
    mensaje.hidden = true;
  }

}

// Ejecutar inmediatamente
actualizarContador();

// Actualizar cada segundo
setInterval(actualizarContador, 1000);


// ==========================================
// CONFIRMACIÓN POR WHATSAPP
// ==========================================

const whatsappButton = document.getElementById(
  "whatsapp-button"
);

function configurarWhatsapp() {

  const numero = configuracion.whatsapp.replace(
    /\D/g,
    ""
  );

  const mensaje = `¡Hola! 🥳

Confirmo mi asistencia a la celebración de los 50 años de ${configuracion.nombre}.

📅 Fecha: Sábado 21 de noviembre de 2026
🕣 Hora: 8:30 p. m.
📍 Lugar: El Señorial

¡Nos vemos en la celebración! 🎉`;

  if (numero.length < 10) {

    whatsappButton.removeAttribute("target");

    whatsappButton.addEventListener(
      "click",
      function(event) {

        event.preventDefault();

        alert(
          "Falta configurar el número de WhatsApp en script.js"
        );

      }
    );

    return;
  }

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  whatsappButton.href = url;

}

configurarWhatsapp();


// ==========================================
// ANIMACIONES AL DESLIZAR
// ==========================================

const elementosAnimados = document.querySelectorAll(
  ".reveal"
);

if ("IntersectionObserver" in window) {

  const observador = new IntersectionObserver(
    (entradas) => {

      entradas.forEach((entrada) => {

        if (entrada.isIntersecting) {

          entrada.target.classList.add(
            "visible"
          );

          observador.unobserve(
            entrada.target
          );

        }

      });

    },
    {
      threshold: 0.12
    }
  );

  elementosAnimados.forEach((elemento) => {
    observador.observe(elemento);
  });

} else {

  elementosAnimados.forEach((elemento) => {
    elemento.classList.add("visible");
  });

}



/* ==========================================
   REPRODUCTOR DE MÚSICA - VERSIÓN CORREGIDA
========================================== */

const musicaFondo = document.getElementById("musica-fondo");
const btnMusica = document.getElementById("btn-musica");

if (musicaFondo && btnMusica) {

  // CONFIGURACIÓN
  musicaFondo.volume = 0.5;
  musicaFondo.loop = true;

  let usuarioPauso = false;
  let reproduccionSolicitada = false;

  // ==========================================
  // ACTUALIZAR BOTÓN MUSICAL
  // ==========================================

  function actualizarEstadoMusica() {

    const reproduciendo = !musicaFondo.paused;

    btnMusica.classList.toggle(
      "playing",
      reproduciendo
    );

    btnMusica.setAttribute(
      "aria-pressed",
      String(reproduciendo)
    );

    btnMusica.setAttribute(
      "aria-label",
      reproduciendo
        ? "Pausar música"
        : "Reproducir música"
    );

    btnMusica.title = reproduciendo
      ? "Pausar música"
      : "Reproducir música";

  }

  // ==========================================
  // INICIAR MÚSICA
  // ==========================================

  async function iniciarMusica() {

    if (
      usuarioPauso ||
      !musicaFondo.paused ||
      reproduccionSolicitada
    ) {
      return;
    }

    reproduccionSolicitada = true;

    try {

      await musicaFondo.play();

    } catch (error) {

      console.log(
        "La reproducción requiere interacción del usuario."
      );

    } finally {

      reproduccionSolicitada = false;

    }

  }

  // ==========================================
  // CONTROL MANUAL
  // ==========================================

  async function alternarMusica() {

    if (!musicaFondo.paused) {

      usuarioPauso = true;

      musicaFondo.pause();

    } else {

      usuarioPauso = false;

      try {

        await musicaFondo.play();

      } catch (error) {

        console.warn(
          "No se pudo reproducir el audio:",
          error
        );

      }

    }

  }

  btnMusica.addEventListener(
    "click",
    alternarMusica
  );

  // ==========================================
  // SINCRONIZACIÓN DEL BOTÓN
  // ==========================================

  musicaFondo.addEventListener(
    "play",
    actualizarEstadoMusica
  );

  musicaFondo.addEventListener(
    "pause",
    actualizarEstadoMusica
  );

  musicaFondo.addEventListener(
    "ended",
    actualizarEstadoMusica
  );

  actualizarEstadoMusica();

  // ==========================================
  // INTENTO AUTOMÁTICO DESPUÉS DE 1.5 SEGUNDOS
  // ==========================================

  setTimeout(() => {

    iniciarMusica();

  }, 1500);

 
  // ==========================================
  // INICIAR AL PRIMER TOQUE DEL USUARIO
  // ==========================================

  function iniciarConInteraccion(evento) {

    // El botón musical tiene su propio control
    if (evento.target.closest("#btn-musica")) {
      return;
    }

    // Respetar si el usuario pausó la música
    if (usuarioPauso) {
      document.removeEventListener(
        "pointerdown",
        iniciarConInteraccion
      );
      return;
    }

    // No intentar reproducir si ya está sonando
    if (!musicaFondo.paused) {
      document.removeEventListener(
        "pointerdown",
        iniciarConInteraccion
      );
      return;
    }

    iniciarMusica();

    document.removeEventListener(
      "pointerdown",
      iniciarConInteraccion
    );

  }

  document.addEventListener(
    "pointerdown",
    iniciarConInteraccion
  );

}
