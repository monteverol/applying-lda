import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Movies from './pages/movies'
import Books from './pages/books'
import Songs from './pages/songs'
import Games from './pages/games'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/movies' element={<Movies />} />
        <Route path='/books' element={<Books />} />
        <Route path='/songs' element={<Songs />} />
        <Route path='/games' element={<Games />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
