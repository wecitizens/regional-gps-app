<template>
    <div>
        <main class="main text-white clearfix">
            <h1 class="big-title"><span class="big-title__big">{{$t('home.title_1')}}</span><span class="big-title__small">{{$t('home.title_2')}}</span></h1>
            <div class="subtitle">{{ $t('home.subtitle') }}</div>
            <h2>{{ $t("home.title") }}</h2>
            <div class="infos d-none">{{ $t("home.description", {"userCount": campaignTotalParticipants}) }}</div>
            <div class="cta-section">
                <div class="perso-left">
                    <img src="/img/perso-1.svg" alt="">
                </div>
                <router-link to="/municipality" tag="a" class="btn-start">
                    {{ $t("home.cta") }}
                </router-link>
                <div class="perso-right">
                    <img src="/img/perso-2.svg" alt="">
                </div>
            </div>
        </main>
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

  import {mapActions, mapGetters} from 'vuex';
  import Steps from '../components/Steps';
  import Aos from 'aos';
  import Vue from 'vue';

  export default {
    name: 'home',
    components: {
      Steps
    },
    created() {
      this.$store.dispatch('getQuestions');
      Aos.init();

      //let userLang = navigator.language || navigator.userLanguage;

      switch (this.$router.currentRoute.name) {
        case "home-nl":
          Vue.i18n.set("nl");
          break
        case "home-en":
          Vue.i18n.set('en');
          break
      }
    },
    methods: {
      ...mapActions(['getQuestions']),
      setLocale: (local) => {
        console.log('-> Switch lang', local);
        Vue.i18n.set(local);
      },
    },
    computed: {
      ...mapGetters([
        'questions',
        'currentQuestionKey',
        'campaignTotalParticipants']),
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">

    body, html {
        min-height: 100vh;
    }

    .big-title {
        margin-top: 0;
        text-align: center;
        font-size: 48px;
        color: #000000;
        font-weight: bold;
        font-family: 'IBM Plex Sans Condensed', sans-serif;

        &__big {
            font-size: 60px;
            display: block;
        }

        &__small{
            display: block;
            font-size: 19px;
            margin: -10px;
        }

        margin-bottom: 1rem;
    }

    h2 {
        width: 90%;
        margin: 10px auto 0 !important;
    }

    .subtitle {
        background: #F8E71C;
        text-transform: uppercase;
        font-size: 18px;
        display: inline-block;
        padding: 0.3em 0.8em;
        font-weight: bold;
    }

    .infos {
        font-family: IBMPlexSans-Italic;
        font-size: 14px;
        color: #000000;
        text-align: center;
    }

    .cta-section {
        background: #000000;
        margin-top: 120px;
        height: 150px;
        position: relative;
        padding-top: 20px;

        .perso-left {
            position: absolute;
            top: -100px;
            left: 50%;
            margin-left: -140px;
        }

        .btn-start {
            background: #EA3434;
            color: #ffffff;
            height: 110px;
            width: 110px;
            border: none;
            border-radius: 110px;
            text-align: center;
            text-transform: uppercase;
            margin: 0 auto !important;
            display: block;
            padding-top: 32px;
            font-weight: bold;

            &:hover {
                text-decoration: none;
                background: #F8E71C;
            }

            span {
                width: 100%;
                display: inline-block;
            }
        }

        .perso-right {
            position: absolute;
            top: -100px;
            right: 50%;
            margin-right: -130px;
        }
    }

    .footer {
        bottom: 0;
        color: #000;
        width: 100%;
        padding: 0.5em;
        margin: 0;
        text-align: center;
        background: #F5F5F1;
        position: relative;
    }

    @media (min-width: 768px) {
        .footer {
            position: relative;
        }
    }
</style>
