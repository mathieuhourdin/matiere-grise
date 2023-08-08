<template>
  <div>
  <a :href="link">
    <slot />
  </a>
  </div>
</template>


<script setup lang="ts">

import { computed } from "vue";
const props = defineProps<{
  partialHref?: String
}>()
const link = computed(() => {
  return import.meta.env.BASE_URL + (props.partialHref ? props.partialHref : "")
})

</script>
