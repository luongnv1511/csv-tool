const csv = require("csv-parser");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const results = [];

const args = process.argv.slice(2);
const fileInput = args[0];
const fileOutput = args[1];
const brand = args[2];

const csvWriter = createCsvWriter({
  path: __dirname + `/${fileOutput}`,
  header: [
    { id: "id", title: "id" },
    { id: "title", title: "title" },
    { id: "brand", title: "brand" },
    { id: "link", title: "link" },
    { id: "price", title: "price" },
    { id: "description", title: "description" },
    { id: "image_link", title: "image_link" },
    { id: "mpn", title: "mpn" },
    { id: "gtin", title: "gtin" },
    { id: "availability", title: "availability" },
    { id: "condition", title: "condition" },
    { id: "product_type", title: "product_type" },
    { id: "product_category", title: "product_category" },
    { id: "bingads_grouping", title: "bingads_grouping" },
    { id: "bingads_label", title: "bingads_label" },
    { id: "custom_label_0", title: "custom_label_0" },
    { id: "custom_label_1", title: "custom_label_1" },
    { id: "custom_label_2", title: "custom_label_2" },
    { id: "custom_label_3", title: "custom_label_3" },
    { id: "custom_label_4", title: "custom_label_4" },
    { id: "bingads_redirect", title: "bingads_redirect" },
    { id: "sale_price", title: "sale_price" },
    { id: "sale_price_effective_date", title: "sale_price_effective_date" },
  ],
});

fs.createReadStream(__dirname + `/${fileInput}`)
  .pipe(csv({ separator: "\t" }))
  .on("data", (data) => {
    if (data.id) {
      data.mpn = data.id;
      if (!data.price) return;
      data.price = Number(data.price.match(/\d*.\d*/)[0]).toFixed(2);
      if (data.sale_price) {
        data.sale_price = Number(data.sale_price.match(/\d*.\d*/)[0]).toFixed(
          2
        );
      }
      data.brand = brand;
      results.push(data);
    }
  })
  .on("end", () => {
    csvWriter
      .writeRecords(results)
      .then(() => console.log("The CSV file was written successfully"));
  });
