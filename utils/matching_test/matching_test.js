LA = require('look-alike');
LAUtil = require('../../node_modules/look-alike/lib/util');

function getSubject(matchRequest) {
    console.log('getSubject' ,matchRequest);
    return matchRequest.answers.reduce(
        (accumulator, target) => {
            const currentAnswerFormat = matchRequest.answer_formats.find(x => x.key === target.answer_format);

            if (currentAnswerFormat) {
                const currentItem = currentAnswerFormat.items.find(x => x.key === target.value);

                if (currentItem) {
                    console.log(currentItem);
                    return {
                        ...accumulator,
                        [target.question_key]: currentItem.weight
                    }
                } else {
                    console.log('currentItemNotFound', currentAnswerFormat.items, target.value);
                }
            } else {
                console.log('currentAnswerFormatNotFound', target.answer_format, matchRequest.answer_formats);
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
                console.log('currentAnswerFormatNotFound', target.answer_format);
            }
        }, {});
}


// transform an array of user-question-value objects   into an array of oneuser-multiple answers-objects
function getSamples(matchRequest, data) {

    return data.reduce(
        function (accum, currt) {

            let u = {};

            if (accum.hasOwnProperty(currt.user_key))
                u = accum[currt.user_key];

            const q = matchRequest.answers.find(aa => aa.question_key == currt.question_key);



            if (q == null) // otherwise when question answer not found in segment, there might be a question_id mismatch
                return accum;

            try {
                u[currt.question_key] = matchRequest.answer_formats.find(x => x.key == q.answer_format).items.find(x => x.key == currt.value).weight;
            } catch (err) {
                console.log('cannot find ', currt.question_key, q.answer_format, currt.value, answer_formats);
            }
            accum[currt.user_key] = u;
            return accum;

        }
        , {});
}




function laudistance(p1, p2, opts) {


    var attr, dist, val, x, y;
    dist = 0;
    for (attr in p1) {
        console.log('  for: ' , attr);
        val = p1[attr];
        x = val;
        y = p2[attr];
        if ((opts != null ? opts.stdv : void 0) && Object.getOwnPropertyNames(opts.stdv).length > 0) {
            console.log('    use stdv');
            x /= opts.stdv[attr];
            y /= opts.stdv[attr];
        }
        if ((opts != null ? opts.weights : void 0) && Object.getOwnPropertyNames(opts.weights).length > 0) {
            console.log('    use weights: ',  opts.weights[attr]);
            x *= opts.weights[attr];
            y *= opts.weights[attr];
        }
        dist += Math.pow(x - y, 2);
    }
    console.log('   localdistance');
    return Math.sqrt(dist);
}



function individualDistance(answer_formats, subject, weights, set) {
    let filteredSet = {};
    let filteredSubject = {};
    let filteredWeights = {};
    let filteredNbr = 0;

    Object.keys(subject).forEach(f => {
        console.log('   subject key ', f);


        if (set.hasOwnProperty(f)) {
            if (subject[f]!=50) {
                console.dir('Included:' ,subject[f]);
                filteredSet[f] = set[f];
                filteredSubject[f] = subject[f];
                filteredWeights[f] = weights[f];
                filteredNbr++;
            } else {
                console.dir('Excluded' , subject[f]);
            }
        }
    });

    const subjectLength = Object.keys(subject).length;

    console.log('  filteredSet:', filteredSet);
    console.log('  filteredSubject:', filteredSubject);
    console.log('  filteredWeights:', filteredWeights);

    const distance = laudistance(filteredSet, filteredSubject, {weights: filteredWeights});
    console.log('  calculated distance: ', distance);

    // works for one format only
    const itemWeightMax = answer_formats[0].items.map(idx => idx.weight).reduce((p, c) => {
        return c > p ? c : p;
    }, 0);
    console.log('   itemWeightMax:', itemWeightMax);

    const distanceMax = Math.sqrt(
        Object.values(filteredWeights).reduce((p, c) => {
            return p + Math.pow(c * itemWeightMax, 2)
        }, 0));

    console.log("  distanceMax: ", distanceMax);
    console.log("  filteredNbr: ", filteredNbr);
    console.log("  subjectLength: ", subjectLength);
    //console.log("  intermediateEval: ", 1 / 3 * filteredNbr / subjectLength);

    const distance1 = 100 * (1 - distance / distanceMax);
    console.log('  distance1:', distance1);
    //const corrDistance = 100 * (1 - distance / distanceMax) * (2 / 3 + 1 / 3 * filteredNbr / subjectLength);
    //console.log('  correctedDistance:', corrDistance);
    return distance1;
}



