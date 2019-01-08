const csv = require('csvtojson');
const fs = require("fs");

const fileName = "Communes - Belgium Municipalities.csv";

csv()
    .fromFile(fileName)
    .then((districts) => {

        districts.forEach(district => {
            
            const ep = "2018_be_municipal_"; 
            
            let poll = {
                key: ep + "be_" + district.code + "_voter",
                survey_key: ep + district.region + "_" + district.type,
                segment_keys : [
                    ep + "be_" + district.code + "_candidate",
                    ep + "be_" + district.code + "_electoral_list"
                ],
                insufficient_data: false
            };

            fs.writeFile(poll.key + ".json", JSON.stringify(poll, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }

                console.log("File has been created");
            });
        });

    });