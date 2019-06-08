<template>
  <div class="nav-container">
    <div class="logo">
      <span class="helper"></span>
      <img alt="Vue logo" src="../assets/logo.png">
    </div>
    <nav>
      <div class="nav-list">
        <div class="nav-item">
          <router-link to="/">Home</router-link>
        </div>
        <div class="nav-item">
          <router-link to="/config-list">Config-List</router-link>
        </div>
        <div class="nav-item">
          <router-link to="/favorites">Favorites</router-link>
        </div>
        <div class="nav-item">
          <router-link to="/settings">Settings</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NavBar extends Vue {}
</script>

<style lang="scss">
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
    }
  }
}
</style>

