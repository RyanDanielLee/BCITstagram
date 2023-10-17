const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description: This program will unzip a zip file, read all the png files from the unzipped directory, 
 * grayscale each image, and save the grayscaled images to a new directory
 *
 * Created Date: October 16, 2023
 * Author: Ryan Lee
 *
 * Note: This file uses AdmZip instead of unzipper because unzipper created courrpted images
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then(imagePaths => {
    let promises = []
    for (let i = 0; i < imagePaths.length; i++) {
      let pathIn = imagePaths[i];
      let pathOut = path.join(pathProcessed, path.basename(pathIn));
      promises.push(IOhandler.grayScale(pathIn, pathOut));
    }
    return Promise.all(promises);
  })
  .then(() => console.log("All Images Done"))
  .catch(error => console.log(error))