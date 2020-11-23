const csv = require("csv-parser");
const csvWriter = require("csv-write-stream");
const fs = require("fs");

const results = [];
const args = process.argv.slice(2);
const fileInput = args[0];
const fileOutput = args[1];
const brand = args[2];

const writeStreamFile = (stream, fileName) => {
  const writeStream = fs.createWriteStream(fileName);
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => writeStream.write(chunk));
    stream.on("error", reject);
    stream.on("end", resolve);
  });
};

(async () => {
  let row = 1;
  const writer = csvWriter({ sendHeaders: false });
  writer.write({
    id: "id",
    title: "title",
    brand: "brand",
    link: "link",
    price: "price",
    description: "description",
    image_link: "image_link",
    mpn: "mpn",
    availability: "availability",
    condition: "condition",
    product_type: "product_type",
    product_category: "product_category",
    bingads_grouping: "bingads_grouping",
    bingads_label: "bingads_label",
    custom_label_0: "custom_label_0",
    custom_label_1: "custom_label_1",
    custom_label_2: "custom_label_2",
    custom_label_3: "custom_label_3",
    custom_label_4: "custom_label_4",
    bingads_redirect: "bingads_redirect",
    sale_price: "sale_price",
    sale_price_effective_date: "sale_price_effective_date",
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
        console.log("Row number: ", row);
        row++;
        writer.write(data);
      }
    })
    .on("end", () => {});
  await writeStreamFile(writer, __dirname + `/${fileOutput}`);
  writer.end();
})();
