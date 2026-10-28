# Licencias de recursos utilizados

**Actividad R2 · UOC 20.671 · Arturo Navarrete Jiménez**

Cumplo con la "Nota sobre propiedad intelectual" del enunciado: enumero
todos los recursos externos, su autor, su origen y su licencia. También
documento los recursos propios.

## Recursos propios

| Recurso | Archivo | Autor | Licencia |
|---|---|---|---|
| Logo HealthySmile Halloween | `src/assets/images/logo.svg` | Arturo Navarrete Jiménez | MIT (incluida en `LICENSE`) |
| Sonido "spark" | `src/assets/sounds/spark.wav` | Arturo Navarrete Jiménez (generado con Python wave) | MIT |
| Iconos de la app | `src-tauri/icons/*` | Arturo Navarrete Jiménez (generados con PIL) | MIT |
| Partículas (calabaza, murciélago, chispa) | `src/particles.js` | Arturo Navarrete Jiménez | MIT |
| Todo el código fuente | `src/`, `src-tauri/` | Arturo Navarrete Jiménez | MIT |

## Librerías externas

Se cargan en runtime desde CDN; no se redistribuyen ficheros ajenos en el repo.

| Librería | Versión fijada | Licencia | URL |
|---|---|---|---|
| p5.js | 2.2.3 | LGPL-2.1 | https://p5js.org/ |
| @mediapipe/tasks-vision | 1.2.0 | Apache-2.0 | https://developers.google.com/mediapipe |
| Modelo `face_landmarker.task` | v1 float16 | Apache-2.0 (Google) | https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task |
| Tauri | v2 | MIT / Apache-2.0 | https://v2.tauri.app/ |

## Fuentes tipográficas

| Fuente | Autor | Licencia | URL |
|---|---|---|---|
| Creepster | Sideshow (vía Google Fonts) | SIL Open Font License (OFL) 1.1 | https://fonts.google.com/specimen/Creepster |
| Nunito | Vernon Adams, Cyreal, Jacques Le Bailly | SIL OFL 1.1 | https://fonts.google.com/specimen/Nunito |

Ambas fuentes están cargadas desde Google Fonts dentro del `style.css` con
`@import`. No se incluyen ficheros `.ttf` en el repo.

## Textos y bibliografía

- Daniel Shiffman, *The Nature of Code* (capítulo 4), CC BY-NC 3.0 US — se
  cita en `particles.js` y en la documentación; no se copia código ni se
  redistribuye material.
- MediaPipe Face Landmarker, documentación oficial de Google — se citan
  URL y nombres de funciones.

## Imágenes o sonidos ajenos

Ninguno. Todos los recursos binarios del repositorio son creación propia o
están generados por código incluido en el propio proyecto.

## Nota sobre uso de IA

He usado un asistente conversacional (Claude) como apoyo durante la
investigación de librerías y la redacción de la documentación. Las
decisiones técnicas, los umbrales, el concepto estético y las pruebas
reales son míos. El código es editable y comentado en castellano para
que pueda explicar cada parte en la defensa.
