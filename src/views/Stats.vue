<template>
    <div>
        <steps :active="3"></steps>
        <h3 class="text-center m-3">{{$t('stats.anonymous_question_to_improve_service')}}</h3>
        <el-form ref="form" label-position="top" :model="form" label-width="120px">

            <el-form-item :label="q[0].title">
                <el-select :v-model="form.source" placeholder="" value="">
                    <el-option v-if="value" v-for="(name, value) in q[0].options" :key="value" v-bind:label="name" :name="q[0].key"
                               :value="value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="q[1].title">
                <el-select :v-model="form.age" placeholder="" value="">
                    <el-option v-if="value" v-for="(name, value) in q[1].options" :key="value" v-bind:label="name" :name="q[1].key"
                               :value="value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="q[2].title">
                <el-select :v-model="form.party_vote" placeholder="" value="">
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


  export default {
    components: {
      ElRadio,
      Steps
    },
    data() {
      return {
        municipality: null,
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
        Api.get('stats', {
          stats: this.form,
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
