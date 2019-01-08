<template>
    <div class="questions">
        <div v-for="(question, idx) in questions.list.data.questions" :key="idx">
            <h3 class="question mt-5">
                <Question :index="idx" :folded="true" :question="question" :answerFormat="getAnswerFormat(question.answer_format)"/>
            </h3>
        </div>
    </div>
</template>

<script>

  import {mapActions, mapGetters} from 'vuex';
  import Question from './../components/Question';

  export default {
    name: 'questions',
    components: {
      Question
    },
    created() {
      this.$store.dispatch('getQuestions');
    },
    methods: {
      ...mapActions(['getQuestions']),
      getAnswerFormat (answerFormatKey) {
        return this.questions.list.data.answer_formats.find(f => f.key === answerFormatKey)
      }
    },
    computed: {
      ...mapGetters(['questions', 'currentQuestionKey']),
    },
  }
</script>

<style scoped>

</style>
