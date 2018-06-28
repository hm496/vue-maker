<template>
  <div class="App">
    <header class="App-header" v-finger:tap="tap">
      <h1 class="App-title">Welcome to Vue</h1>
    </header>
    <p class="App-intro">
      To get started, edit <code>src/App.vue</code> and save to reload.
    </p>
  </div>
</template>

<script>
    export default {
      methods: {
        tap: function () {
          console.log('onTap');
        },
      }
    }
</script>

<style lang="less" scoped>
  .App {
    text-align: center;
  }

  .App-header {
    background-color: #222;
    height: 150px;
    padding: 20px;
    color: white;
  }

  .App-title {
    font-size: 1.5em;
  }

  .App-intro {
    font-size: large;
  }
</style>
