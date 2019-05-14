<template>
    <div class="results">
        <b-card no-body>
            <b-tabs card>
                <b-tab :title="$t('title.candidates')" class="col-md-6 tab-center" active>
                    <p class="list-legend">{{ $t('Les candidats qui partagent le plus mes convictions sont') }}:</p>
                    <div class="row list-item" v-for="(item, idx) in currentRegCandidateScores.map(extractCandidate)"
                         :key="idx" v-bind:class="{ disabled: !item.has_answered }" v-if="item.score">
                        <div class="col-3">
                            <img :src="item.img" v-if="item.img" class="img-thumbnail"/>
                            <img src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png" v-else
                                 class="img-thumbnail"/>
                        </div>
                        <div class="col-9">
                            <div class="title">
                                <a v-if="item.completeness > 12"
                                   :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.id"
                                   target="_blank">{{ item.name }}</a>
                                <span v-else>{{ item.name }}</span>
                            </div>
                            <div class="subtitle"><span v-if="item.position > 0">#{{ item.position }}</span> {{
                                item.group }}
                            </div>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" :style="'width:' + item.score + '%;'"
                                     :aria-valuenow="item.score"
                                     aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                </div>
                            </div>
                        </div>
                    </div>
                    <a href="" class="btn btn-primary" v-on:click="() => printDiv('print-list')">PRINT</a>
                </b-tab>
                <b-tab :title="$t('title.parties')" class="col-md-6 tab-center">
                    <div id="print-list">
                    <p class="list-legend">{{ $t('Les listes qui partagent le plus mes convictions sont') }}:</p>
                    <div class="row list-item" v-for="(item, idx) in regCurrentElectoralListScores.map(extractList)"
                         :key="idx">
                        <div class="col-3 d-none">
                            <img :src="item.img" v-if="item.img" class="img-thumbnail"/>
                            <img src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png" v-else
                                 class="img-thumbnail"/>
                        </div>
                        <div class="col-12">
                            <div class="title">{{ item.name }}</div>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" :style="'width:' + item.score + '%;'"
                                     :aria-valuenow="item.score"
                                     aria-valuemin="0" aria-valuemax="100">{{ Math.round(item.score) }}%
                                </div>
                            </div>
                        </div>
                    </div>

                    </div>

                    <a href="" class="btn btn-primary d-print-none" v-on:click="() => printDiv('print-list')">PRINT</a>
                </b-tab>
            </b-tabs>
        </b-card>

        <el-dialog :visible.sync="showNewsletter" width="60%">
            <h2 class="mb-3">{{ $t('newsletter.title') }}</h2>
            <p>{{ $t('newsletter.text') }}</p>
            <a :href="$t('newsletter.link')" target="_blank" class="btn btn-info btn-block mt-3">{{
                $t('newsletter.title') }}</a>
        </el-dialog>


        <footer class="footer container-fluid">
            <div class="row">
                <div class="col text-center">
                    <div class="mb-2">{{ $t("home.with_help_from") }}</div>
                    <img src="/img/partner-metro.png" height="20" class="m-2">
                    <img src="/img/partner-sudpress.png" height="20" class="m-2">
                    <img src="/img/partner-levif.png" height="20" class="m-2">
                    <img src="/img/partner-knack.png" height="20" class="m-2">
                </div>
            </div>
        </footer>
    </div>
</template>

