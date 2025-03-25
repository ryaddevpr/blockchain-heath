import './App.css'
import { useEffect } from 'react'
import { loadNetwork, loadProvider } from './store/interactions'
import { useDispatch } from 'react-redux'
import { Navbar } from './components'

function App() {
  const dispatch = useDispatch()
  const loadBlockchainData = async () => {
    const provider = loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)
  }
  useEffect(() => {
    loadBlockchainData()
  })
  return (
    <div className='App'>
      <Navbar />
    </div>
  )
}

export default App
