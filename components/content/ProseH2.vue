<template>
  <h2 :id="id" class="sans-serif ttu measure-wide mh1 mh3-ns ml6-l">
    <a :href="`#${id}`" class="link near-black f2 f1-l">
      <slot />
    </a>
  </h2>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
