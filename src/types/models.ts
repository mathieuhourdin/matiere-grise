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
  author_id?: string
  publishing_state: string
  resource_category_id?: string
  resource_type: string
  progress?: number
  created_at?: Date
  updated_at?: Date
}

export type ApiThoughtOutput = ApiObject &
  ThoughtOutput & {
    progress: number
  }

export interface Article extends ThoughtOutput {
  resource_title: string
  resource_subtitle: string
  resource_content: string
  resource_comment: string
  author_id?: string
  author?: User
  progress: number
  maturing_state: string
  publishing_state: string
  parent_id?: string
  resource_external_content_url: string
  resource_image_url: string
  url_slug: string
  resource_type: string
}

export interface Problem extends ThoughtOutput {
  resource_title: string
  resource_subtitle: string
  resource_content: string
  author_id?: string
  publishing_state: string
  resource_comment?: string
  maturing_state?: string
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
  input_progress: number
  input_date: Date
  input_comment: string
  input_is_public: boolean
  input_user_id?: string
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
