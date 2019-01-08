const csv = require('csvtojson');
const fs = require("fs");

const fileName = "utils/segment_generation/answers_candidate.csv";

csv()
  .fromFile(fileName)
  .then((rows) => {

    let data = {};

    rows.map((item) => {

      if(typeof data[item.segment_key] === 'undefined'){
        data[item.segment_key] = {data: []};
      }

      data[item.segment_key].data.push(
        {
          "user_key": item.user_key,
          "question_key": item.question_key,
          "value": item.value
        }
      );
    });

    for (let key in data){
      fs.writeFile( 'public/api/gps/answer/segment/'+ key + "_candidate.json", JSON.stringify(data[key], null, 2), (err) => {

        if (err) {
          console.error(err);
          return;
        }

        console.log("File has been created");

      });
    }

    console.log("-- Candidate answers generated --");
  });