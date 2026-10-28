# Documentación del proceso para Folio

**Actividad R2 · UOC 20.671 · Arturo Navarrete Jiménez · Octubre 2026**

Esta es la plantilla con la estructura que subiré a Folio. Las secciones
marcadas con `[COMPLETAR TRAS LAS PRUEBAS]` las tengo que rellenar yo con
mis pruebas y capturas reales. El resto refleja decisiones ya tomadas.

> **Aviso sobre uso de IA.** Siguiendo la normativa de uso de IA de la UOC,
> declaro que he utilizado un asistente conversacional (Claude) para
> acelerar la investigación de librerías, estructurar el código y preparar
> borradores de documentación. Las decisiones técnicas, el concepto visual,
> la calibración de umbrales y las pruebas se han hecho a mano. Puedo
> explicar cada parte del código y defender el porqué de cada elección.

---

## A. Concepto del proyecto

HealthySmile Lab nos ha pedido una experiencia que anime a los niños a abrir
bien la boca para cepillarse los dientes. Mi propuesta se llama **"Boca de
Calabaza"**: cuando el niño abre la boca frente a la cámara, un cepillo
mágico de Halloween suelta chispas que espantan a los monstruos de la caries.

- **Público:** niños de 4 a 8 años. Interfaz grande, pocos textos, iconos.
- **Relación con Halloween:** calabazas como partículas premio, murciélagos
  como "espuma" mágica, paleta naranja/morada/verde pantano. Fuente
  tipo *Creepster* para los títulos.
- **Objetivo interactivo:** acumular 15 segundos con la boca abierta.
  Una barra "Limpieza" sube hasta llenarse.

## B. Workflow de la aplicación

1. Al arrancar aparece una pantalla de **loading** con una calabaza animada y
   una barra que avanza mientras se descarga la librería de MediaPipe y el
   modelo facial. Esto cumple el requisito de "animación de carga".
2. Cuando está todo listo, pasamos a la pantalla de **bienvenida**: logo,
   título y un botón grande **"¡Empezar cepillado!"**.
3. Al pulsar el botón, el navegador pide permiso de cámara (requisito del
   enunciado: interacción previa).
4. En la pantalla de **juego**, el usuario se ve en espejo. Al abrir la boca,
   aparecen chispas naranjas. Si la mantiene abierta más de 1 segundo, salen
   murciélagos; más de 4 segundos, un anillo de calabazas gira sobre su
   cara.
5. Cuando acumula 15 segundos de boca abierta, pasa a la pantalla **final**
   que celebra el logro y permite reiniciar.
6. Dos botones de utilidad: "Reiniciar" (vuelve el contador a cero) y
   "Mostrar puntos" (dibuja los landmarks y el ratio, para enseñar la
   detección en la defensa).

## C. Decisiones técnicas

- **Librería facial: MediaPipe Face Landmarker.** El razonamiento completo
  está en `docs/investigacion-librerias.md`. Resumen: es la librería que ml5
  usa por debajo, me permite optar al 10/10, está mantenida por Google y me
  da 478 puntos faciales con `runningMode: 'VIDEO'` optimizado para webcam.
- **Cálculo de la apertura:** uso cuatro landmarks: 13 (labio superior
  interno), 14 (labio inferior interno), 61 (comisura izquierda) y 291
  (comisura derecha). El ratio es `distancia(13,14) / distancia(61,291)`.
  Al ser una proporción, es invariante a la distancia a la cámara.
- **Histéresis en los umbrales:** boca "abierta" cuando el ratio pasa de
  0.35; "cerrada" cuando baja por debajo de 0.25. Dos umbrales distintos
  evitan que el estado parpadee cuando el ratio se queda rondando el límite.
- **Suavizado:** aplico `lerp` sobre el ratio con factor 0.5 para quitar el
  ruido fotograma a fotograma.
- **Partículas:** sistema basado en el capítulo 4 de *The Nature of Code*
  de Daniel Shiffman (natureofcode.com/particles). Un array de objetos
  `Particle` con `position`, `velocity`, `acceleration` y `lifespan`. Tres
  niveles según la duración de apertura (breve / mantenida / larga). Límite
  de 300 partículas para que no se degrade el frame rate.
