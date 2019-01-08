<template>
    <div>
        <steps :active="1"></steps>
        <div class="container mt-3 mb-5" v-if="vote.current.election && vote.current.election.candidates">
            <h2>{{ $t('only_3_candidates_message', {'number': vote.current.election.candidates.filter((item) =>
                item.total_received).length}) }}</h2>
            <div class="alert alert-warning mt-3">
                {{ $t('insuffisant_number') }}
            </div>
            <ul class="list-unstyled mt-4">
                <li class="media mb-3" v-for="(item, key) in orderList" :key="key"
                    v-bind:class="{ disabled: !item.total_received }">
                    <a :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.politician_id"
                       target="_blank">
                        <img class="mr-3 align-self-start img-thumbnail" :src="item.img" width="64" alt=""
                             v-if="item.img">
                        <img class="mr-3 align-self-start img-thumbnail"
                             src="//directory.wecitizens.be/assets/media/politician-thumb/img-no-photo.png"
                             width="64" alt="" v-else>
                    </a>
                    <div class="media-body text-left">
                        <h5>
                            <a :href="'//directory.wecitizens.be/'+$i18n.locale()+'/politician/profil/'+item.politician_id"
                               target="_blank">{{ item.full_name }}</a></h5>
                        <h6>
                            {{ item.list }}
                            <span v-if="item.order > 0">#{{item.order}}</span>
                        </h6>
                    </div>
                </li>
            </ul>

            <a :href="'mailto:?subject=' +  encodeURIComponent($t('mail.invite_candidate.subject')) + '&body=' + encodeURIComponent($t('mail.invite_candidate.text'))"
               class="el-button el-button--default">
                {{ $t("button.invite_candidate") }}
            </a>
            
            <router-link :to="'/survey/'+district_key" class="btn btn-block btn-danger mt-3 d-none">{{
                $t('im_doing_test_anyway') }}
            </router-link>
        </div>
    </div>
</template>

<script>

  import {mapActions, mapGetters, mapState} from 'vuex';
  import Steps from '../components/Steps';

  export default {
    name: "poll-insufficient-candidates",
    components: {
      Steps
    },
    data() {
      return {
        district_key: null
      }
    },
    computed: {
      ...mapGetters(['questions', 'currentQuestionKey', 'survey']),
      ...mapState(['vote']),
      orderList() {

        if (this.$store.state.vote.current.election) {

          let candidates = this.$store.state.vote.current.election.candidates;
          console.log("candidates in insufficient",candidates);
          return candidates.sort((a, b) => (b.total_received - a.total_received) / 20 + (b.completeness - a.completeness) / 100);
        }

        return [];
      }
    },
    methods: {
      ...mapActions(['getQuestions', 'previousQuestion', 'nextQuestion']),
    },
    created() {
      this.$store.dispatch('getDistricts').then(() => {

        this.district_key = this.$route.params.key;

        const district = this.$store.state.vote.districts.find(r => r.key === this.district_key);

        this.$store.commit("setCurrentDistrict", district);
        this.$store.dispatch("setCurrentElection", district);
        this.$store.dispatch('setCurrentPoll', district)
          .then(() => this.$store.dispatch('setCurrentSurvey'))
          .then(() => this.getQuestions())
          .then(() => {
            this.loading = false;
          });
      });
    }
  }
</script>

<style scoped>
    .list-scroll {
        height: 70vh;
        overflow-y: scroll;
    }

    .disabled {
        color: rgba(64, 64, 64, 0.59) !important;
        opacity: 0.6;
    }
</style>
