export interface ApiObject {
  id: string
}

export interface User {
  id?: string
  email: string
  first_name: string
  last_name: string
  handle: string
  password?: string
}

export interface Category {
  id?: string
  display_name: string
  problems?: Resource[]
  problems_count?: number
}

export interface Resource {
  resource_id: string
  resource_title: string
  resource_subtitle: string
  resource_content: string
  resource_external_content_url: string
  resource_comment: string
  resource_image_url: string
  resource_maturing_state: string
  resource_publishing_state: string
  resource_type: string
  resource_category_id: string
  created_at?: Date
  updated_at?: Date
}

export type ApiResource = Resource & ApiObject

export interface Interaction {
  id?: string
  interaction_progress: number
  interaction_date: Date
  interaction_comment: string
  interaction_is_public: boolean
  interaction_user_id: string
  interaction_type?: string
  author?: User
  created_at?: Date
  updated_at?: Date
  resource_id?: string
  resource?: Resource
}

export type ApiInteraction = ApiObject &
  Interaction & {
    interaction_progress: number
    resource: Resource
  }

export interface ThoughtInputUsage {
  id?: string
  resource_id?: string
  thought_input_id?: string
  thought_input: ApiInteraction
  usage_reason: string
}

export interface Comment {
  id?: string
  start_index: number
  end_index: number
  content: string
  created_at: Date
  updated_at: Date
  author_id?: string
  author?: User
  editing: boolean
}
