<template>
  <div>
    <table class="w-full">
        <thead v-if="displayHeader">
            <tr>
                <th v-for="column in displayColumns" :key="column.field_name">
                    {{ column.display_name }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="py-1" v-for="item in items" :key="item.id">
                <td class="bg-gray-700" :class="column.width" v-for="(column, i) in displayColumns" :key="item.id + '-' + column.field_name">
                    <div v-if="column.field_name.length == 2" class="mx-2">
                        <div class="md:text-lg text-xs font-bold"> {{ displayValue(item, column.field_name[0]) }}</div>
                        <div class="md:text-xs text-2xs"> {{ displayValue(item, column.field_name[1]) }}</div>
                    </div>
                    <img class="rounded m-2 w-14 md:w-auto md:max-w-full max-h-12 shadow-sm shadow-slate-400" v-else-if="column.field_type == 'image'" :src="displayValue(item, column.field_name[0])" />
                    <div v-else-if="column.field_type == 'action'">
                        <ActionButton type="valid" text="Choisir" class="m-2" />
                    </div>
                    <div v-else class="text-left md:text-lg text-sm font-bold" :class="{ 'text-xs': (i != 0), 'text-sm': (i == 0) }">
                        {{ displayValue(item, column.field_name[0]) }}
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import ActionButton from '@/components/Ui/ActionButton.vue';
import { useMenu } from '@/composables/useMenu';
import { computed } from 'vue';
const props = defineProps<{
  items: any[]
  columns: {
    display_name: string
    field_name: string[]
    field_type: string
    width: object
  }[]
  displayHeader: boolean
}>()

const { isMobile } = useMenu()

const displayValue = (item: any, field_name: string) => {
  return item[field_name]
}

const displayColumns = computed(() => {
    return props.columns.filter((column) => column.field_type != 'action' || !isMobile.value)
})
</script>

<style>
table { 
    border-collapse: separate; 
    border-spacing: 0 0.3em; 
    margin-top: -10px; /* correct offset on first border spacing if desired */
    table-layout: auto;
}
/* Toutes les cellules de la ligne ont la même couleur */
tbody tr td {
  background: #020617;       /* ou ta couleur de ligne */
}

/* Coins arrondis à gauche */
tbody tr td:first-child {
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}

/* Coins arrondis à droite */
tbody tr td:last-child {
  border-top-right-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
}
</style>