<template>
    <div>
        <steps :active="1"></steps>
        <div class="text-center container mt-5">
            <h1>{{ $t("region.what_is_your_region") }}</h1>
            <br/>

            <div id="flags-div">
                <button style="margin:15px;"  v-on:click="setCurrentRegion('VL')" ><img style="width:100px; height:80px;padding:8px;" src="../assets/flanders_flag.svg.png" ></button>
                <button style="margin:15px;"  v-on:click="setCurrentRegion('WA')" ><img style="width:100px; height:80px;padding:8px;" src="../assets/wallonia_flag.svg.png" ></button>
                <button style="margin:15px;"  v-on:click="setCurrentRegion('BR')" ><img style="width:100px; height:80px;padding:8px;" src="../assets/brussels_flag.svg.png" ></button>
            </div>
            <br/>
        </div>
            <div class="text-center container mt-5">

            <h1>{{ $t("district.what_is_your_district") }}</h1>
            <p>{{ $t("district.help_customise_survey") }}</p><br/>

            <el-row>
                <el-autocomplete style="width:350px;" class="inline-input" v-model="district" :fetch-suggestions="filterRegionalDistricts"
                                 v-bind:placeholder="$t('input.place_holder.your_postcode')"
                                 @select="setCurrentDistrict({ district })"></el-autocomplete>
            </el-row>
            <br/>
                <el-row v-if="vote.current.election">
                    <div>vote.current.election </div>
                    <router-link :to="'/survey/2019-05-26?'+district_code"
                                 tag="el-button">{{ $t("button.lets_go") }}
                    </router-link>
                </el-row>
                <el-row v-if="vote.current.election && vote.current.election.candidates">
                    <div>vote.current.election.candidates </div>
                </el-row>
                <el-row v-if="vote.current.election && vote.current.election.candidates && vote.current.election.candidates.length">
                    <div>vote.current.election.candidates.length </div>
                </el-row>
             <el-row v-if="vote.current.election && vote.current.election.candidates && vote.current.election.candidates.length">
                    <router-link v-if="participatingCandidates >= 0" :to="'/survey/'+district_code"
                                 tag="el-button">{{ $t("button.lets_go") }}
                    </router-link>
                    <router-link v-else :to="'/insufficient-candidates/'+district_key" tag="el-button">
                        {{$t("button.lets_go") }}
                    </router-link>
                    <div class="mt-2">
                        {{ $t('accept_condition') }}
                    </div>
             </el-row>
                <el-row v-else-if="district && vote.current.election">
                    <div>{{ $t('not_enough_candidates_answered')}}</div>
                </el-row>

        </div>
    </div>
</template>

<script>

  import {mapState} from 'vuex';
  import Steps from '../components/Steps';
  import { Loading } from 'element-ui';

  export default {
    name: 'region',
    components: {Steps},
    data() {
      return {
          region: null,
        district: null,
        zip_code: null,
        district_key: null,
        district_code: null
      }
    },
    created() {
      this.$store.dispatch('getElectoralDistricts');
    },
    computed: {
      displayNextStepButton() {
        return true
      },
      survey() {
        //console.log(this.$store.state);
        return this.$store.state.survey.current;
      },
      participatingCandidates() {
          //console.log('participatingCandidates');
          //console.log('current.election:'); console.log(this.$store.state.vote.current.election);
          if (this.$store.state.vote.current.election.candidates.length) {
          let candidates = this.$store.state.vote.current.election.candidates.filter((item) => item.total_received > 0);
          //console.log('Candidates', candidates);
          return candidates.length;
        }
        return 0;
      },
      ...mapState(['vote'])
    },
    methods: {
        selectRegion(data) {
            this.$store.commit("Region.vue:meth.setCurrentRegion:", data);
        },

        setCurrentRegion(data) {
            //console.log('Region.vue:meth.setCurrentRegion:', data);
            this.$store.commit("setCurrentRegion", data);

            this.region = data;
            this.filterRegionalDistricts('BER'+data);
        },
        setCurrentDistrict(data) {
            const loading = Loading.service();
            //console.log('Region.vue:meth.:setCurrentDistrict:', data);
            //console.log('store.state.vote', this.$store.state.vote);
            const district = this.$store.state.vote.districtSearchResults.find(r => r.value === data.district);

            //console.log('...district:', district);

            this.district_key = district.key;
            this.district_code = district.code;
            this.$store.commit("setCurrentDistrict", district);
            this.$store.dispatch("setCurrentElection", district).then(() => {
                loading.close();
            });
        },
        async filterRegionalDistricts(data, cb) {
            //console.log('Region.vue:meth.filterRegionalDistricts:', data);
            await this.$store.dispatch('filterDistricts', data);
            cb(this.$store.state.vote.districtSearchResults);
        },

        async filterDistricts(data, cb) {
            await this.$store.dispatch('filterDistricts', data);
            cb(this.$store.state.vote.districtSearchResults);
        }
    }
  };
</script>
