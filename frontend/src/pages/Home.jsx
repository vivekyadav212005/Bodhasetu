import React, { useEffect, useMemo, useState } from 'react'
import UploadBox from '../components/UploadBox'
import QueryBox from '../components/QueryBox'
import AnswerBox from '../components/AnswerBox'
import { getDocuments } from '../services/api'
import { useAppStore } from '../store/useAppStore'

export default function Home() {
	const answers = useAppStore(s => s.answers)
	const [docMap, setDocMap] = useState({})
	useEffect(()=>{
		getDocuments().then(res => {
			const map = {}
			for (const d of (res.documents||[])) map[d._id] = d
			setDocMap(map)
		}).catch(()=>{})
	}, [])
	const lastAnswer = useMemo(()=> answers.length ? answers[answers.length-1].data : null, [answers])
	return (
		<div className="space-y-4">
			<UploadBox />
			<QueryBox />
			<AnswerBox data={lastAnswer} docMap={docMap} />
		</div>
	)
}
