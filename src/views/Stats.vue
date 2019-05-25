<template>
    <div>
        <steps :active="3"></steps>
        <h4 class="text-center m-3">{{$t('stats.anonymous_question_to_improve_service')}}</h4>
        <el-form ref="form" label-position="top" :model="form" label-width="120px">

            <el-form-item :label="q[1].title">
                <el-select v-model="form.age" placeholder="" value="">
                    <el-option v-for="(name, value) in q[1].options" :key="value" v-bind:label="name" :name="q[1].key"
                               :value="value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="q[0].title">
                <el-select v-model="form.source" placeholder="" value="">
                    <el-option v-if="value" v-for="(name, value) in q[0].options" :key="value" v-bind:label="name" :name="q[0].key"
                               :value="value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="q[2].title">
                <el-select v-model="form.party_vote" placeholder="" value="">
                    <el-option v-if="value" v-for="(name, value) in q[2].options" :key="value" v-bind:label="name" :name="q[2].key"
                               :value="value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button @click="seeResults"> {{ $t('button.see_results') }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import Steps from '../components/Steps'
  import ElRadio from "element-ui/packages/radio/src/radio"
  import Api from '../store/_helpers/api';
  import axios from "axios";

  export default {
    components: {
      ElRadio,
      Steps
    },
    data() {
      return {
        choose: null,
        type: null,
        form: {
          source: null,
          age: null,
          party_vote: null
        },
        q: this.$t('stats.questions')
      }
    },
    computed: {},
    methods: {
      seeResults() {

        //console.log("FORM", this.form);

        let data = this.form;


          const answers = this.$store.state.questions.list.data.questions
              .map(q => {
                  return {
                      question_key: q.key,
                      answer_format: 'agr_5_scale_tol_3_scale_abs',
                      value: q.agreement,
                      tolerance: q.importance
                  }
              }).filter(q => q.value != null);

          data.answers = answers;

          //console.log(data);


          axios.get('stats', {
          params: data
        }).then(() => {
          this.$router.push({name: 'results'});
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  h1 {

  }
</style>
