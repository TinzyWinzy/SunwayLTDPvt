import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { CMSPage } from '../../types/database'

export function AdminCMS() {
  const [pages, setPages] = useState<CMSPage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'cms_pages'))
      setPages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CMSPage)))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <button className="btn-primary text-sm">New Page</button>
      </div>

      <div className="card">
        <div className="space-y-3">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : pages.length === 0 ? (
            <p className="text-gray-500">No content pages yet. Create your first page.</p>
          ) : (
            pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">{page.title || page.slug}</h3>
                  <p className="text-xs text-gray-500">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${page.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {page.is_published ? 'Published' : 'Draft'}
                  </span>
                  <button className="text-accent text-sm hover:underline">Edit</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
