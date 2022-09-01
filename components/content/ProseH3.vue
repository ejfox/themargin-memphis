<template>
  <h3 :id="id" class="serif mh1 mh3-ns mv2 measure">
    <a :href="`#${id}`" class="black link">
      <slot />
    </a>
  </h3>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
