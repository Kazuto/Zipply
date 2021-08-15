<template>
  <div v-show="loading" class="background">
    <spinner></spinner>
  </div>
</template>

<script>
import Spinner from "./Spinner.vue";
export default {
  components: { Spinner },
  props: {
    loading: Boolean,
  },
};
</script>

<style lang="postcss" scoped>
.background {
  @apply absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-25;
}

svg {
  @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 transition animate-spin;
}
</style>
