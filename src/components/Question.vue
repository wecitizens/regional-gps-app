<template>
    <div v-if="question.text">

        <el-popover
                placement="bottom-start"
                title="Title"
                width="200"
                trigger="manual"
                v-model="help_mode"
                content="this is content, this is content, this is content">
            <div slot="reference" class="alert-primary" @click="help_mode = !help_mode">
                <div slot="reference" @click="help_mode = !help_mode">
                    <span v-if="index">{{ (index + 1)  }}</span>
                    <span v-else>{{ questions.current.index }}</span>/{{ questions.total }}
                </div>
            </div>
        </el-popover>

        <h3 class="title p-3">{{ $t('gps.survey.' + question.text) }}</h3>


        <el-row v-show="$t('gps.survey.' + question.notice)"    class="actions mt-3">
            <el-tooltip class="item" effect="dark" :content="$t('moreinfo_tooltip')" placement="bottom">
                <el-button title="test" :disabled="!question.notice" @click="showMoreInfo = !showMoreInfo"
                           :icon="showMoreInfo ? 'el-icon-minus' : 'el-icon-info'" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item d-none" effect="dark" :content="$t('importance_tooltip')" placement="bottom">
                <el-button title="test" @click="showImportance = !showImportance"
                           :icon="showImportance ? 'el-icon-minus' : 'el-icon-star-off'" circle></el-button>
            </el-tooltip>
        </el-row>

        <div v-show="showMoreInfo" class="moreInfos mt-3">
            {{ $t('gps.survey.' + question.notice) }}
        </div>

        <div v-show="showImportance && answerFormat.tolerance" class="importances mt-3">

            <h4>{{ $t('importance.title') }}</h4>

            <el-radio-group v-model="importance">
                <el-radio-button v-for="(importance, key) in answerFormat.tolerance.items" :key="key"
                                 :label="key">{{ $t('gps.survey.' + importance.name) }}
                </el-radio-button>
            </el-radio-group>
        </div>

        <div class="row answers__legend mt-5">
            <div class="col text-left">{{ $t("Pas du tout d'accord")}}</div>
            <div class="col text-center">{{ $t("Je ne me prononce pas")}}</div>
            <div class="col text-right">{{ $t("Tout à fait d'accord")}}</div>
        </div>
        <div class="answers">
            <el-button icon="el-icon-check"
                       v-for="item in answerFormatOrdered"
                       v-bind:class="{'is-active': answer_key === item.key}" circle
                       :key="item.id" @click="() => setAnswer(item.key)">
            </el-button>
        </div>
    </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import FoldableIcon from './FoldableIcon';
  import Vue from 'vue';

  export default {
    props: {
      'question': {},
      'answerFormat': {},
      folded: {
        type: Boolean,
        default: false
      },
      index: {
        default: false
      },
      help_mode: {
        default: true
      }
    },
    components: {
      FoldableIcon
    },
    data() {
      return {
        agreement: null,
        importance: 1,
        answer_key: null,
        isFolded: this.folded,
        showMoreInfo: false,
        showImportance: false
      }
    },
    computed: {
      ...mapGetters(['questions', 'currentQuestionKey', 'survey']),
      answerFormatOrdered() {

        if (this.answerFormat) {     // NOT WORKING. side effects in computed properties.
           // console.log('unorderedAnsweredF:' , this.answerFormat);
          return  this.answerFormat.items.sort((a, b) => a.weight < b.weight);
          // console.log('orderedAnsweredF:' , orderedAnsweredF);
          // return orderedAnsweredF;
        }

        return [];
      }
    },
    watch: {
      agreement: function (agreement) {
        console.log('Set agreement', agreement);
        setTimeout(() => {
          let tolerance = this.answerFormat.tolerance.items[this.importance].key;
          this.setQuestionImportance({questionKey: this.question.key, importance: tolerance});
          this.setQuestionAgreement({questionKey: this.question.key, agreement});
        }, 1000)
      },
      importance: function (importance) {
        setTimeout(() => {
          let tolerance = this.answerFormat.tolerance.items[importance].key;

          this.setQuestionImportance({questionKey: this.question.key, tolerance})
        }, 100)
      },
      questions: function (questions) {

      }
    },
    methods: {
      ...mapActions(['setQuestionAgreement', 'setQuestionImportance']),
      showStepLabel: (answerFormat, index) => {
        if (index) {
          return Vue.i18n.translate('gps.survey.' + answerFormat.tolerance.items[index].name);
        }
        return index;
      },
      setAnswer: function (key) {
        console.log('Agreement', key);
        this.answer_key = key;
        this.agreement = key;
      },
      setImportance: function (importance) {
        console.log('Data', importance);
        this.importance = importance;
      }
    }
  };
</script>

<style lang="scss">

    .alert-primary {
        width: auto;
        display: inline-block;
        padding: 0.2em;
        font-weight: bold;
        font-size: 18px;
    }

    h3.title {
        margin-top: 1em;
        font-size: 22px;
    }

    .answers__legend {
        width: 320px;
        color: #000000;
        margin-left: auto !important;
        margin-right: auto !important;
        margin-bottom: 10px;
        margin-top: 10px;
        font-size: 10px;
    }

    .answers {
        background: #000000;
        padding: 0.5em;

        .el-button {
            height: 50px;
            width: 50px;
            background: #FFFFFF;
            border: none;

            i {
                color: #000000;
                font-size: 24px;
                opacity: 0;
            }

            &.is-active {
                opacity: 1;
                animation: blink-animation 0.4s steps(5, start) 2;
                -webkit-animation: blink-animation 0.4s steps(5, start) 2;

                i {
                    opacity: 1;
                }
            }

            &:hover {
                opacity: 0.8;
            }

            &:nth-child(2) {
                background: #fdcad1;
            }

            &:nth-child(3) {
                background: #f09aa3;
            }

            &:nth-child(4) {
                background: #f56073;
            }

            &:nth-child(5) {
                background: #E4001C;
            }
        }
    }

    @keyframes blink-animation {
        to {
            visibility: hidden;
        }
    }

    @-webkit-keyframes blink-animation {
        to {
            visibility: hidden;
        }
    }

    h3.title {
        max-width: 28em;
        margin: auto;
    }

    div.more-info {
        max-width: 35em;
        margin: auto;
        font-size: 60%;
        text-align: justify;
        font-weight: normal;
    }

</style>
