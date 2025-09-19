import React from 'react'

export default function DocumentList({ documents, onViewSummary }) {
	return (
		<div className="card p-4">
			<div className="overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="text-left border-b">
							<th className="py-2 pr-3">Name</th>
							<th className="py-2 pr-3">Department</th>
							<th className="py-2 pr-3">Created</th>
							<th className="py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{documents.map(d => (
							<tr key={d._id} className="border-b last:border-b-0">
								<td className="py-2 pr-3 font-medium">{d.doc_title || d.filename}</td>
								<td className="py-2 pr-3">{d.department}</td>
								<td className="py-2 pr-3">{d.created_at ? new Date(d.created_at).toLocaleString() : '-'}</td>
								<td className="py-2">
									<button className="btn" onClick={()=>onViewSummary?.(d._id)}>View Summary</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
