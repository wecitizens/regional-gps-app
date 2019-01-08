export const GET_QUESTIONS = 'GET_QUESTIONS'
export const SET_CURRENT_QUESTION = 'SET_CURRENT_QUESTION'
export const SET_QUESTION_AGREEMENT = 'SET_QUESTION_AGREEMENT'
export const SET_QUESTION_IMPORTANCE = 'SET_QUESTION_IMPORTANCE'
export const SET_TOTAL = 'SET_TOTAL'

export default {
  getters: {
    questions: state => state,
    survey: (state) => state.list,
    questionsLoading: state => state.list.loading,
    currentQuestionKey: state => state.current === undefined ? null : state.current.key
  },
  state: {
    list: {
      data: {
        question_order: [],
        questions: [
          {
            key: null,
            text: null,
            notice: null
          }
        ],
        answer_formats: [
          {
            items: [
              {
                key: null,
                name: null
              }
            ]
          }
        ]
      },
      actions: {},
      loading: false,
      success: false,
      error: ''
    },
    current: {
      key: null,
      text: null,
      notice: null,
      index: 1
    },
    total: 30
  },
  mutations: {
    setSurvey (state, mutation) {
      state.list.data = mutation
    },
    [SET_CURRENT_QUESTION] (state, mutation) {
      state.current = mutation.question
    },
    [SET_QUESTION_AGREEMENT] (state, mutation) {
      const questionKey = mutation.questionKey
      state.list.data.questions.filter(q => q.key === questionKey)[0].agreement = mutation.agreement
    },
    [SET_QUESTION_IMPORTANCE] (state, mutation) {
      const questionKey = mutation.questionKey
      state.list.data.questions.filter(q => q.key === questionKey)[0].importance = mutation.importance
    },
    [SET_TOTAL] (state, mutation) {
      state.total = mutation.total
    }
  },
  actions: {
    async getQuestions (store) {
      await store.commit('setSurvey', store.rootState.survey.current.survey)

      if(store.state.list.data){
        const questions = store.state.list.data.questions
        const currentQuestion = questions[0]
        currentQuestion.index = 1
        store.commit(SET_CURRENT_QUESTION, {question: currentQuestion})
        store.commit(SET_TOTAL, {total: store.state.list.data.question_order.length})
      }
    },
    setQuestionAgreement ({commit, state}, data) {
      commit(SET_QUESTION_AGREEMENT, data)

      const questionKey = data.questionKey
      const order = state.list.data.question_order
      const previousIndex = order.indexOf(questionKey)

      const currentQuestion = state.list.data.questions.find(q => q.key === order[previousIndex + 1])
      const previousQuestion = state.list.data.questions.find(q => q.key === order[previousIndex - 2])
      const nextQuestion = state.list.data.questions.find(q => q.key === order[previousIndex + 2])

      if (previousQuestion) {
        console.log('Has previous')
      }

      if (nextQuestion) {
        console.log('Has next')
      }

      if (currentQuestion) {
        currentQuestion.index = previousIndex + 2
        commit(SET_CURRENT_QUESTION, {question: currentQuestion})
      }
    },
    setQuestionImportance ({commit}, data) {
      commit(SET_QUESTION_IMPORTANCE, data)
    },
    nextQuestion ({commit, state}, data) {
      const questionKey = data.questionKey
      const order = state.list.data.question_order
      const previousIndex = order.indexOf(questionKey)

      const currentQuestion = state.list.data.questions.find(q => q.key === order[previousIndex + 1])

      if (currentQuestion) {
        currentQuestion.index = previousIndex + 1 + 1 // as index start at 0
        commit(SET_CURRENT_QUESTION, {question: currentQuestion})
      }
    },
    previousQuestion ({commit, state}, data) {
      const questionKey = data.questionKey
      const order = state.list.data.question_order
      const previousIndex = order.indexOf(questionKey)

      const currentQuestion = state.list.data.questions.find(q => q.key === order[previousIndex - 1])

      if (currentQuestion) {
        currentQuestion.index = previousIndex
        commit(SET_CURRENT_QUESTION, {question: currentQuestion})
      }
    }
  }
}
