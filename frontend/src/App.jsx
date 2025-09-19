import React from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Documents from './pages/Documents'

export default function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen bg-gray-50">
				<nav className="bg-white border-b shadow-sm">
					<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
						<Link to="/" className="font-semibold text-lg">Bodhasetu</Link>
						<div className="flex gap-4">
							<NavLink to="/" end className={({isActive})=>`hover:text-blue-600 ${isActive?'text-blue-600':''}`}>Home</NavLink>
							<NavLink to="/documents" className={({isActive})=>`hover:text-blue-600 ${isActive?'text-blue-600':''}`}>Documents</NavLink>
						</div>
					</div>
				</nav>
				<main className="max-w-6xl mx-auto p-4">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/documents" element={<Documents />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	)
}
