import { ref } from 'vue'
import { type Interaction } from '@/types/models'

const userLogLecture = ref<Interaction | null>(null)
const userLogProduction = ref<Interaction | null>(null)

export function useMe() {
  return {
    userLogLecture,
    userLogProduction
  }
}