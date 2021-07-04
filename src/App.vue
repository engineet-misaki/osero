<template>
  <div id="app">
    <Osero/>
  </div>
</template>

<script>
import Osero from './components/Osero.vue'

export default {
  name: 'App',
  components: {
    Osero
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
body {
  background-image: url("./assets/bg1.gif");
  background-size: cover;
}
</style>
