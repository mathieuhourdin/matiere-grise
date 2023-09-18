import { fetchWrapper } from '@/helpers'
import { ref } from 'vue'

const categories = ref([])

const getCategories = async () => {
    const response = await fetchWrapper.get('/categories')
    return response.data;
}

const loadCategories = async () => {
    categories.value = await getCategories()
}

export function useCategories() {
    return {
        getCategories,
        categories,
        loadCategories
    }
}
