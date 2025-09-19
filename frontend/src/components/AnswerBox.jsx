import React, { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function SourceItem({ s }) {
	const [expanded, setExpanded] = useState(false)
	const text = s.excerpt || ''
	const short = text.length > 200 ? text.slice(0, 200) + '…' : text
	return (
		<div className="p-3 border rounded-lg">
					<div className="text-sm text-gray-600 mb-1">
						Doc: <span className="font-medium">{s.doc_name || s.doc_id}</span>{' '}
				{s.page_number != null && (<span>• Page {s.page_number}</span>)}
				{s.score != null && (<span> • Score {s.score.toFixed ? s.score.toFixed(3) : s.score}</span>)}
			</div>
			<div className="text-gray-800 text-sm whitespace-pre-line">
				{expanded ? text : short}
			</div>
			{text.length > 200 && (
				<button className="btn-secondary mt-2 px-2 py-1 rounded" onClick={()=>setExpanded(!expanded)}>
					{expanded ? 'Show less' : 'Show more'}
				</button>
			)}
		</div>
	)
}

function normalizeText(s) {
	if (!s) return ''
	const looksLikeMd = /[#*_\-`\[\]]/.test(s)
	if (looksLikeMd) return s
	// Turn double newlines into paragraph breaks, single into line breaks
	return s
		.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
		.map(p => p.replace(/\n/g, '  \n')).join('\n\n')
}

export default function AnswerBox({ data, docMap }) {
	if (!data) return null
	const md = useMemo(()=> normalizeText(data.answer), [data.answer])
	return (
		<div className="card p-5">
			<h3 className="text-lg font-semibold mb-2">Answer</h3>
			<div className="prose prose-gray max-w-none">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{md || 'No answer'}</ReactMarkdown>
			</div>
			{!!data.sources?.length && (
				<div className="mt-4">
					<h4 className="font-semibold mb-2">Sources</h4>
					<div className="grid gap-3">
						{data.sources.map((s, i) => {
							const meta = docMap?.[s.doc_id]
							const name = meta?.doc_title || meta?.filename || s.doc_id
							return <SourceItem key={i} s={{...s, doc_name: name}} />
						})}
					</div>
				</div>
			)}
		</div>
	)
}
