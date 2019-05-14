<template>
    <div class="results">
        <b-card no-body v-for="result in results" class="mt-2">
            <h2 class="mt-2">{{ $t("choose."+result.type+"_elections") }}</h2>
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
                    <a :v-if="result.type === 'regional'" href="" class="btn btn-outline-info" v-on:click="() => printDiv('print-list')">{{ $t("print")}}</a>
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

                    <a :v-if="result.type === 'regional'" href="" class="btn btn-outline-info d-print-none" v-on:click="() => printDiv('print-list')">{{ $t("print")}}</a>
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

    },
    mounted() {

    },
    computed: {

    },
    data() {
      return {
        showNewsletter: false,
        results: [// @todo dynamise this
          {
            "type" : "european"
          },
          {
            "type" : "federal"
          },
          {
            "type" : "regional"
          },
        ],
        currentRegCandidateScores: [],
        regCurrentElectoralListScores : [],
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
