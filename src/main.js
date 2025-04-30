const { invoke } = window.__TAURI__.core;
document.getElementById('add-btn').addEventListener('click', async () => {
  try {
    const list = document.getElementById('dynamic-list');
    const songPath = await invoke('open_file_dialog');
    
    if (!songPath) return; 
    
   
    const songName = songPath.split(/[\\/]/).pop(); 
    
  
    const trackElement = document.createElement('div');
    trackElement.className = 'track-item';
    trackElement.innerHTML = `
      <div class="track-info">
        <span class="track-icon"><i class="fas fa-music"></i></span>
        <span class="track-title">${songName}</span>
      </div>
      <button class="play-btn">
        <i class="fas fa-play"><span>&#10148;</span></i>
      </button>
    `;
    
   
    trackElement.addEventListener('click', async () => {
      try {
     
        document.querySelectorAll('.track-item').forEach(item => {
          item.classList.remove('playing');
          item.querySelector('.play-btn i').className = 'fas fa-play';
        });
        
    
        trackElement.classList.add('playing');
        trackElement.querySelector('.play-btn i').className = 'fas fa-pause';
        
       
        document.querySelector('.current-track').textContent = songName;
        document.querySelector('.player-controls .play-btn i').className = 'fas fa-pause';
        
  
        await invoke('Play_selected_file', { filepath: songPath });
        
      
        simulatePlaybackProgress();
      } catch (err) {
        console.error("Ошибка воспроизведения:", err);
        trackElement.classList.remove('playing');
      }
    });
    
    list.appendChild(trackElement);
    
  } catch (err) {
    console.error("Ошибка:", err);
    
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = 'Не удалось добавить трек';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
});

document.getElementById('Stop-track').addEventListener('click', async () => {
  try {
    await invoke('StopTrack');
  
  }
catch(err){
    console.error("Ошибка", err);
}
});

document.getElementById('Volume-input').addEventListener('input', async (e) => {
  try {
    const volumePercent = parseInt(e.target.value);
    const volumeNormalized = volumePercent / 100; 
    
    await invoke('ChangeVolume', { volume: volumeNormalized });
  
  } catch(err) {
    console.error("Ошибка изменения громкости:", err);
  }
});