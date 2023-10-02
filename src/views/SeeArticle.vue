<template>
  <div v-if="!!thoughtOutput" class="px-8 mx-auto">
    <div v-if="!editingMetaData">
      <div class="my-8">
        <img
          :src="thoughtOutput.resource_image_url"
          class="border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto"
        />
      </div>
      <h1 class="text-3xl my-3 font-mplus md:text-center text-left">{{ thoughtOutput.resource_title }}</h1>
      <div class="md:text-center text-left">{{ thoughtOutput.resource_subtitle }}</div>
      <div class="md:text-center text-left">
        <router-link
          v-if="thoughtOutputUser"
          :to="'/users/' + thoughtOutputUser.id"
          class="text-sm underline"
          >{{ thoughtOutputUser.first_name }} {{ thoughtOutputUser.last_name }}</router-link
        >
      </div>
      <RoundLinkButton v-if="isThoughtOutputAuthor" @click="setEditingMetaData(true)"
        ><PencilSquareIcon class="m-1"
      /></RoundLinkButton>
      <div class="md:flex my-8">
        <ProgressBar :progress-value="thoughtOutput.interaction_progress" class="m-2 w-1/3" />
        <a
          v-if="thoughtOutput.resource_type === 'atcl'"
          class="ml-auto underline"
          :href="article.resource_external_content_url"
        >
          Ajouter un commentaire
        </a>
      </div>
    </div>
    <div v-else>
      <ArticleForm
        v-if="thoughtOutput.resource_type == 'atcl'"
        :article="article"
        @change="(event) => debouncedUpdateThoughtOutput(thoughtOutput.id, event)"
      />
      <ProblemForm
        v-else
        :problem="thoughtOutput"
        @change="(event) => debouncedUpdateThoughtOutput(thoughtOutput.id, event)"
      />
      <div class="flex flex-row-reverse">
        <ActionButton class="mx-4" @click="setEditingMetaData(false)" type="valid" text="Preview"
          >Ok</ActionButton
        >
        <ActionButton
          v-if="thoughtOutput.resource_publishing_state == 'drft'"
          @click="publishThoughtOutput"
          type="valid"
          text="Publier"
        />
        <div v-else class="p-2 border rounded bg-neutral-100">Publié</div>
      </div>
    </div>
    <div>
      <ToggleButtonGroup :choices="tabChoices" :default="toggleDefault" />
    </div>
    <hr class="border-top border-zinc-400 my-4" />
    <div v-if="current_tab == 'ctnt'">
      <TextInterface
        v-if="thoughtOutput.resource_publishing_state != 'drft'"
        :ext-comments="comments"
        :resource-id="thoughtOutput.id"
        :full-text="thoughtOutput.resource_content"
        :editable="isThoughtOutputAuthor"
        @change="(event) => debouncedUpdateThoughtOutputContent(event)"
      />
      <TextAreaInput
        v-else
        class="h-96"
        label="Contenu"
        :modelValue="thoughtOutput.resource_content"
        @update:modelValue="(event) => debouncedUpdateThoughtOutputContent(event)"
      />
    </div>
    <div v-else>
      <ModalSheet :open="openAddThoughtInputUsage" @close="openAddThoughtInputUsage = false">
        <CreateThoughtInputUsageForm
          @refresh="loadBiblio"
          @close="openAddThoughtInputUsage = false"
          :thought-output="thoughtOutput"
        />
      </ModalSheet>
      <div @click="openAddThoughtInputUsage = true" class="text-sm italic underline">
        Ajouter une référence
      </div>
      <ThoughtInputsList
        :thought-inputs="thoughtInputUsages.map((usage: ThoughtInputUsage) => usage.thought_input)"
        :usage-reasons="thoughtInputUsages.map((usage: ThoughtInputUsage) => usage.usage_reason)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CreateThoughtInputUsageForm from '@/components/CreateThoughtInputUsageForm.vue'
