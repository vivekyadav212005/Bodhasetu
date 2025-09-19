import React, { useState, useCallback } from 'react'
import { uploadDocument } from '../services/api'

export default function UploadBox({ onUploaded }) {
	const [hover, setHover] = useState(false)
	const [busy, setBusy] = useState(false)
	const [department, setDepartment] = useState('General')
	const [message, setMessage] = useState('')

	const handleFiles = useCallback(async (files) => {
		const file = files?.[0]
		if (!file) return
		setBusy(true)
		setMessage('')
		try {
			await uploadDocument(file, department)
			setMessage('Processing complete')
			onUploaded?.()
		} catch (e) {
			setMessage(`Upload failed: ${e.message}`)
		} finally {
			setBusy(false)
		}
	}, [department, onUploaded])

	const onDrop = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setHover(false)
		handleFiles(e.dataTransfer.files)
	}
	const onChange = (e) => handleFiles(e.target.files)

	return (
		<div className="card p-6">
			<div className="flex items-center gap-3 mb-3">
				<input className="input" value={department} onChange={e=>setDepartment(e.target.value)} placeholder="Department" />
				<label className="btn cursor-pointer">
					{busy ? 'Uploading…' : 'Select File'}
					<input type="file" className="hidden" onChange={onChange} disabled={busy} />
				</label>
			</div>
			<div
				onDragOver={(e)=>{e.preventDefault(); setHover(true)}}
				onDragLeave={()=>setHover(false)}
				onDrop={onDrop}
				className={`border-2 border-dashed rounded-lg p-10 text-center ${hover ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
			>
				Drag & drop a document here
			</div>
			{message && <div className="mt-3 text-sm text-gray-700">{message}</div>}
		</div>
	)
}
