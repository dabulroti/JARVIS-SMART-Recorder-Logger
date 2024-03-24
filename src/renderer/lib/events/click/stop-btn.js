document
  .getElementById('stopBtn')
  .addEventListener('click', ({ target }) => {
    const loadingBar = document.getElementById('saveProgressBar');
    loadingBar.style.display = 'block'; // Show the loading bar

    const startBtn = document.getElementById('startBtn');
    const saveBtn = document.getElementById('saveBtn');
    const videoSelectBtn = document.getElementById('videoSelectBtn');

    window.mediaRecorder.stop();

    fetch('http://127.0.0.1:8002/stop-logging/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Logging stopped successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error stopping logging.');
      })
      .finally(() => {
        loadingBar.style.display = 'none'; // Hide the loading bar
      });

    startBtn.classList.remove('is-danger');
    startBtn.textContent = 'Start';
    target.setAttribute('disabled', 'disabled');
    startBtn.removeAttribute('disabled');
    saveBtn.removeAttribute('disabled');
    videoSelectBtn.removeAttribute('disabled');
  });
