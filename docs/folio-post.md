# Post para Folio · R2 HealthySmile Halloween

**Título:** HealthySmile Halloween — Cepillado digital con detección facial

**Resumen (párrafo introductorio del post):**

Para el reto R2 he desarrollado **HealthySmile Halloween**, una aplicación
de escritorio que ayuda a los niños a cepillarse los dientes mediante un
juego de "cepillado mágico". La webcam detecta la cara con MediaPipe Face
Landmarker, se calcula la apertura de la boca a partir de los 4 landmarks
de los labios y, cuando el niño abre la boca, un cepillo mágico suelta
chispas de Halloween que se intensifican con el tiempo (chispas → murciélagos
→ anillo de calabazas). La app está construida con p5.js 2.2.3, empaquetada
con Tauri v2 para optar a los puntos extra, y usa partículas basadas en el
capítulo 4 de *The Nature of Code* de Shiffman.

**Enlaces:**
- 🎃 Sketch online: `[URL del editor online de p5]`
- 📂 Repositorio: https://github.com/anavarreteJdc/healthysmile-halloween
- 🎥 Vídeo demostración: `[URL de YouTube/Drive]`
- 📄 Documentación completa del proceso: `docs/folio.md` en el repo

**Lo que destaco:**
- Librería alternativa a ml5 (MediaPipe) para optar al 10/10.
- Empaquetado con Tauri v2 (no Electron) para el extra.
- 3 niveles de partículas según duración de apertura, con histéresis para
  que no parpadeen.
- Documentación completa de decisiones técnicas, estéticas y fuentes.

**Pendientes a añadir al post:**
- Capturas de pantalla de las 4 pantallas (loading, bienvenida, juego, final).
- Foto o escaneo de los bocetos a mano.
- Link al vídeo de defensa.
