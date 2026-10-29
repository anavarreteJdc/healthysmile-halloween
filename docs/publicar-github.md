# Cómo publicar en GitHub (extra 2.5 %)

El repositorio git ya está inicializado y con un primer commit. Solo
falta subirlo a tu cuenta.

## Opción A · Con `gh` (GitHub CLI)

Si tienes GitHub CLI instalado (https://cli.github.com):

```powershell
cd "D:\UOC\Semestre 2026 2º\Desarrollo de aplicaciones interactivas\R2\proyecto"
gh auth login              # solo la primera vez
gh repo create healthysmile-halloween --public --source=. --push
```

Esto crea el repo público en tu cuenta y hace el push. Terminado.

## Opción B · Desde la web de GitHub + git CLI

1. Abre https://github.com/new
2. Nombre: **healthysmile-halloween**
3. Descripción: *Cepillado digital interactivo con detección facial y
   temática Halloween. Desarrollo de Aplicaciones Interactivas, R2.*
4. Público. **No** añadas README, .gitignore ni LICENSE (ya los tenemos).
5. Pulsa **Create repository**.
6. Copia la URL que te muestran (algo como
   `https://github.com/TU_USUARIO/healthysmile-halloween.git`).

Luego en PowerShell:

```powershell
cd "D:\UOC\Semestre 2026 2º\Desarrollo de aplicaciones interactivas\R2\proyecto"
git remote add origin https://github.com/TU_USUARIO/healthysmile-halloween.git
git push -u origin main
```

GitHub te pedirá autenticarte. En Windows normalmente ya está Git
Credential Manager y abre una ventana del navegador.

## Después del push

- Añade la URL del repo al final del README si quieres (ya está vacío).
- En Folio, enlaza:
  - **URL del sketch online de p5** (obligatorio para la entrega)
  - **URL del repositorio GitHub** (para el 2.5 % extra)
