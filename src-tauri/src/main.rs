// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Carles: código mínimo de Tauri. No necesito comandos personalizados
    // porque toda la lógica está en el frontend (p5 + MediaPipe).
    // Tauri sirve la carpeta ../src como webview y da acceso a getUserMedia.
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("Error al iniciar Tauri");
}
