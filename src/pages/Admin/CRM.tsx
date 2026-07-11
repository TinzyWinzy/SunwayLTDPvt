import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { CRMTask, CRMInteraction } from '../../types/database'

export function AdminCRM() {
  const [tasks, setTasks] = useState<CRMTask[]>([])
  const [interactions, setInteractions] = useState<CRMInteraction[]>([])
  const [activeTab, setActiveTab] = useState<'tasks' | 'interactions'>('tasks')

  useEffect(() => {
    async function load() {
      const [tasksSnap, interactionsSnap] = await Promise.all([
        getDocs(query(collection(db, 'crm_tasks'), orderBy('created_at', 'desc'))),
        getDocs(query(collection(db, 'crm_interactions'), orderBy('created_at', 'desc'))),
      ])
      setTasks(tasksSnap.docs.map((d) => ({ id: d.id, ...d.data() } as CRMTask)))
      setInteractions(interactionsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as CRMInteraction)))
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">CRM</h1>

      <div className="flex gap-2 mb-6">
        {(['tasks', 'interactions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              activeTab === tab ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab} ({tab === 'tasks' ? tasks.length : interactions.length})
          </button>
        ))}
      </div>

      {activeTab === 'tasks' ? (
        <div className="card">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="font-medium text-sm">{task.description || 'No description'}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {task.type} | Due: {task.due_date || 'N/A'} | {task.status}
                  </p>
                </div>
                <span className="badge capitalize">{task.status}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-3">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge capitalize">{interaction.type}</span>
                  <span className="badge capitalize">{interaction.direction}</span>
                </div>
                <p className="text-sm">{interaction.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {interaction.created_at ? new Date(interaction.created_at).toLocaleString() : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
