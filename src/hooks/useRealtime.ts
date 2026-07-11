import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

type CollectionName = 'orders' | 'installation_bookings' | 'crm_tasks'

export function useRealtime<T extends DocumentData>(
  collectionName: CollectionName,
  constraints?: QueryConstraint[],
) {
  const [records, setRecords] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, collectionName), ...(constraints || []))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as T[]

        setRecords(docs)
        setLoading(false)
      },
      () => {
        setLoading(false)
      },
    )

    return unsubscribe
  }, [collectionName])

  return { records, loading }
}
