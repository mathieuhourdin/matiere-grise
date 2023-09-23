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
  title: string
  description: string
  content: string
  image_url: string
  author_id?: string
  publishing_state: string
  output_type: string
  progress?: number
}

export type ApiThoughtOutput = ApiObject &
  ThoughtOutput & {
    progress: number
  }

export interface Article extends ThoughtOutput {
  title: string
  description: string
  content: string
  potential_improvements: string
  author_id?: string
  progress: number
  maturing_state: string
  publishing_state: string
  parent_id?: string
  gdoc_url: string
  image_url: string
  url_slug: string
  output_type: string
}

export interface Problem extends ThoughtOutput {
  title: string
  description: string
  content: string
  author_id?: string
  publishing_state: string
  potential_improvements?: string
  maturing_state?: string
  output_type: string
  image_url: string
  category_id?: string
  related_articles?: Article[]
  related_thought_inputs?: ThoughtInput[]
}

export interface ThoughtInput {
  id?: string
  resource_title: string
  resource_author_name: string
  resource_type: string
  resource_link: string
  resource_image_link: string
  resource_comment: string
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
}
