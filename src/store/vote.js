import API from './_helpers/api'
import Vue from 'vue'

export default {
  state: {
    current: {
      district: null,
      election: null
    },
    districts: [],
    districtSearchResults: []
  },
  mutations: {
    setCurrentDistrict (state, payload) {
      state.current.district = payload
    },
    setCurrentElection (state, payload) {
      state.current.election = payload
    },
    setDistricts (state, payload) {
      state.districts = payload
    },
    setDistrictSearchResults (state, payload) {
      state.districtSearchResults = payload
    }
  },
  actions: {
    async getDistricts ({ commit }, data) {
      const districts = await API.get('vote/district.json', data)
        .then((request) => {
          Vue.i18n.add('en', {vote: request.data.i18n.en})
          Vue.i18n.add('fr', {vote: request.data.i18n.fr})
          Vue.i18n.add('nl', {vote: request.data.i18n.nl})
          return request.data.data
        })

      commit('setDistricts', districts)
    },
    filterDistricts ({commit, state}, queryString) {
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
    async setCurrentElection ({commit}, district) {
      if(district) {
        const election = await API.get('vote/election/2018_be_municipal/district/' + district.key + '.json').then((request) => {
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
    }
  },
  getters: {
    districts: state => state.districts,
    districtSearchResults: state => state.districtSearchResults,
    currentElection: state => state.current.election
  }
}
