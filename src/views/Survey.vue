<template>
    <div>
        <steps :active="1"></steps>
        <div class="text-center">
            <transition-group name="slide" tag="div" class="questions-slider" v-if="questions.list.data">
                <div v-for="(question, idx) in questions.list.data.questions" :key="idx"
                     v-if="question.key === currentQuestionKey">
                    <div class="question mt-5">
                        <Question v-bind:class="{ show_tips : helpMode }" :help_mode="helpMode" :question="question"
                                  :answerFormat="getAnswerFormat(question.answer_format)"/>
                    </div>
                </div>
            </transition-group>
        </div>
        <el-footer class="footer-fixed" v-if="questions">
            <div v-show="questions.current.index > minQuestions" class="alert alert-warning">
                {{ $t("precision_notice") }}
            </div>
            <div class="row">
                <div class="col-2">
                    <a v-show="questions.current.index > 1" class="btn btn-block"
                       @click="goPrevious"><i class="fas fa-chevron-left"></i></a>
                </div>
                <div class="col">
                    <a v-show="questions.current.index > minQuestions" class="btn btn-block"
                       @click="goResults">{{ $t("button.see_results") }} </a>
                </div>
                <div class="col-2">
                    <a v-show="questions.current.index < questions.total" class="btn btn-block"
                       @click="goNext"><i
                            class="fas fa-chevron-right"></i>
                    </a>
                </div>
            </div>
        </el-footer>

        <div v-bind:class="{ help_mode : helpMode }">

        </div>
    </div>
</template>

<script>
  import Question from '../components/Question'
  import {mapGetters, mapActions} from 'vuex'
  import Steps from '../components/Steps'

  export default {
    components: {
      Question,
      Steps
    },
    data() {
      return {
        loading: true,
        helpMode: false,
        minQuestions: 20
      }
    },
    computed: {
      ...mapGetters(['questions', 'currentQuestionKey', 'survey', "getEndOfSurvey"])
    },
    methods: {
      ...mapActions(['getQuestions', 'previousQuestion', 'nextQuestion']),
      getAnswerFormat(answerFormatKey) {
        return this.questions.list.data.answer_formats.filter(f => f.key === answerFormatKey)[0]
      },
      goNext() {
        this.$store.dispatch('nextQuestion', {questionKey: this.currentQuestionKey});
      },
      goPrevious() {
        this.$store.dispatch('previousQuestion', {questionKey: this.currentQuestionKey});
      },
      goResults() {
        this.$router.push({path: '/stats'});
      }
    },
    watch: {
      getEndOfSurvey: function () {
        this.$router.push({path: '/stats'});
      }
    },
    created() {
      console.log('Survey.vue.created:');

      // Skip default 20 questions for local env
      if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        this.minQuestions = 5;
      }

      // JMV: I've commented this as I don't see its purpose. Seems redundant.
      //this.$store.dispatch('getDistricts').then(() => {
      // this.district_key = this.$route.params.key;
      //const district = this.$store.state.vote.districts.find(r => r.key === this.district_key);
      //this.$store.commit("setCurrentDistrict", district);
      //this.$store.dispatch("setCurrentElection", district);

      // currentPoll will set segment_keys from related poll json file. segment_keys is used in matching process.
      this.$store.dispatch('setCurrentPoll', null)
        .then(() => this.$store.dispatch('setCurrentSurvey'))
        .then(() => this.getQuestions())
        .then(() => {
          this.loading = false;
          let $ = window.jQuery;
          $("html, body").animate({scrollTop: $(document).height()}, 1000);
        })
      //});

    }
  }
</script>
<style lang="scss" scoped>
    .slide-leave-active,
    .slide-enter-active {
        transition: 1s;
    }

    .slide-enter {
        transform: translate(100%, 0);
    }

    .slide-leave-to {
        transform: translate(-100%, 0);
    }

    .questions-slider {
        overflow: hidden;
        position: relative;
        min-height: 80vh;
        width: 100%;
    }

    .questions-slider .question {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .footer-fixed {
        background: #F5F5F1;
        height: 70px;
        position: relative;
        bottom: 0;
        width: 100%;
    }

    .help_mode {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #444;
        height: 100vh;
        width: 100 wh;
        opacity: 0.4;
    }


</style>
