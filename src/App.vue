<template>
  <div id="app">
    <div>
      <Converter />
    </div>
  </div>
</template>

<script>
import Converter from "./components/Converter.vue";

export default {
  name: "App",
  components: {
    Converter,
  },
};
</script>

<style lang="postcss" scoped>
* {
  @apply box-border m-0;
}

#app {
  @apply h-screen flex items-center justify-center font-sans;

  div {
    @apply container;
  }
}
</style>
