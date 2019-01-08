import Vue from 'vue'
import Vuex from 'vuex'
import questions from './questions'
import survey from './gps/survey'
import match from './gps/match'
import vote from './vote'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    questions,
    survey,
    vote,
    match  
  }
})
