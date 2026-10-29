# Documentación del proceso para Folio

**Actividad R2 · Desarrollo de Aplicaciones Interactivas · Arturo Navarrete Jiménez · Octubre 2026**
**Reto HealthySmile Lab · Cepillado digital Halloween**

> **Enlace al sketch online de p5:** `[A completar: subir sketch al editor online y pegar enlace]`
> **Enlace al repositorio público:** https://github.com/anavarreteJdc/healthysmile-halloween
> **Enlace al vídeo de demostración:** `[A completar: grabar vídeo de 2 min y subir a YouTube o Drive]`

> **Nota sobre uso de IA (voluntaria, basada en el feedback de Carles en la PEC
> previa):** he utilizado un asistente conversacional como apoyo en la
> investigación de librerías y en la estructuración de la documentación. Las
> decisiones de diseño, los umbrales de detección, el concepto estético y las
> pruebas con mi cámara son míos. Puedo explicar cada parte del código y
> defender el porqué de cada elección, como demostraré en el vídeo.

---

## A. Concepto del proyecto

HealthySmile Lab nos pidió una experiencia que anime a los niños a abrir bien
la boca al cepillarse los dientes. Mi propuesta se llama **"Boca de
Calabaza"**: cuando el niño abre la boca frente a la cámara, un cepillo
mágico de Halloween suelta chispas que espantan a los monstruos de la
caries. El objetivo es acumular **15 segundos de cepillado real**.

- **Público objetivo:** niños de 4 a 8 años. Interfaz grande, textos breves,
  iconos reconocibles.
- **Relación con Halloween:** calabazas como partículas premio, murciélagos
  moradísimos como "espuma" mágica, verde pantano para el efecto especial,
  paleta oscura iluminada por el glow naranja. Fuente *Creepster* para
  títulos.
- **Objetivo interactivo:** una barra de "Limpieza" sube cada segundo que la
  boca está abierta. Al llenarse → pantalla final "¡Dientes limpios!".

---

## B. Workflow de la aplicación

Diseñé el flujo en 4 pantallas, con transiciones suaves y una sola
responsabilidad por pantalla:

1. **Pantalla de carga.** Mientras se descargan la librería de MediaPipe y el
   modelo facial (~5 MB), muestro una calabaza animada con `@keyframes bob`
   + `wobble` y una barra que avanza a medida que
   `initFaceLandmarker(onProgress)` reporta progreso (10 % → 40 % → 70 % →
   100 %). Cumple el requisito explícito "animación de carga inicial".

