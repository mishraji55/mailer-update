const fs = require("fs");
const csvParser = require("csv-parser");
const emailValidator = require("email-validator");

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const recipients = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => {
        if (emailValidator.validate(data.email)) recipients.push(data);
      })
      .on("end", () => resolve(recipients))
      .on("error", (err) => reject(err));
  });
};

module.exports = { parseCSV };