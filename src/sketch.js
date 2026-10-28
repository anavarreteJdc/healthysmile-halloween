/* ============================================================
   sketch.js  (punto de entrada en modo instancia de p5)
   Carles: en p5.js 2.x ya no se usa preload(). Para cargar MediaPipe,
   la fuente y el sonido uso async setup() con await, como pide la
   nueva gestión asíncrona de la que me hablaste en la PEC anterior.
   Fuente: https://p5js.org/tutorials/v2_transition/
   ============================================================ */

import {
  initFaceLandmarker, detectFromVideo,
  mouthOpenRatio, mouthCenter, mouthWidth, LANDMARKS
} from './faceDetection.js';

import {
  ParticleSystem, LEVEL_LOW, LEVEL_MID, LEVEL_HIGH
} from './particles.js';

// Carles: umbrales que se pueden ajustar sin tocar el resto del código.
// La histéresis evita que la boca parpadee entre "abierta" y "cerrada".
const RATIO_OPEN_THRESHOLD  = 0.35; // por encima => abierta
const RATIO_CLOSE_THRESHOLD = 0.25; // por debajo => cerrada
const RATIO_SMOOTH          = 0.5;  // factor de interpolación (lerp)

// Niveles de duración de la apertura (segundos).
const TIME_LEVEL_MID  = 1.0;
const TIME_LEVEL_HIGH = 4.0;

// Objetivo total de limpieza (segundos acumulados de boca abierta).
const CLEAN_TARGET_SECONDS = 15;

// Estado del juego, fuera del sketch para que la UI pueda leerlo.
const state = {
  screen: 'loading',             // loading | welcome | game | done
  smoothedRatio: 0,
  isOpen: false,
  openSince: 0,                  // timestamp ms desde que se abrió
  openDuration: 0,               // segundos actuales
  totalCleanTime: 0,             // acumulado total
  showDebug: false,
  landmarks: null,
};

let particleSystem = null;
let video = null;
let videoReady = false;
let sketchStarted = false;

// ----------------------------------------------------------------
// p5 en modo instancia (recomendado con módulos ESM)
// ----------------------------------------------------------------
const sketch = (p) => {

  p.setup = async () => {
    // Carles: creo el canvas dentro del contenedor del DOM para que CSS
    // controle su posición. Lo dimensiono al tamaño de la ventana.
    const w = p.min(window.innerWidth, 1920);
    const h = p.min(window.innerHeight, 1080);
    const canvas = p.createCanvas(w, h);
    canvas.parent('canvas-container');

    particleSystem = new ParticleSystem(p);

    // Vídeo de la cámara con createCapture (recurso del enunciado).
    // Fuente: https://p5js.org/reference/p5/createCapture
    video = p.createCapture({
      video: { width: 1280, height: 720, facingMode: 'user' },
      audio: false,
    }, (stream) => {
      videoReady = true;
      updateHUD('mouth', 'cámara OK');
    });
    video.size(w, h);
    video.hide(); // dibujo el frame yo mismo, no quiero el elemento <video>
  };

  p.draw = () => {
    if (state.screen !== 'game') return;

    // Fondo oscuro con un ligero fade para efecto de trazo.
    p.background(11, 0, 20, 230);

    if (!videoReady) {
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(24);
      p.text('Esperando cámara...', p.width / 2, p.height / 2);
      return;
    }

    // Dibujo la cámara espejada (sensación de espejo del baño).
    p.push();
    p.translate(p.width, 0);
    p.scale(-1, 1);
    p.image(video, 0, 0, p.width, p.height);
    p.pop();

    // Detección facial sobre el frame actual.
    const videoElem = video.elt;
    const landmarks = detectFromVideo(videoElem);
    state.landmarks = landmarks;

    if (landmarks) {
      updateMouthState(landmarks);
      spawnParticles(landmarks);
      if (state.showDebug) drawDebugLandmarks(landmarks);
    } else {
      updateHUD('mouth', 'sin cara');
    }

    particleSystem.update();
    particleSystem.draw();

    // ¿Hemos terminado?
    if (state.totalCleanTime >= CLEAN_TARGET_SECONDS) {
      goToScreen('done');
    }
  };

  // --------------------------------------------------------------
  // Lógica de la boca (Carles: toda la parte evaluable del cálculo)
  // --------------------------------------------------------------
  function updateMouthState(landmarks) {
    const rawRatio = mouthOpenRatio(landmarks);
    // Suavizado con lerp: evita saltos bruscos frame a frame.
    state.smoothedRatio = p.lerp(state.smoothedRatio, rawRatio, RATIO_SMOOTH);

    // Histéresis: dos umbrales distintos para abrir y cerrar.
    if (!state.isOpen && state.smoothedRatio > RATIO_OPEN_THRESHOLD) {
      state.isOpen = true;
      state.openSince = p.millis();
    } else if (state.isOpen && state.smoothedRatio < RATIO_CLOSE_THRESHOLD) {
      state.isOpen = false;
      state.openDuration = 0;
    }

    if (state.isOpen) {
      state.openDuration = (p.millis() - state.openSince) / 1000;
      state.totalCleanTime += p.deltaTime / 1000;
    }

    // HUD
    updateHUD('mouth', state.isOpen ? 'ABIERTA' : 'cerrada');
    updateHUD('time',  state.openDuration.toFixed(1) + 's');
    updateCleanBar(state.totalCleanTime / CLEAN_TARGET_SECONDS);
  }

  function spawnParticles(landmarks) {
    if (!state.isOpen) return;

    const center = mouthCenter(landmarks);
    const width = mouthWidth(landmarks);
    if (!center) return;

    // Las coordenadas de MediaPipe son normalizadas 0-1 sobre el vídeo original.
    // Hay que convertirlas al tamaño del canvas y ESPEJAR en X porque dibujé
    // la cámara espejada arriba.
    const x = p.width - center.x * p.width;
    const y = center.y * p.height;
    const scale = p.map(width, 0.05, 0.2, 0.6, 1.8, true);

    let level = LEVEL_LOW;
    if (state.openDuration >= TIME_LEVEL_HIGH) level = LEVEL_HIGH;
    else if (state.openDuration >= TIME_LEVEL_MID) level = LEVEL_MID;

    particleSystem.emit(x, y, level, scale);
    playSpark();
  }

  function drawDebugLandmarks(landmarks) {
    // Carles: pinto solo los 4 puntos de la boca y el ratio en pantalla,
    // útil para calibrar los umbrales mirando los valores reales.
    p.push();
    p.translate(p.width, 0);
    p.scale(-1, 1);
    p.fill(0, 255, 0);
    p.noStroke();
    const pts = [LANDMARKS.UPPER_LIP_INNER, LANDMARKS.LOWER_LIP_INNER,
                 LANDMARKS.MOUTH_LEFT, LANDMARKS.MOUTH_RIGHT];
    for (const idx of pts) {
      const lm = landmarks[idx];
      p.ellipse(lm.x * p.width, lm.y * p.height, 8);
    }
    p.pop();

    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(14);
    p.text(`ratio: ${state.smoothedRatio.toFixed(3)}`, 20, p.height - 60);
    p.text(`partículas: ${particleSystem.count}`, 20, p.height - 40);
    p.text(`fps: ${p.frameRate().toFixed(0)}`, 20, p.height - 20);
  }

  p.windowResized = () => {
    const w = p.min(window.innerWidth, 1920);
    const h = p.min(window.innerHeight, 1080);
    p.resizeCanvas(w, h);
    if (video) video.size(w, h);
  };
};