<script>

  import {mapGetters} from 'vuex'

  export default {
    name: 'results',
    methods: {
      printDiv() {
        window.print();
      },
      getElectoralListForScore(score) {
        return this.currentElection.electoral_lists.find(e => e.key == score.user_key);
      },
      extractCandidate(score) {
        console.log('extractCandidate');
        let group = this.currentElection.electoral_lists
          .filter(e => e.candidates.map(c => c.key).includes(score.user_key))[0]
        let candidate = this.currentElection.candidates.find(p => p.key == score.user_key)
        console.log(score)
        if (candidate) {
          return {
            id: candidate.politician_id,
            name: candidate.full_name,
            group: this.$t('vote.' + group.name),
            position: group.candidates.find(c => c.key == score.user_key).order,
            score: score.score,
            img: candidate.img,
            has_answered: candidate.has_answered,
            completeness: candidate.completeness
          }
        } else {
          return {}
        }
      },
      extractList(score) {
          console.log('extractList');

          let list = this.getElectoralListForScore(score)
        if (list) {
          return {
            name: this.$t('vote.' + list.name),
            score: score.score,
            img: list.img
          }
        } else {
          return {}
        }
      }
    },
    created() {

      console.log('Store', this.$store);

      const poll = this.$store.state.survey.current.poll;
      const currVote= this.$store.state.vote.current;
      var segment_keys = [];
      if (currVote) {
          console.log('currVote:');console.log(currVote);
          if (currVote.district) {
              let reg_base_segment = '2019_be_' + currVote.district.code;
              segment_keys.push( reg_base_segment+ '_candidate');
              //segment_keys.push( reg_base_segment+ '_candidate' , reg_base_segment+ '_substitute', reg_base_segment+ '_electoral_list' );
          } else {
              console.log('currVote.district EMPTY');
          }
          if (currVote.eurDistrict) {
              //let eur_base_segment = '2019_be_' + currVote.eurDistrict.code;
              let eur_base_segment = '2019_be_eur_' + currVote.eurDistrict.code;
              //segment_keys.push( eur_base_segment+ '_candidate', eur_base_segment+ '_substitute' , eur_base_segment+ '_electoral_list' );
          } else {
              console.log('currVote.eurDistrict EMPTY');
          }
          if (currVote.fedDistrict) {
              //let fed_base_segment = '2019_be_' + currVote.fedDistrict.code;
              let fed_base_segment = '2019_be_fed_' + currVote.fedDistrict.code;
              //segment_keys.push( fed_base_segment+ '_candidate', fed_base_segment+ '_substitute', fed_base_segment+ '_electoral_list' );
          } else {
              console.log('currVote.fedDistrict EMPTY');
          }
          if (currVote.regDistrict) {
              //let reg_base_segment = '2019_be_' + currVote.regDistrict.code;
              let reg_base_segment = '2019_be_reg_' + currVote.regDistrict.code;
              segment_keys.push( reg_base_segment+ '_candidate');
              //segment_keys.push( reg_base_segment+ '_candidate' , reg_base_segment+ '_substitute', reg_base_segment+ '_electoral_list' );
          } else {
              console.log('currVote.regDistrict EMPTY');
          }
          console.log('segment_keys:');console.log(segment_keys);
      }
      const survey = this.$store.state.survey.current.survey;

      if (survey) {

        // TODO : q.agreement is "Tout à fait d'accord" must change !!
        // TODO : q.importance not set if not defined and same prob as before I suppose ...

        const answers = this.$store.state.questions.list.data.questions
          .map(q => {
            return {
              question_key: q.key,
              answer_format: 'agr_5_scale_tol_3_scale_abs',
              value: q.agreement,
              tolerance: q.importance
            }
          }).filter(q => q.value != null);

          if (typeof segment_keys !== 'undefined') {
              console.log('segment_keys');
              segment_keys.forEach(s =>
                  this.$store.dispatch('performMatch', {
                      segment_key: s,
                      answer_formats: survey.answer_formats,
                      answers: answers
                  }));
          } else {
              console.log('poll.segment_keys UNDEFINED');
          }


        /*if (typeof poll.segment_keys !== 'undefined') {
            console.log('poll.segment_keys');
            poll.segment_keys.forEach(s =>
            this.$store.dispatch('performMatch', {
              segment_key: s,
              answer_formats: survey.answer_formats,
              answers: answers
            }));
        } else {
            console.log('poll.segment_keys UNDEFINED');
        }*/
      } else {
          console.log('Results : survey UNDEFINED');
      }
    },
    mounted() {

      // Redirect to homepage if no survey defined !
      if (!this.$store.state.survey.current.poll) {
        this.$router.push('/');
      }
    },
    computed: {
      ...mapGetters(['currentElection', 'currentCandidateScores', 'currentSubstituteScores', 'currentElectoralListScores',
          'currentEurSubstituteScores', 'currentEurSubstituteScores', 'currentEurElectoralListScores',
          'currentRegSubstituteScores', 'currentRegSubstituteScores', 'currentRegElectoralListScores',
          'currentFedSubstituteScores', 'currentFedSubstituteScores', 'currentFedElectoralListScores'      ])
    },
    data() {
      return {
        showNewsletter: false
      };
    }
  }
</script>

<style scoped>

    @media print {
        . {
            display: none;
        }
    }

    .tab-center {
        margin: auto;
    }

    .list-legend {
        font-weight: bold;
        font-style: italic;
        font-size: 120%;
        padding: 1em;
    }

    .list-item {
        padding: .6em 0;
        text-align: left;
    }

    .list-item img {
        border-radius: 100%;
    }

    .list-item .title {
        margin-top: .4em;
        font-size: 150%;
        font-weight: bold;
    }

    .list-item .subtitle {
        background: transparent;
        font-size: 120%;
    }

    .list-item .progress {
        margin-top: .6em;
        border-radius: 10px;
    }

    .list-item .progress-bar {
        background-color: #F8E71C;
        color: black;
    }

    .list-scroll {
        height: 70vh;
        overflow-y: scroll;
    }

    .image {
        position: relative;
        overflow: hidden;
        padding-bottom: 100%;
    }

    .image img {
        position: absolute;
    }
</style>
