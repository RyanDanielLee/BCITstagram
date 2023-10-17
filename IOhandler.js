/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: October 16, 2023
 * Author: Ryan Lee
 *
 */

// const unzipper = require("unzipper"),
//   fs = require("fs"),
//   PNG = require("pngjs").PNG,
//   path = require("path");
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const PNG = require('pngjs').PNG;

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
// const unzip = (pathIn, pathOut) => {
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(pathIn)
//     .pipe(unzipper.Extract({ path: pathOut}))
//     .on("end", resolve)
//     .on("error", reject)
//   })
// };
function unzipFile(pathIn, pathOut) {
  return new Promise((resolve, reject) => {
      try {
          let zip = new AdmZip(pathIn);
          zip.extractAllToAsync(pathOut, true, err => {
              if (err) {
                 reject(err);
              } else { 
                resolve();
              }
          });
      } catch (err) {
          reject(err);
      }
  });
}

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
// const readDir = (dir) => {
//   return new Promise((resolve, reject) => {
//     fs.readdir(dir, (err, files) => {
//       if (err) { 
//         reject(err);
//       } else {
//         resolve(files.map(file => path.join(dir, file)));
//       }
//     });
//   });
// };
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        files = files.filter(file => fs.lstatSync(path.join(dir, file)).isFile());
        resolve(files.map(file => path.join(dir, file)));
      }
    });
  });
};


/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
// const grayScale = (pathIn, pathOut) => {
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(pathIn)
//       .pipe(new PNG())
//       .on('parsed', function() {
//         for (let y = 0; y < this.height; y++) {
//           for (let x = 0; x < this.width; x++) {
//             let idx = (this.width * y + x) << 2;
//             let grayscale = this.data[idx] * .3 + this.data[idx+1] * .59 + this.data[idx+2] * .11;
//             this.data[idx] = grayscale;
//             this.data[idx+1] = grayscale;
//             this.data[idx+2] = grayscale;
//           }
//         }
//         this.pack().pipe(fs.createWriteStream(pathOut)).on('finish', resolve).on('error', reject);
//       })
//       .on('error', reject);
//   });
// };

function grayScale(pathIn, pathOut) {
  return new Promise((resolve, reject) => {
      fs.createReadStream(pathIn)
          .pipe(new PNG())
          .on('parsed', function() {
              for (let y = 0; y < this.height; y++) {
                  for (let x = 0; x < this.width; x++) {
                      let idx = (this.width * y + x) << 2;
                      // Adjust the weights used to calculate the grayscale value
                      let grayscale = (this.data[idx] + this.data[idx+1] + this.data[idx+2]) / 3;
                      this.data[idx] = grayscale;
                      this.data[idx+1] = grayscale;
                      this.data[idx+2] = grayscale;
                  }
              }
              // Save the grayscaled image to a separate directory
              this.pack().pipe(fs.createWriteStream(pathOut)).on('finish', resolve).on('error', reject);
          })
          .on('error', reject);
  });
}

// module.exports = {
//   unzip,
//   readDir,
//   grayScale,
// };
module.exports = { unzipFile, readDir, grayScale };