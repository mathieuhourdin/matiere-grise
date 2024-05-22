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
  profile_picture_url?: string
  pseudonym?: string
  pseudonymized?: boolean
  display_name?: string
}

export interface Category {
  id?: string
  display_name: string
  problems?: Resource[]
  problems_count?: number
}

export interface Resource {
  title: string
  subtitle: string
  content: string
  external_content_url: string
  comment: string
  image_url: string
  maturing_state: string
  publishing_state: string
  resource_type: string
  category_id?: string
  created_at?: Date
  updated_at?: Date
  is_local_draft?: boolean
}

export interface ContextualResource {
  resource?: Resource
  user_id?: string
  context_comment?: string
  progress?: number
  date: Date
}

export type ApiResource = Resource & ApiObject

export interface Interaction {
  id?: string
  interaction_progress: number
  interaction_date: Date
  interaction_comment: string
  interaction_is_public: boolean
  interaction_user_id?: string
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

export interface ResourceRelation {
  id?: string
  target_resource_id?: string
  origin_resource_id?: string
  origin_resource: ApiResource
  relation_comment: string
  user_id: string
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
