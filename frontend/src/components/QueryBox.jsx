import React, { useState } from 'react'
import { askQuery } from '../services/api'

export default function QueryBox({ docId, onAnswered }) {
	const [q, setQ] = useState('')
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')

	const submit = async (e) => {
		e.preventDefault()
		if (!q.trim()) return
		setBusy(true)
		setError('')
		try {
			const data = await askQuery({ query: q, doc_id: docId })
			onAnswered?.(data)
		} catch (e) {
			setError(`Query failed: ${e.message}`)
		} finally {
			setBusy(false)
		}
	}

		return (
			<form onSubmit={submit} className="card p-4">
				<div className="flex items-start gap-3">
					<textarea rows={3} className="input flex-1 min-h-[3rem]" placeholder="Ask a question…" value={q} onChange={e=>setQ(e.target.value)} />
					<button className="btn" disabled={busy}>{busy ? 'Thinking…' : 'Ask'}</button>
				</div>
				{error && <div className="text-red-600 text-sm mt-2">{error}</div>}
				<div className="text-xs text-gray-500 mt-1">Tip: Shift+Enter for newline, Enter to submit.</div>
			</form>
		)
}
