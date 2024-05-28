<template>
  <div class="flex flex-col p-4">
    <div class="text-sm mb-2">
      Conversion au format SPIP : ajouter le contenu à partir d'un fichier .docx (.doc ne marche
      pas) puis copier (icon en haut à droite) coller dans spip. Le gras est mis en gras, et les
      parties entre guillements sont mises en italique. Attention aux insertions de discours
      indirect dans les citations, qui doivent être remises en non italique.
    </div>
    <div class="text-sm mb-2">
      Pour les fichiers copiés collés depuis un pdf, sélectionnez l'option pour enlever les sauts de
      ligne. La mise en gras ne fonctionne pas pour cette option (problème technique inconnu). Un
      simple saut de ligne est supprimé, un double saut de ligne est transformé en un simple saut de
      ligne.
    </div>
    <CheckboxInput class="mb-2" v-model="removeLineBreaks" label="Enlever les sauts de ligne" />
    <input
      id="file"
      type="file"
      @change="uploadFile"
      placeholder="Ajouter depuis un fichier"
      class="mb-4"
    />
    <div v-if="fileConversion">
      <div>{{ fileConversion.name }}</div>
      <SelectionTextInterface
        class="h-full w-full overflow-scroll border border-slate-400 mb-4 p-2 rounded"
        type="textarea"
        :text="fileConversion.content"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFileConverter } from '@/composables/useFileConverter'
import SelectionTextInterface from '@/components/SelectionTextInterface.vue'
import CheckboxInput from '@/components/Ui/CheckboxInput.vue'

const { postFileConversion } = useFileConverter()
const fileConversion = ref(null)
const removeLineBreaks = ref(false)
const uploadFile = async (event) => {
  const file = event.target.files[0]

  const formData = new FormData()

  formData.append(file.name, file)

  const response = await postFileConversion(formData, 'spip', removeLineBreaks.value)
  fileConversion.value = response
}
</script>
