import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const BUCKET = 'user-files'
const SIGNED_URL_EXPIRY_SECONDS = 60 // link valid for 60s

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/files/[id] -> returns a short-lived signed URL to download the file
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: record, error: fetchError } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !record) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(record.filepath, SIGNED_URL_EXPIRY_SECONDS, {
      download: record.filename,
    })

  if (signError || !signed) {
    return NextResponse.json({ error: signError?.message ?? 'Could not sign URL' }, { status: 500 })
  }

  return NextResponse.json({ url: signed.signedUrl })
}

// DELETE /api/files/[id] -> removes the storage object and its metadata row
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: record, error: fetchError } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !record) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  const { error: removeError } = await supabase.storage
    .from(BUCKET)
    .remove([record.filepath])

  if (removeError) {
    return NextResponse.json({ error: removeError.message }, { status: 500 })
  }

  const { error: deleteError } = await supabase
    .from('files')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}