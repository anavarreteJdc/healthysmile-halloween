# Referencias

**Actividad R2 · UOC 20.671 · Arturo Navarrete Jiménez**

## Recursos de la asignatura (carpeta 2_Recursos_y_enlaces)

### Para la cámara, DOM y CSS
- **Referencia de p5.js (es)** — https://p5js.org/es/reference/ — API usada en
  todo `sketch.js`.
- **`createCapture()`** — https://p5js.org/reference/p5/createCapture — para
  abrir la webcam.
- **`createCanvas()`, `resizeCanvas()`, `createVector()`** — igual, usados en
  el sketch.
- **Tutorial "Creating & Styling HTML"** —
  https://p5js.org/tutorials/creating-styling-html/ — para la convivencia
  entre DOM y canvas.
- **Tutorial "Loading & Selecting Fonts"** —
  https://p5js.org/tutorials/loading-and-selecting-fonts/ — para la fuente
  Creepster.
- **Vídeos UOC 8.4, 8.7, 8.10** — material privado del aula. Los he visto
  para repasar `select()`, callbacks y fundamentos de CSS.

### Para las partículas
- **The Nature of Code · Capítulo 4 "Particle Systems"** — Daniel Shiffman.
  https://natureofcode.com/particles/ — **esta es la base del algoritmo** de
  `src/particles.js`. He adaptado el patrón `ParticleSystem` + `Particle`
  con `pos/vel/acc/lifespan` a mi caso de tres niveles.
- También está la ficha de la UOC:
  https://discovery.biblioteca.uoc.edu/permalink/34CSUC_UOC/1asfcbc/alma991000972899706712

### Para la detección facial
- **MediaPipe Face Landmarker · Guía Web** —
  https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js
  (fuente principal).
- **README oficial de @mediapipe/tasks-vision** —
  https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/README.md
- **ml5.js FaceMesh** — https://docs.ml5js.org/#/reference/facemesh —
  consultada solo como alternativa descartada.
- **Ejemplos ml5-next-gen** — https://github.com/ml5js/ml5-next-gen/tree/main/examples

### Para el empaquetado
- **Tauri v2 · Start** — https://v2.tauri.app/start — guía oficial.
- **The Tauri Book** — https://v2.tauri.app/about/book/ (el acceso .url
  original tenía la URL mal formada; es ésta).
- **Electron docs** — https://www.electronjs.org/docs/latest/ — leído por
  si Tauri no funcionaba en mi equipo.

### Otros
- **README guide (Medium)** —
  https://medium.com/@kc_clintone/the-ultimate-guide-to-writing-a-great-readme-md-for-your-project-3d49c2023357
- **readme.so** — https://readme.so/es

## Fuentes externas que he añadido

- **Guía de transición a p5.js v2** — https://p5js.org/tutorials/v2_transition/ —
  imprescindible porque la asignatura todavía trae ejemplos de la 1.x.
- **"p5.js 2.1 y 2.2"** · Processing Foundation blog, 9 de marzo de 2026 —
  https://processingfoundation.org/blog/p5js-21-and-22-expanding-graphics-avenues-with-p5strands-improvements-and-webgpu
- **ml5.js con p5.js 2.0** — https://ml5js.org/blog/using-ml5-with-p5-2/ —
  para entender cómo cambian las APIs asíncronas.
- **Tauri issue #5042 (cámara WebView2)** —
  https://github.com/tauri-apps/tauri/issues/5042 — contexto del problema de
  permisos.

## Comentarios sobre lo que no he podido verificar

- Los enlaces de O'Reilly y de la biblioteca de la UOC necesitan sesión
  autenticada; he podido leerlos solo parcialmente.
- La última versión de `@mediapipe/tasks-vision` publicada hoy. He fijado
  `0.10.22` por ser la más reciente que aparece en jsDelivr. Si cambia la
  API en una futura versión, hay que actualizar `faceDetection.js`.
