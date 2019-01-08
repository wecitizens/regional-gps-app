LA = require('look-alike');
LAUtil = require('../../node_modules/look-alike/lib/util');

function getSubject(matchRequest) {
    return matchRequest.answers.reduce(
        (accumulator, target) => {
            const currentAnswerFormat = matchRequest.answer_formats.find(x => x.key === target.answer_format);

            if (currentAnswerFormat) {
                const currentItem = currentAnswerFormat.items.find(x => x.key === target.value);

                if (currentItem) {
                    return {
                        ...accumulator,
                        [target.question_key]: currentItem.weight
                    }
                } else {
                    console.log('currentItemNotFound', currentAnswerFormat.items, target.value);
                }
            } else {
                console.log('currentAnswerFormatNotFound', target.answer_format, answer_formats);
            }
        }, {});
}

function getWeights(matchRequest) {
    return matchRequest.answers.reduce(
        (accumulator, target) => {
            const currentAnswerFormat = matchRequest.answer_formats.find(x => x.key === target.answer_format);

            if (currentAnswerFormat) {
                const currentItem = currentAnswerFormat.tolerance.items.find(x => x.key === target.tolerance);

                if (currentItem) {
                    return {
                        ...accumulator,
                        [target.question_key]: currentItem.weight
                    }
                } else {
                    console.log('currentItemNotFound', currentAnswerFormat.items, target.value);
                }
            } else {
                console.log('currentAnswerFormatNotFound', target.answer_format, answer_formats);
            }
        }, {});
}

function getSamples(matchRequest, data) {

    return data.reduce(
        function (acc, t) {

            let u = {};

            if (acc.hasOwnProperty(t.user_key))
                u = acc[t.user_key];

            const q = matchRequest.answers.find(aa => aa.question_key == t.question_key);

            if (q == null) // otherwise when question answer not found in segment, there might be a question_id mismatch
                return acc;

            try {
                u[t.question_key] = matchRequest.answer_formats.find(x => x.key == q.answer_format).items.find(x => x.key == t.value).weight;
            } catch (err) {
                console.log('cannot find ', t.question_key, q.answer_format, t.value, answer_formats);
            }
            acc[t.user_key] = u;
            return acc;

        }
        , {});
}

function individualDistance(answer_formats, subject, weights, set) {
    let filteredSet = {};
    let filteredSubject = {};
    let filteredWeights = {};
    let i = 0;

    Object.keys(subject).forEach(f => {
        if (set.hasOwnProperty(f)) {
            filteredSet[f] = set[f];
            filteredSubject[f] = subject[f];
            filteredWeights[f] = weights[f];
            i++;
        }
    });

    const subjectLength = Object.keys(subject).length;

    const distance = LAUtil.distance(filteredSet, filteredSubject, {weights: filteredWeights});

    // works for one format only
    const itemWeightMax = answer_formats[0].items.map(i => i.weight).reduce((p, c) => {
        return c > p ? c : p;
    }, 0);

    const distanceMax = Math.sqrt(
        Object.values(filteredWeights).reduce((p, c) => {
            return p + Math.pow(c * itemWeightMax, 2)
        }, 0));

    console.log("Max weight : ");
    console.log(itemWeightMax);

    console.log("Max distance : ");
    console.log(distanceMax);

    return 100 * (1 - distance / distanceMax) * (2 / 3 + 1 / 3 * i / subjectLength);
}

function performMatch(matchRequest, segmentAnswers) {

    const subject = getSubject(matchRequest);
    const weights = getWeights(matchRequest);
    const samples = getSamples(matchRequest, segmentAnswers);

    console.log("My choice : ");
    console.log(subject);

    console.log("My tolerance : ");
    console.log(weights);

    return Object.keys(samples).map(key => {

        const sample = samples[key];

        // for all subject keys, get the sample one. if it does not exist, remove the one 

        const match = individualDistance(matchRequest.answer_formats, subject, weights, sample);

        return {
            key: key,
            score: match
        }

    });
}

function perform() {
    const matchRequest = {
        "segment_key": '2018_be_municipal_be_6850_politician',
        "answer_formats":
            [
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
        answers: [
            {
                question_key: "question_103",
                answer_format: "agr_5_scale_tol_3_scale_abs",
                value: "agree",
                tolerance: "very_important"
            },
            {
                question_key: "question_104",
                answer_format: "agr_5_scale_tol_3_scale_abs",
                value: "disagree",
                tolerance: "important"
            }
        ]
    };

    const segmentData = [
        /* {
             "user_key": "be_politician_1",
             "question_key": "question_103",
             "value": "agree"
         }, */
        {
            "user_key": "be_politician_1",
            "question_key": "question_104",
            "value": "strongly_disagree"
        },
        /* {
             "user_key": "be_politician_2",
             "question_key": "question_103",
             "value": "agree"
         },*/
        {
            "user_key": "be_politician_2",
            "question_key": "question_104",
            "value": "strongly_agree"
        }
    ];

    // TODO : How to unit test vue modules ...
    const score = performMatch(matchRequest, segmentData);

    console.log("My scores : ");
    console.log(score);
}

perform();