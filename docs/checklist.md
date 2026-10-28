# Comprobación final · R2

**Leyenda:**
- ✅ Completado y comprobado
- 🟡 Implementado, pendiente de comprobar en Windows
- 🔴 Pendiente de implementar

| # | Requisito del enunciado | Estado | Dónde está / Qué falta |
|---|---|---|---|
| 1 | Aplicación gráfica de escritorio | 🟡 | `src-tauri/`. Falta ejecutar `npm run tauri:dev` en Windows |
| 2 | p5.js (última versión 2.x) | ✅ | CDN p5@2.2.3 en `index.html` |
| 3 | Librería externa de detección facial | ✅ | MediaPipe Face Landmarker 0.10.22 |
| 4 | Visualización de la cámara en tiempo real | 🟡 | `createCapture` + `image()`, probar con cámara real |
| 5 | Partículas que reaccionan a la boca y al tiempo | ✅ | `particles.js`, 3 niveles |
| 6 | Interfaz con elementos DOM | ✅ | 4 pantallas en `index.html`, botones, HUD |
| 7 | Hoja de estilos CSS externa | ✅ | `style.css` |
| 8 | Animación de carga inicial | ✅ | Calabaza animada + barra en `screen-loading` |
| 9 | Temática Halloween | ✅ | Logo, paleta, fuente Creepster, partículas |
| 10 | Al menos un recurso multimedia | ✅ | `logo.svg` + `spark.wav` (originales) |
| 11 | Investigación y documentación de librerías | ✅ | `docs/investigacion-librerias.md` |
| 12 | Alternativa a ml5 para optar al 10 | ✅ | MediaPipe elegida y justificada |
| 13 | Conversión a app de escritorio | 🟡 | Tauri v2 configurado, compilar en Windows |
| 14 | Modo kiosk y pantalla completa 1080p | 🟡 | `fullscreen: true`, `decorations: false` en `tauri.conf.json` |
| 15 | Documentación del proceso | 🟡 | `docs/folio.md` con secciones a completar tras pruebas |
| 16 | Esbozos iniciales | 🔴 | **A mano, por el estudiante.** Carpeta `esbozos/` lista |
| 17 | Documento de propiedad intelectual | ✅ | `docs/licencias.md` |
| 18 | README adecuado | ✅ | `README.md` |
| 19 | Publicación en GitHub/GitLab (+2.5 %) | 🟡 | Repo local inicializado, falta push |
| 20 | Tauri (+2.5 %) | 🟡 | Configurado, falta compilar |
| 21 | Comentarios "Carles: ..." puntuales | ✅ | 10+ comentarios en código, en puntos clave |
| 22 | Entrega: zip del sketch | 🔴 | A hacer tras probar |
| 23 | Enlace al sketch online de p5 en Folio | 🔴 | Subir al editor online |

## Pruebas a realizar en Windows

### Pruebas funcionales
- [ ] `npm install` sin errores
- [ ] `npm run tauri:dev` arranca la ventana
- [ ] La ventana abre en pantalla completa 1920×1080
- [ ] Pulsar `F` sale y vuelve a entrar en fullscreen
- [ ] Pulsar `Alt+F4` cierra la app
- [ ] La pantalla de loading se muestra y la barra avanza
- [ ] Al terminar la carga, aparece la bienvenida con el logo
- [ ] Pulsar "¡Empezar cepillado!" pide permiso de cámara
- [ ] Al aceptar, se ve la cámara espejada
- [ ] "Mostrar puntos" dibuja 4 puntos verdes en la boca
- [ ] Al abrir la boca, el HUD muestra "ABIERTA"
- [ ] Aparecen chispas naranjas sobre la boca
- [ ] Con la boca abierta >1s salen murciélagos
- [ ] Con la boca abierta >4s aparece el anillo
- [ ] La barra "Limpieza" avanza
- [ ] Al llegar al 100% pasa a pantalla final
- [ ] "Jugar otra vez" vuelve a empezar
- [ ] "Reiniciar" pone el contador a 0

### Pruebas técnicas
- [ ] FPS medios >= 25 durante el juego
- [ ] El permiso de cámara se recuerda entre arranques
- [ ] Si no hay internet, la carga falla con mensaje claro
- [ ] El sonido se oye al emitir chispas

### Pruebas estéticas
- [ ] Los colores coinciden con la paleta Halloween
- [ ] La fuente Creepster se carga (si no, cae a Impact)
- [ ] El logo se ve nítido en pantalla grande
- [ ] El HUD no tapa la cara del niño
