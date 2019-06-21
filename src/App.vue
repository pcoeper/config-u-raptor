<template>
  <div id="app">
    <nav>
      <NavBar></NavBar>
    </nav>
    <main>
      <div class="content-wrapper">
        <router-view/>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavBar from '@/components/NavBar.vue';

@Component({
  components: {
    NavBar
  }
})
export default class App extends Vue {}
</script>


<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#app {
  display: grid;
  grid-template-columns: 100px auto;
  grid-template-rows: 100vh;
  grid-template-areas: "nav content";
}

nav {
  grid-area: nav;
  background-color: lightblue;
}

main {
  grid-area: content;
  background-color: lightcoral;
  padding: 40px 40px;
  height: 100%;

  .content-wrapper {
    height: 100%;
    overflow: auto;
    padding: 10px 50px;
  }
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
</style>
