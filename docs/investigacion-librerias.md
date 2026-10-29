# Investigación de librerías de detección facial

**Actividad R2 · Desarrollo de Aplicaciones Interactivas · Arturo Navarrete Jiménez · Octubre 2026**

El enunciado dice que usar ml5.js limita la nota a 8/10 y que una alternativa
permite optar al 10/10. Esta nota recoge la comparación que hice antes de elegir.

## Lo que necesito que haga la librería

1. Detectar al menos un rostro en tiempo real en una webcam.
2. Dar los puntos de los labios (o algo equivalente) para calcular la apertura.
3. Funcionar dentro de un `WebView` empaquetado (Tauri/Electron) en Windows.
4. Documentación oficial clara y mantenimiento activo.
5. No pesar tanto que haga esperar varios segundos al cargar.

**No** necesito reconocimiento de emociones. El enunciado solo pide la apertura
de la boca; incluyo las emociones en la comparación porque el enunciado también
pide investigarlas.

## Candidatas

| Librería | Puntos | Emociones | p5 integra | Mantenimiento | Nota máx. |
|---|---|---|---|---|---|
| ml5.js (`faceMesh`) | 478 (usa MediaPipe por debajo) | No en `faceMesh` | Sí, oficial | Activo, soporte p5 2.x | 8 |
| **MediaPipe Face Landmarker** | 478 + 52 blendshapes | No (sí movimientos) | Manual, ~30 LOC | Google, muy activo | 10 |
| face-api.js (`justadudewhohacks`) | 68 | 7 expresiones | Manual | Prácticamente abandonado | 10 |
| @vladmandic/face-api | 68 | 7 expresiones | Manual | Fork activo pero inactivo últimamente | 10 |
| @vladmandic/human | 468+ | Sí | Manual | Activo, muy completo | 10 |

### ml5.js faceMesh
- **Pros:** tutorial oficial de la UOC, API muy sencilla, ya cubre nuestro caso.
- **Contras:** nota máxima 8. Carga capa extra sobre MediaPipe (más KB). El propio
  enunciado dice que falla en Chrome con la webcam.
- **Fuente:** [https://docs.ml5js.org/#/reference/facemesh](https://docs.ml5js.org/#/reference/facemesh)

### MediaPipe Face Landmarker (elegida)
- **Pros:** es el motor que ml5 usa por debajo. Da los mismos 478 puntos, con la
  ventaja de que ejecutamos directamente la librería optimizada de Google (WASM
  y aceleración GPU opcional). API `detectForVideo` pensada para webcam en modo
  `VIDEO`. 52 *blendshapes* (como `jawOpen`) listos para usar sin cálculo manual.
- **Contras:** no hay integración oficial con p5, hay que escribir el pegamento.
  Son unas 30 líneas: ver `src/faceDetection.js`. También implica cargar un
  módulo ESM, lo que requiere `type="module"` en el `<script>`.
- **Fuentes:**
  - [https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js)
  - [https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/vision_bundle.mjs](https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/vision_bundle.mjs)

### face-api.js (original)
- **Pros:** detecta emociones de serie (`faceExpressionNet`).
- **Contras:** no se actualiza desde hace años, los modelos son más pesados y
  solo da 68 puntos (menos preciso para los labios internos).

### @vladmandic/face-api
- **Pros:** fork mantenido durante un tiempo, misma API que el original.
- **Contras:** el repositorio ha quedado parado en los últimos meses, los
  modelos siguen siendo los antiguos de 68 puntos.
- **Fuente:** [https://repos.ecosyste.ms/hosts/GitHub/repositories/vladmandic/face-api](https://repos.ecosyste.ms/hosts/GitHub/repositories/vladmandic/face-api)

### @vladmandic/human
- **Pros:** combina detección facial, de manos, de cuerpo y de emociones. Muy
  completa.
- **Contras:** es demasiado para este proyecto. Añadiría peso y complejidad
  sin que aporte nada visible al cepillado.

## Decisión

Elijo **MediaPipe Face Landmarker** porque:

1. Es la librería "de verdad" detrás de ml5, con nota máxima 10/10.
2. Tiene documentación oficial muy clara, con ejemplos de `runningMode: 'VIDEO'`.
3. Google la actualiza con frecuencia; es la apuesta a largo plazo.
4. Me permite elegir entre calcular yo la apertura (lo hago, por aprendizaje y
   para poder defenderlo) o usar el blendshape `jawOpen` como alternativa.

## Lo que NO he podido verificar

- La versión exacta publicada hoy en npm. Fijé `@1.2.0` porque es la última
  que aparece en jsDelivr al escribir esto, pero no he podido comprobar
  `npm view @mediapipe/tasks-vision version` desde este entorno. Si al ejecutar
  en tu Windows la versión ha cambiado, revisa el `index.html` y el import
  dinámico en `faceDetection.js`.
- El funcionamiento real dentro de Tauri + WebView2. Hay un issue abierto
  ([tauri-apps/tauri#5042](https://github.com/tauri-apps/tauri/issues/5042))
  donde explican que, si el usuario deniega la cámara una vez, WebView2
  recuerda la decisión y no vuelve a preguntar. Documento el problema y la
  solución (resetear permisos de WebView2) en el README.

## Sobre emociones

Aunque el proyecto no las necesita, el enunciado me pide investigar las
librerías de emociones faciales disponibles. Las que he visto son:

- face-api.js y @vladmandic/face-api, con 7 emociones básicas basadas en el
  dataset FER2013 (feliz, triste, enfadado, sorprendido, miedo, disgustado,
  neutral).
- @vladmandic/human, que incluye las mismas 7 emociones con modelos más
  recientes.
- MediaPipe no clasifica emociones de forma directa, pero sus 52 blendshapes
  (`mouthSmileLeft`, `browInnerUp`, etc.) permiten reconstruirlas con reglas.

Si en una futura evolución quisiéramos premiar al niño con una cara feliz al
terminar el cepillado, usaríamos los blendshapes de MediaPipe en lugar de
añadir otra librería.
