<template>
  <div class="nav-container">
    <div class="logo">
      <span class="helper"></span>
      <img alt="Vue logo" src="../assets/logo.png">
    </div>
    <nav>
      <div class="nav-list">
        <div class="nav-item">
          <router-link to="/">
            <v-icon label="home-icone">
              <v-icon name="circle" scale="3"/>
              <v-icon name="home" scale="1.5" inverse/>
            </v-icon>
          </router-link>
        </div>
        <div class="nav-item">
          <router-link to="/config-list">
            <v-icon label="home-icone">
              <v-icon name="circle" scale="3"/>
              <v-icon name="list-ul" scale="1.5" inverse/>
            </v-icon>
          </router-link>
        </div>
        <div class="nav-item">
          <router-link to="/favorites">
            <v-icon label="home-icone">
              <v-icon name="circle" scale="3"/>
              <v-icon name="heart" scale="1.5" inverse/>
            </v-icon>
          </router-link>
        </div>
        <div class="nav-item">
          <router-link to="/settings">
            <v-icon label="home-icone">
              <v-icon name="circle" scale="3"/>
              <v-icon name="cog" scale="1.5" inverse/>
            </v-icon>
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/home';
import 'vue-awesome/icons/list-ul';
import 'vue-awesome/icons/heart';
import 'vue-awesome/icons/cog';
import 'vue-awesome/icons/circle';

@Component({
  components: { 'v-icon': Icon }
})
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

