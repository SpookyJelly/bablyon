// const fs = require("fs");
// const readline = require("readline");
const fs = require("fs");

const arr = [
  {
    filePath: "./pages/shooter/index.html",
    searchString: "./assets/",
    replaceString: "./shooter/assets/",
  },
];

arr.forEach((item) => {
  fs.readFile(item.filePath, "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      return;
    }
    const modifiedData = data.replaceAll(item.searchString, item.replaceString);
    fs.writeFile(item.filePath, modifiedData, "utf8", (err) => {
      if (err) return console.log(err);
    });
  });
});

// fs.readFile(filePath, "utf8", (err, data) => {
//   if (err) {
//     console.log("Error reading file:", err);
//     return;
//   }
//   const modifiedData = data.replaceAll(searchString, replaceString);
//   fs.writeFile(filePath, modifiedData, "utf8", (err) => {
//     if (err) return console.log(err);
//   });
// });
