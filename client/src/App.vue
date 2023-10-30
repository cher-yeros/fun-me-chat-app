<template>
  <v-app>
    <app-bar app></app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- <v-footer app> </v-footer> -->
  </v-app>
</template>

<script>
import AppBar from "./components/AppBar.vue";

// import RouterView from "vue-router";
export default {
  name: "App",
  components: {
    AppBar,
  },
};
</script>

<style>
/* @font-face {
  font-family: myFirstFont;
  src: url(sansation_light.woff);
} */
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: "merriweather sans";
  /* font-family: "nunito"; */
  /* font-family: "natural mono"; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
