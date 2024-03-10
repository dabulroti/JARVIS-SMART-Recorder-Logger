require('./lib/events/click')
require('./lib/events/ipc')

const { ipcRenderer } = require('electron');

ipcRenderer.on('protocolUrl', (event, url) => {
    console.log('Received URL:', url);
    // Display the URL in your HTML
    document.getElementById('urlDisplay').textContent = url;
});

ipcRenderer.on('commandLine', (event, url) => {
    console.log('Received command line:', url);
});