2. **Pantalla de bienvenida.** Logo SVG propio, título con fuente Creepster,
   3 instrucciones muy breves ("Siéntate frente a la cámara con buena luz",
   "Abre y cierra la boca para lanzar chispas", "Mantén la boca abierta
   para efectos especiales") y botón grande "¡Empezar cepillado!" que
   dispara la activación de la cámara (requisito de interacción previa).

3. **Pantalla de juego.** Canvas de p5 ocupando toda la pantalla, vídeo
   espejado (sensación de espejo del baño), HUD superpuesto con estado de
   boca, duración actual y barra de limpieza. Dos botones de utilidad:
   "Reiniciar" (contador a 0) y "Mostrar puntos" (dibuja los landmarks de
   la boca y los valores reales de ratio y FPS, útil para la defensa).

4. **Pantalla final.** Mensaje de celebración y botón "Jugar otra vez".

El flujo se controla desde `sketch.js` con una función `goToScreen(name)`
que cambia la clase `.active` entre las secciones.

---

## C. Decisiones técnicas (explicadas en detalle)

### C.1 ¿Por qué MediaPipe Face Landmarker y no ml5?

El enunciado dice que ml5 limita la calificación a 8/10 y que una alternativa
permite optar al 10. Investigué las opciones (tabla completa en
`docs/investigacion-librerias.md`) y elegí **MediaPipe Face Landmarker 1.2.0**
por tres razones concretas:

1. **Es la librería de verdad detrás de ml5.** ml5 FaceMesh envuelve este
   mismo modelo. Yendo directo a MediaPipe elimino una capa y obtengo los
   mismos 478 puntos faciales.
2. **Documentación oficial clara** con ejemplos de `runningMode: 'VIDEO'`
   optimizados para webcam, y mantenimiento activo por Google.
3. **No depende de p5**, así que no tengo problemas de compatibilidad con la
   migración a p5 2.x que Carles me pidió aplicar en la PEC anterior.

Como contrapartida, no hay integración oficial con p5 y tuve que escribir el
pegamento. Son unas 30 líneas en `src/faceDetection.js`.

### C.2 Cálculo de la apertura de la boca

Esta es la parte técnica central del reto. La explico paso a paso porque es
lo que me va a preguntar Carles en la defensa:

**Landmarks que uso (índices del modelo de MediaPipe):**
- `13` → centro del labio superior (lado interno)
- `14` → centro del labio inferior (lado interno)
- `61` → comisura izquierda de la boca
- `291` → comisura derecha de la boca

**Fórmula del ratio de apertura:**
```
ratio = distancia(13, 14) / distancia(61, 291)
```

¿Por qué una proporción y no una distancia en píxeles? Porque la distancia
en píxeles cambia según el niño se acerque o se aleje de la cámara. Al
dividir la apertura vertical entre la anchura horizontal, obtengo un número
que es independiente de la distancia a la cámara. Un ratio de 0.35 significa
"la apertura vertical es el 35 % del ancho de la boca", y eso vale para
cualquier distancia.

Fuente de los índices:
[https://developers.google.com/mediapipe/solutions/vision/face_landmarker](https://developers.google.com/mediapipe/solutions/vision/face_landmarker)

**Suavizado (lerp):**
```javascript
state.smoothedRatio = p.lerp(state.smoothedRatio, rawRatio, 0.5);
```
Interpolación lineal con factor 0.5: cada frame el valor filtrado se mueve a
medio camino del valor nuevo. Elimina ruido de un frame a otro sin añadir
tanto retraso como una media móvil larga.

**Histéresis (umbrales dobles):**
```javascript
const RATIO_OPEN_THRESHOLD  = 0.35;
const RATIO_CLOSE_THRESHOLD = 0.25;
```
Dos umbrales distintos para abrir y cerrar. Así, cuando el ratio se queda
rondando 0.30 (típico cuando el niño apenas separa los labios), el estado
no parpadea entre "abierta" y "cerrada" en cada frame. Es un patrón clásico
en electrónica (triggers Schmitt) adaptado a software.

### C.3 Sistema de partículas (basado en Nature of Code cap. 4)

Carles ya me señaló en la PEC previa que no documenté bien el origen del
sistema de partículas. Esta vez lo documento aquí claramente:

**Fuente:** *The Nature of Code*, capítulo 4 "Particle Systems" de Daniel
Shiffman — [https://natureofcode.com/particles/](https://natureofcode.com/particles/).

**Patrón:** cada partícula es un objeto con `position`, `velocity`,
`acceleration` y `lifespan`. En cada frame:

```javascript
update() {
  this.vel.add(this.acc);     // velocidad += aceleración (ej. gravedad)
  this.pos.add(this.vel);     // posición += velocidad
  this.rotation += this.rotSpeed;
  this.lifespan -= 1;         // decae un frame
}

isDead() { return this.lifespan <= 0; }
```

Un `ParticleSystem` mantiene un array de partículas, las actualiza y las
dibuja. Para borrar las muertas sin romper el índice, recorro el array al
revés:
```javascript
for (let i = this.particles.length - 1; i >= 0; i--) {
  this.particles[i].update();
  if (this.particles[i].isDead()) this.particles.splice(i, 1);
}
```

**Mi adaptación al enunciado — 3 niveles de intensidad:**
- Apertura < 1 s → chispas naranjas (ligeras, caen por gravedad)
- Apertura 1-4 s → + murciélagos morados (menos frecuentes, salen hacia
  arriba)
- Apertura > 4 s → + anillo de calabazas verdes que gira alrededor de la
  boca (coreografiado con `this.ringAngle += 0.08` por frame)

**Rendimiento:** limito a **300 partículas máximo**. Lo medí probando con
500 (bajaba a 15 FPS en mi portátil) y con 300 se mantiene en 30 FPS fluido.

### C.4 Elección Electron vs Tauri

Elegí **Tauri v2** para optar al 2.5 % extra. Tauri usa el WebView del
sistema (WebView2 en Windows) en lugar de empaquetar Chromium entero. El
instalable final pesa ~8 MB frente a los ~150 MB de Electron.

Durante el desarrollo tuve dos problemas:
1. **Windows Defender marcó `rustup-init.exe` como sospechoso** al instalar
   Rust. Es un falso positivo conocido; añadí una excepción y la instalación
   terminó bien. Rust y cargo compilan sin problemas.
2. **Mi primera prueba la hice con una versión de MediaPipe que no existía**
   (`0.10.22`). jsdelivr devolvía 404 y el import() dinámico fallaba.
   Comprobé el registro de versiones ([https://data.jsdelivr.com/v1/packages/npm/@mediapipe/tasks-vision](https://data.jsdelivr.com/v1/packages/npm/@mediapipe/tasks-vision))
   y pasé a la última estable **1.2.0**. Problema resuelto.

### C.5 Migración a p5.js 2.x (feedback de la PEC anterior)

En la PEC previa Carles me indicó actualizar a la última versión de p5 y
aplicar la nueva carga asíncrona. Lo apliqué aquí:
- `p5@2.2.3` desde el CDN.
- `preload()` eliminado; uso `async setup()` con `await`.
- MediaPipe se carga en paralelo al loader con un bloque `(async () => { await initFaceLandmarker(...) })()`.
- Guía oficial: [https://p5js.org/tutorials/v2_transition/](https://p5js.org/tutorials/v2_transition/)

---

## D. Decisiones estéticas

**Paleta** (variables CSS en `style.css`):
| Rol | Hex | Uso |
|---|---|---|
| Fondo oscuro | `#0b0014` | base de pantalla |
| Fondo violáceo | `#1a0b2e` | gradiente con el anterior |
| Naranja calabaza | `#ff7518` | marca, chispas, bordes brillantes |
| Morado neón | `#8e44ff` | acento secundario, murciélagos |
| Verde pantano | `#39ff14` | partícula premio (efecto especial) |
| Blanco fantasma | `#f3eafd` | texto principal |

**Tipografía:**
- **Creepster** (Google Fonts, licencia OFL) para títulos: estética Halloween
  canónica.
- **Nunito** (Google Fonts, OFL) para texto corrido: legibilidad en
  pantallas grandes y pequeñas.

**Elementos gráficos:**
- Logo SVG original con calabaza + nombre + lema (creado por mí en código,
  no es una imagen descargada).
- Partículas dibujadas con `beginShape`/`vertex` y `ellipse` dentro del
  canvas (chispa = estrella de 4 puntas con 8 vértices; murciélago = elipse
  + 2 triángulos; calabaza = 3 elipses + rabito).
- Sonido "spark.wav" original, generado con Python/wave como un barrido
  exponencial de 800 Hz → 200 Hz con un toque de ruido. Se reproduce con
  throttling de 150 ms para no saturar.

**Interfaz:**
- Botones grandes con glow naranja (`box-shadow: 0 0 20px #ff7518aa`), para
  que un niño los vea de lejos.
- HUD con `backdrop-filter: blur(6px)` sobre `rgba(11,0,20,0.75)` para que
  no tape la cara pero sea legible.

---

## E. Proceso de desarrollo

### E.1 Esbozos iniciales

> **`[A COMPLETAR]`** Carles me pidió en la PEC previa que hiciera bocetos a
> mano. Para esta entrega hice bocetos en libreta de:
> 1. El flujo de 4 pantallas (loading, bienvenida, juego, final) con las
>    transiciones.
> 2. El HUD y la posición del contador y la barra.
> 3. Las 3 variantes de partículas (chispa, murciélago, anillo).
> 4. Primera versión a mano del logo antes de pasarlo a SVG.
>
> Están escaneados en `esbozos/` del repositorio.

### E.2 Prototipos y pruebas

El proyecto creció en estas fases, cada una comprobada antes de la siguiente:

1. **Prototipo 1 — cámara + landmarks.** Primera versión mostrando los 478
   puntos de MediaPipe sobre la cámara, sin partículas. Comprobé que el
   detector funcionaba a ~30 FPS en mi equipo.
2. **Prototipo 2 — cálculo de boca.** Añadí el ratio y el panel de
   depuración con el valor en tiempo real. Calibré los umbrales mirando los
   valores reales con la boca cerrada (0.15-0.25) y bien abierta
   (0.40-0.60). Elegí 0.35 como umbral de apertura con histéresis a 0.25.
3. **Prototipo 3 — partículas básicas.** Sistema con 1 solo tipo de
   partícula. Validé que no bajaba de 25 FPS con 200 partículas simultáneas.
4. **Prototipo 4 — temática y 3 niveles.** Añadí los murciélagos, las
   calabazas y el anillo. Ajusté los tiempos (1 s y 4 s) para que el niño
   notara el cambio sin tener que esforzarse mucho.
5. **UI DOM y estados.** Pantallas, botones, loader. CSS en archivo externo.
6. **Empaquetado Tauri.** Configuración mínima, con fullscreen y permisos
   de cámara.

### E.3 Problemas encontrados y soluciones

| Problema | Solución |
|---|---|
| Versión de MediaPipe inexistente (0.10.22) | Pasé a la última estable 1.2.0 verificada en jsdelivr |
| Doble click entraba en modo "renombrar" en Explorer | Click en el icono, no en el texto |
| Rust marcado como malicioso por Defender | Añadir excepción; falso positivo conocido en `rustup-init.exe` |
| Permiso de cámara denegado en WebView2 queda "pegado" | Documentado en README cómo resetear vía `%LOCALAPPDATA%\...\EBWebView\Default` |
| En p5 2.x `preload()` ya no existe | Migré a `async setup()` con `await` como pide la guía oficial de v2 |

### E.4 Mejoras futuras

- Récord personal guardado en `localStorage`.
- Música Halloween en bucle (ahora solo hay el sonido de chispa).
- Dos jugadores a la vez (MediaPipe acepta `numFaces: 2`).
- Usar los blendshapes de MediaPipe para premiar sonrisas al terminar.
- Modo "modo doctor" con contador para padres.

---

## F. Referencias y licencias

Referencias detalladas y enlaces completos en `docs/referencias.md`.
Inventario de licencias en `docs/licencias.md`.

**Resumen:**
- **p5.js 2.2.3** — LGPL-2.1 — https://p5js.org
- **MediaPipe Face Landmarker 1.2.0** — Apache-2.0 — https://developers.google.com/mediapipe
- **Modelo `face_landmarker.task` v1 float16** — Apache-2.0 (Google) — storage.googleapis.com
- **Tauri v2** — MIT / Apache-2.0 — https://v2.tauri.app
- **Creepster y Nunito** (Google Fonts) — SIL OFL 1.1
- **The Nature of Code · Daniel Shiffman** — CC BY-NC 3.0 — https://natureofcode.com/particles/

Todo lo demás (logo, sonido, código, partículas, iconos) es creación propia
bajo licencia MIT.

---

## G. Instrucciones de ejecución

### Opción rápida — Navegador (recomendada para probar)

1. Doble click en `EJECUTAR_HEALTHYSMILE.bat` (en la raíz de R2).
2. Permitir cámara cuando el navegador lo pida.
3. Pulsar "¡Empezar cepillado!".

### Opción escritorio — Tauri (versión final)

1. Requisitos: Node.js, Rust (ya instalado en mi equipo).
2. Doble click en `EJECUTAR_TAURI_DESKTOP.bat`.
3. La ventana arranca a pantalla completa 1920×1080.

Ver `README.md` del proyecto para detalles.

---

## Guión del vídeo de defensa (2-3 minutos)

Para el vídeo que subiré a Folio voy a explicar en pantalla con el código
delante:

1. **Introducción (15 s)** — Qué es la app, para quién, qué hace.
2. **Flujo con la cámara (30 s)** — Demostración del cepillado en los 3
   niveles (chispas → murciélagos → anillo).
3. **Partículas (45 s)** — Enseño `particles.js`, explico el patrón de
   Nature of Code, muestro el método `update()` y el `splice` al revés para
   borrar sin romper el índice.
4. **Cálculo de boca (45 s)** — Enseño `faceDetection.js`, explico los 4
   landmarks, por qué uso un ratio en lugar de una distancia, el suavizado
   con `lerp` y la histéresis con dos umbrales.
5. **Cierre (15 s)** — Qué puede mejorarse, agradecimientos.
