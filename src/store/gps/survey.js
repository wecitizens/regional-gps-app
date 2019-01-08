import API from '../_helpers/api'
import Vue from 'vue'

export default {
  state: {
    current: {
      poll: null,
      survey: null,
      campaign: {
        totalParticipants: 23122
      }
    }
  },
  mutations: {
    setCurrentPoll (state, payload) {
      state.current.poll = payload
    },
    setCurrentSurvey (state, payload) {
      state.current.survey = payload
    }
  },
  actions: {
    async setCurrentPoll ({ commit, rootState }, data) {

      console.log('-> setCurrentPoll', data);

      const poll = await API.get('gps/poll/2018_be_municipal_' +
        rootState.vote.current.district.key + '_voter.json', data)
        .then(request => {
          return request.data
        })
      commit('setCurrentPoll', poll)
    },
    async setCurrentSurvey ({ commit, state }) {
      const survey = await API.get('gps/survey/' + state.current.poll.survey_key + '.json').then(request => {
        const survey = request.data
        Vue.i18n.add('en', { gps: { survey: survey.i18n.en } })
        Vue.i18n.add('fr', { gps: { survey: survey.i18n.fr } })
        Vue.i18n.add('nl', { gps: { survey: survey.i18n.nl } })
        return survey
      })
      commit('setCurrentSurvey', survey)
    },
    getSurvey (data) {
      console.log('getSurvey', data)
      // answer format, questions, question order
    },
    getCampaign (data) {
      console.log('getCampaign', data)
      // number of user who participated
    }
  },
  getters: {
    campaignTotalParticipants (state) {
      return state.current.campaign.totalParticipants
    },
    currentSurvey (state) {
      return state.current.survey
    }
  }
}
