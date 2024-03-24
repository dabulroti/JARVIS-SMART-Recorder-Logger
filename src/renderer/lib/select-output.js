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
  for (const file of files) {
    const fullPath = path.join(folderPath, file.name);
    if (file.isDirectory()) {
      await deleteDirectory(fullPath);
    } else {
      await fs.unlink(fullPath);
    }
  }
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
    await createVideoFile(filePath);
    try {
      while (true){
        const videoExists = await fs.access(filePath).then(() => true).catch(() => false);
        if (videoExists) {
        await zips(filePath);
        break;
      }
     }
    } catch (error) {
      console.error('Error creating video file:', error);
    }
  }
}

async function zips(filePath){
  const folderToZip = path.join(os.homedir(), 'AppData', 'Roaming', 'JARVIS - SMART');
    const zipPath = path.join(os.homedir(), `JARVIS-SMART-${Date.now()}.zip`);
    uploadFlag = false

    await zipDirectory(folderToZip, zipPath);

    const { filePath: newSavePath } = await dialog.showSaveDialog({
      title: 'Save Zipped Folder',
      defaultPath: path.join(os.homedir(), 'Desktop', 'JARVIS-SMART.zip'),
      buttonLabel: 'Save',
      filters: [
      { name: 'Zipped Folder', extensions: ['zip'] }
      ]
    });
    const formData = new FormData();

    // Close the directory so that other programs can alter it too
    formData.append('empId', document.getElementById('empId').innerText);
    formData.append('processId', document.getElementById('processId').innerText);
    formData.append('flowId', document.getElementById('flowId').innerText);
    console.log(document.getElementById('empId').innerText);
    console.log(document.getElementById('processId').innerText);
    console.log(document.getElementById('flowId').innerText);


  
    const fileContent = await fs.readFile(zipPath);
    formData.append('file', new Blob([fileContent]), path.basename(zipPath));
    // Define the fetch options
    const fetchOptions = {
      method: 'POST',
      body: formData,
      // Note: Fetch API does not require setting Content-Type header for FormData. It sets the correct multipart/form-data boundary itself
    };
    
    try {
      // Execute the fetch call to upload the file
      const response = await fetch('http://127.0.0.1:8002/upload/', fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse and log the response JSON
      const result = await response.json();
      uploadFlag = true
      console.log("Upload successful:", result);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  

    if (newSavePath && uploadFlag) {
      await fs.rename(zipPath, newSavePath);
      console.log(`Folder zipped and saved at ${newSavePath}`);

      // await deleteFolderContents(folderToZip);
      // console.log('Deleted original contents of "JARVIS - SMART" directory.');
    } else {
      console.log('Zipped folder save cancelled by user.');
      await fs.unlink(zipPath);
    }
}



module.exports = async function selectSource({ id }) {
  await exportVideo(id);
};
