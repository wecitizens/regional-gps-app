const csv = require('csvtojson');
const fs = require("fs");

const fileName = "answers.csv";

csv()
    .fromFile(fileName)
    .then((rows) => {

        const data = rows.reduce(
            (acc, obj) => {
                let cle = obj.segment_key + '_' + obj.segment_type;
                if (!acc[cle]) {
                    acc[cle] = [];
                }
                acc[cle].push({
                    user_key: obj.user_key,
                    user_name: obj.user_name, // @TODO name appears in segment answers but should only in district election
                    question_key: obj.question_key,
                    value: obj.value
                });
                return acc;
            }, {});

        //  console.log(data);

        Object.keys(data).forEach(k => {
            fs.writeFile(k + ".json", JSON.stringify({data: data[k]}, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }

                console.log("File has been created");
            });

            /*fs.writeFile(k.replace('electoral_list', 'candidate') + ".json", JSON.stringify({data: []}, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }

                console.log("File has been created");
            });*/

            const removeDuplicates = function removeDuplicates(array) {
                let uniq = {};
                return array.filter(obj => !uniq[obj.id] && (uniq[obj.id] = true))
            };


            const translations = removeDuplicates(data[k].map(d => (
                { // hack to get first record
                    key: d.user_key + "_name",
                    value: d.user_name
                }))).reduce((acc, cur) => ({...acc, [cur.key]: cur.value}), {});

            fs.writeFile(k.replace('2018_be_municipal_', '').replace('_electoral_list', '') + ".json",

                JSON.stringify({

                    key: k.replace('municipal_be', 'municipal').replace('_electoral_list', ''),
                    type: "be_municipal",
                    type_name: "election_type_be_municipal_name",
                    date: "2018-10-14T00:00:00.000Z",
                    main_election_key: "2018_be_municipal",
                    district_key: k.replace('2018_be_municipal_', '').replace('_electoral_list', ''),
                    electoral_lists: removeDuplicates(data[k].map(d => {
                        return { // hack to get first record
                            key: d.user_key,
                            name: d.user_key + "_name"
                        }
                    },)),
                    i18n: {
                        en: {},
                        fr: translations,
                        nl: {}
                    }
                }, null, 2)
                , (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    console.log("File has been created");
                });
        });

        console.log("Generate file to use in api/gps/answer/segment");
    });