// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_file_dialog])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn open_file_dialog(window: tauri::Window) -> Result<String, String> {
    let file_path = rfd::AsyncFileDialog::new()
        .add_filter("all Files", &["mp3", "FLAC"])
        .pick_file()
        .await
        .ok_or("Dialog closed".to_string())?
        .path()
        .to_string_lossy()
        .into_owned();
    
    
    Ok(file_path)
}
