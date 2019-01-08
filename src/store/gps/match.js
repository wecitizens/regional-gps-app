import LAUtil from '../../../node_modules/look-alike/lib/util';
import API from "../_helpers/api";

// TODO : handle more (or less) than two segment for each poll

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
                console.log('currentAnswerFormatNotFound', target.answer_format, matchRequest.answer_formats);
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
                console.log('cannot find ', t.question_key, q.answer_format, t.value, matchRequest.answer_formats);
                return acc;
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

    console.log("Distance : ");
    console.log(distance);
    
    console.log("Score");
    console.log((1 - distance / distanceMax));

    console.log("i");
    console.log(i);

    console.log("subjectLength");
    console.log(subjectLength);
    
    console.log("Max weight : ");
    console.log(itemWeightMax);

    console.log("Max distance : ");
    console.log(distanceMax);

    return 100 * (1 - distance / distanceMax) * (0.75 + 0.25 * i / subjectLength);
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


        console.log('Individual - subject', subject);
        console.log('Individual - weight', weights);
        console.log('Individual - sample', sample);
        
        const match = individualDistance(matchRequest.answer_formats, subject, weights, sample);

        console.log('Individual - match', match);
        console.log('Individual - user_key', key);

        return {
            user_key: key,
            score: match
        }

    });
}

export default {
    state: {
        current: {
            candidateSegmentAnswers: null,
            electoralListSegmentAnswers: null,
            candidateScores: [],
            electoralListScores: []
        }
    },
    getters: {
        currentCandidateScores: state => state.current.candidateScores,
        currentElectoralListScores: state => state.current.electoralListScores
    },
    mutations: {
        setCurrentCandidateScores(state, payload) {
            state.current.candidateScores = payload;
        },
        setCurrentElectoralListScores(state, payload) {
            state.current.electoralListScores = payload;
        },
        setCurrentCandidateSegmentAnswers(state, payload) {
            state.current.candidateSegmentAnswers = payload;
        },
        setCurrentElectoralListSegmentAnswers(state, payload) {
            state.current.electoralListSegmentAnswers = payload;
        }
    },
    actions: {
        async performMatch({commit}, matchRequest) {

            const segmentAnswers = await API.get('gps/answer/segment/' + matchRequest.segment_key + '.json').then((request) => {
                return request.data.data;
            });

            if (matchRequest.segment_key.includes("electoral_list")) {
                commit('setCurrentElectoralListSegmentAnswers', segmentAnswers)
            }

            if (matchRequest.segment_key.includes("candidate")) {
                commit('setCurrentCandidateSegmentAnswers', segmentAnswers)
            }

            const scores = performMatch(matchRequest, segmentAnswers);

            console.log("My scores : ");
            console.log(scores);

            const viewScores = scores
                .sort((a, b) => -(a.score - b.score))
                .map(s => {
                    s.score = s.score.toFixed(2);
                    return s;
                });

            if (matchRequest.segment_key.includes("electoral_list")) {
                commit('setCurrentElectoralListScores', viewScores)
            }

            if (matchRequest.segment_key.includes("candidate")) {
                commit('setCurrentCandidateScores', viewScores)
            }
        }
    }
};