
import './App.css'
import { BrowserRouter, Route,  Routes } from 'react-router-dom'
import Room from "../components/Room"
import Landing from '../components/landing'
function App() {


  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/landing' element={<Landing/>}/>
        <Route path='/room' element={<Room/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
