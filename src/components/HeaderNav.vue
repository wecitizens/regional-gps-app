<template>
    <nav class="header-nav clearfix">
        <div class="row">
            <div class="col-4 text-right">
                <div class="btn-group float-left">
                    <button type="button" class="header-button hamburger btn hamburger--slider" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-bars fa-lg"></i>
                    </button>
                    <div class="dropdown-menu">
                        <router-link class="dropdown-item" to="/">{{$t('menu.item.welcome')}}</router-link>
                        <a class="dropdown-item" @click="handleShare">{{$t('menu.item.share_app',
                            {'app_title' :
                            $t('app.title')}) }}
                        </a>
                        <router-link class="d-none dropdown-item" to="/questions">
                            {{$t('menu.item.see_all_questions')}}
                        </router-link>
                        <router-link class="dropdown-item" to="/">{{$t('menu.item.start_from_scratch')}}
                        </router-link>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" target="_blank"
                           :href="$t('links.gps_link')">{{$t('menu.item.about_app',
                            {app_title:$t('app.title')})}}</a>
                        <a class="dropdown-item" target="_blank"
                           :href="$t('links.wecitizens_link')">{{$t('menu.item.about_association',
                            {association_name:$t('association.name')})}}</a>
                        <a class="dropdown-item" target="_blank"
                           :href="$t('links.advice_to_elector_link')">{{$t('menu.item.advice_to_elector',
                            {association_name:$t('association.name')})}}</a>
                        <a class="dropdown-item" @click="() => showDonate = true">{{$t('menu.item.donate',
                            {app_title:$t('app.title')})}}</a>

                        <a class="dropdown-item" target="_blank"
                           :href="$t('newsletter.link')">{{$t('newsletter.title')}}</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" target="_blank"
                           :href="$t('links.register_as_candidate_link')">{{$t('menu.item.register_as_candidate',
                            {association_name:$t('association.name')})}}</a>
                    </div>
                </div>
            </div>
            <div class="col-4 text-center">
                <router-link to="/"><img src="/img/logo.svg" alt=""></router-link>
            </div>
            <div class="col-4 text-right">
                <ul class="nav nav-lang">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" id="navbarLang" data-toggle="dropdown" href="#"
                           role="button"
                           aria-haspopup="true" aria-expanded="false">{{ $i18n.locale() }}</a>
                        <div class="dropdown-menu" aria-labelledby="navbarLang">
                            <a class="dropdown-item" v-for="(locale, key) in $i18n.locales()" :key="key"
                               v-if="locale !== $i18n.locale()" @click="() => setLocale(locale)">{{ locale }}</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <el-dialog
                :visible.sync="showShare"
                width="90%">
            <h1>{{ $t("share.title") }}</h1>
            <br>
            <div class="addthis_toolbox addthis_inline_share_toolbox"></div>
        </el-dialog>
        <el-dialog
                :visible.sync="showDonate"
                width="90%"
        >
            <h3>{{ $t("donate.title") }}</h3>
            <p>{{ $t("donate.content") }}</p>
            <p>{{ $t("donate.account") }}</p>

            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_s-xclick">
                <input type="hidden" name="hosted_button_id" value="V5SWJKELNVZQE">
                <input type="hidden" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                <button type="submit" name="submit" class="btn btn-primary">{{ $t("PayPal-button") }}</button>
                <img alt="" border="0" src="https://www.paypalobjects.com/nl_NL/i/scr/pixel.gif" width="1" height="1">
            </form>

        </el-dialog>
    </nav>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'header-nav',
    methods: {
      setLocale: (local) => {
        console.log('-> Switch lang', local);
        Vue.i18n.set(local);
      },
      handleShare() {
        //this.showShare = true;
        window.$('#share-modal').modal('show');
      }
    },
    data: () => {
      return {
        'showShare': false,
        'showDonate': false
      }
    },
    created() {
      let $ = window.jQuery;

      $('#navbar-toggler').each(function () {
        $(this).on('click', function () {
          $('body').toggleClass('menu__open');
        });
        $('.wrap').on('click', function () {
          console.log('click');
          $('body').removeClass('menu__open');
        });
        $(window).on('resize', function () {
          $('body').removeClass('menu__open');
        });
      });
    }
  }
</script>

<style lang="scss" scoped>

    .header-nav {
        padding: 10px 16px;
        .nav-lang {
            float: right;
            a {
                color: #000;
                &:hover {
                    color: #444444;
                }
            }
        }

        .header-button{
            background: none;
            padding: 0.5em;
            margin: 0;
            font-size: 15px;
        }
    }
</style>
