import LAUtil from '../../../node_modules/look-alike/lib/util';
import API from "../_helpers/api";

// TODO : handle more (or less) than two segment for each poll

function getSubject(matchRequest) {
    console.log('getSubject' ,matchRequest);
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

    //console.log('individualDistance..');

    let filteredSet = {};
    let filteredSubject = {};
    let filteredWeights = {};
    let filteredNbr = 0;

    Object.keys(subject).forEach(f => {
        if (set.hasOwnProperty(f)) {

            if (subject[f] != 50) {   // we do not take into account 'no_opinion' case
                console.dir('Included:', subject[f]);
                filteredSet[f] = set[f];
                filteredSubject[f] = subject[f];
                filteredWeights[f] = weights[f];
                filteredNbr++;
            } else {
                console.dir('Excluded', subject[f]);
            }
        }
    });

    //const subjectLength = Object.keys(subject).length;

    const distance = laudistance(filteredSet, filteredSubject, {weights: filteredWeights});

    // works for one format only
    const itemWeightMax = answer_formats[0].items.map(idx => idx.weight).reduce((p, c) => {
        return c > p ? c : p;
    }, 0);

    const distanceMax = Math.sqrt(
        Object.values(filteredWeights).reduce((p, c) => {
            return p + Math.pow(c * itemWeightMax, 2)
        }, 0));

    //console.log("Distance : ");console.log(distance);
    //console.log("Score");console.log((1 - distance / distanceMax));
    //console.log("i");console.log(i);
    //console.log("subjectLength");console.log(subjectLength);
    //console.log("Max weight : ");console.log(itemWeightMax);
    //console.log("Max distance : ");console.log(distanceMax);

    const distance1 = 100 * (1 - distance / distanceMax);
    //console.log('  distance1:', distance1);
    //return 100 * (1 - distance / distanceMax) * (0.75 + 0.25 * filteredNbr / subjectLength);
    //const corrDistance = 100 * (1 - distance / distanceMax) * (2 / 3 + 1 / 3 * filteredNbr / subjectLength);
    //console.log('  correctedDistance:', corrDistance);
    return distance1;

}


function laudistance(p1, p2, opts) {


    var attr, dist, val, x, y;
    dist = 0;
    for (attr in p1) {
        val = p1[attr];
        x = val;
        y = p2[attr];
        if ((opts != null ? opts.stdv : void 0) && Object.getOwnPropertyNames(opts.stdv).length > 0) {
            x /= opts.stdv[attr];
            y /= opts.stdv[attr];
        }
        if ((opts != null ? opts.weights : void 0) && Object.getOwnPropertyNames(opts.weights).length > 0) {
            x *= opts.weights[attr];
            y *= opts.weights[attr];
        }
        console.log('localdistance');
        dist += Math.pow(x - y, 2);
    }
    return Math.sqrt(dist);
}


function performMatch(matchRequest, segmentAnswers) {

    console.log('performMatch:', matchRequest);


    //if (matchRequest.electionKey) {
    //    arr.includes(obj);
    //}
    //console.log(electionsQuestions);

    const subject = getSubject(matchRequest);
    const weights = getWeights(matchRequest);
    const samples = getSamples(matchRequest, segmentAnswers);



    console.log(samples);
    //console.log("My choice : ");console.log(subject);
    //console.log("My tolerance : ");console.log(weights);

    return Object.keys(samples).map(key => {

        console.log('Individual - user_key', key);
        const sample = samples[key];
        console.log('Individual - sample', sample);

        // for all subject keys, get the sample one. if it does not exist, remove the one 

        //console.log('Individual - subject', subject);
        //console.log('Individual - weight', weights);

        const match = individualDistance(matchRequest.answer_formats, subject, weights, sample);

        //console.log('Individual - match', match);

        return {
            user_key: key,
            score: match
        }

    });
}


