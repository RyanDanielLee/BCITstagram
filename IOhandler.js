/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: October 16, 2023
 * Author: Ryan Lee
 *
 * Note: This file uses AdmZip instead of unzipper because unzipper created courrpted images
 * The original code provided has also been modified to accomodate for these changes
 */


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

const unzip = (pathIn, pathOut) => new Promise((resolve, reject) => {
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

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */

const readDir = dir => new Promise((resolve, reject) => {
    fs.promises.readdir(dir)
      .then(files => {
        let promises = files.map(file => {
          let filePath = path.join(dir, file);
          return fs.promises.stat(filePath)
            .then(stats => {
              if (stats.isFile()) {
                return filePath;
              } else {
                return null;
              }
            });
        });
        return Promise.all(promises);
      })
      .then(filePaths => {
        let validFilePaths = [];
        for (let i = 0; i < filePaths.length; i++) {
          if (filePaths[i] !== null) {
            validFilePaths.push(filePaths[i]);
          }
        }
        resolve(validFilePaths);
      })
      .catch(reject);
  });

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

const grayScale = (pathIn, pathOut) => new Promise((resolve, reject) => {
  fs.createReadStream(pathIn)
      .pipe(new PNG())
      .on('parsed', function() {
          for (let y = 0; y < this.height; y++) {
              for (let x = 0; x < this.width; x++) {
                  let idx = (this.width * y + x) << 2;
                  let grayscale = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
                  this.data[idx] = grayscale;
                  this.data[idx + 1] = grayscale;
                  this.data[idx + 2] = grayscale;
              }
          }
          this.pack().pipe(fs.createWriteStream(pathOut)).on('finish', resolve).on('error', reject);
      })
      .on('error', reject);
});

module.exports = { 
  unzip, 
  readDir, 
  grayScale 
};