- **p5.js 2.x:** uso la versión 2.2.3 porque me indicaste en la PEC
  anterior que `preload()` ya no se usa y que debo pasar a `async setup()`
  con `await`. Lo aplico aquí: el detector facial se carga con `await`
  dentro de un bloque asíncrono que corre en paralelo al loader.
- **Electron vs Tauri:** elegí Tauri v2 para optar al 2.5% extra. Es más
  ligero y usa el `WebView` del sistema (WebView2 en Windows) en lugar
  de empaquetar Chromium entero.

## D. Decisiones estéticas

- **Paleta** (variables CSS en `style.css`):
  - Fondo: morado muy oscuro `#1a0b2e` sobre negro violáceo `#0b0014`.
  - Acentos: naranja calabaza `#ff7518`, morado neón `#8e44ff`.
  - Partículas especiales: verde "pantano" `#39ff14`.
  - Texto: blanco fantasmal `#f3eafd`.
- **Tipografía:** `Creepster` para títulos (fuente clásica de Halloween,
  cargada desde Google Fonts) y `Nunito` para texto corrido (buena
  legibilidad incluso en pantalla pequeña).
- **Formas:** calabazas, murciélagos y chispas-estrella. Los dibujo con
  `beginShape`/`vertex` y `ellipse` dentro del canvas, sin cargar
  imágenes externas (solo el logo SVG, hecho por mí).
- **Interfaz:** botones grandes con borde brillante, pantalla casi oscura
  para que resalten las partículas, HUD con fondo semitransparente y
  `backdrop-filter` para que no tape la cámara.

## E. Proceso de desarrollo (COMPLETAR TRAS LAS PRUEBAS)

Esta sección la tengo que rellenar yo según vaya probando en mi ordenador.

### E.1 Esbozos iniciales

> `[COMPLETAR]` Carles me pidió en la PEC anterior que hiciera **bocetos a
> mano**. Para esta entrega los dibujaré en una libreta y los escanearé
> aquí. Al menos:
> - Esquema del flujo de pantallas (loading → bienvenida → juego → final).
> - Boceto del HUD con la posición del contador y la barra de limpieza.
> - Diseño del logo antes de pasarlo a SVG.
> - Las tres variantes de partículas (chispas, murciélagos, anillo).

### E.2 Prototipos probados

> `[COMPLETAR]` Qué funcionó a la primera, qué tuve que ajustar. Por
> ejemplo: valor inicial de los umbrales que no detectaban bien, cambio del
> delegate GPU a CPU si no funcionaba, etc.

### E.3 Pruebas realizadas

> `[COMPLETAR]` Enumerar las pruebas reales:
> - Prueba en navegador (editor online de p5): ¿se cargó la librería? ¿se
>   abrió la cámara? ¿detectó la cara?
> - Prueba en Tauri dev: ¿la ventana arrancó en fullscreen? ¿cámara OK?
> - Prueba de calibración: ratios reales medidos con "Mostrar puntos",
>   con la boca cerrada y abierta.
> - Prueba de rendimiento: FPS medios durante el juego.
> - Prueba con diferentes personas (si fue posible).

### E.4 Problemas encontrados y soluciones

> `[COMPLETAR]` Problemas reales que me he encontrado y cómo los he
> resuelto. Por ejemplo, el issue de WebView2 con los permisos de cámara,
> o cualquier error de compilación de Tauri.

### E.5 Mejoras futuras

- Añadir un marcador para que los padres vean cuánto tiempo cepilla el niño.
- Música de ambiente Halloween en bucle (ahora solo hay un pop por chispa).
- Modo con dos jugadores (dos caras a la vez), aprovechando que
  MediaPipe acepta `numFaces: 2`.
- Guardar récord personal con `localStorage`.
- Usar los blendshapes de MediaPipe para premiar sonrisas al final.

## F. Referencias

Las referencias completas con enlaces y licencias están en
`docs/referencias.md` y `docs/licencias.md`.

## G. Instrucciones de ejecución

Ver `README.md` en la raíz del proyecto. Resumen:

- **En navegador** (editor online de p5): copiar `src/sketch.js`,
  `src/faceDetection.js`, `src/particles.js`, `src/index.html` y
  `src/style.css` al editor.
- **En escritorio con Tauri:** instalar Node.js y Rust, luego
  `cd proyecto && npm install && npm run tauri:dev`.
