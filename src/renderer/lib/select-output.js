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
          await deleteFileWithRetry(fullPath);
      }
  }
}


async function deleteDirectory(directoryPath) {
  await deleteFolderContents(directoryPath);
  await fs.rmdir(directoryPath);
}

async function deleteFileWithRetry(filePath, maxRetries = 5, retryDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
          await fs.unlink(filePath);
          console.log(`File successfully deleted: ${filePath}`);
          return;
      } catch (error) {
          if (error.code === 'ENOENT') {
              console.log(`File does not exist, skipping delete: ${filePath}`);
              return;
          } else if (attempt < maxRetries) {
              console.log(`Attempt ${attempt} failed to delete file. Retrying in ${retryDelay}ms...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
          } else {
              console.log(`Failed to delete file after ${maxRetries} attempts.`);
              throw error;
          }
      }
  }
}


async function exportVideo(ext) {
  const filePath = path.join(os.homedir(), 'AppData', 'Roaming', 'JARVIS - SMART', `vid-${Date.now()}.${ext}`);
  console.log(`Creating video at: ${filePath}`);

  try {
    // Wait for the video file to be fully created and processed.
    await createVideoFile(filePath);
    console.log(`Video file created at: ${filePath}`);

    // Proceed with zipping the file now that it's guaranteed to be ready.
    await zips(filePath);
    console.log(`Zipping completed for: ${filePath}`);

    // Optionally delete the original file after zipping, if required.
    await deleteFileWithRetry(filePath);
    console.log(`Original video file deleted: ${filePath}`);
  } catch (error) {
    console.error('Error in video creation or post-processing:', error);
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

      await deleteFolderContents(folderToZip);
      // console.log('Deleted original contents of "JARVIS - SMART" directory.');
    } else {
      console.log('Zipped folder save cancelled by user.');
      await fs.unlink(zipPath);
    }
}



module.exports = async function selectSource({ id }) {
  await exportVideo(id);
};
