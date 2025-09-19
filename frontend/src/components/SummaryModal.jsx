import React, { useEffect, useMemo, useState } from 'react'
import { getSummary } from '../services/api'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function SummaryModal({ docId, onClose }) {
	const [data, setData] = useState(null)
	const [error, setError] = useState('')

	useEffect(()=>{
		if (!docId) return
		setError('')
		setData(null)
		getSummary(docId).then(setData).catch(e=>setError(e.message))
	}, [docId])

	if (!docId) return null
	return (
		<div className="fixed inset-0 bg-black/40 flex items-start justify-center p-6 z-50" onClick={onClose}>
			<div className="card w-full max-w-2xl p-5" onClick={e=>e.stopPropagation()}>
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-lg font-semibold">Document Summary</h3>
					<button className="btn-secondary px-3 py-1 rounded" onClick={onClose}>Close</button>
				</div>
				{!data && !error && <div>Loading…</div>}
				{error && <div className="text-red-600">{error}</div>}
						{data && (
							<div className="space-y-4">
								<div><span className="font-medium">Status:</span> {data.summary_status}</div>
								<div className="prose max-w-none">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>
										{data.summary || 'No summary available yet.'}
									</ReactMarkdown>
								</div>
								{!!data.actionable?.length && (
									<div>
										<div className="font-medium mb-1">Actionable</div>
										<ul className="list-disc pl-5">
											{data.actionable.map((a,i)=>(<li key={i}>{a}</li>))}
										</ul>
									</div>
								)}
							</div>
						)}
			</div>
		</div>
	)
}
