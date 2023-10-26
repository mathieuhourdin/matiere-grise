<template>
  <div class="justify-items-center mx-auto flex flex-wrap max-w-full">
    <div v-if="center" class="ml-auto" />
    <div v-for="choice in choices" class="relative" :key="choice.value">
      <ActionButton
        class="w-30 my-1 mx-1"
        :text="choice.text"
        @click="updateTab(choice.value)"
        :type="choice.value == tab ? 'valid' : 'abort'"
      />
      <div v-if="choice.count" class="absolute right-0 top-0 w-4 h-4 rounded-square text-2xs bg-green-400 text-center">{{ choice.count }}</div>
    </div>
    <div class="mr-auto" />
  </div>
</template>
<script setup lang="ts">
import ActionButton from '@/components/Ui/ActionButton.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
const emit = defineEmits(['update'])
const props = withDefaults(
  defineProps<{
    choices: { text: string; value: string; count?: number }[]
    default?: string
    urlKey?: string
    url?: boolean
    center?: boolean
  }>(),
  { url: false, center: false }
)
const tab = ref<string | null>(null)
const router = useRouter()
const route = useRoute()
const updateTab = (tabValue: string) => {
  emit('update', tabValue)
  tab.value = tabValue
  if (props.url) {
    const query = route.query
    const path = route.path
    const finalKey = props.urlKey ?? 'tab'
    console.log(finalKey)
    const newQuery = {}
    newQuery[finalKey] = tabValue
    const lastQuery = { ...query, ...newQuery }
    router.push({ path: path, query: lastQuery })
    console.log(`route : ${JSON.stringify(route)}`)
  }
}
onMounted(() => updateTab(props.default ?? ''))
</script>
<style>
.rounded-square {
  border-radius: 50%;
}
</style>
