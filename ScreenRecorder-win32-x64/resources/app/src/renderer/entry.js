require('./lib/events/click')
require('./lib/events/ipc')

const { ipcRenderer } = require('electron');

ipcRenderer.on('protocolUrl', (event, url) => {
    console.log('Received URL:', url);
    // Display the URL in your HTML
    document.getElementById('urlDisplay').textContent = url;
});

ipcRenderer.on('server-ready', () => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
    console.log("Uvicorn is ready!");
  });
