// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::i32;
use std::{fs::File, path::Path,io::BufReader, sync::Arc, sync::Mutex};
use std::time::Duration;
use rodio::{Decoder, OutputStream, Sink};
use rodio::source::{SineWave, Source};

use lazy_static::lazy_static;

lazy_static::lazy_static! {
    static ref GLOBAL_SINK: Arc<Mutex<Option<Arc<Sink>>>> = Arc::new(Mutex::new(None));
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_file_dialog,Play_selected_file, StopTrack, ChangeVolume])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
// доделать, ужасы страшилки
#[tauri::command]
async fn Play_selected_file(filepath: String) {
    let selectedmfile = std::fs::File::open(filepath).unwrap();
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    
   
    if let Some(sink) = GLOBAL_SINK.lock().unwrap().take() {
        sink.stop();
    }


    let sink = Arc::new(Sink::try_new(&stream_handle).unwrap());
    let source = Decoder::new(BufReader::new(selectedmfile)).unwrap();

    sink.append(source);
    *GLOBAL_SINK.lock().unwrap() = Some(sink.clone());

   
    sink.sleep_until_end();
}

#[tauri::command]
async fn StopTrack() {
    if let Some(sink) = &*GLOBAL_SINK.lock().unwrap() {
        sink.stop();
    }
}

#[tauri::command]
async fn ChangeVolume(volume: f32) {
    if let Some(sink) = &*GLOBAL_SINK.lock().unwrap() {
        sink.set_volume(volume.clamp(0.0, 1.0)); 
    }
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
