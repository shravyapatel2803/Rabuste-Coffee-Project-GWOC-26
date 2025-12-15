import { useState } from 'react'
import './pages/Home' 
import Home from './pages/Home'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Home/>
    </>
  )
}

export default App
