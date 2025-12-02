export interface Rock {
  id: string
  name: string
  description: string
  features: string
  youtube_url: string
  model_url: string
  image_url: string
  audio_url: string
  island: "동도" | "서도"
  order_index: number
  created_at: string
}
