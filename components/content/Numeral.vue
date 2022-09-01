<template>
  <span class="numeral f2 f1-l absolute-l ml3 ml0-l pl2 dib tr">
    {{ text }} <slot />
  </span>
</template>
<script setup>
defineProps(['text'])
</script>
<style scoped>
.numeral {
  /* margin-left: -0.5em; */
  margin-top: -0.2em;
  /* position: absolute; */
}
</style>
