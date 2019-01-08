const csv = require('csvtojson');
const fs = require("fs");

const fileName = "Q21-Questions-for-GPS - S&Q (no input, extend formula only).csv";

const surveyTemplate = {
    "key": null,
    "name": null,
    "question_order": [],
    "questions": [],
    "answer_formats": [
        {
            "key": "dummy_yes_no",
            "items": [
                {
                    "key": "yes",
                    "name": "answer_format.item.yes",
                    "weight": 100
                },
                {
                    "key": "no",
                    "name": "answer_format.item.no",
                    "weight": 0
                }
            ]
        },
        {
            "key": "agr_5_scale_tol_3_scale_abs",
            "items": [
                {
                    "key": "strongly_agree",
                    "name": "answer_format.item.strongly_agree",
                    "weight": 100
                },
                {
                    "key": "agree",
                    "name": "answer_format.item.agree",
                    "weight": 75
                },
                {
                    "key": "no_opinion",
                    "name": "answer_format.item.no_opinion",
                    "weight": 50
                },
                {
                    "key": "disagree",
                    "name": "answer_format.item.disagree",
                    "weight": 25
                },
                {
                    "key": "strongly_disagree",
                    "name": "answer_format.item.strongly_disagree",
                    "weight": 0
                }
            ],
            "tolerance": {
                "items": [
                    {
                        "key": "not_important",
                        "name": "answer_format.tolerance.item.not_important",
                        "weight": 0.4
                    },
                    {
                        "key": "important",
                        "name": "answer_format.tolerance.item.important",
                        "weight": 1
                    },
                    {
                        "key": "very_important",
                        "name": "answer_format.tolerance.item.very_important",
                        "weight": 2.5
                    }
                ]
            }
        }
    ],
    "i18n": {
        "en": {
            "question": null,
            "answer_format": {
                "item": {
                    "yes": "Yes",
                    "no": "No",
                    "strongly_agree": "Fully agree",
                    "agree": "Rather yes",
                    "no_opinion": "No opinion",
                    "disagree": "Rather no",
                    "strongly_disagree": "Strongly disagree"
                },
                "tolerance": {
                    "item": {
                        "very_important": "Very important",
                        "important": "Important",
                        "not_important": "Not important"
                    }
                }
            }
        },
        "fr": {
            "question": null,
            "answer_format": {
                "item": {
                    "yes": "Oui",
                    "no": "Non",
                    "strongly_agree": "Tout à fait d'accord",
                    "agree": "Plutôt d'accord",
                    "no_opinion": "Je ne me prononce pas",
                    "disagree": "Plutôt pas d'accord",
                    "strongly_disagree": "Pas du tout d'accord"
                },
                "tolerance": {
                    "item": {
                        "very_important": "Très important",
                        "important": "Important",
                        "not_important": "Pas important"
                    }
                }
            }
        },
        "nl": {
            "question": null,
            "answer_format": {
                "item": {
                    "yes": "Ja",
                    "no": "Nee",
                    "strongly_agree": "Helemaal akkoord",
                    "agree": "Eerder ja",
                    "no_opinion": "Ik spreek mij niet uit",
                    "disagree": "Eerder nee",
                    "strongly_disagree": "Helemaal niet akkoord"
                },
                "tolerance": {
                    "item": {
                        "very_important": "Zeer belangrijk",
                        "important": "Belangrijk",
                        "not_important": "Niet belangrijk"
                    }
                }
            }
        }
    }
};

function translationObj(obj,lang, rObj){    
    if(obj[lang].text !== "")
        rObj[obj.questionId + "_text"] = obj[lang].text;

    if(obj[lang].notice !== "")
        rObj[obj.questionId + "_notice"] = obj[lang].notice;
}

csv()
    .fromFile(fileName)
    .then((c)=>{

        let surveys = [...new Set(c.map(o => o.key))];
        let languages = ["en","fr","nl"];

        surveys.forEach(survey => {

            console.log(survey);
            
            let surveyObj = JSON.parse(JSON.stringify(surveyTemplate)); // TODO find how to clone
            
            surveyObj.key = survey;
            surveyObj.name = "survey_" + survey;
            
            const questions = c.filter(r => r.key === survey).sort((a,b) => parseInt(a.questionOrder, 10) - parseInt(b.questionOrder,10) );
            
            console.log(questions);

            surveyObj.question_order = questions.map(q => "question_" + q.questionId);
            
            surveyObj.questions = questions.map(q => {
                return {
                    key: "question_" + q.questionId,
                    text: "question." +  q.questionId + "_text",
                    notice: q.noticeExists === "TRUE" ? "question." +  q.questionId + "_notice" : null,
                    answer_format: "agr_5_scale_tol_3_scale_abs"
                };
            });
            
            languages.forEach(l => {
                let rObj = {};
                c.filter(r => r.key === survey).map(obj => translationObj(obj, l, rObj)); // using aggregate in dict

                surveyObj.i18n[l].question = rObj;
                    
                
            });

            console.log(JSON.stringify(surveyObj, null, 2));

            fs.writeFile(survey + ".json", JSON.stringify(surveyObj, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                console.log("File has been created");
            });
        });
        
    });