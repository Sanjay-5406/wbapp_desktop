export interface FileRecord {
  id: string
  user_id: string
  filename: string
  filepath: string
  size: number
  mime_type: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      files: {
        Row: FileRecord
        Insert: {
          id?: string
          user_id: string
          filename: string
          filepath: string
          size: number
          mime_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          filename?: string
          filepath?: string
          size?: number
          mime_type?: string
          created_at?: string
        }
      }
    }
  }
}