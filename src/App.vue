<template>
    <div id="app">
        <header-nav></header-nav>
        <transition name="fade">
            <router-view/>
        </transition>
    </div>
</template>

<script>

  import HeaderNav from './components/HeaderNav';

  export default {
    components : {
      HeaderNav
    },
    created() {

    }
  }
</script>

<style lang="scss">

    body, html{
        background: #F5F5F1;
        color: #000000;

    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

    .text-white {
        color: #ffffff;
    }

    #nav {
        padding: 30px;
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }

    .nav-lang {
        text-transform: uppercase;
        a {
            color: #ffffff;
        }
    }
</style>
