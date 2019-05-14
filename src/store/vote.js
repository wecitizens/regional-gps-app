import API from './_helpers/api'
import Vue from 'vue'

export default {
  state: {
    current: {
      region:null,
      district: null,
      regDistrict: null,
      fedDistrict: null,
      eurDistrict: null,
      election: null,
      surveyKey: null
    },
    districts: [],
    eurDistricts: [],
    fedDistricts: [],
    regDistricts: [],
    districtSearchResults: [],
    eurDistrictSearchResults: [],
    fedDistrictSearchResults: [],
    regDistrictSearchResults: []
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
    setCurrentRegDistrict (state, payload) {
      //console.log('vote.js:mut.setCurrentDistrict', payload);
      state.current.regDistrict = payload
    },
    setCurrentEurDistrict (state, payload) {
      //console.log('vote.js:mut.setCurrentDistrict', payload);
      state.current.eurDistrict = payload
    },
    setCurrentFedDistrict (state, payload) {
      //console.log('vote.js:mut.setCurrentDistrict', payload);
      state.current.fedDistrict = payload
    },
    setCurrentElection (state, payload) {
      //console.log('vote.js:mut.setCurrentElection:', payload);
      state.current.election = payload
    },
    setDistricts (state, payload) {
      //console.log('vote.js:mut.setDistricts:', payload);
      state.districts = payload
    },
    setEurDistricts (state, payload) {
      console.log('vote.js:mut.setEurDistricts:', payload);
      state.eurDistricts = payload
    },
    setRegDistricts (state, payload) {
      //console.log('vote.js:mut.setRegDistricts:', payload);
      state.regDistricts = payload
    },
    setFedDistricts (state, payload) {
      //console.log('vote.js:mut.setFedDistricts:', payload);
      state.fedDistricts = payload
    },
    setDistrictSearchResults (state, payload) {
      state.districtSearchResults = payload
    },
    setEurDistrictSearchResults (state, payload) {
      state.eurDistrictSearchResults = payload
    },
    setFedDistrictSearchResults (state, payload) {
      state.fedDistrictSearchResults = payload
    },
    setRegDistrictSearchResults (state, payload) {
      state.regDistrictSearchResults = payload
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
    async getEurElectoralDistricts({ commit }, data) {
      console.log('vote.js:act.getEurElectoralDistricts:');
      const elEurDistricts= await API.get('vote/electoral-districts.json?reg=EUROP', data)
          .then((request) => {
            console.log(request.data);
            Vue.i18n.add('en', {vote: request.data.i18n.en})
            Vue.i18n.add('fr', {vote: request.data.i18n.fr})
            Vue.i18n.add('nl', {vote: request.data.i18n.nl});
            //console.log(request.data.data);
            return request.data.data
          })
      commit('setEurDistricts', elEurDistricts)
    },
    async getRegElectoralDistricts({ commit }, data) {
      console.log('vote.js:act.getRegElectoralDistricts:');
      const elRegDistricts= await API.get('vote/electoral-districts.json?reg=BER', data)
          .then((request) => {
            //console.log(request.data);
            Vue.i18n.add('en', {vote: request.data.i18n.en})
            Vue.i18n.add('fr', {vote: request.data.i18n.fr})
            Vue.i18n.add('nl', {vote: request.data.i18n.nl});
            //console.log(request.data.data);
            return request.data.data
          })
      commit('setRegDistricts', elRegDistricts)
    },
    async getFedElectoralDistricts({ commit }, data) {
      console.log('vote.js:act.getFedElectoralDistricts:');
      const elDistricts= await API.get('vote/electoral-districts.json?reg=BEFCH', data)
          .then((request) => {
            //console.log(request.data);
            Vue.i18n.add('en', {vote: request.data.i18n.en})
            Vue.i18n.add('fr', {vote: request.data.i18n.fr})
            Vue.i18n.add('nl', {vote: request.data.i18n.nl});
            //console.log(request.data.data);
            return request.data.data
          })
      commit('setFedDistricts', elDistricts)
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
    filterEurDistricts ({commit, state}, queryString) {
      console.log('vote.js:act.filterEurDistricts ');
      const eurDistricts = state.eurDistricts.map(m => {
        m.value = m.code + ' ' + Vue.i18n.translate('vote.' + m.name)
        return m
      })
      const createEurDistrictFilter = function (queryString) {
        return (eurDistrict) => {
          return (eurDistrict.value.toLowerCase().includes(queryString.toLowerCase()))
        }
      }
      const results = queryString ? eurDistricts.filter(createEurDistrictFilter(queryString)) : eurDistricts
      commit('setEurDistrictSearchResults', results)
    },
    filterRegDistricts ({commit, state}, queryString) {
      console.log('vote.js:act.filterRegDistricts ');
      const regDistricts = state.regDistricts.map(m => {
        m.value = m.code + ' ' + Vue.i18n.translate('vote.' + m.name)
        return m
      })
      const createRegDistrictFilter = function (queryString) {
        return (regDistrict) => {
          return (regDistrict.value.toLowerCase().includes(queryString.toLowerCase()))
        }
      }
      const results = queryString ? regDistricts.filter(createRegDistrictFilter(queryString)) : regDistricts
      commit('setRegDistrictSearchResults', results)
    },
    filterFedDistricts ({commit, state}, queryString) {
      console.log('vote.js:act.filterFedDistricts ');
      const fedDistricts = state.fedDistricts.map(m => {
        m.value = m.code + ' ' + Vue.i18n.translate('vote.' + m.name)
        return m
      })
      const createFedDistrictFilter = function (queryString) {
        return (fedDistrict) => {
          return (fedDistrict.value.toLowerCase().includes(queryString.toLowerCase()))
        }
      }
      const results = queryString ? fedDistricts.filter(createFedDistrictFilter(queryString)) : fedDistricts
      commit('setFedDistrictSearchResults', results)
    },
    async setCurrentMunicipalElection ({commit}, district) {
      if(district) {

        console.log("District", district);

        /*const election = await API.get('vote/election/2019_be_regional/district/' + district.key + '.json').then((request) => {
          Vue.i18n.add('en', {vote: request.data.i18n.en})
          Vue.i18n.add('fr', {vote: request.data.i18n.fr})
          Vue.i18n.add('nl', {vote: request.data.i18n.nl})
          return request.data
        });*/
        commit('setCurrentDistrict', district)
        //commit('setCurrentElection', election)
      } else {
        console.log('District undefined !');
      }
    },
    async setCurrentElection ({commit}, someData) {
        const election = await API.get('vote/election/2019_be_reg_fed_eur.json').then((request) => {
          //console.log('vote.js:act.setCurrentElection'); console.log(request.data.i18n);
          Vue.i18n.add('en', {vote: request.data.i18n.en})
          Vue.i18n.add('fr', {vote: request.data.i18n.fr})
          Vue.i18n.add('nl', {vote: request.data.i18n.nl})
          return request.data
        })
        commit('setCurrentElection', election)
        commit('setCurrentSurveyKey', '2019-5-26')
    }
  },
  getters: {
    districts: state => state.districts,
    districtSearchResults: state => state.districtSearchResults,
    currentElection: state => state.current.election
  }
}
