import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type { FileRecord } from '@/app/types/database.types'

const BUCKET = 'user-files'
const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50MB, adjust as needed

// GET /api/files -> list the current user's files
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ files: data satisfies FileRecord[] })
}

// POST /api/files -> upload a new file (multipart/form-data, field name "file")
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File exceeds max size of 50MB' }, { status: 400 })
  }

  // Path: {user_id}/{uuid}-{original filename}, keeps files unique & namespaced per user
  const uniquePrefix = crypto.randomUUID()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${user.id}/${uniquePrefix}-${safeName}`

  const arrayBuffer = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: record, error: insertError } = await supabase
    .from('files')
    .insert({
      user_id: user.id,
      filename: file.name,
      filepath: storagePath,
      size: file.size,
      mime_type: file.type || 'application/octet-stream',
    })
    .select()
    .single()

  if (insertError) {
    // Roll back the uploaded object if the DB insert fails
    await supabase.storage.from(BUCKET).remove([storagePath])
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ file: record satisfies FileRecord }, { status: 201 })
}