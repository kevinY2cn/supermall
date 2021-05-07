<template>
  <div id="app">
    <router-link to="/home" tag="button">首页</router-link>

    <router-link to="/login" tag="button">登陆</router-link>

    <router-link to="/shop" tag="button">商城</router-link>

    <router-link to="/authority" tag="button">权限管理</router-link>
    <router-view/>
<!--    <h2>{{isLogin}}</h2>-->
<!--    <verification></verification>-->
  </div>
</template>

<script>
/*import Register from 'views/Register'*/
import { mapState,mapActions  } from 'vuex'
/*import Verification from "components/Verification";*/


export default {
  name: 'app',

/*  components: {Verification},*/
  computed: {
    ...mapState('login',{
      isLogin: state => state.isLogin
    })
  },

  methods: {
    ...mapActions('login',{
      doLogin: 'doLogin'
    })
  }
}
</script>

<style>

</style>
