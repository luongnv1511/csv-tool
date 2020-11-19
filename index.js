const fs = require("fs");
const parse = require("csv-parse");
const stringify = require("csv-stringify");

const args = process.argv.slice(2);
const fileSrc = args[0];
const fileExport = args[1];
const brand = args[2];
let count = 1;

fs.createReadStream(__dirname + `/${fileSrc}`)
  .pipe(parse({ delimiter: "\t", quote: '"', skip_empty_lines: true }))
  .on("data", async (csvRow) => {
    const row0 = csvRow[0];
    if (row0 && row0 == "id") {
      await csvRow.unshift("mpn");
      await csvRow.unshift("chanel");
      await csvRow.unshift("content_language");
      await csvRow.unshift("target_country");
      await csvRow.unshift("offer_id");
    } else {
      await csvRow.unshift(row0);
      await csvRow.unshift("online");
      await csvRow.unshift("en");
      await csvRow.unshift("US");
      await csvRow.unshift(row0);
    }
    if (csvRow[12] != "price") {
      const price = {
        currency: "USD",
        value: Number(csvRow[12].match(/\d*.\d*/)[0]).toFixed(2),
      };
      csvRow[12] = JSON.stringify(price);
    }
    if (csvRow[14] != "brand") {
      csvRow[14] = brand;
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
