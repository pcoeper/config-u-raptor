<template>
  <div id="app-wrapper">
    <nav>
      <NavBar></NavBar>
    </nav>
    <main>
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import NavBar from "@/components/NavBar.vue";

export default {
  components: { NavBar }
};
</script>


<style lang="scss">
$lightBlue: #b3c7d6ff;
$middleBlue: #85b3d1ff;
$lightYellow: #d9b48fff;

body {
  margin: 0;
  padding: 0;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#app-wrapper {
  display: grid;
  grid-template-columns: 100px auto;
  grid-template-rows: 100vh;
  grid-template-areas: "nav content";
}

nav {
  background-color: $middleBlue;
  grid-area: nav;
}

main {
  grid-area: content;
  background-color: $lightBlue;
  padding: 40px 40px;
  height: 100%;

  .content-wrapper {
    height: 100%;
    overflow: auto;
    padding: 10px 50px;
  }
}
</style>
