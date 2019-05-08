import API from './_helpers/api'
import Vue from 'vue'

export default {
  state: {
    current: {
      region:null,
      district: null,
      election: null,
      surveyKey: null
    },
    districts: [],
    districtSearchResults: []
  },
  mutations: {
    setCurrentRegion(state, payload) {
      //console.log('vote.js:mut.setCurrentRegion', payload);
      state.current.region= payload
    },
    setCurrentSurveyKey(state, payload) {
      //console.log('vote.js:mut.setCurrentSurveyKey', payload);
      state.current.surveyKey = payload
    },

    setCurrentDistrict (state, payload) {
      //console.log('vote.js:mut.setCurrentDistrict', payload);
      state.current.district = payload
    },
    setCurrentElection (state, payload) {
      //console.log('vote.js:mut.setCurrentElection:', payload);
      state.current.election = payload
    },
    setDistricts (state, payload) {
      //console.log('vote.js:mut.setDistricts:', payload);
      state.districts = payload
    },
    setDistrictSearchResults (state, payload) {
      state.districtSearchResults = payload
    }
  },
  actions: {
    async getDistricts ({ commit }, data) {
      //console.log('vote.js:act.getDistricts:');console.log(data);
      const districts = await API.get('vote/district.json', data)
        .then((request) => {
          Vue.i18n.add('en', {vote: request.data.i18n.en})
          Vue.i18n.add('fr', {vote: request.data.i18n.fr})
          Vue.i18n.add('nl', {vote: request.data.i18n.nl})
          return request.data.data
        })

      commit('setDistricts', districts)
    },
    async getElectoralDistricts({ commit }, data) {
      //console.log('vote.js:act.getElectoralDistricts:');
      const elDistricts= await API.get('vote/electoral-districts.json', data)
        .then((request) => {
          //console.log(request.data);
          Vue.i18n.add('en', {vote: request.data.i18n.en})
          Vue.i18n.add('fr', {vote: request.data.i18n.fr})
          Vue.i18n.add('nl', {vote: request.data.i18n.nl});
          //console.log(request.data.data);
          return request.data.data
        })

      commit('setDistricts', elDistricts)
    },
    filterDistricts ({commit, state}, queryString) {
      //console.log('vote.js:act.filterDistricts ');
      const districts = state.districts.map(m => {
        m.value = m.code + ' ' + Vue.i18n.translate('vote.' + m.name)
        return m
      })
      const createDistrictFilter = function (queryString) {
        return (district) => {
          return (district.value.toLowerCase().includes(queryString.toLowerCase()))
        }
      }
      const results = queryString ? districts.filter(createDistrictFilter(queryString)) : districts
      commit('setDistrictSearchResults', results)
    },
    async setCurrentMunicipalElection ({commit}, district) {
      if(district) {
        const election = await API.get('vote/election/2019_be_regional/district/' + district.key + '.json').then((request) => {
          Vue.i18n.add('en', {vote: request.data.i18n.en})
          Vue.i18n.add('fr', {vote: request.data.i18n.fr})
          Vue.i18n.add('nl', {vote: request.data.i18n.nl})
          return request.data
        })
        commit('setCurrentDistrict', district)
        commit('setCurrentElection', election)
      } else {
        console.log('District undefined !');
      }
    },
    async setCurrentElection ({commit}, district) {
      if(district) {
        const election = await API.get('vote/election/2019_be_reg_fed_eur.json').then((request) => {
          //console.log('vote.js:act.setCurrentElection'); console.log(request.data.i18n);
          Vue.i18n.add('en', {vote: request.data.i18n.en})
          Vue.i18n.add('fr', {vote: request.data.i18n.fr})
          Vue.i18n.add('nl', {vote: request.data.i18n.nl})
          return request.data
        })
        commit('setCurrentElection', election)
        commit('setCurrentSurveyKey', '2019-5-26')
      } else {
        console.log('District undefined !');
      }
    }
  },
  getters: {
    districts: state => state.districts,
    districtSearchResults: state => state.districtSearchResults,
    currentElection: state => state.current.election
  }
}
