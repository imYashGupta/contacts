import { CustomField } from "./CustomField"

export interface Contact {
  id: number
  user_id: number
  name: string
  email: string
  phone: string
  gender: string
  profile_photo: string
  file: string
  deleted_at: any
  created_at: string
  updated_at: string
  custom_fields: CustomField[]
}


