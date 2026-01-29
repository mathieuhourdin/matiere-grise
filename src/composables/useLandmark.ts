import { fetchWrapper } from '@/helpers'
import { useSnackbar } from '@/composables/useSnackbar'

const { launchSnackbar } = useSnackbar()

export interface LandmarkDetail {
  id: string
  title?: string
  subtitle?: string
  content?: string
  landmark_type?: string
  parent_landmarks?: LandmarkDetail[]
  related_elements?: LandmarkDetail[]
  created_at?: string
  updated_at?: string
  [key: string]: any
}

const getLandmark = async (id: string): Promise<LandmarkDetail> => {
  try {
    const response = await fetchWrapper.get('/landmarks/' + id)
    return response.data
  } catch (error) {
    launchSnackbar(`Error getting landmark: ${error}`, 'error')
    throw error
  }
}

export function useLandmark() {
  return {
    getLandmark
  }
}
