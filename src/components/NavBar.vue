<template>
  <div class='nav-container'>
    <div class='logo'>
      <span class='helper'></span>
      <img alt='Vue logo' src='../assets/logo.png' />
    </div>
    <div class='nav-list'>
      <div class='nav-item'>
        <router-link to='/setup-list'>
          <v-icon name='home' scale='1.5' />
        </router-link>
      </div>
      <div class='nav-item'>
        <router-link to='/config-list'>
          <v-icon name='list-ul' scale='1.5' />
        </router-link>
      </div>
      <div class='nav-item'>
        <router-link to='/settings'>
          <v-icon name='cog' scale='1.5' />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/home';
import 'vue-awesome/icons/list-ul';
import 'vue-awesome/icons/heart';
import 'vue-awesome/icons/cog';

export default {
  components: { 'v-icon': Icon }
};
</script>

<style lang='scss' scoped>
.nav-container {
  .logo {
    height: 150px;

    .helper {
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }

    img {
      width: 80%;
      vertical-align: middle;
    }
  }

  .nav-item {
    margin: 50px 0;
    a {
      text-decoration: none;
      color: #2c3e50;
      cursor: pointer;

      &.router-link-exact-active {
        color: #a52641;
      }
    }
  }
}
</style>

