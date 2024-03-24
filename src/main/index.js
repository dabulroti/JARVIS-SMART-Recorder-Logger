const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const { execFile, exec } = require('child_process');
const fs = require('fs');


require('./lib/events');

if (require('electron-squirrel-startup')) {
  app.quit();
}

Menu.setApplicationMenu(null);

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 562.5,
    icon: path.resolve(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.resolve(__dirname, '..', 'renderer', 'index.html'));
  mainWindow.webContents.openDevTools();

};

const http = require('http');

function waitForServerReady(url, callback) {
  const parsedUrl = new URL(url);

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname,
    method: 'GET'
  };

  const interval = setInterval(() => {
    const req = http.request(options, res => {
      console.log('Server is ready.');
      clearInterval(interval);
      callback();
    });

    req.on('error', error => {
      console.log('Server not ready, waiting...');
    });

    req.end();
  }, 1000); // Attempt to connect every 1000 milliseconds (1 second)
}

app.on('ready', () => {
  createWindow();
  handleCommandLineArguments(process.argv);

  // Attempt to open a custom URL scheme
  const customUrl = 'myapp2-protocol://';
  shell.openExternal(customUrl)
    .then(() => {
      console.log('Success: Opened custom URL:', customUrl);
      // If you want to log this success in the renderer's DevTools:
      mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`console.log("Success: Opened custom URL: ${customUrl}")`);
        waitForServerReady('http://127.0.0.1:8003/', () => {
        // Actions to take once the server is confirmed ready
        mainWindow.webContents.send('server-ready');
  });
      });
    })
    .catch(err => {
      console.error('Error opening custom URL:', err);
    });
});


app.on('second-instance', (event, commandLine, workingDirectory) => {
  if (mainWindow) {
    handleCommandLineArguments(commandLine);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  killBackendProcess();
});

function handleCommandLineArguments(commandLine) {
  const protocolUrl = commandLine.find(arg => arg.startsWith('myapp-protocol://'));
  if (protocolUrl && mainWindow) {
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.webContents.send('protocolUrl', protocolUrl);
      mainWindow.webContents.send('commandLine', process.cwd());
    });
  }
}

function killBackendProcess() {
  exec('taskkill /f /t /im index.exe', (err, stdout, stderr) => {
    if (err) {
      console.error('Failed to kill backend process:', err);
      return;
    }
    if (stdout) {
      console.log('Backend process killed:', stdout);
    }
    if (stderr) {
      console.error('Error killing backend process:', stderr);
    }
  });
}