// Carles: arranco p5 cuando esté disponible. Como cargo p5 con <script defer>
// y este archivo es type="module", el orden de ejecución puede variar entre
// navegadores. Por eso espero a window.load, que garantiza que ambos han llegado.
function startP5() {
  if (typeof p5 === 'undefined') {
    setTimeout(startP5, 50);
    return;
  }
  new p5(sketch);
}
if (document.readyState === 'complete') startP5();
else window.addEventListener('load', startP5);

// ----------------------------------------------------------------
// Flujo de pantallas (DOM, nada de p5)
// ----------------------------------------------------------------
function goToScreen(name) {
  state.screen = name;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + name);
  if (target) target.classList.add('active');
}

function updateHUD(id, value) {
  const el = document.getElementById('hud-' + id);
  if (el) el.textContent = value;
}
function updateCleanBar(ratio) {
  const bar = document.getElementById('clean-bar');
  if (bar) bar.style.width = (Math.min(1, ratio) * 100) + '%';
}
function updateLoadingBar(ratio, msg) {
  const bar = document.getElementById('loading-bar');
  if (bar) bar.style.width = (ratio * 100) + '%';
  const hint = document.querySelector('#screen-loading .hint');
  if (hint && msg) hint.textContent = msg;
}


// Carles: cargo el sonido como <audio> nativo. En p5 2.x evitamos p5.sound
// porque todavía está en migración. HTMLAudioElement.play() es suficiente
// y me da control de volumen y clonación para que se solapen.
const sparkAudio = new Audio('assets/sounds/spark.wav');
sparkAudio.volume = 0.4;
let lastSparkTime = 0;
function playSpark() {
  const now = performance.now();
  if (now - lastSparkTime < 150) return; // evita saturar: máximo 1 cada 150ms
  lastSparkTime = now;
  const clone = sparkAudio.cloneNode();
  clone.volume = 0.4;
  clone.play().catch(() => {}); // silenciar errores si no hay interacción aún
}

// Botones ---------------------------------------------------------
document.getElementById('btn-start').addEventListener('click', () => {
  // Carles: pido la cámara aquí, no antes, para cumplir el requisito
  // de "una interacción previa de acceso a la cámara".
  goToScreen('game');
});

document.getElementById('btn-reset').addEventListener('click', () => {
  state.totalCleanTime = 0;
  state.openDuration = 0;
  particleSystem.clear();
  updateCleanBar(0);
});

document.getElementById('btn-debug').addEventListener('click', (e) => {
  state.showDebug = !state.showDebug;
  e.target.textContent = state.showDebug ? 'Ocultar puntos' : 'Mostrar puntos';
});

document.getElementById('btn-again').addEventListener('click', () => {
  state.totalCleanTime = 0;
  state.openDuration = 0;
  particleSystem.clear();
  updateCleanBar(0);
  goToScreen('game');
});

// Carga en paralelo del detector mientras el usuario ve el loader.
(async () => {
  try {
    await initFaceLandmarker((progress, msg) => updateLoadingBar(progress, msg));
    goToScreen('welcome');
  } catch (err) {
    console.error('Error al cargar MediaPipe:', err);
    const hint = document.querySelector('#screen-loading .hint');
    if (hint) hint.textContent = 'Error al cargar. ¿Hay conexión a internet?';
  }
})();

// Pulsar F o doble click para pantalla completa (modo kiosko manual).
window.addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
});