export default {
    state: {
        current: {
            candidateSegmentAnswers: [],
            eurCandidateSegmentAnswers: [],
            fedCandidateSegmentAnswers: [],
            regCandidateSegmentAnswers: [],

            substituteSegmentAnswers: [],
            eurSubstituteSegmentAnswers: [],
            fedSubstituteSegmentAnswers: [],
            regSubstituteSegmentAnswers: [],

            electoralListSegmentAnswers: [],
            eurElectoralListSegmentAnswers: [],
            fedElectoralListSegmentAnswers: [],
            regElectoralListSegmentAnswers: [],

            //candidateScores: [],
            eurCandidateScores: [],
            fedCandidateScores: [],
            regCandidateScores: [],

            // c moche..qd on n'a pas le temps d'apprendre Vue...
            substituteScores: [],
            eurSubstituteScores: [],
            fedSubstituteScores: [],
            regSubstituteScores: [],

            // .. pour faire les choses proprement.
            electoralListScores: [],
            eurElectoralListScores: [],
            fedElectoralListScores: [],
            regElectoralListScores: [],

            allPartyImages: [],
            electionsQuestions:null,
            eurDistrictLists:null,
            fedDistrictLists:null,
            regDistrictLists:null,

            eurSubstitutes: [],
            fedSubstitutes: [],
            regSubstitutes: [],
            eurCandidates: [],
            fedCandidates: [],
            regCandidates: []

        }
    },
    getters: {
        currentEurCandidateScores: state => state.current.eurCandidateScores,
        currentRegCandidateScores: state => state.current.regCandidateScores,
        currentFedCandidateScores: state => state.current.fedCandidateScores,

        // currentCandidateScores: state => state.current.candidateScores,
        currentEurSubstituteScores: state => state.current.eurSubstituteScores,
        currentRegSubstituteScores: state => state.current.regSubstituteScores,
        currentFedSubstituteScores: state => state.current.fedSubstituteScores,

        //currentElectoralListScores: state => state.current.electoralListScores
        currentEurElectoralListScores: state => state.current.eurElectoralListScores,
        currentRegElectoralListScores: state => state.current.regElectoralListScores,
        currentFedElectoralListScores: state => state.current.fedElectoralListScores,

        eurCandidates: state => state.current.eurCandidates,
        fedCandidates: state => state.current.fedCandidates,
        regCandidates: state => state.current.regCandidates,

        eurSubstitutes: state => state.current.eurSubstitutes,
        fedSubstitutes: state => state.current.fedSubstitutes,
        regSubstitutes: state => state.current.regSubstitutes,

        eurDistrictLists: state => state.current.eurDistrictLists,
        fedDistrictLists: state => state.current.fedDistrictLists,
        regDistrictLists: state => state.current.regDistrictLists,

        allPartyImages: state => state.current.allPartyImages,
        electionsQuestions: state => state.current.electionsQuestions

    },
    mutations: {

        setCurrentSurvey (state, payload) {
            console.log('match.js:setCurrentSurvey electionsQuestions  ', payload);
            state.current.electionsQuestions = payload.electionsquestions;
        },


        setAllPartyImages (state, payload) {
            state.current.allPartyImages = payload
        },

        setCurrentEurDistrictLists (state, payload) {
            state.current.eurDistrictLists = payload
        },
        setCurrentFedDistrictLists(state, payload) {
            state.current.fedDistrictLists = payload
        },
        setCurrentRegDistrictLists (state, payload) {
            console.log('vote.js:mut.setCurrentRegDistrictLists', payload);
            state.current.regDistrictLists = payload
        },
        setCurrentEurSubstitutes (state, payload) {
            console.log('vote.js:mut.setCurrentEurSubstitutes', payload);
            state.current.eurSubstitutes = payload
        },
        setCurrentFedSubstitutes(state, payload) {
            console.log('vote.js:mut.setCurrentFedSubstitutes', payload);
            state.current.fedSubstitutes = payload
        },
        setCurrentRegSubstitutes(state, payload) {
            console.log('vote.js:mut.setCurrentRegSubstitutes', payload);
            state.current.regSubstitutes = payload
        },

        setCurrentEurCandidates(state, payload) {
            console.log('vote.js:mut.setCurrentEurCandidates', payload);
            state.current.eurCandidates = payload
        },
        setCurrentFedCandidates(state, payload) {
            console.log('vote.js:mut.setCurrentFedCandidates', payload);
            state.current.fedCandidates = payload
        },
        setCurrentRegCandidates(state, payload) {
            console.log('vote.js:mut.setCurrentRegCandidates', payload);
            state.current.regCandidates = payload
        },

        // SCORES
        setCurrentCandidateScores(state, payload) {
            console.log('setCurrentCandidateScores:');console.log(payload);
            if (payload.electionTp=='eur') state.current.eurCandidateScores= payload.scores;
            if (payload.electionTp=='reg') state.current.regCandidateScores= payload.scores;
            if (payload.electionTp=='fed') state.current.fedCandidateScores= payload.scores;
        },
        setCurrentElectoralListScores(state, payload) {
            console.log('setCurrentElectoralListScores:');console.log(payload);
            if (payload.electionTp=='eur') state.current.eurElectoralListScores= payload.scores;
            if (payload.electionTp=='reg') state.current.regElectoralListScores= payload.scores;
            if (payload.electionTp=='fed') state.current.fedElectoralListScores= payload.scores;
        },
        setCurrentSubstituteScores(state, payload) {
            console.log('setCurrentSubstituteScores:');console.log(payload);
            if (payload.electionTp=='eur') state.current.eurSubstituteScores= payload.scores;
            if (payload.electionTp=='reg') state.current.regSubstituteScores= payload.scores;
            if (payload.electionTp=='fed') state.current.fedSubstituteScores= payload.scores;
        },

        // ANSWERS
        setCurrentCandidateSegmentAnswers(state, payload) {
            //state.current.candidateSegmentAnswers[payload.electionTp] = payload.answers;
            if (payload.electionTp=='eur') state.current.eurCandidateSegmentAnswers= payload.answers;
            if (payload.electionTp=='reg') state.current.regCandidateSegmentAnswers= payload.answers;
            if (payload.electionTp=='fed') state.current.fedCandidateSegmentAnswers= payload.answers;
        },
        setCurrentSubstituteSegmentAnswers(state, payload) {
            //state.current.substituteSegmentAnswers[payload.electionTp] = payload.answers;
            if (payload.electionTp=='eur') state.current.eurSubstituteSegmentAnswers= payload.answers;
            if (payload.electionTp=='reg') state.current.regCandidateSegmentAnswers= payload.answers;
            if (payload.electionTp=='fed') state.current.fedCandidateSegmentAnswers= payload.answers;
        },
        setCurrentElectoralListSegmentAnswers(state, payload) {
            //state.current.electoralListSegmentAnswers[payload.electionTp] = payload.answers;
            if (payload.electionTp=='eur') state.current.eurElectoralListSegmentAnswers= payload.answers;
            if (payload.electionTp=='reg') state.current.regElectoralListSegmentAnswers= payload.answers;
            if (payload.electionTp=='fed') state.current.fedElectoralListSegmentAnswers= payload.answers;
        }
    },
    actions: {

        async getFedDistrictLists({ commit }, data) {
            console.log('match.js:act.getFedDistrictLists:');

            let endpoint = 'vote/election/2019_be/district/be_'+data.code+'.json';
            console.log(endpoint);

            const elDistrictData = await API.get('vote/election/2019_be/district/be_'+data.code+'.json', data)
                .then((request) => {
                    console.log(request.data);
                    return request.data
                })
            commit('setCurrentFedDistrictLists', elDistrictData.electoral_lists)
            commit('setCurrentFedCandidates', elDistrictData.candidates);
            commit('setCurrentFedSubstitutes', elDistrictData.substitutes);

        },
        async getRegDistrictLists({ commit }, data) {
            console.log('match.js:act.getRegDistrictLists:');

            let endpoint = 'vote/election/2019_be/district/be_'+data.code+'.json';
            console.log(endpoint);

            const elDistrictData = await API.get(endpoint, data)
                .then((request) => {
                    console.log(request.data);
                    return request.data
                })
            commit('setCurrentRegDistrictLists', elDistrictData.electoral_lists)
            commit('setCurrentRegCandidates', elDistrictData.candidates);
            commit('setCurrentRegSubstitutes', elDistrictData.substitutes);
        },
        async getEurDistrictLists({ commit }, data) {
            //console.log('match.js:act.getEurDistrictLists:');

            let endpoint = 'vote/election/2019_be/district/be_'+data.code+'.json';
            //console.log(endpoint);

            const elDistrictData = await API.get(endpoint, data)
                .then((request) => {
                    //console.log(request.data);
                    return request.data
                })
            commit('setCurrentEurDistrictLists', elDistrictData.electoral_lists)
            commit('setCurrentEurCandidates', elDistrictData.candidates);
            commit('setCurrentEurSubstitutes', elDistrictData.substitutes);
        },

        async getAllPartyImages({ commit }, data) {
            //console.log('match.js:act.getAllPartyImages:');

            let endpoint = 'gps/partyimages.json';
            //console.log(endpoint);

            const partyimagesData = await API.get(endpoint, data)
                .then((request) => {
                    //console.log(request.data);
                    return request.data
                })
            commit('setAllPartyImages', partyimagesData)
        },


        async performMatch({commit}, matchRequest) {
            console.log('>> performMatch');
            console.log('matchRequest:', matchRequest);
            console.log('matchRequest.segment_key:', matchRequest.segment_key);
            const segmentAnswers = await API.get('gps/answer/segment/' + matchRequest.segment_key + '.json').then((request) => {
                console.log(request.data.data);
                return request.data.data;
            });

            let electionTp='';
            if (matchRequest.segment_key.includes('fed')) {
                electionTp = 'fed';
                matchRequest.electionKey = 'election_22';
            }
            if (matchRequest.segment_key.includes('eur')) {
                electionTp = 'eur';
                matchRequest.electionTp = 'eur'
                matchRequest.electionKey = 'election_21';
            }
            if (matchRequest.segment_key.includes('reg')) {
                electionTp = 'reg';
                matchRequest.electionKey = 'election_23';
            }


            if (matchRequest.segment_key.includes("electoral_list")) {
                console.log('.. for electoral_list s:');
                commit('setCurrentElectoralListSegmentAnswers', { 'electionTp':electionTp,'answers':segmentAnswers}  )
            }

            if (matchRequest.segment_key.includes("candidate")) {
                console.log(' .. for candidates');
                commit('setCurrentCandidateSegmentAnswers', { 'electionTp':electionTp,'answers':segmentAnswers} )
            }
            if (matchRequest.segment_key.includes("substitute")) {
                console.log(' .. for substitutes');
                commit('setCurrentSubstituteSegmentAnswers', { 'electionTp':electionTp,'answers':segmentAnswers} )
            }

            const scores = performMatch(matchRequest, segmentAnswers);


            const viewScores = scores
                .sort((a, b) => -(a.score - b.score))
                .map(s => {
                    s.score = s.score.toFixed(2);
                    return s;
                });

            console.log('** SORTED SCORES: '); console.log(viewScores);

            if (matchRequest.segment_key.includes("electoral_list")) {
                console.log('.. electoral_list');
                commit('setCurrentElectoralListScores', { 'electionTp':electionTp,'scores':viewScores} )
            }

            if (matchRequest.segment_key.includes("candidate")) {
                console.log('.. candidate');
                commit('setCurrentCandidateScores', { 'electionTp':electionTp,'scores':viewScores} )
            }
            if (matchRequest.segment_key.includes("substitute")) {
                console.log('.. substitute');
                commit('setCurrentSubstituteScores', { 'electionTp':electionTp,'scores':viewScores}   )
            }
        }
    }
};