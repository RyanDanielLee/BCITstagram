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

