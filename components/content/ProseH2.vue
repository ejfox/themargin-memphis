<template>
  <h2 :id="id" class="sans-serif ttu mh1 mh3-ns mv2 measure-narrow z-2">
    <a :href="`#${id}`" class="link">
      <slot />
    </a>
  </h2>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
