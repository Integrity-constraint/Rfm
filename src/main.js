const { invoke } = window.__TAURI__.core;

document.getElementById('add-btn').addEventListener('click', async () => {
  try {
    const list = document.getElementById('dynamic-list');
      const song = await invoke('open_file_dialog');
      const newItem = document.createElement('li');
      newItem.addEventListener()
      newItem.textContent = song;
      list.appendChild(newItem);
  } catch (err) {
      console.error("ошибка", err);
     
  }
});