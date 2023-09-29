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
  problems?: Problem[]
  problems_count?: number
}

export interface ThoughtOutput {
  id?: string
  resource_title: string
  resource_subtitle: string
  resource_content: string
  resource_image_url: string
  interaction_user_id?: string
  resource_publishing_state: string
  resource_category_id?: string
  resource_type: string
  interaction_progress?: number
  created_at?: Date
  updated_at?: Date
}

export type ApiThoughtOutput = ApiObject &
  ThoughtOutput & {
    interaction_progress: number
  }

export interface Article extends ThoughtOutput {
  resource_title: string
  resource_subtitle: string
  resource_content: string
  resource_comment: string
  interaction_user_id?: string
  author?: User
  interaction_progress: number
  resource_maturing_state: string
  resource_publishing_state: string
  resource_parent_id?: string
  resource_external_content_url: string
  resource_image_url: string
  resource_type: string
}

export interface Problem extends ThoughtOutput {
  resource_title: string
  resource_subtitle: string
  resource_content: string
  interaction_user_id?: string
  resource_publishing_state: string
  resource_comment?: string
  resource_maturing_state?: string
  resource_type: string
  resource_image_url: string
  resource_category_id?: string
  related_articles?: Article[]
  related_thought_inputs?: ThoughtInput[]
}

export interface ThoughtInput {
  id?: string
  resource_title: string
  resource_subtitle?: string
  resource_content?: string
  resource_author_name: string
  resource_type: string
  resource_external_content_url: string
  resource_image_url: string
  resource_comment: string
  resource_category_id?: string
  interaction_progress: number
  interaction_date: Date
  interaction_comment: string
  interaction_is_public: boolean
  interaction_user_id?: string
  interaction_type?: string
  created_at?: Date
  updated_at?: Date
}

export type ApiThoughtInput = ThoughtInput & {
  id: string
  input_user_id: string
}

export interface ThoughtInputUsage {
  id?: string
  thought_output_id?: string
  thought_input_id?: string
  thought_input: ApiThoughtInput
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
