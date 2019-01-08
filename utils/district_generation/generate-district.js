const csv = require('csvtojson');
const fs = require("fs");

const fileName = "Communes - Belgium Municipalities.csv";

csv()
    .fromFile(fileName)
    .then((rows) => {

        const districts = rows.map(r => {
            return {
                key: "be_" + r.code,
                code: r.code,
                type: "municipality",
                name: "district_be_" + r.code + "_name"
            }
        });

        const request = {
            data: districts,
            i18n: {
                fr: rows.reduce(
                    (accumulator, target) => ({ ...accumulator, ["district_be_" + target.code + "_name"]: target.name_fr }),
                    {}),
                nl: rows.reduce(
                    (accumulator, target) => ({ ...accumulator, ["district_be_" + target.code + "_name"]: target.name_nl }),
                    {}),
            }
        };

        fs.writeFile("district.json", JSON.stringify(request, null, 2), (err) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log("File has been created");
        });
    });