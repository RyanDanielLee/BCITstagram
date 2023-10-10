const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const fs = require("fs")
const unzipper = require("unzipper");
const { error } = require("console");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then(imagePaths => {
    let promises = []
    for (let i = 0; i < imagePaths.length; i++) {
      let pathIn = imagePaths[i];
      let pathOut = ``
      promises.push(IOhandler.grayScale(pathIn, pathOut));
    }
    return Promise.all(promises);
  })
  .then(() => console.log("All Images Done"))
  .catch(console.log(error))

// fs.createReadStream(zipFilePath)
//   .pipe(unzipper.Extract({ path: "./unzipped" }));

  //Read each png file...
  //fs.createReadStream("png1.png")

  //Step 1: Read the zip file
  //Step 2: Unzip the zip file  .then should only run after ziping occufs, use promises
  //Step 3: read all png images from unzipped folder
  //Step 4: Send them to the grayscale filter function
  //Step 5: After ALL Images have SUCCESSFULLY been grayscaled, (show a success message)
  //ALL ERRORS MUST SHOW IN .catch in PROMISE CHAIN

// Promise.all([promise1, promise2, promise3]).then((values) => {
//     console.log(("All images done!"))
// })

// greyScale("img1.png"), greyScale("img2.png"), greyScale("img3.png")
// .then (() => console.log("All images done!"))