import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { FileManager } from '@/app/myfiles/file-manager'
import type { FileRecord } from '@/app/types/database.types'

export default async function MyFilesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">My Files</h1>
      <FileManager initialFiles={(files ?? []) as FileRecord[]} />
    </div>
  )
}