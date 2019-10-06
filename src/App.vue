<template>
  <div id='app-wrapper'>
    <nav>
      <NavBar></NavBar>
    </nav>
    <main>
      <div class='content-wrapper'>
        <router-view />
      </div>
    </main>
  </div>
</template>

<script lang='ts'>
import NavBar from '@/components/NavBar.vue';

export default {
  components: { NavBar }
};
</script>


<style lang='scss'>
$white: white;
$lightBlue: #b3c7d6;
$middleBlue: #85b3d1;
$darkBlue: #2460a7ff;
$lightYellow: #d9b48fff;

body {
  margin: 0;
  padding: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#app-wrapper {
  display: grid;
  grid-template-columns: 100px auto;
  grid-template-rows: 100vh;
  grid-template-areas: 'nav content';
}

nav {
  background-color: $middleBlue;
  grid-area: nav;
  box-shadow: 0 4px 8px 0 rgba($color: #000000, $alpha: 0.2);
  z-index: 1;
}

main {
  grid-area: content;
  background-color: $white;
  padding: 40px 30px 40px 40px;
  height: 100%;

  .content-wrapper {
    height: 100%;
    overflow: auto;
    padding-right: 10px;
  }
}

.m-l-5 {
  margin-left: 5px;
}

@import '../node_modules/bulma/bulma.sass';
</style>
