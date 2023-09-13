<template>
  <div v-if="!!thoughtOutput" class="px-8 mx-auto">
    <div v-if="!editingMetaData">
      <div class="my-8">
        <img
          :src="thoughtOutput.image_url"
          class="border border-slate-300 dark:border-zinc-700 rounded-xl ml-auto mr-auto"
        />
      </div>
      <h1 class="text-3xl my-3 font-mplus md:text-center text-left">{{ thoughtOutput.title }}</h1>
      <div class="md:text-center text-left">{{ thoughtOutput.description }}</div>
      <RoundLinkButton v-if="isThoughtOutputAuthor" @click="setEditingMetaData(true)"
        ><PencilSquareIcon class="m-1"
      /></RoundLinkButton>
      <div class="md:flex my-8">
        <ProgressBar :progress-value="thoughtOutput.progress" class="w-1/3" />
        <a class="ml-auto underline" :href="thoughtOutput.gdoc_url"> Ajouter un commentaire </a>
      </div>
    </div>
    <div v-else>
      <ArticleForm
        v-if="thoughtOutput.output_type == 'atcl'"
        :article="thoughtOutput"
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
          v-if="thoughtOutput.publishing_state == 'drft'"
          @click="publishThoughtOutput"
          type="valid"
          text="Publier"
        />
        <div v-else class="p-2 border rounded bg-neutral-100">Publié</div>
      </div>
    </div>
    <div>
      <ToggleButtonGroup :choices="tabChoices" default="ctnt" />
    </div>
    <hr class="border-top border-zinc-400 my-4" />
    <div v-if="current_tab == 'ctnt'">
      <TextInterface
        v-if="thoughtOutput.publishing_state != 'drft'"
        :ext-comments="comments"
        :ressource-id="thoughtOutput.id"
        :full-text="thoughtOutput.content"
        :editable="isThoughtOutputAuthor"
        @change="(event) => debouncedUpdateThoughtOutputContent(event)"
      />
      <TextAreaInput
        v-else
        class="h-96"
        label="Contenu"
        :modelValue="thoughtOutput.content"
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
      <ThoughtInputsList :thought-inputs="thoughtInputUsages.map((tiu) => tiu.thought_input)" />
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
import { useThoughtOutput } from '@/composables/useThoughtOutput.ts'
import { useComments } from '@/composables/useComments.ts'
import { useUser } from '@/composables/useUser.ts'
import { useThoughtInputUsages } from '@/composables/useThoughtInputUsages.ts'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { watch, toRefs, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const props = defineProps<{
  id: String
}>()
const route = useRoute()

/************** tabs ******************/

const tabChoices = ref([
  { text: 'Contenu', value: 'ctnt' },
  { text: 'Biblio', value: 'bbli' }
])

const current_tab = ref(null)

watch(
  () => route.query.tab,
  (newValue) => {
    console.log('new route query', newValue)
    current_tab.value = newValue
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
const { getThoughtOutput, updateThoughtOutput } = useThoughtOutput()
const debouncedUpdate = ref(null)
const thoughtOutput = ref(null)
const router = useRouter()
watch(
  () => route.query.editing,
  (editing) => {
    console.log('Editing : ', editing)
    editingMetaData.value = editing === 'false' ? false : !!editing
  }
)
const editingMetaData = ref(false)
const setEditingMetaData = (value) => {
  router.push({ query: { editing: value } })
}

const publishThoughtOutput = () => {
  thoughtOutput.value.publishing_state = 'pbsh'
  updateThoughtOutput(thoughtOutput.value.id, thoughtOutput.value)
}

const debouncedUpdateThoughtOutput = (id, newThoughtOutput) => {
  thoughtOutput.value = newThoughtOutput
  clearTimeout(debouncedUpdate.value)
  debouncedUpdate.value = setTimeout(async () => {
    try {
      await updateThoughtOutput(id, thoughtOutput.value)
    } catch (error) {
      console.log('An error : ', error)
    }
  }, 1000)
}

const debouncedUpdateThoughtOutputContent = (newThoughtOutputContent) => {
  if (newThoughtOutputContent == '\n') return
  debouncedUpdateThoughtOutput(toRefs(props).id.value, {
    ...thoughtOutput.value,
    content: newThoughtOutputContent
  })
}

/************** user section *********************/
const { user } = useUser()
const isThoughtOutputAuthor = computed(() => {
  if (!user.value) return false
  return thoughtOutput.value.author_id == user.value.id
})

/************** comments section *****************/
const { getCommentsForThoughtOutput } = useComments()
const comments = ref([])

onMounted(async () => {
  thoughtOutput.value = await getThoughtOutput(props.id)
  comments.value = await getCommentsForThoughtOutput(props.id)
  const editing = route.query.editing
  editingMetaData.value = editing === 'false' ? false : !!editing
})
</script>
