import { fetchWrapper } from '@/helpers'
import { type Category } from '@/types/models'
import { ref } from 'vue'

const categories = ref<Category[]>([])

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
