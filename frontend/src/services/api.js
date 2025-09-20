import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const api = axios.create({ baseURL: BASE_URL, timeout: 30000 })

export async function uploadDocument(file, department = 'General') {
	const form = new FormData()
	form.append('file', file)
	form.append('department', department)
	const { data } = await api.post('/upload', form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
	return data
}

export async function getDocuments({ department, limit = 50, skip = 0 } = {}) {
	const params = {}
	if (department) params.department = department
	params.limit = limit
	params.skip = skip
	const { data } = await api.get('/documents', { params })
	return data
}

export async function getSummary(docId) {
	try {
		const { data } = await api.get(`/document/${docId}/summary`)
		return data
	} catch (err) {
		const { data } = await api.get(`/summary/${docId}`)
		return data
	}
}

export async function askQuery({ query, top_k = 8, doc_id, department }) {
	const payload = { query, top_k }
	if (doc_id) payload.doc_id = doc_id
	if (department) payload.department = department
	const { data } = await api.post('/query', payload)
	return data
}

// Email ingestion APIs
export async function getEmailLogs() {
	const { data } = await api.get('/emails/logs')
	return data
}

export async function fetchEmailsNow() {
	const { data } = await api.post('/emails/fetch')
	return data
}

export async function approveEmail(logId) {
	const { data } = await api.post(`/emails/approve/${logId}`)
	return data
}

export async function rejectEmail(logId) {
	const { data } = await api.post(`/emails/reject/${logId}`)
	return data
}
