import React, { useEffect, useState } from 'react'
import { getDocuments } from '../services/api'
import DocumentList from '../components/DocumentList'
import SummaryModal from '../components/SummaryModal'

export default function Documents() {
	const [docs, setDocs] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [modalDoc, setModalDoc] = useState(null)

	const refresh = async () => {
		setLoading(true)
		setError('')
		try {
			const res = await getDocuments()
			setDocs(res.documents || [])
		} catch (e) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(()=>{ refresh() }, [])

	return (
		<div className="space-y-4">
			{loading && <div>Loading…</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && (
				<DocumentList documents={docs} onViewSummary={(id)=>setModalDoc(id)} />
			)}
			<SummaryModal docId={modalDoc} onClose={()=>setModalDoc(null)} />
		</div>
	)
}