function performMatch(matchRequest /*contains the user answers*/, segmentAnswers   /* the politician answers*/) {

    console.log('PerformMatch..');
    console.log('   matchRequest:', matchRequest);
    const answers = getSubject(matchRequest);
    console.log('   answers extracted:', answers);

    const weights = getWeights(matchRequest);

    const samples = getSamples(matchRequest, segmentAnswers);
    console.log('performMatch samples:', samples);

    console.log("User question answers: ", answers);
    console.log("User answers weights: ", weights);
    console.log('\n');

    return Object.keys(samples).map(key => {

        console.log(' > ', key);
        const sample = samples[key];

        // for all subject keys, get the sample one. if it does not exist, remove the one 

        const match = individualDistance(matchRequest.answer_formats, answers, weights, sample);
        let matchO =  {
            key: key,
            score: match
        }

        console.log('\n');
        return matchO;
    });
}



function performMatch2019(userAnswersMatchRequest /*contains the user answers*/, politiciansAnswers   /* the politician answers*/) {

    console.log('PerformMatch2019..');

    console.log("   userAnswersMatchRequest: ", userAnswersMatchRequest);


    const samples = getSamples(userAnswersMatchRequest, politiciansAnswers);
    console.log('   samples extracted:', samples);

    const userAnswers = getSubject(userAnswersMatchRequest);
    console.log("   user question answers extracted: ", userAnswers);

    const weights = getWeights(userAnswersMatchRequest);
    console.log("   user answers weights extracted: ", weights);

    console.log('\n');

    return Object.keys(samples).map(key => {

        console.log(' > ', key);
        const sample = samples[key];

        // for all subject keys, get the sample one. if it does not exist, remove the one

        const match = individualDistance(userAnswersMatchRequest.answer_formats, userAnswers, weights, sample);
        let matchO =  {
            key: key,
            score: match
        }

        return matchO;

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
                        {   "key": "strongly_agree",
                            "name": "answer_format.item.strongly_agree",
                            "weight": 100},
                        {   "key": "agree",
                            "name": "answer_format.item.agree",
                            "weight": 75},
                        { "key": "no_opinion",
                            "name": "answer_format.item.no_opinion",
                            "weight": 50 },
                        { "key": "disagree",
                            "name": "answer_format.item.disagree",
                            "weight": 25 },
                        { "key": "strongly_disagree",
                            "name": "answer_format.item.strongly_disagree",
                            "weight": 0 }
                    ],
                    "tolerance": {
                        "items": [
                            {   "key": "not_important",
                                "name": "answer_format.tolerance.item.not_important",
                                "weight": 0.4 },
                            {   "key": "important",
                                "name": "answer_format.tolerance.item.important",
                                "weight": 1 },
                            {   "key": "very_important",
                                "name": "answer_format.tolerance.item.very_important",
                                "weight": 2.5 }
                        ]
                    }
                }
            ],
        answers: [
            {   question_key: "question_103",
                answer_format: "agr_5_scale_tol_3_scale_abs",
                value: "strongly_disagree",
                tolerance: "important"
            },
            {   question_key: "question_104",
                answer_format: "agr_5_scale_tol_3_scale_abs",
                value: "agree",
                tolerance: "important"
            },
            {   question_key: "question_106",
                answer_format: "agr_5_scale_tol_3_scale_abs",
                value: "no_opinion",
                tolerance: "important"
            },
            {   question_key: "question_105",
                answer_format: "agr_5_scale_tol_3_scale_abs",
                value: "no_opinion",
                tolerance: "important"
            },
        ]
    };

    const segmentData = [
         {
             "user_key": "be_politician_1",
             "question_key": "question_103",
             "value": "agree"
         },
        {
            "user_key": "be_politician_1",
            "question_key": "question_106",
            "value": "disagree"
        },
        //{"user_key": "be_politician_1",  "question_key": "question_105", "value": "agree"},
        //{"user_key": "be_politician_2","question_key": "question_105","value": "agree"},
        {
            "user_key": "be_politician_1",
            "question_key": "question_104",
            "value": "strongly_disagree"
        },
        {
            "user_key": "be_politician_1",
            "question_key": "question_105",
            "value": "strongly_agree"
        },
        {
             "user_key": "be_politician_2",
             "question_key": "question_103",
             "value": "strongly_disagree"
         },
        {
            "user_key": "be_politician_2",
            "question_key": "question_105",
            "value": "agree"
        },
        {
            "user_key": "be_politician_2",
            "question_key": "question_106",
            "value": "agree"
        },
        {
            "user_key": "be_politician_2",
            "question_key": "question_107",
            "value": "strongly_disagree"
        },
        {
            "user_key": "be_politician_2",
            "question_key": "question_104",
            "value": "strongly_agree"
        }
    ];

    // TODO : How to unit test vue modules ...
    console.log('\n');
    const score = performMatch2019(matchRequest /*contains the user answers*/ , segmentData /* the politician answers*/ );

    console.log('\n');
    console.log("The matching scores of the policitians for the user answers: ");
    console.log(score);
    console.log('\n');
}

perform();