<template>
    <div>
        <steps :active="1"></steps>
        <div class="text-center container mt-5">
            <h1>{{ $t("choose.title") }}</h1>
            <p>{{ $t("choose.baseline") }}</p><br/>

            <el-row class="mb-3">
                <el-select v-model="districts.europe"
                           :placeholder="$t('choose.european_elections')">
                    <el-option
                            v-for="item in europLists"
                            :key="item.code"
                            :label="$t('vote.'+item.name)"
                            :value="item.code"
                    >
                    </el-option>
                </el-select>
            </el-row>

            <el-row class="mb-3">
                <el-select v-model="districts.federal"
                           :placeholder="$t('choose.federal_elections')">
                    <el-option
                            v-for="item in federalLists"
                            :key="item.code"
                            :label="$t('vote.'+item.name)"
                            :value="item.code">
                    </el-option>
                </el-select>
            </el-row>

            <el-row class="mb-3">
                <el-select v-model="districts.regional"
                           :placeholder="$t('choose.regional_elections')">
                    <el-option
                            v-for="item in regionalLists"
                            :key="item.code"
                            :label="$t('vote.'+item.name)"
                            :value="item.code">
                    </el-option>
                </el-select>
            </el-row>
            <br/>
            <el-row v-if="districtKey">
                <router-link :to="'/survey/'+districtKey"
                             tag="el-button">{{ $t("button.lets_go") }}
                </router-link>
                <div class="mt-2">
                    {{ $t('accept_condition') }}
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>

  import {mapState} from 'vuex';
  import Steps from '../components/Steps';
  import {Loading} from 'element-ui';
  import Vue from "vue";

  export default {
    name: 'district',
    components: {Steps},
    data() {
      return {
        districts: {
          europe: null,
          federal: null,
          regional: null,
        }
      }
    },
    created() {
      this.$store.dispatch('getElectoralDistricts');
    },
    computed: {
      districtKey(){

        let district = this.districts;

        if (district.europe && district.federal && district.regional) {
          return district.regional;
        }

        return null;
      },
      survey() {
        console.log(this.$store.state);
        return this.$store.state.survey.current;
      }
      ,
      participatingCandidates() {

        if (this.$store.state.vote.current.election.candidates.length) {
          let candidates = this.$store.state.vote.current.election.candidates.filter((item) => item.total_received > 0);
          console.log('Candidates', candidates);
          return candidates.length;
        }

        return 0;
      },
      europLists() {

        if (this.$store.state.vote.districts.length) {
          return this.$store.state.vote.districts.filter((item) => item.type.match("EUROP"));
        }

        return [];
      },
      federalLists() {

        if (this.$store.state.vote.districts.length) {
          return this.$store.state.vote.districts.filter((item) => item.type.match("BEF"));
        }

        return [];
      },
      regionalLists() {

        if (this.$store.state.vote.districts.length) {
          return this.$store.state.vote.districts.filter((item) => item.type.match("BER"));
        }

        return [];
      },
      ...mapState(['vote'])
    },
    methods: {
      querySearch(key, queryString, cb) {
        console.log("Search", key, queryString);
        let items = this[key];
        let results = items.filter((item) => item.name.match(queryString));
        cb(results);
      },
      setCurrentDistricts() {

        console.log(this.districts);

        /*const loading = Loading.service();
        const district = this.$store.state.vote.districtSearchResults.find(r => r.value === data.district);
        this.district_key = district.key;*/
        /*this.$store.commit("setCurrentDistrict", district);
        this.$store.dispatch("setCurrentElection", district).then(() => {
          loading.close();
        });*/
      }
      ,
      async filterDistricts(data, cb) {
        await this.$store.dispatch('filterDistricts', data);
        cb(this.$store.state.vote.districtSearchResults);
      }
    }
  };
</script>
