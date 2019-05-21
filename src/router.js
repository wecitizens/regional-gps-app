import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Explanation from './views/Explanation.vue'
import Survey from './views/Survey.vue'
import Region from './views/Region.vue'
import Choose from './views/Choose.vue'
import Results from './views/Results.vue'
import Stats from './views/Stats.vue'
import Translations from './views/Translations.vue'
import Questions from './views/Questions.vue'
import PollInsufficientCandidates from './views/PollInsufficientCandidates.vue'
import ResultsTMP from "./views/ResultsTMP";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/en',
      name: 'home-en',
      component: Home
    },
    {
      path: '/nl',
      name: 'home-nl',
      component: Home
    },
    {
      path: '/survey/:key',
      name: 'survey',
      component: Survey
    },
    {
      path: '/region',
      name: 'region',
      component: Region
    },
    //{
    //  path: '/municipality',
    //  name: 'municipality',
    //  component: Municipality
    //},
    {
      path: '/choose',
      name: 'choose',
      component: Choose
    },
    {
      path: '/explanation/:key',
      name: 'explanation',
      component: Explanation
    },
    {
      path: '/insufficient-candidates/:key',
      name: 'poll-insufficient-candidates',
      component: PollInsufficientCandidates
    },
    {
      path: '/questions',
      name: 'questions',
      component: Questions
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    },
    {
      path: '/results',
      name: 'results',
      component: Results
    },
    {
      path: '/results/:key',
      name: 'result',
      component: ResultsTMP
    },
    {
      path: '/translations',
      name: 'translations',
      component: Translations
    }
  ],
  scrollBehavior() {
    return {x: 0, y: 0};
  }
})
