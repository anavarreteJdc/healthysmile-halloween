/* ============================================================
   faceDetection.js
   Carles: aquí encapsulo todo lo relacionado con MediaPipe
   Face Landmarker. He elegido esta librería (no ml5) por tres motivos
   que explico en docs/investigacion-librerias.md:
     1. Google la mantiene activamente y da 478 puntos faciales.
     2. Trae runningMode "VIDEO" optimizado para webcam.
     3. No depende de p5, así puedo cargarla en Tauri sin conflictos.
   La librería se carga como módulo ES desde el CDN oficial.
   ============================================================ */

// URL del CDN de MediaPipe. Pongo versión fijada para que no cambie
// la API por una actualización inesperada.
const MP_WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm';
const MP_MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// Carles: índices de los landmarks que uso. Vienen del modelo de MediaPipe
// (los mismos que ml5 FaceMesh, porque ml5 usa este modelo por debajo).
// Fuente: https://developers.google.com/mediapipe/solutions/vision/face_landmarker
export const LANDMARKS = {
  UPPER_LIP_INNER: 13,   // centro del labio superior (lado interno)
  LOWER_LIP_INNER: 14,   // centro del labio inferior (lado interno)
  MOUTH_LEFT:      61,   // comisura izquierda
  MOUTH_RIGHT:     291,  // comisura derecha
  FACE_TOP:        10,   // frente, para normalizar por tamaño de cara
  FACE_BOTTOM:     152,  // mentón
};

let faceLandmarker = null;
let lastVideoTime = -1;

// Carles: cargo la librería dinámicamente para no bloquear el arranque
// de p5. Devuelvo una promesa que setup() resuelve con await.
export async function initFaceLandmarker(onProgress) {
  if (onProgress) onProgress(0.1, 'Cargando librería MediaPipe...');

  // Carles: espero a que MediaPipe se haya cargado desde el <script type="module">
  // del index.html. Lo expuse en window.MediaPipeVision.
  // Si en 15 segundos no está, tiramos error. Esto suele pasar sin internet.
  const timeout = Date.now() + 15000;
  while (!window.MediaPipeVision && Date.now() < timeout) {
    await new Promise(r => setTimeout(r, 100));
  }
  if (!window.MediaPipeVision) {
    throw new Error('No se pudo cargar MediaPipe (sin internet? proxy?)');
  }
  const { FaceLandmarker, FilesetResolver } = window.MediaPipeVision;

  if (onProgress) onProgress(0.4, 'Descargando runtime WASM...');
  const filesetResolver = await FilesetResolver.forVisionTasks(MP_WASM);

  if (onProgress) onProgress(0.7, 'Cargando modelo facial...');
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: MP_MODEL,
      // Carles: GPU acelera mucho el detector. Si falla el delegate,
      // MediaPipe hace fallback a CPU automáticamente.
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numFaces: 1,
    // Las blendshapes incluyen "jawOpen" (0-1), que podría ser una alternativa
    // al cálculo manual. No la uso porque quiero demostrar que entiendo cómo
    // calcular la apertura a partir de los landmarks.
    outputFaceBlendshapes: false,
  });

  if (onProgress) onProgress(1.0, 'Listo');
  return faceLandmarker;
}

/**
 * Detecta la cara en el frame actual del vídeo.
 * Devuelve el primer rostro encontrado o null.
 */
export function detectFromVideo(videoElement) {
  if (!faceLandmarker || !videoElement) return null;

  // Carles: evito reanalizar el mismo frame. detectForVideo pide un timestamp
  // monótono creciente; si repito, me da error. videoElement.currentTime
  // avanza con el stream de la webcam.
  const now = videoElement.currentTime;
  if (now === lastVideoTime) return null;
  lastVideoTime = now;

  const result = faceLandmarker.detectForVideo(videoElement, performance.now());
  if (!result || !result.faceLandmarks || result.faceLandmarks.length === 0) {
    return null;
  }
  return result.faceLandmarks[0]; // array de 478 puntos {x,y,z} normalizados 0-1
}

/**
 * Calcula el ratio de apertura de la boca.
 * Carles: uso una proporción (apertura vertical / anchura horizontal) para
 * que no dependa de la distancia del usuario a la cámara. Un valor fijo en
 * píxeles cambiaría según se acerca o se aleja.
 *
 * Devuelve un número aproximado entre 0 (cerrada) y ~0.8 (muy abierta).
 */
export function mouthOpenRatio(landmarks) {
  if (!landmarks) return 0;

  const up = landmarks[LANDMARKS.UPPER_LIP_INNER];
  const dn = landmarks[LANDMARKS.LOWER_LIP_INNER];
  const lt = landmarks[LANDMARKS.MOUTH_LEFT];
  const rt = landmarks[LANDMARKS.MOUTH_RIGHT];

  const verticalDist   = dist3d(up, dn);
  const horizontalDist = dist3d(lt, rt);

  if (horizontalDist < 0.001) return 0; // evito dividir por cero
  return verticalDist / horizontalDist;
}

/**
 * Posición media de la boca en coordenadas normalizadas (0-1).
 * La usan las partículas para saber desde dónde salir.
 */
export function mouthCenter(landmarks) {
  if (!landmarks) return null;
  const up = landmarks[LANDMARKS.UPPER_LIP_INNER];
  const dn = landmarks[LANDMARKS.LOWER_LIP_INNER];
  return {
    x: (up.x + dn.x) / 2,
    y: (up.y + dn.y) / 2,
  };
}

/**
 * Devuelve el ancho horizontal de la boca normalizado (sirve para
 * escalar el tamaño de las partículas según se acerca o aleja).
 */
export function mouthWidth(landmarks) {
  if (!landmarks) return 0.1;
  return dist3d(landmarks[LANDMARKS.MOUTH_LEFT], landmarks[LANDMARKS.MOUTH_RIGHT]);
}

// --- utilidad interna ---------------------------------------------------
function dist3d(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
