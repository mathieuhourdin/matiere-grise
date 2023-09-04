<template>
  <div>
    <button
      :class="`${buttonClass} ${textSize(size)} ${roundedClass(rounded)}`"
      @click="clickOnButton()"
        >{{ text }}</button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  const emit = defineEmits(['click']);
  const props = withDefaults(defineProps<{
    text: String,
    type: String,
    size?: String,
    rounded?: boolean,
  }>(), {
    size: "base",
    rounded: false
  });
  const textSize = (size) => {
    if (size == "2xs") {
      return "py-0.5 px-1 text-2xs";
    }
    if (size == "xs") {
      return "py-1 px-2 text-xs";
    }
    if (size == "sm") {
      return "py-1.5 px-3 text-sm";
    }
    if (size == "base") {
      return "py-2 px-4 text-base";
    }
    return "py-2 px-4 text-" + size;
  };
  const roundedClass = (rounded) => {
    if (rounded) return "rounded-xl";
    return "rounded";
  };
  const buttonClass = computed(() => {
    if (props.type == "valid") return "bg-blue-500 hover:bg-blue-700 text-white font-bold" ;
    if (props.type == "abort") return "bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 shadow";
    return "";
  });
  const clickOnButton = () => {
    console.log("Click on button");
    emit('click');
  };
</script>
