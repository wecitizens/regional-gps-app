<template>
    <div class="h-screen">
        <table class="table">
            <thead>
            <tr>
                <td>Ref</td>
                <td>FR</td>
                <td>NL</td>
                <td>EN</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, key) in tl" :key="key">
                <td>{{ item['key'] }}</td>
                <td>{{ item['fr'] }}</td>
                <td>{{ item['nl'] }}</td>
                <td>{{ item['en'] }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

  import Steps from '../components/Steps';
  import fr from '../lang/fr-BE';
  import nl from '../lang/nl-BE';
  import en from '../lang/en-BE';

  import flat from 'flat';

  export default {
    name: 'municipality',
    components: {Steps},
    data() {
      return {
        tl : {}
      }
    },
    created() {
      this.getTranslations();
    },
    computed: {},
    methods: {
      getTranslations(){

        let frFlatten = flat.flatten(fr);
        let nlFlatten = flat.flatten(nl);
        let enFlatten = flat.flatten(en);

        let data = {};

        for(var key in frFlatten){
          data[key] = {
            'key' : key,
            fr : "'" + frFlatten[key],
            nl :  "'" + (typeof nlFlatten[key] !== "undefined" ? nlFlatten[key] : frFlatten[key]),
            en :  "'" + (typeof enFlatten[key] !== "undefined" ? enFlatten[key] : frFlatten[key]),
          };
        }

        console.log('Data', data);

        this.tl = data;

        return data;
      }
    }
  };
</script>
