<template>
  <div class="justify-items-center mx-auto flex flex-wrap max-w-full">
    <ActionButton
      v-for="choice in choices"
      :key="choice.value"
      class="w-24 my-1 mx-1"
      :text="choice.text"
      @click="updateTab(choice.value)"
      :type="choice.value == tab ? 'valid' : 'abort'"
      />
  </div>
</template>
<script setup lang="ts">
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
const props = defineProps<{
  choices: {text: string, value: string}[],
  default?: string
}>();
const tab = ref<string | null>(null)
const router = useRouter()
const route = useRoute()
const updateTab = (tabValue: string) => {
  tab.value = tabValue
  const query = route.query
  const path = route.path
  router.push({ path: path, query: { ...query, tab: tabValue} })
  console.log(`route : ${JSON.stringify(route)}`)
}
onMounted(() => updateTab(props.default?? ''))
</script>
