import React, { useEffect, useState } from 'react'
import UploadBox from '../components/UploadBox'
import QueryBox from '../components/QueryBox'
import AnswerBox from '../components/AnswerBox'
import { getDocuments } from '../services/api'

export default function Home() {
	const [answer, setAnswer] = useState(null)
	const [docMap, setDocMap] = useState({})
	useEffect(()=>{
		getDocuments().then(res => {
			const map = {}
			for (const d of (res.documents||[])) map[d._id] = d
			setDocMap(map)
		}).catch(()=>{})
	}, [])
	return (
		<div className="space-y-4">
			<UploadBox />
			<QueryBox onAnswered={setAnswer} />
			<AnswerBox data={answer} docMap={docMap} />
		</div>
	)
}
