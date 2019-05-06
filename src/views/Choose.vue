<template>
    <div>
        <steps :active="1"></steps>
        <div class="text-center container mt-5">
            <h1>{{ $t("choose.title") }}</h1>
            <p>{{ $t("choose.baseline") }}</p><br/>

            {{ vote.districts }}

            <el-row>
                <el-select v-model="europ" placeholder="Européenne">
                    <el-option
                            v-for="item in europLists"
                            :key="item.value"
                            :label="$t('vote.'+item.name)"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-row>

            <el-row>
                <el-select v-model="federal" placeholder="Fédérales">
                    <el-option
                            v-for="item in federalLists"
                            :key="item.value"
                            :label="$t('vote.'+item.name)"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-row>

            <el-row>
                <el-select v-model="region" placeholder="Régionales">
                    <el-option
                            v-for="item in regionalLists"
                            :key="item.value"
                            :label="$t('vote.'+item.name)"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-row>
            <br/>
            <el-row v-if="vote.current.election && vote.current.election.candidates && vote.current.election.candidates.length">
                <router-link v-if="participatingCandidates >= 6" :to="'/survey/'+district_key"
                             tag="el-button">{{ $t("button.lets_go") }}
                </router-link>
                <router-link v-else :to="'/insufficient-candidates/'+district_key" tag="el-button">
                    {{$t("button.lets_go") }}
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

  export default {
    name: 'district',
    components: {Steps},
    data() {
      return {
        district: null,
        zip_code: null,
        district_key: null,
        region: null,
        europ: null,
        federal: null,
        regions: [
          {
            value: 'VL',
            label: 'Bruxelles-Capitale'
          }, {
            value: 'WL',
            label: 'Région Walonne'
          }, {
            value: 'FL',
            label: 'Région Flamande'
          }
        ]
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
      europLists(){

        if (this.$store.state.vote.districts.length) {
          return this.$store.state.vote.districts.filter((item) => item.type === "EUROP");
        }

        return [];
      },
      federalLists(){

        if (this.$store.state.vote.districts.length) {
          return this.$store.state.vote.districts.filter((item) => item.type.match("BEF"));
        }

        return [];
      },
      regionalLists(){

        if (this.$store.state.vote.districts.length) {
          return this.$store.state.vote.districts.filter((item) => item.type.match("BER"));
        }

        return [];
      },
      ...mapState(['vote'])
    },
    methods: {
      setCurrentDistrict(data) {
        const loading = Loading.service();
        const district = this.$store.state.vote.districtSearchResults.find(r => r.value === data.district);
        this.district_key = district.key;
        this.$store.commit("setCurrentDistrict", district);
        this.$store.dispatch("setCurrentElection", district).then(() => {
          loading.close();
        });
      }
      ,
      async filterDistricts(data, cb) {
        await this.$store.dispatch('filterDistricts', data);
        cb(this.$store.state.vote.districtSearchResults);
      }
    }
  };
</script>
