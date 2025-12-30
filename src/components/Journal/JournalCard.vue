<template>
    <HomeCard
        :content-class="'overflow-scroll h-full'"
        width="30%"
        height="40"
        :list-class="'list-disc list-inside h-full overflow-scroll'"
        :items="journal_items"
        :show-date="true"
        :item-class="'leading-4'"
        :line-height="'none'"
        :show-action="true"
        action-icon="AddIcon"
        @action="addJournalContent"

    >
        <template #header>
            <h2 @click="openJournal" class="flex items-center text-xs md:text-base font-bold">
                {{ journal.resource?.title }}
                <TrendUpIcon v-if="journal_items_loaded && isTrendUp" class="w-8 h-8 ml-2" />
                <TrendDownIcon v-if="journal_items_loaded && !isTrendUp" class="w-8 h-8 ml-2" />
            </h2>
        </template>
    </HomeCard>
</template>

<script setup lang="ts">
import HomeCard from '@/components/Ui/HomeCard.vue'
import TrendUpIcon from '@/components/Ui/Icons/TrendUpIcon.vue'
import TrendDownIcon from '@/components/Ui/Icons/TrendDownIcon.vue'
import { type ApiInteraction } from '@/types/models'
import { useRouter } from 'vue-router'
import { useResourceRelations } from '@/composables/useResourceRelations'
import { ref, onMounted, computed } from 'vue'
import { useResource } from '@/composables/useResource'
import { useQuickCreateModal } from '@/composables/useQuickCreateModal'
const { getResource } = useResource()
const { getAllRelationsForResource } = useResourceRelations()
const { openModal } = useQuickCreateModal()
const props = defineProps<{
    journal: ApiInteraction
}>()

const router = useRouter()

const journal_items = ref<any[]>([])

const journal_items_loaded = ref(false)

const loadJournalItems = async () => {
    const resource = await getResource(props.journal.resource_id)
    const items = await getAllRelationsForResource(resource.id)
    journal_items.value = items.map(item => ({
        title: item.origin_resource.title,
        content: item.origin_resource.subtitle,
        date: item.origin_resource.created_at
    }))
}

const openJournal = () => {
    router.push('/me/resources/' + props.journal.resource_id + '/feed')
}

const addJournalContent = () => {
    if (props.journal.resource_id) {
        openModal(props.journal.resource_id)
    }
}

const isTrendUp = computed(() => {
    if (journal_items.value.length > 0) {
        return new Date(journal_items.value[0].date).getTime() > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).getTime()
    }
    return false
}) 

onMounted(async () => {
    await loadJournalItems()
    journal_items_loaded.value = true
})
</script>