import ToggleButtonGroup from '@/components/Ui/ToggleButtonGroup.vue'
import TextInterface from '@/components/TextInterface.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import RoundLinkButton from '@/components/Ui/RoundLinkButton.vue'
import ArticleForm from '@/components/ArticleForm.vue'
import ProblemForm from '@/components/ProblemForm.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import TextAreaInput from '@/components/Ui/TextAreaInput.vue'
import ThoughtInputsList from '@/components/ThoughtInputsList.vue'
import ModalSheet from '@/components/Ui/ModalSheet.vue'
import { useThoughtOutput } from '@/composables/useThoughtOutput'
import { useComments } from '@/composables/useComments'
import { useUser } from '@/composables/useUser'
import { useThoughtInputUsages } from '@/composables/useThoughtInputUsages'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { watch, toRefs, ref, computed, onMounted, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  type Problem,
  type User,
  type ThoughtOutput,
  type Article,
  type ThoughtInputUsage,
  type ApiThoughtOutput,
  type Comment
} from '@/types/models'
const props = defineProps<{
  id: string
}>()
const route = useRoute()

const article = computed((): Article => {
  const article = thoughtOutput.value as Article
  return article
})

/************** tabs ******************/

const tabChoices = ref([
  { text: 'Contenu', value: 'ctnt' },
  { text: 'Biblio', value: 'bbli' }
])

const toggleDefault = ref(
  route.query.tab && typeof route.query.tab === 'string' ? route.query.tab : 'ctnt'
)

const current_tab = ref<string | null>(null)

watch(
  () => route.query.tab,
  (newValue) => {
    console.log('new route query', newValue)
    if (typeof newValue === 'string') current_tab.value = newValue
  }
)

/************** Biblio *****************/

const { getThoughtInputUsagesForThoughtOutput } = useThoughtInputUsages()

const thoughtInputUsages = ref([])
const openAddThoughtInputUsage = ref(false)

const loadBiblio = async () => {
  thoughtInputUsages.value = await getThoughtInputUsagesForThoughtOutput(toRefs(props).id.value)
}

onMounted(() => loadBiblio())

/************** thoughtOutput section ******************/
const { newThoughtOutput, getThoughtOutput, updateThoughtOutput } = useThoughtOutput()
const debouncedUpdate = ref<number | null>(null)
const thoughtOutput: Ref<ApiThoughtOutput> = ref<ApiThoughtOutput>(newThoughtOutput())
const router = useRouter()
watch(
  () => route.query.editing,
  (editing) => {
    console.log('Editing : ', editing)
    editingMetaData.value = editing === 'false' ? false : !!editing
  }
)
const editingMetaData = ref(false)
const setEditingMetaData = (value: boolean) => {
  router.push({ query: { editing: value.toString() } })
}

const publishThoughtOutput = () => {
  if (!thoughtOutput.value || !thoughtOutput.value.id) return
  thoughtOutput.value.resource_publishing_state = 'pbsh'
  updateThoughtOutput(thoughtOutput.value.id, thoughtOutput.value)
}

const debouncedUpdateThoughtOutput = (id: string, newThoughtOutput: ApiThoughtOutput) => {
  thoughtOutput.value = newThoughtOutput
  if (debouncedUpdate.value !== null) clearTimeout(debouncedUpdate.value)
  debouncedUpdate.value = setTimeout(async () => {
    try {
      await updateThoughtOutput(id, thoughtOutput.value)
    } catch (error) {
      console.log('An error : ', error)
    }
  }, 1000)
}

const debouncedUpdateThoughtOutputContent = (newThoughtOutputContent: string) => {
  if (newThoughtOutputContent == '\n') return
  debouncedUpdateThoughtOutput(toRefs(props).id.value, {
    ...thoughtOutput.value,
    resource_content: newThoughtOutputContent
  })
}

/************** user section *********************/
const { user, getUserById } = useUser()
const isThoughtOutputAuthor = computed(() => {
  if (!user.value) return false
  return thoughtOutput.value.interaction_user_id == user.value.id
})

const thoughtOutputUser: Ref<User | null> = ref<User | null>(null)

/************** comments section *****************/
const { getCommentsForThoughtOutput } = useComments()
const comments = ref<Comment[]>([])

onMounted(async () => {
  thoughtOutput.value = await getThoughtOutput(props.id)
  comments.value = await getCommentsForThoughtOutput(props.id)
  if (thoughtOutput.value.interaction_user_id)
    thoughtOutputUser.value = await getUserById(thoughtOutput.value.interaction_user_id)
  const editing = route.query.editing
  editingMetaData.value = editing === 'false' ? false : !!editing
})
</script>
