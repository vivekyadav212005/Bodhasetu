import React, { useEffect, useState } from 'react'
import { getEmailLogs, approveEmail, rejectEmail, fetchEmailsNow } from '../services/api'

function Badge({ status }) {
  const map = {
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  }
  return <span className={`px-2 py-1 rounded text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
}

export default function Emails() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await getEmailLogs()
      setLogs(res.logs || [])
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=>{ refresh() }, [])

  const doApprove = async (id) => {
    setToast('Ingestion started...')
    try {
      await approveEmail(id)
      setToast('Approved and ingestion started')
      refresh()
    } catch (e) {
      setToast('Approve failed: ' + e.message)
    }
  }
  const doReject = async (id) => {
    try {
      await rejectEmail(id)
      setToast('Rejected successfully')
      refresh()
    } catch (e) {
      setToast('Reject failed: ' + e.message)
    }
  }
  const doFetch = async () => {
    setToast('Checking for new emails...')
    try {
      const res = await fetchEmailsNow()
      setLogs(res.logs || [])
      setToast(`Fetch complete${res.fetched ? `: ${res.fetched} new` : ''}`)
    } catch (e) {
      setToast('Fetch failed: ' + e.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Email Logs</h2>
        <button className="btn" onClick={doFetch}>Check New Emails Now</button>
      </div>
      {toast && <div className="text-sm text-gray-700">{toast}</div>}
      <div className="card p-4 overflow-x-auto">
        {loading ? 'Loading…' : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-3">Filename</th>
                <th className="py-2 pr-3">Sender</th>
                <th className="py-2 pr-3">Subject</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Department</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l._id} className="border-b last:border-b-0">
                  <td className="py-2 pr-3">{l.filename}</td>
                  <td className="py-2 pr-3">{l.sender}</td>
                  <td className="py-2 pr-3">{l.subject}</td>
                  <td className="py-2 pr-3">{l.date ? new Date(l.date).toLocaleString() : '-'}</td>
                  <td className="py-2 pr-3">{l.department}</td>
                  <td className="py-2 pr-3"><Badge status={l.status} /></td>
                  <td className="py-2 flex gap-2">
                    {l.status === 'pending' ? (
                      <>
                        <button className="btn" onClick={()=>doApprove(l._id)}>Approve</button>
                        <button className="btn-secondary px-3 py-2 rounded" onClick={()=>doReject(l._id)}>Reject</button>
                      </>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
