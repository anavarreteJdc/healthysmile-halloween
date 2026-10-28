// Carles: entry point de Electron. Es mucho más corto que Tauri pero hace
// lo mismo: abre una ventana en pantalla completa que carga ../src/index.html
// y da permisos de cámara al WebView.
const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true,
    frame: false,                     // sin bordes = aproximación a kiosko
    autoHideMenuBar: true,
    backgroundColor: '#0b0014',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // permitir getUserMedia sin HTTPS en local
      webSecurity: true,
    },
  });

  // Autorizar automáticamente permisos de cámara.
  // Carles: Electron pregunta por getUserMedia la primera vez; aquí digo
  // que sí de forma permanente para que no bloquee al niño con un popup.
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowed = ['media', 'mediaKeySystem', 'display-capture'];
    callback(allowed.includes(permission));
  });

  // F11 para alternar fullscreen; Escape para salir
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11' || input.key === 'f' || input.key === 'F') {
      win.setFullScreen(!win.isFullScreen());
    }
    if (input.key === 'Escape' && input.control) {
      app.quit();
    }
  });

  win.loadFile(path.join(__dirname, '..', 'src', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
