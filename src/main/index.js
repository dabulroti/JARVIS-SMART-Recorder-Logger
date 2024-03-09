const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

const isDev = process.env.MODE === 'development';

require('./lib/events');

if (require('electron-squirrel-startup')) {
    app.quit();
}

Menu.setApplicationMenu(null);


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 625,
    height: 556,
    icon: path.resolve(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  

  mainWindow.loadFile(
    path.resolve(
      __dirname,
      '..',
      'renderer',
      'index.html'
    )
  );

  mainWindow.webContents.openDevTools();


  if (isDev) {
      mainWindow.webContents.openDevTools();
  }

}


let backend;
backend = path.join(process.cwd(), './dist/ScreenRecorderPSRPythonBackend.exe')
var execfile = require('child_process').execFile;
execfile(
 backend,
 {
  windowsHide: true,
 },
 (err, stdout, stderr) => {
  if (err) {
  console.log(err);
  }
  if (stdout) {
  console.log(stdout);
  }
  if (stderr) {
  console.log(stderr);
  }
 }
)


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      const { exec } = require('child_process');
exec('taskkill /f /t /im ScreenRecorderPSRPythonBackend.exe', (err, stdout, stderr) => {
 if (err) {
  console.log(err)
 return;
 }
 console.log(`stdout: ${stdout}`);
 console.log(`stderr: ${stderr}`);
});
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Add this to listen for the app's 'before-quit' event
app.on('before-quit', () => {
  const { exec } = require('child_process');
exec('taskkill /f /t /im ScreenRecorderPSRPythonBackend.exe', (err, stdout, stderr) => {
 if (err) {
  console.log(err)
 return;
 }
 console.log(`stdout: ${stdout}`);
 console.log(`stderr: ${stderr}`);
});
});

//open dev tools
