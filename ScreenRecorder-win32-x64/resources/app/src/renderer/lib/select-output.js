const { dialog } = require('electron').remote
const { createVideoFile } = require('./handlers')
const os = require('os');
const path = require('path');
const ADMZip = require('adm-zip');
const fs = require('fs').promises; // Use fs promises for asynchronous operations

async function zipDirectory(sourceDir, outPath) {
  const zip = new ADMZip();
  zip.addLocalFolder(sourceDir);
  zip.writeZip(outPath);
}

async function deleteFolderContents(folderPath) {
  const files = await fs.readdir(folderPath, { withFileTypes: true });
  const promises = files.map(file => {
    const fullPath = path.join(folderPath, file.name);
    return file.isDirectory() ? deleteDirectory(fullPath) : fs.unlink(fullPath);
  });
  await Promise.all(promises);
}

async function deleteDirectory(directoryPath) {
  await deleteFolderContents(directoryPath);
  await fs.rmdir(directoryPath);
}

async function exportVideo(ext) {
  const filePath = path.join(os.homedir(), 'AppData', 'Roaming', 'JARVIS - SMART', `vid-${Date.now()}.${ext}`);
  console.log(filePath);

  if (filePath) {
    console.log(filePath);
    createVideoFile(filePath);

    // After saving the video, zip the "JARVIS - SMART" folder
    const folderToZip = path.join(os.homedir(), 'AppData', 'Roaming', 'JARVIS - SMART');
    const zipPath = path.join(os.homedir(), `JARVIS-SMART-${Date.now()}.zip`); // Temporary path for zipping

    await zipDirectory(folderToZip, zipPath);

    // Use Electron dialog to ask the user for a new save location
    const { filePath: newSavePath } = await dialog.showSaveDialog({
      title: 'Save Zipped Folder',
      defaultPath: path.join(os.homedir(), 'Desktop', 'JARVIS-SMART.zip'),
      buttonLabel: 'Save',
      filters: [
        { name: 'Zipped Folder', extensions: ['zip'] }
      ]
    });

    if (newSavePath) {
      // Move the zipped file to the new location chosen by the user
      await fs.rename(zipPath, newSavePath);
      console.log(`Folder zipped and saved at ${newSavePath}`);

      // Delete everything in the "JARVIS - SMART" directory
      await deleteFolderContents(folderToZip);
      console.log('Deleted original contents of "JARVIS - SMART" directory.');
    } else {
      console.log('Zipped folder save cancelled by user.');
      // Optionally, clean up by deleting the temporarily zipped file
      await fs.unlink(zipPath);
    }
  }
}

module.exports = async function selectSource({ id }) {
  await exportVideo(id);
};
