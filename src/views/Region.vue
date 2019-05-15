<template>
    <div>
        <steps :active="1"></steps>
        <div class="text-center container mt-5">
            <h5>{{ $t("region.what_is_your_region") }}</h5>
            <div id="flags-div">
                <button style="margin:15px;"  v-on:click="setCurrentRegion('VL')" ><img style="width:80px; height:60px;padding:8px;" src="../assets/flanders_flag.svg.png" ></button>
                <button style="margin:15px;"  v-on:click="setCurrentRegion('WA')" ><img style="width:80px; height:60px;padding:8px;" src="../assets/wallonia_flag.svg.png" ></button>
                <button style="margin:15px;"  v-on:click="setCurrentRegion('BR')" ><img style="width:80px; height:60px;padding:8px;" src="../assets/brussels_flag.svg.png" ></button>
            </div>
        </div>
            <div class="text-center container mt-5">
             <el-row v-if="vote.current.region" >
                 <h5>{{ $t("district.what_is_your_eur_district") }}:</h5>
                    <el-autocomplete style="width:350px;" class="inline-input" v-model="eurDistrict" :fetch-suggestions="filterEurDistricts"
                     @select="setCurrentEurDistrict({ eurDistrict })"></el-autocomplete>
             </el-row >
                <br>
                <el-row  v-if="vote.current.region" >
                    <h5>{{ $t("district.what_is_your_fed_district") }}:</h5>
                    <el-autocomplete style="width:350px;" class="inline-input" v-model="fedDistrict" :fetch-suggestions="filterFedDistricts"
                     @select="setCurrentFedDistrict({ fedDistrict })"></el-autocomplete>
                </el-row>
                <br>
                <el-row  v-if="vote.current.region" >
                    <h5>{{ $t("district.what_is_your_reg_district") }}:</h5>
                    <el-autocomplete style="width:350px;" class="inline-input" v-model="regDistrict" :fetch-suggestions="filterRegDistricts"
                                     @select="setCurrentRegDistrict({ regDistrict })"></el-autocomplete>
                </el-row>
                <br/>
                <!--el-row v-if="vote.current.election && vote.current.region && vote.current.fedDistrict && vote.current.regDistrict&& vote.current.eurDistrict"-->
                    <el-row v-if="vote.current.election && vote.current.region && vote.current.regDistrict ">
                    <router-link :to="'/survey/2019-05-26?'+region"
                                 tag="el-button">{{ $t("button.lets_go") }}
                    </router-link>
                    <div class="mt-2">
                        {{ $t('accept_condition') }}
                    </div>
                </el-row>
            <br/>
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
        regDistrict: null,
        fedDistrict: null,
        eurDistrict: null,
        zip_code: null,
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
        selectRegion(data) {
            this.$store.commit("Region.vue:meth.setCurrentRegion:", data);
        },

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
