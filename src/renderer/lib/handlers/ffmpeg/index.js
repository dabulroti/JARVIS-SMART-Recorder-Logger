const { start, end } = require('../../events/export')
const loadFfmpeg = require('./load-ffmpeg')
const createReadableVideoBuffer = require('./create-readable-video-buffer')

// exports.createVideoFile = async function (filePath) {
//   const ffmpeg = loadFfmpeg()
//   const readableVideoBuffer = createReadableVideoBuffer()

//   await ffmpeg
//     .input(readableVideoBuffer)
//     .output(filePath)
//     .withNoAudio()
//     .on('start', start)
//     .on('end', end)
//     .run()
// }

exports.createVideoFile = function (filePath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = loadFfmpeg();
    const videoBuffer = window.videoBuffer; // Make sure this is correctly populated
    const readableVideoBuffer = createReadableVideoBuffer(videoBuffer);

    ffmpeg.input(readableVideoBuffer)
      .output(filePath)
      .withNoAudio()
      .on('start', () => console.log('FFmpeg processing started'))
      .on('end', () => {
        console.log('FFmpeg processing finished');
        resolve(filePath); // Resolve with the filePath if needed
      })
      .on('error', (err) => {
        console.error('FFmpeg processing error:', err);
        reject(err);
      })
      .run();
  });
};
