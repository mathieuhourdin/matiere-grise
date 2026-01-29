<template>
    <div>
        <div v-if="resourceItem.resource">
            <div class="flex justify-between items-center">
                <div class="text-lg font-bold mb-2">{{ formatDate(new Date(resourceItem.date)) }} - {{ resourceItem.resource.title }}</div>
                <div>
                    <ActionButton 
                        type="valid" 
                        size="sm" 
                        :text="isAnalyzing ? 'Analyse en cours...' : 'Analyser'"
                        :disabled="isAnalyzing"
                        @click="analyzeItem"
                    />
                </div>
        </div>
        <div v-if="validRelations.length > 0" class="flex flex-wrap gap-2 mb-2">
            <Chip
                v-for="relation in validRelations"
                :key="relation.id"
                :text="relation.origin_resource.title"
                :tooltip="getRelationTooltip(relation)"
            />
        </div>
        <div class="text-sm dark:text-gray-300 text-gray-700 mb-2">{{ resourceItem.resource.subtitle }}</div>
        <div class="text-sm dark:text-gray-300 text-gray-500 whitespace-pre-line">{{ resourceItem.resource.content }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useResourceRelations } from '@/composables/useResourceRelations'
import { type ApiResource, type ContextualResource, type ResourceRelation } from '@/types/models'
import { ref, computed, onMounted } from 'vue'
import Chip from '@/components/Ui/Chip.vue'
import ActionButton from '@/components/Ui/ActionButton.vue'
import { fetchWrapper } from '@/helpers/fetch-wrapper'

const props = defineProps<{
    resourceItem: any
}>()

const { getAllRelationsForResource } = useResourceRelations()
const relations = ref<any[]>([])
const isAnalyzing = ref(false)

const analyzeItem = async () => {
    isAnalyzing.value = true
    try {
        const response = await fetchWrapper.post('/lens', {
            current_trace_id: props.resourceItem.resource.id
        })
        console.log('Lens created:', response.data)
    } catch (error) {
        console.error('Error creating lens:', error)
    } finally {
        isAnalyzing.value = false
    }
}

const validRelations = computed(() => {
    return relations.value.filter(relation => relation.origin_resource)
})

const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getRelationTooltip = (relation: ResourceRelation) => {
    if (!relation.origin_resource) return ''
    
    const parts: string[] = []
    parts.push(relation.origin_resource.title)
    
    if (relation.origin_resource.subtitle) {
        parts.push(relation.origin_resource.subtitle)
    }
    
    if (relation.relation_comment) {
        parts.push(`Commentaire: ${relation.relation_comment}`)
    }
    if (relation.origin_resource.content) {
        parts.push(relation.origin_resource.content)
    }
    
    return parts.join('\n')
}

onMounted(async () => {
    const fetchedRelations = await getAllRelationsForResource(props.resourceItem.resource.id)
    relations.value = fetchedRelations.filter(relation => relation.relation_type === 'elmt')
})
</script>