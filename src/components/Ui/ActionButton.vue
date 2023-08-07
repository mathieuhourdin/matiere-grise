<template>
  <div>
    <button
      :class="buttonClass"
      @click="$emit('click')"
        >{{ text }}</button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  const props = defineProps<{
    text: String,
    type: String,
  }>();
  const buttonClass = computed(() => {
    if (props.type == "valid") return "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" ;
    if (props.type == "abort") return "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow";
    return "";
  })
</script>
