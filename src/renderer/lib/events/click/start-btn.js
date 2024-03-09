document
  .getElementById('startBtn')
  .addEventListener('click', ({ target }) => {

    // Function to start logging
  fetch('http://127.0.0.1:8002/start-logging/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      // No need to send body for this example, but you can include data if required
  })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
      alert('Logging started successfully!');
  })
  .catch((error) => {
      console.error('Error:', error);
      alert('Error starting logging.');
  });





    const stopBtn = document.getElementById('stopBtn')
    const saveBtn = document.getElementById('saveBtn')
    const saveLogsBtn = document.getElementById('saveLogsBtn')
    const videoSelectBtn = document.getElementById('videoSelectBtn')

    stopBtn.removeAttribute('disabled')
    saveBtn.setAttribute('disabled', 'disabled')
    videoSelectBtn.setAttribute('disabled', 'disabled')
    saveLogsBtn.setAttribute('disabled', 'disabled')
    target.setAttribute('disabled', 'disabled')
    
    window.mediaRecorder.start()
  
    target
      .classList
      .add('is-danger')
    
    target.textContent = 'Recording'
  })