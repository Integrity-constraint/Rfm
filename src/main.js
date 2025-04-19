const { invoke } = window.__TAURI__.core;

document.getElementById('add-btn').addEventListener('click', async () => {
  try {
    const list = document.getElementById('dynamic-list');
      const song = await invoke('open_file_dialog');
      const newItem = document.createElement('Button');
      newItem.addEventListener('click', async () => {
      
          const songname = newItem.textContent;

          await invoke('Play_selected_file', { filepath: songname });

      })
      newItem.textContent = song;
      list.appendChild(newItem);
  } catch (err) {
      console.error("ошибка", err);
     
  }
});

