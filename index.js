var fs = require("fs");
var parse = require("csv-parse");
var stringify = require("csv-stringify");

const args = process.argv.slice(2);
let fileSrc = args[0];
let fileExport = args[1];
let count = 1;

fs.createReadStream(__dirname + `/${fileSrc}`)
  .pipe(parse({ delimiter: "\t", quote: '"', skip_empty_lines: true }))
  .on("data", async (csvRow) => {
    const row0 = csvRow[0];
    if (row0 && row0 == "id") {
      await csvRow.unshift("mpn");
    } else {
      await csvRow.unshift(row0);
    }

    stringify([csvRow], (err, output) => {
      fs.appendFile(fileExport, output, "utf8", (err) => {
        if (err) {
          console.log("err: ", err);
        } else {
          console.log("Row Number: ", count);
          count += 1;
        }
      });
    });
  });
