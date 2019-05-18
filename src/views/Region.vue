<template>
    <div>
        <steps :active="1"></steps>

            <div class="text-center container mt-5">

                <h4>{{ $t("choose.title") }}</h4>
                <p>{{ $t("choose.baseline") }}</p><br/>

             <el-row  >
                 <el-autocomplete style="width:350px;" class="inline-input" v-model="eurDistrict"
                                  :placeholder="$t('choose.european_elections')"
                                  :fetch-suggestions="filterEurDistricts"
                                  @select="setCurrentEurDistrict({ eurDistrict })"></el-autocomplete>
             </el-row >
                <br>
                <el-row  >
                    <el-autocomplete style="width:350px;" class="inline-input" v-model="fedDistrict"
                                     :placeholder="$t('choose.federal_elections')"
                                     :fetch-suggestions="filterFedDistricts"
                                     @select="setCurrentFedDistrict({ fedDistrict })"></el-autocomplete>
                </el-row>
                <br>
                <el-row >
                    <el-autocomplete style="width:350px;" class="inline-input" v-model="regDistrict"
                                     :placeholder="$t('choose.regional_elections')"
                                     :fetch-suggestions="filterRegDistricts"
                                     @select="setCurrentRegDistrict({ regDistrict })"></el-autocomplete>
                </el-row>
                <br/>
            </div>

                <el-row v-if="vote.current.fedDistrict && vote.current.regDistrict&& vote.current.eurDistrict">
                    <router-link :to="'/survey/2019-05-26?'+region"
                                 tag="el-button">{{ $t("button.lets_go") }}
                    </router-link>
                    <div class="mt-2">
                        {{ $t('accept_condition') }}
                    </div>
                </el-row>
            <br/>
    </div>
</template>

<script>

  import {mapState} from 'vuex';
  import Steps from '../components/Steps';
  import {Loading} from 'element-ui';

  export default {
    name: 'region',
    components: {Steps},
    data() {
      return {
        region: null,
        district: null,
        regDistrict: null,
        fedDistrict: null,
        eurDistrict: null,
        district_key: null,
        district_code: null,
        eur_district_key: null,
        eur_district_code: null,
        reg_district_key: null,
        reg_district_code: null,
        fed_district_key: null,
        fed_district_code: null
      }
    },

     getters: {
         region: state => state.current.region,
     },

    created() {
      //this.$store.dispatch('getElectoralDistricts');
      this.$store.dispatch('getEurElectoralDistricts');
      this.$store.dispatch('getFedElectoralDistricts');
      this.$store.dispatch('getRegElectoralDistricts');
      this.$store.dispatch("setCurrentElection", null);

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

        setCurrentRegion(data) {
            console.log('Region.vue:meth.setCurrentRegion:', data);
            this.$store.commit("setCurrentRegion", data);

            this.region = data;
            this.filterRegDistricts('BER'+data);
            this.$store.dispatch("setCurrentElection", null).then(() => {
                //loading.close();
            });
        },

        setCurrentEurDistrict(data) {
            const loading = Loading.service();
            //console.log('Region.vue:meth.:setCurrentEurDistrict:', data);
            //console.log('store.state.vote', this.$store.state.vote);
            const eurDistrict = this.$store.state.vote.eurDistrictSearchResults.find(r => r.value === data.eurDistrict);

            console.log('...eurDistrict:', eurDistrict);

            this.eur_district_key = eurDistrict.key;
            this.eur_district_code = eurDistrict.code;
            this.$store.commit("setCurrentEurDistrict", eurDistrict);


            this.$store.dispatch("getEurDistrictLists", eurDistrict).then(() => {
                loading.close();
            });
        },

        setCurrentRegDistrict(data) {
            const loading = Loading.service();
            //console.log('Region.vue:meth.:setCurrentRegDistrict:', data);
            //console.log('store.state.vote', this.$store.state.vote);
            const regDistrict = this.$store.state.vote.regDistrictSearchResults.find(r => r.value === data.regDistrict);
            console.log('...regDistrict:', regDistrict);

            this.reg_district_key = regDistrict.key;
            this.reg_district_code = regDistrict.code;
            this.$store.commit("setCurrentRegDistrict", regDistrict);

            let region = regDistrict.type.substr(3,2);

            console.log('region from regDistrict: ' + region);
            this.$store.commit("setCurrentRegion", region);


            this.$store.dispatch("getRegDistrictLists", regDistrict).then(() => {
                loading.close();
            });
        },

        setCurrentFedDistrict(data) {
            const loading = Loading.service();
            //console.log('Region.vue:meth.:setCurrentRegDistrict:', data);
            //console.log('store.state.vote', this.$store.state.vote);
            const fedDistrict = this.$store.state.vote.fedDistrictSearchResults.find(r => r.value === data.fedDistrict);
            console.log('...fedDistrict:', fedDistrict);

            this.fed_district_key = fedDistrict.key;
            this.fed_district_code = fedDistrict.code;
            this.$store.commit("setCurrentFedDistrict", fedDistrict);

            this.$store.dispatch("getFedDistrictLists", fedDistrict).then(() => {
                loading.close();
            });
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
            loading.close();
        },
        async filterEurDistricts(data, cb) {
            //console.log('Region.vue:meth.filterEurDistricts:', data);
            await this.$store.dispatch('filterEurDistricts', data);
            cb(this.$store.state.vote.eurDistrictSearchResults);
        },
        async filterRegDistricts(data, cb) {
            //console.log('Region.vue:meth.filterRegDistricts:', data);
            await this.$store.dispatch('filterRegDistricts', data);
            cb(this.$store.state.vote.regDistrictSearchResults);
        },
        async filterFedDistricts(data, cb) {
            //console.log('Region.vue:meth.filterFedDistricts:', data);
            await this.$store.dispatch('filterFedDistricts', data);
            cb(this.$store.state.vote.fedDistrictSearchResults);
        },

        async filterDistricts(data, cb) {
            await this.$store.dispatch('filterDistricts', data);
            cb(this.$store.state.vote.districtSearchResults);
        }
    }
  };
</script>
